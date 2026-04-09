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
    Check,
    Copy,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
type TicketStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "AWAITING_CUSTOMER"
    | "AWAITING_AGENT"
    | "RESOLVED"
    | "CLOSED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type ReplyMode = "reply" | "note";

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
    isNote?: boolean;
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
    assignedTo: "Andrian" as string | null,
    labels: ["Bug", "Installation"] as string[],
    createdAt: "2026-04-07T08:00:00Z",
    updatedAt: "2026-04-07T10:30:00Z",
    customer: { name: "John Doe", email: "john@example.com", initials: "JD", ticketCount: 3 },
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
        isFromAgent: false,
        authorName: "John Doe",
        authorInitials: "JD",
        createdAt: "2026-04-07T08:00:00Z",
        content:
            "Hi, I purchased the Solarion Template Kit but I'm getting an error when trying to import it in Elementor. The error message says 'Template import failed: Invalid template format'. I've tried re-downloading and re-importing multiple times but the same error keeps appearing.\n\nMy Elementor version is 3.19.0 and WordPress is 6.4.2. Please help!",
        attachments: [
            { id: "a1", name: "error-screenshot.png", size: 245000, type: "image/png", url: "#" },
        ],
    },
    {
        id: "m2",
        isFromAgent: true,
        authorName: "Andrian",
        authorInitials: "AN",
        createdAt: "2026-04-07T09:15:00Z",
        content:
            "Hi! Thank you for reaching out to Evocave support.\n\nThis error usually happens when the template file is corrupted during download. Could you please try the following steps:\n\n1. Clear your browser cache and re-download the file\n2. Make sure you're importing the correct .json file (not the .zip)\n3. Try using a different browser\n\nLet me know if any of these steps resolve the issue!",
    },
    {
        id: "m3",
        isFromAgent: false,
        authorName: "John Doe",
        authorInitials: "JD",
        createdAt: "2026-04-07T10:30:00Z",
        content:
            "Thank you for your quick response! I tried all the steps but still getting the same error. I'm using Chrome and have cleared the cache. The .json file is 2.3MB – is that the right size?",
    },
    {
        id: "m4",
        isFromAgent: true,
        isNote: true,
        authorName: "Andrian",
        authorInitials: "AN",
        createdAt: "2026-04-07T10:35:00Z",
        content:
            "Internal: File size 2.3MB seems correct. Might be a server-side validation issue. Check Elementor version compatibility with our kit versions.",
    },
];

const mockTeam = ["Andrian", "Support 1", "Support 2"];
const mockLabels = ["Bug", "Installation", "License", "Feature Request", "General"];
const mockCanned = [
    {
        id: "c1",
        title: "Template import steps",
        body: "Hi! Thank you for reaching out.\n\nPlease try the following steps to resolve the import issue:\n\n1. Clear your browser cache\n2. Re-download the template file\n3. Import the .json file (not the .zip)\n\nLet us know if this helps!",
    },
    {
        id: "c2",
        title: "License verification",
        body: "Hi! To verify your license, please provide your Envato purchase code. You can find it in your Envato downloads page under License Certificate.",
    },
    {
        id: "c3",
        title: "Closing — issue resolved",
        body: "I'm glad we could resolve the issue! If you ever need help again, feel free to open a new ticket. Have a great day!",
    },
    {
        id: "c4",
        title: "Asking for more info",
        body: "Hi! Could you please provide more details about the issue? Specifically:\n\n- WordPress version\n- Elementor version\n- Any error messages you see\n- Steps to reproduce\n\nThis will help us resolve your issue faster.",
    },
];

const mockAuditLog = [
    {
        id: "al1",
        actorInitials: "AN",
        type: "reply",
        text: "Andrian replied to this ticket",
        createdAt: "2026-04-07T09:15:00Z",
    },
    {
        id: "al2",
        actorInitials: "AN",
        type: "status",
        text: "Andrian changed status from Open → In Progress",
        createdAt: "2026-04-07T09:10:00Z",
    },
    {
        id: "al3",
        actorInitials: "AN",
        type: "assigned",
        text: "Andrian assigned ticket to themselves",
        createdAt: "2026-04-07T08:30:00Z",
    },
    {
        id: "al4",
        actorInitials: "SY",
        type: "reply",
        text: "Ticket created by John Doe",
        createdAt: "2026-04-07T08:00:00Z",
    },
];

