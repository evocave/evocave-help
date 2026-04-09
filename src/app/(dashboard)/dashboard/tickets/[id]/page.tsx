"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    Paperclip,
    X,
    FileText,
    ImageIcon,
    FileArchive,
    Film,
    Send,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────
type TicketStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "AWAITING_CUSTOMER"
    | "AWAITING_AGENT"
    | "RESOLVED"
    | "CLOSED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface Attachment {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
}

interface Message {
    id: string;
    content: string;
    isFromAgent: boolean;
    authorName: string;
    authorInitials: string;
    createdAt: string;
    attachments?: Attachment[];
}

interface AttachedFile {
    id: string;
    file: File;
    preview?: string;
}

// ─── Constants ───────────────────────────────────────────
const MAX_FILE_SIZE_MB = 10;
const MAX_FILES = 5;
const MAX_TOTAL_SIZE_MB = 20;

const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": "image",
    "image/png": "image",
    "image/gif": "image",
    "image/webp": "image",
    "video/mp4": "video",
    "video/webm": "video",
    "application/pdf": "pdf",
    "application/zip": "archive",
    "application/x-zip-compressed": "archive",
};

// ─── Mock Data ───────────────────────────────────────────
const mockTicket = {
    id: "1",
    referenceNumber: "EVO-2026-015",
    subject: "Installation Error on Solarion Template Kit",
    status: "OPEN" as TicketStatus,
    priority: "HIGH" as Priority,
    category: "Installation Issue",
    createdAt: "2026-04-07T08:00:00Z",
    updatedAt: "2026-04-07T10:30:00Z",
    product: {
        id: "p1",
        name: "Solarion - Solar & Green Renewable Energy Elementor Template Kit",
        thumbnailUrl: "https://s3.envato.com/files/778140542/thumbnail-solarion.png",
        license: "Regular License",
    },
};

const mockMessages: Message[] = [
    {
        id: "m1",
        content:
            "Hi, I purchased the Solarion Template Kit but I'm getting an error when trying to import it in Elementor. The error message says 'Template import failed: Invalid template format'. I've tried re-downloading and re-importing multiple times but the same error keeps appearing.\n\nMy Elementor version is 3.19.0 and WordPress is 6.4.2. Please help!",
        isFromAgent: false,
        authorName: "John Doe",
        authorInitials: "JD",
        createdAt: "2026-04-07T08:00:00Z",
        attachments: [
            { id: "a1", name: "error-screenshot.png", size: 245000, type: "image/png", url: "#" },
        ],
    },
    {
        id: "m2",
        content:
            "Hi! Thank you for reaching out to Evocave support.\n\nThis error usually happens when the template file is corrupted during download. Could you please try the following steps:\n\n1. Clear your browser cache and re-download the file\n2. Make sure you're importing the correct .json file (not the .zip)\n3. Try using a different browser\n\nLet me know if any of these steps resolve the issue!",
        isFromAgent: true,
        authorName: "Evocave Support",
        authorInitials: "ES",
        createdAt: "2026-04-07T09:15:00Z",
    },
    {
        id: "m3",
        content:
            "Thank you for your quick response! I tried all the steps but still getting the same error. I'm using Chrome and have cleared the cache. The .json file is 2.3MB – is that the right size?",
        isFromAgent: false,
        authorName: "John Doe",
        authorInitials: "JD",
        createdAt: "2026-04-07T10:30:00Z",
    },
];