// ─── Configs ─────────────────────────────────────────────
const statusConfig: Record<TicketStatus, { label: string; color: string; bg: string }> = {
    OPEN: { label: "Open", color: "text-blue-400", bg: "bg-blue-500/10 border border-blue-500/20" },
    IN_PROGRESS: {
        label: "In Progress",
        color: "text-amber-400",
        bg: "bg-amber-500/10 border border-amber-500/20",
    },
    AWAITING_CUSTOMER: {
        label: "Awaiting Customer",
        color: "text-purple-400",
        bg: "bg-purple-500/10 border border-purple-500/20",
    },
    AWAITING_AGENT: {
        label: "Awaiting Agent",
        color: "text-zinc-400",
        bg: "bg-zinc-500/10 border border-zinc-500/20",
    },
    RESOLVED: {
        label: "Resolved",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border border-emerald-500/20",
    },
    CLOSED: {
        label: "Closed",
        color: "text-zinc-500",
        bg: "bg-zinc-500/10 border border-zinc-500/20",
    },
};

const priorityConfig: Record<Priority, { label: string; color: string; dot: string }> = {
    LOW: { label: "Low", color: "text-zinc-400", dot: "bg-zinc-500" },
    MEDIUM: { label: "Medium", color: "text-blue-400", dot: "bg-blue-500" },
    HIGH: { label: "High", color: "text-amber-400", dot: "bg-amber-500" },
    URGENT: { label: "Urgent", color: "text-red-400", dot: "bg-red-500" },
};

const labelColors: Record<string, string> = {
    Bug: "bg-red-500/10 text-red-400 border-red-500/20",
    Installation: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    License: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Feature Request": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    General: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
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

// ─── Inline Dropdown ──────────────────────────────────────
function InlineDropdown<T extends string>({
    value,
    options,
    onChange,
    renderTrigger,
}: {
    value: T;
    options: { value: T; label: string }[];
    onChange: (val: T) => void;
    renderTrigger: (label: string) => React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const current = options.find((o) => o.value === value);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1"
            >
                {renderTrigger(current?.label ?? value)}
            </button>
            {open && (
                <div className="bg-popover border-border absolute top-full left-0 z-50 mt-1.5 min-w-40 overflow-hidden rounded-xl border shadow-xl">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={cn(
                                "hover:bg-muted flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors",
                                opt.value === value
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground",
                            )}
                        >
                            {opt.label}
                            {opt.value === value && <Check className="h-3.5 w-3.5" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Message Bubble ───────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
    const isAgent = message.isFromAgent;
    const isNote = message.isNote;

    if (isNote) {
        return (
            <div className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-semibold text-amber-400">
                    {message.authorInitials}
                </div>
                <div className="max-w-[85%] space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-medium">
                            {message.authorName}
                        </span>
                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-400">
                            Internal note
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {formatDate(message.createdAt)}
                        </span>
                    </div>
                    <div className="rounded-2xl rounded-tl-sm border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                        <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                            {message.content}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex gap-3 ${isAgent ? "flex-row-reverse" : ""}`}>
            <div
                className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isAgent ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400",
                )}
            >
                {message.authorInitials}
            </div>
            <div className={`max-w-[85%] space-y-1 ${isAgent ? "items-end" : ""}`}>
                <div className={`flex items-center gap-2 ${isAgent ? "flex-row-reverse" : ""}`}>
                    <span className="text-foreground text-sm font-medium">
                        {message.authorName}
                    </span>
                    {isAgent && (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-400">
                            Support
                        </span>
                    )}
                    <span className="text-muted-foreground text-xs">
                        {formatDate(message.createdAt)}
                    </span>
                </div>
                <div
                    className={cn(
                        "rounded-2xl px-4 py-3",
                        isAgent
                            ? "rounded-tr-sm border border-emerald-500/20 bg-emerald-500/5"
                            : "border-border bg-card/40 rounded-tl-sm border",
                    )}
                >
                    <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                        {message.content}
                    </p>
                </div>
                {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                        {message.attachments.map((att) => (
                            <a
                                key={att.id}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border-border/60 bg-secondary/30 hover:bg-secondary/60 group flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors"
                            >
                                <div className="bg-secondary text-muted-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
                                    {getFileIcon(att.type, "h-3.5 w-3.5")}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-foreground truncate text-xs font-medium">
                                        {att.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {formatBytes(att.size)}
                                    </p>
                                </div>
                            </a>
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
    onAdd: (f: AttachedFile[]) => void;
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
            newFiles.push({
                id,
                file,
                preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
            });
        }
        if (newFiles.length > 0) onAdd(newFiles);
        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {files.map((f) => (
                <div
                    key={f.id}
                    className="border-border bg-secondary/40 flex items-center gap-2 rounded-lg border py-1.5 pr-1.5 pl-2.5"
                >
                    {f.preview ? (
                        <img src={f.preview} alt="" className="h-5 w-5 rounded object-cover" />
                    ) : (
                        <div className="text-muted-foreground">
                            {getFileIcon(f.file.type, "h-4 w-4")}
                        </div>
                    )}
                    <span className="text-muted-foreground max-w-25 truncate text-xs">
                        {f.file.name}
                    </span>
                    <button
                        type="button"
                        onClick={() => onRemove(f.id)}
                        className="text-muted-foreground hover:text-foreground ml-0.5 transition-colors"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
            {error && <p className="w-full text-xs text-red-400">{error}</p>}
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs transition-colors"
            >
                <Paperclip className="h-3.5 w-3.5" />
                Attach{" "}
                <span className="text-muted-foreground/50">
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
export default function AdminTicketDetailPage() {
    const [ticket, setTicket] = useState(mockTicket);
    const status = statusConfig[ticket.status];
    const priority = priorityConfig[ticket.priority];
    const isClosed = ["RESOLVED", "CLOSED"].includes(ticket.status);

    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [replyText, setReplyText] = useState("");
    const [replyMode, setReplyMode] = useState<ReplyMode>("reply");
    const [replyFiles, setReplyFiles] = useState<AttachedFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [auditFilter, setAuditFilter] = useState<"all" | "reply" | "status" | "assigned">("all");

    // Canned responses — muncul saat ketik "/"
    const [showCanned, setShowCanned] = useState(false);
    const [cannedSearch, setCannedSearch] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const filteredCanned = mockCanned.filter((c) =>
        c.title.toLowerCase().includes(cannedSearch.toLowerCase()),
    );

    function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const val = e.target.value;
        setReplyText(val);
        // Trigger canned responses ketik "/"
        if (val === "/" || val.startsWith("/")) {
            setShowCanned(true);
            setCannedSearch(val.slice(1));
        } else {
            setShowCanned(false);
            setCannedSearch("");
        }
    }

    function selectCanned(body: string) {
        setReplyText(body);
        setShowCanned(false);
        setCannedSearch("");
        textareaRef.current?.focus();
    }

    async function handleReply() {
        if (!replyText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 800));
        setMessages((prev) => [
            ...prev,
            {
                id: `m${Date.now()}`,
                content: replyText,
                isFromAgent: true,
                isNote: replyMode === "note",
                authorName: "Andrian",
                authorInitials: "AN",
                createdAt: new Date().toISOString(),
            },
        ]);
        setReplyText("");
        setReplyFiles([]);
        setIsSubmitting(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Escape") {
            setShowCanned(false);
            return;
        }
        if (showCanned && e.key === "Enter" && filteredCanned.length > 0) {
            e.preventDefault();
            selectCanned(filteredCanned[0].body);
            return;
        }
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleReply();
    }

    function copyRef() {
        navigator.clipboard.writeText(ticket.referenceNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function toggleLabel(label: string) {
        setTicket((prev) => ({
            ...prev,
            labels: prev.labels.includes(label)
                ? prev.labels.filter((l) => l !== label)
                : [...prev.labels, label],
        }));
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_272px]">
            {/* ── Kiri ── */}
            <div>
                {/* Topbar sticky — actionable */}
                <div className="bg-background sticky top-6 z-10 -mt-6 pt-6 pb-4 lg:top-16 lg:-mt-12 lg:pt-12">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Back */}
                        <Link
                            href="/admin/tickets"
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">All Tickets</span>
                        </Link>
                        <span className="text-muted-foreground">/</span>

                        {/* Ref number + copy */}
                        <button
                            onClick={copyRef}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-mono text-sm transition-colors"
                        >
                            {ticket.referenceNumber}
                            {copied ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                                <Copy className="h-3 w-3 opacity-50" />
                            )}
                        </button>

                        <div className="bg-border h-4 w-px" />

                        {/* Status — inline editable */}
                        <InlineDropdown
                            value={ticket.status}
                            options={Object.entries(statusConfig).map(([v, c]) => ({
                                value: v as TicketStatus,
                                label: c.label,
                            }))}
                            onChange={(val) => setTicket((p) => ({ ...p, status: val }))}
                            renderTrigger={(label) => (
                                <span
                                    className={cn(
                                        "flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-0.5 text-xs",
                                        status.bg,
                                        status.color,
                                    )}
                                >
                                    {label} <ChevronDown className="h-3 w-3 opacity-60" />
                                </span>
                            )}
                        />

                        {/* Priority — inline editable */}
                        <InlineDropdown
                            value={ticket.priority}
                            options={Object.entries(priorityConfig).map(([v, c]) => ({
                                value: v as Priority,
                                label: c.label,
                            }))}
                            onChange={(val) => setTicket((p) => ({ ...p, priority: val }))}
                            renderTrigger={(label) => (
                                <span
                                    className={cn(
                                        "flex cursor-pointer items-center gap-1 text-xs",
                                        priority.color,
                                    )}
                                >
                                    <span
                                        className={cn("h-1.5 w-1.5 rounded-full", priority.dot)}
                                    />
                                    {label} <ChevronDown className="h-3 w-3 opacity-60" />
                                </span>
                            )}
                        />

                        {/* Assignee — inline editable */}
                        <InlineDropdown
                            value={ticket.assignedTo ?? ""}
                            options={[
                                { value: "", label: "Unassigned" },
                                ...mockTeam.map((m) => ({ value: m, label: "@" + m })),
                            ]}
                            onChange={(val) =>
                                setTicket((p) => ({ ...p, assignedTo: val || null }))
                            }
                            renderTrigger={(label) => (
                                <span className="border-border text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-colors">
                                    {ticket.assignedTo ? `@${ticket.assignedTo}` : "Unassigned"}
                                    <ChevronDown className="h-3 w-3 opacity-60" />
                                </span>
                            )}
                        />
                    </div>

                    {/* Subject */}
                    <h1 className="text-foreground mt-3 text-lg leading-snug font-semibold">
                        {ticket.subject}
                    </h1>
                </div>

                {/* Thread */}
                <div className="bg-secondary/20 mt-2 space-y-5 rounded-xl px-4 py-5">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isClosed && (
                        <div className="flex items-center gap-3 py-2">
                            <div className="border-border h-px flex-1" />
                            <span className="text-muted-foreground text-xs">
                                Ticket {ticket.status.toLowerCase()}
                            </span>
                            <div className="border-border h-px flex-1" />
                        </div>
                    )}
                </div>

                {/* Reply box sticky */}
                {!isClosed && (
                    <div className="bg-background sticky bottom-8 z-10 -mb-12 pt-4 lg:bottom-12 lg:mb-0">
                        <div className="bg-background absolute inset-x-0 bottom-0 -mb-8 h-8 lg:-mb-12 lg:h-12" />

                        <div
                            className={cn(
                                "overflow-hidden rounded-xl border transition-colors focus-within:border-zinc-600",
                                replyMode === "note"
                                    ? "border-amber-500/30 bg-amber-500/5"
                                    : "border-border bg-secondary/20",
                            )}
                        >
                            {/* Mode tabs */}
                            <div className="border-border/60 flex items-center gap-1 border-b px-3 pt-2 pb-0">
                                {(["reply", "note"] as ReplyMode[]).map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => setReplyMode(mode)}
                                        className={cn(
                                            "rounded-t-lg px-3 py-1.5 text-xs font-medium transition-colors",
                                            replyMode === mode
                                                ? mode === "note"
                                                    ? "border border-b-0 border-amber-500/30 bg-amber-500/5 text-amber-400"
                                                    : "border-border bg-secondary/40 text-foreground border border-b-0"
                                                : "text-muted-foreground hover:text-foreground",
                                        )}
                                    >
                                        {mode === "reply" ? "Reply to customer" : "Internal note"}
                                    </button>
                                ))}
                            </div>

                            {replyMode === "note" && (
                                <p className="text-muted-foreground px-4 pt-2 text-xs">
                                    🔒 Only visible to your team
                                </p>
                            )}

                            {/* Canned responses popup — muncul saat ketik "/" */}
                            {showCanned && (
                                <div className="border-border bg-popover absolute right-0 bottom-full left-0 mb-1 overflow-hidden rounded-xl border shadow-xl">
                                    <div className="border-border flex items-center gap-2 border-b px-3 py-2">
                                        <span className="text-muted-foreground text-xs">
                                            Canned responses
                                        </span>
                                        <span className="text-muted-foreground ml-auto text-xs">
                                            ↑↓ navigate · Enter select · Esc close
                                        </span>
                                    </div>
                                    {filteredCanned.length > 0 ? (
                                        filteredCanned.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => selectCanned(item.body)}
                                                className="hover:bg-muted w-full px-4 py-2.5 text-left transition-colors"
                                            >
                                                <p className="text-foreground text-sm font-medium">
                                                    {item.title}
                                                </p>
                                                <p className="text-muted-foreground line-clamp-1 text-xs">
                                                    {item.body.substring(0, 80)}...
                                                </p>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground px-4 py-3 text-sm">
                                            No canned responses found
                                        </p>
                                    )}
                                </div>
                            )}

                            <textarea
                                ref={textareaRef}
                                placeholder={
                                    replyMode === "reply"
                                        ? 'Write your reply... Type "/" for canned responses · Ctrl+Enter to send'
                                        : "Write an internal note... only visible to your team"
                                }
                                value={replyText}
                                onChange={handleTextareaChange}
                                onKeyDown={handleKeyDown}
                                rows={3}
                                className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
                            />

                            <div className="border-border/60 flex items-center justify-between gap-3 border-t px-4 py-2.5">
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
                                    className={cn(
                                        "flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                                        replyText.trim() && !isSubmitting
                                            ? replyMode === "note"
                                                ? "bg-amber-600 text-white hover:bg-amber-500"
                                                : "bg-blue-600 text-white hover:bg-blue-500"
                                            : "cursor-not-allowed bg-zinc-800 text-zinc-600",
                                    )}
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
                                    {isSubmitting
                                        ? "Sending..."
                                        : replyMode === "note"
                                          ? "Add Note"
                                          : "Send Reply"}
                                    {!isSubmitting && (
                                        <span className="text-xs opacity-50">⌘↵</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Kanan: sidebar satu halaman ── */}
            <div className="sticky top-28 hidden lg:block lg:h-[calc(100svh-10rem)]">
                <div className="border-border bg-secondary/20 flex h-full flex-col rounded-xl border">
                    {/* Content — natural scroll */}
                    <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-5 py-5">
                        {/* Customer */}
                        <div>
                            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                Customer
                            </p>
                            <div className="bg-secondary/30 border-border rounded-lg border p-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-semibold text-blue-400">
                                        {ticket.customer.initials}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-foreground text-sm font-medium">
                                            {ticket.customer.name}
                                        </p>
                                        <p className="text-muted-foreground truncate text-xs">
                                            {ticket.customer.email}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={
                                        "/admin/tickets?customer=" +
                                        encodeURIComponent(ticket.customer.email)
                                    }
                                    className="text-muted-foreground hover:text-foreground mt-2.5 block text-xs transition-colors"
                                >
                                    {ticket.customer.ticketCount} tickets from this customer →
                                </Link>
                            </div>
                        </div>

                        {/* Product */}
                        <div>
                            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                Product
                            </p>
                            <Link
                                href={"/admin/products/" + ticket.product.id}
                                className="border-border bg-secondary/20 hover:bg-secondary/40 group flex items-center gap-3 rounded-lg border p-2.5 transition-colors"
                            >
                                <img
                                    src={ticket.product.thumbnailUrl}
                                    alt=""
                                    className="h-9 w-9 shrink-0 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-foreground line-clamp-2 text-xs leading-snug font-medium transition-colors group-hover:text-white">
                                        {ticket.product.name}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5 text-xs">
                                        {ticket.product.license}
                                    </p>
                                </div>
                            </Link>
                        </div>

                        <div className="border-border/60 border-t" />

                        {/* Category */}
                        <div>
                            <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-wide uppercase">
                                Category
                            </p>
                            <p className="text-foreground text-sm">{ticket.category}</p>
                        </div>

                        {/* Labels */}
                        <div>
                            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                Labels
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {mockLabels.map((label) => {
                                    const active = ticket.labels.includes(label);
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => toggleLabel(label)}
                                            className={cn(
                                                "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                                                active
                                                    ? (labelColors[label] ??
                                                          "border-zinc-500/20 bg-zinc-500/10 text-zinc-400")
                                                    : "border-border text-muted-foreground hover:border-border/80",
                                            )}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border-border/60 border-t" />

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-muted-foreground mb-0.5 text-xs font-medium tracking-wide uppercase">
                                    Opened
                                </p>
                                <p className="text-foreground text-sm">
                                    {formatDateFull(ticket.createdAt)}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-0.5 text-xs font-medium tracking-wide uppercase">
                                    Updated
                                </p>
                                <p className="text-foreground text-sm">
                                    {timeAgo(ticket.updatedAt)}
                                </p>
                            </div>
                        </div>

                        <div className="border-border/60 border-t" />

                        {/* Audit log — 3 terakhir + view all modal */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    Activity
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowAuditModal(true)}
                                    className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                                >
                                    View all →
                                </button>
                            </div>
                            <div className="space-y-3">
                                {mockAuditLog.slice(0, 3).map((log) => (
                                    <div key={log.id} className="flex items-start gap-2">
                                        <div className="bg-secondary/60 text-muted-foreground mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold">
                                            {log.actorInitials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-foreground text-xs leading-snug">
                                                {log.text}
                                            </p>
                                            <p className="text-muted-foreground mt-0.5 text-xs">
                                                {timeAgo(log.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions — fix di bawah */}
                    <div className="border-border shrink-0 space-y-2 border-t px-5 py-4">
                        {/* Assign to me */}
                        {ticket.assignedTo !== "Andrian" && (
                            <button
                                type="button"
                                onClick={() => setTicket((p) => ({ ...p, assignedTo: "Andrian" }))}
                                className="border-border text-muted-foreground hover:text-foreground w-full rounded-lg border py-2 text-sm transition-colors"
                            >
                                Assign to me
                            </button>
                        )}
                        {!isClosed ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setTicket((p) => ({ ...p, status: "RESOLVED" }))}
                                    className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                                >
                                    Mark as Resolved
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTicket((p) => ({ ...p, status: "CLOSED" }))}
                                    className="border-border text-muted-foreground hover:text-foreground w-full rounded-lg border py-2 text-sm transition-colors"
                                >
                                    Close Ticket
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setTicket((p) => ({ ...p, status: "OPEN" }))}
                                className="border-border text-muted-foreground hover:text-foreground w-full rounded-lg border py-2 text-sm transition-colors"
                            >
                                Reopen Ticket
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Audit Log Modal ── */}
            {showAuditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-popover border-border w-full max-w-md overflow-hidden rounded-2xl border shadow-xl">
                        {/* Header */}
                        <div className="border-border flex items-center justify-between border-b px-5 py-4">
                            <div>
                                <h2 className="text-foreground text-base font-semibold">
                                    Activity Log
                                </h2>
                                <p className="text-muted-foreground mt-0.5 text-xs">
                                    {ticket.referenceNumber} · {mockAuditLog.length} events
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAuditModal(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Filter tabs */}
                        <div className="border-border flex gap-1 border-b px-3 py-2">
                            {(["all", "reply", "status", "assigned"] as const).map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setAuditFilter(f)}
                                    className={cn(
                                        "rounded-lg px-2.5 py-1 text-xs capitalize transition-colors",
                                        auditFilter === f
                                            ? "bg-secondary text-foreground font-medium"
                                            : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {f === "all"
                                        ? "All"
                                        : f === "reply"
                                          ? "Replies"
                                          : f === "status"
                                            ? "Status changes"
                                            : "Assignments"}
                                </button>
                            ))}
                        </div>

                        {/* Log list */}
                        <div className="scrollbar-thin max-h-96 overflow-y-auto px-5 py-4">
                            {(() => {
                                const filtered =
                                    auditFilter === "all"
                                        ? mockAuditLog
                                        : mockAuditLog.filter((l) => l.type === auditFilter);
                                return filtered.length > 0 ? (
                                    <div className="space-y-4">
                                        {filtered.map((log, i) => (
                                            <div key={log.id} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className="bg-secondary/60 text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold">
                                                        {log.actorInitials}
                                                    </div>
                                                    {i < filtered.length - 1 && (
                                                        <div className="bg-border/60 mt-1 w-px flex-1" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1 pb-4">
                                                    <p className="text-foreground text-sm leading-snug">
                                                        {log.text}
                                                    </p>
                                                    <p className="text-muted-foreground mt-1 text-xs">
                                                        {timeAgo(log.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground py-8 text-center text-sm">
                                        No activity in this category
                                    </p>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