// ─── Configs ─────────────────────────────────────────────
const statusConfig: Record<TicketStatus, { label: string; color: string }> = {
    OPEN: { label: "Open", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
    IN_PROGRESS: {
        label: "In Progress",
        color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    AWAITING_CUSTOMER: {
        label: "Awaiting You",
        color: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    },
    AWAITING_AGENT: {
        label: "Awaiting Agent",
        color: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
    },
    RESOLVED: {
        label: "Resolved",
        color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    CLOSED: { label: "Closed", color: "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20" },
};

const priorityConfig: Record<Priority, { label: string; color: string; dot: string }> = {
    LOW: { label: "Low", color: "text-zinc-400", dot: "bg-zinc-500" },
    MEDIUM: { label: "Medium", color: "text-blue-400", dot: "bg-blue-500" },
    HIGH: { label: "High", color: "text-amber-400", dot: "bg-amber-500" },
    URGENT: { label: "Urgent", color: "text-red-400", dot: "bg-red-500" },
};

// ─── Helpers ─────────────────────────────────────────────
function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDateFull(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

function formatBytes(bytes: number) {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon(type: string, className = "h-4 w-4") {
    const kind = ALLOWED_TYPES[type];
    if (kind === "image") return <ImageIcon className={className} />;
    if (kind === "video") return <Film className={className} />;
    if (kind === "archive") return <FileArchive className={className} />;
    return <FileText className={className} />;
}

// ─── Attachment Preview (dalam message) ──────────────────
function AttachmentPreview({ attachment }: { attachment: Attachment }) {
    return (
        <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-lg border border-zinc-700/60 bg-zinc-800/60 px-3 py-2 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
        >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-700 text-zinc-400">
                {getFileIcon(attachment.type, "h-3.5 w-3.5")}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-300 group-hover:text-white">
                    {attachment.name}
                </p>
                <p className="text-xs text-zinc-600">{formatBytes(attachment.size)}</p>
            </div>
        </a>
    );
}

// ─── Message Bubble ───────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
    const isAgent = message.isFromAgent;
    return (
        <div className={`flex gap-3 ${isAgent ? "flex-row-reverse" : ""}`}>
            <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isAgent ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                }`}
            >
                {message.authorInitials}
            </div>
            <div className={`max-w-[85%] space-y-1 ${isAgent ? "items-end" : ""}`}>
                <div className={`flex items-center gap-2 ${isAgent ? "flex-row-reverse" : ""}`}>
                    <span className="text-sm font-medium text-zinc-200">{message.authorName}</span>
                    {isAgent && (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-400">
                            Support
                        </span>
                    )}
                    <span className="text-xs text-zinc-600">{formatDate(message.createdAt)}</span>
                </div>
                <div
                    className={`rounded-2xl px-4 py-3 ${
                        isAgent
                            ? "rounded-tr-sm border border-emerald-500/20 bg-emerald-500/5"
                            : "rounded-tl-sm border border-zinc-800 bg-zinc-900"
                    }`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-300">
                        {message.content}
                    </p>
                </div>
                {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                        {message.attachments.map((att) => (
                            <AttachmentPreview key={att.id} attachment={att} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Reply Attachments ────────────────────────────────────
function ReplyAttachments({
    files,
    onAdd,
    onRemove,
}: {
    files: AttachedFile[];
    onAdd: (files: AttachedFile[]) => void;
    onRemove: (id: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    function handleFiles(fileList: FileList) {
        setError(null);
        const newFiles: AttachedFile[] = [];
        const totalCurrent = files.reduce((sum, f) => sum + f.file.size, 0);
        for (const file of Array.from(fileList)) {
            if (files.length + newFiles.length >= MAX_FILES) {
                setError(`Max ${MAX_FILES} files`);
                break;
            }
            if (!ALLOWED_TYPES[file.type]) {
                setError(`${file.name}: type not allowed`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setError(`${file.name}: exceeds ${MAX_FILE_SIZE_MB}MB`);
                continue;
            }
            const totalNew = newFiles.reduce((sum, f) => sum + f.file.size, 0);
            if (totalCurrent + totalNew + file.size > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
                setError(`Total exceeds ${MAX_TOTAL_SIZE_MB}MB`);
                break;
            }
            const id = Math.random().toString(36).slice(2);
            const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
            newFiles.push({ id, file, preview });
        }
        if (newFiles.length > 0) onAdd(newFiles);
        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {files.map((f) => (
                <div
                    key={f.id}
                    className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 py-1.5 pr-1.5 pl-2.5"
                >
                    {f.preview ? (
                        <img src={f.preview} alt="" className="h-5 w-5 rounded object-cover" />
                    ) : (
                        <div className="text-zinc-500">{getFileIcon(f.file.type, "h-4 w-4")}</div>
                    )}
                    <span className="max-w-25 truncate text-xs text-zinc-400">{f.file.name}</span>
                    <span className="text-xs text-zinc-600">{formatBytes(f.file.size)}</span>
                    <button
                        type="button"
                        onClick={() => onRemove(f.id)}
                        className="ml-0.5 text-zinc-700 transition-colors hover:text-zinc-400"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
            {error && <p className="w-full text-xs text-red-400">{error}</p>}
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-zinc-600 transition-colors hover:text-zinc-400"
            >
                <Paperclip className="h-3.5 w-3.5" />
                Attach
                <span className="text-zinc-700">
                    ({files.length}/{MAX_FILES})
                </span>
            </button>
            <input
                ref={inputRef}
                type="file"
                multiple
                accept={Object.keys(ALLOWED_TYPES).join(",")}
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────
export default function TicketDetailPage() {
    const ticket = mockTicket;
    const status = statusConfig[ticket.status];
    const priority = priorityConfig[ticket.priority];
    const isClosed = ["RESOLVED", "CLOSED"].includes(ticket.status);

    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [replyText, setReplyText] = useState("");
    const [replyFiles, setReplyFiles] = useState<AttachedFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const threadRef = useRef<HTMLDivElement>(null);

    // Scroll ke pesan terbaru
    useEffect(() => {
        if (threadRef.current) {
            threadRef.current.scrollTop = threadRef.current.scrollHeight;
        }
    }, [messages]);

    async function handleReply() {
        if (!replyText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 800));
        setMessages((prev) => [
            ...prev,
            {
                id: `m${Date.now()}`,
                content: replyText,
                isFromAgent: false,
                authorName: "John Doe",
                authorInitials: "JD",
                createdAt: new Date().toISOString(),
            },
        ]);
        setReplyText("");
        setReplyFiles([]);
        setIsSubmitting(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleReply();
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_288px]">
            {/* kiri */}
            <div>
                {/* topbar */}
                <div className="bg-background sticky top-6 z-10 -mt-16 pt-16 pb-4 lg:top-16">
                    <div className="flex shrink-0 items-center gap-3">
                        <Link
                            href="/dashboard/tickets"
                            className="flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            My Tickets
                        </Link>
                        <span className="text-zinc-700">/</span>
                        <span className="font-mono text-sm text-zinc-500">
                            {ticket.referenceNumber}
                        </span>
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs ${status.color}`}
                            >
                                {status.label}
                            </span>
                            <span className={`flex items-center gap-1 text-xs ${priority.color}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                                {priority.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* thread */}
                <div
                    ref={threadRef}
                    className="bg-secondary/20 mt-4 flex-1 space-y-5 overflow-y-auto px-4 py-6"
                >
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isClosed && (
                        <div className="flex items-center gap-3 py-2">
                            <div className="h-px flex-1 bg-zinc-800" />
                            <span className="text-muted-foreground text-xs">
                                Ticket {ticket.status.toLowerCase()} —{" "}
                                <Link
                                    href="/dashboard/tickets/new"
                                    className="text-blue-400 transition-colors hover:text-blue-300"
                                >
                                    Open new ticket
                                </Link>
                            </span>
                            <div className="h-px flex-1 bg-zinc-800" />
                        </div>
                    )}
                </div>

                {/* reply */}
                <div className="bg-background sticky bottom-8 z-10 -mb-12 pt-4 lg:bottom-12 lg:mb-0">
                    <div className="bg-background absolute inset-x-0 bottom-0 -mb-8 h-8 lg:bottom-0 lg:-mb-12 lg:block lg:h-12" />
                    <div className="shrink-0">
                        {!isClosed ? (
                            <div className="bg-secondary/40 overflow-hidden rounded-xl border border-zinc-800 transition-colors focus-within:border-zinc-600">
                                <textarea
                                    placeholder="Write your reply... (Ctrl+Enter to send)"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    rows={3}
                                    className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
                                />
                                <div className="flex items-center justify-between gap-3 border-t border-zinc-800/60 px-4 py-2.5">
                                    <ReplyAttachments
                                        files={replyFiles}
                                        onAdd={(f) => setReplyFiles((prev) => [...prev, ...f])}
                                        onRemove={(id) =>
                                            setReplyFiles((prev) => prev.filter((f) => f.id !== id))
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={handleReply}
                                        disabled={!replyText.trim() || isSubmitting}
                                        className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                            replyText.trim() && !isSubmitting
                                                ? "bg-blue-600 text-white hover:bg-blue-500"
                                                : "cursor-not-allowed bg-zinc-800 text-zinc-600"
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <svg
                                                className="h-4 w-4 animate-spin"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                />
                                            </svg>
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                        {isSubmitting ? "Sending..." : "Send Reply"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
                                <p className="text-sm text-zinc-500">
                                    This ticket is {ticket.status.toLowerCase()}.{" "}
                                    <Link
                                        href="/dashboard/tickets/new"
                                        className="text-blue-400 transition-colors hover:text-blue-300"
                                    >
                                        Create a new ticket
                                    </Link>{" "}
                                    if you need further assistance.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* kanan */}
            <div className="sticky top-28 hidden lg:block lg:h-[calc(100svh-10rem)]">
                <div className="border-border bg-secondary/20 flex h-full flex-col justify-between space-y-6 rounded-lg border px-6 py-6">
                    <div className="space-y-6">
                        {/* Subject */}
                        <div>
                            <p className="text-muted-foreground mb-1 text-xs font-medium">
                                Subject
                            </p>
                            <p className="text-foreground truncate text-base leading-snug font-medium">
                                {ticket.subject}
                            </p>
                        </div>

                        {/* Status + Priority */}
                        <div>
                            <p className="text-muted-foreground mb-2 text-xs font-medium">Status</p>
                            <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs ${status.color}`}
                            >
                                {status.label}
                            </span>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-2 text-xs font-medium">
                                Priority
                            </p>
                            <span className={`flex items-center gap-2 text-sm ${priority.color}`}>
                                <span className={`h-2 w-2 rounded-full ${priority.dot}`} />
                                {priority.label}
                            </span>
                        </div>

                        {/* Category */}
                        <div>
                            <p className="text-muted-foreground mb-1 text-xs font-medium">
                                Category
                            </p>
                            <p className="text-sm text-zinc-300">{ticket.category}</p>
                        </div>

                        {/* Product */}
                        <div>
                            <p className="text-muted-foreground mb-2 text-xs font-medium">
                                Product
                            </p>
                            <Link
                                href={"/dashboard/products/" + ticket.product.id}
                                className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-2 transition-colors hover:border-zinc-700"
                            >
                                <img
                                    src={ticket.product.thumbnailUrl}
                                    alt={ticket.product.name}
                                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="line-clamp-2 truncate text-xs leading-snug font-medium text-zinc-200 transition-colors group-hover:text-white">
                                        {ticket.product.name}
                                    </p>
                                    <p className="mt-0.5 text-xs text-zinc-600">
                                        {ticket.product.license}
                                    </p>
                                </div>
                            </Link>
                        </div>

                        <div>
                            <p className="text-muted-foreground mb-0.5 text-xs font-medium">
                                Opened
                            </p>
                            <p className="text-sm text-zinc-300">
                                {formatDateFull(ticket.createdAt)}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-0.5 text-xs font-medium">
                                Last Updated
                            </p>
                            <p className="text-sm text-zinc-300">{timeAgo(ticket.updatedAt)}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    {!isClosed && (
                        <button
                            type="button"
                            className="w-full rounded-lg border border-zinc-800 py-2 text-sm text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-300"
                        >
                            Mark as Resolved
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
