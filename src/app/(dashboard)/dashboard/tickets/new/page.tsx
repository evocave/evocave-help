"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
    ChevronLeft,
    ChevronDown,
    X,
    Paperclip,
    FileText,
    ImageIcon,
    FileArchive,
    Film,
} from "lucide-react";
import {
    RiBold,
    RiCodeLine,
    RiDoubleQuotesR,
    RiItalic,
    RiLink,
    RiListOrdered,
    RiListUnordered,
    RiUnderline,
} from "@remixicon/react";

// ─── Types ───────────────────────────────────────────────
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type Category = "installation" | "bug" | "feature" | "license" | "other";

interface Product {
    id: string;
    envatoItemId: number;
    name: string;
    thumbnailUrl: string;
    purchaseCode: string;
    purchaseDate: string;
    license: string;
}

interface KBArticle {
    id: number;
    title: string;
    breadcrumb: string;
    url: string;
    excerpt: string;
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
const mockProducts: Product[] = [
    {
        id: "p1",
        envatoItemId: 56240617,
        name: "Solarion - Solar & Green Renewable Energy Elementor Template Kit",
        thumbnailUrl: "https://s3.envato.com/files/778140542/thumbnail-solarion.png",
        purchaseCode: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        purchaseDate: "2026-04-04T01:03:54+11:00",
        license: "Regular License",
    },
    {
        id: "p2",
        envatoItemId: 56557806,
        name: "Coworkly - Coworking Creative Space Elementor Template Kit",
        thumbnailUrl: "https://s3.envato.com/files/778143115/thumbnail-coworkly.png",
        purchaseCode: "x9y8z7w6-v5u4-3210-wxyz-ab9876543210",
        purchaseDate: "2025-12-11T04:40:15+11:00",
        license: "Regular License",
    },
];

const mockKBArticles: KBArticle[] = [
    {
        id: 1,
        title: "How to Install Solarion Template Kit",
        breadcrumb: "Solarion › Installation",
        url: "https://docs.evocave.com/solarion/installation",
        excerpt: "Step-by-step guide to importing the template into Elementor.",
    },
    {
        id: 2,
        title: "Template Import Failed — Fix Invalid Format Error",
        breadcrumb: "Solarion › Troubleshooting",
        url: "https://docs.evocave.com/solarion/troubleshooting/import-failed",
        excerpt: "Solutions for the invalid template format error during import.",
    },
    {
        id: 3,
        title: "Where to Find Your Purchase Code",
        breadcrumb: "General › License",
        url: "https://docs.evocave.com/general/purchase-code",
        excerpt: "How to locate your Envato purchase code from your downloads page.",
    },
    {
        id: 4,
        title: "How to Activate Your Support License",
        breadcrumb: "General › License",
        url: "https://docs.evocave.com/general/activate-support",
        excerpt: "Steps to verify and activate your support subscription.",
    },
    {
        id: 5,
        title: "Customizing Global Colors in Elementor",
        breadcrumb: "Solarion › Customization",
        url: "https://docs.evocave.com/solarion/customization/colors",
        excerpt: "Change the global color palette and typography settings.",
    },
    {
        id: 6,
        title: "Mobile Responsive Issues — Common Fixes",
        breadcrumb: "Solarion › Troubleshooting",
        url: "https://docs.evocave.com/solarion/troubleshooting/mobile",
        excerpt: "Fix mobile layout problems including broken sections and overflow.",
    },
    {
        id: 7,
        title: "Coworkly Figma Kit — Getting Started",
        breadcrumb: "Coworkly › Getting Started",
        url: "https://docs.evocave.com/coworkly/getting-started",
        excerpt: "How to open, duplicate and use the Coworkly Figma UI Kit.",
    },
    {
        id: 8,
        title: "Updating Your Template Kit to Latest Version",
        breadcrumb: "General › Updates",
        url: "https://docs.evocave.com/general/updates",
        excerpt: "How to safely update your kit without losing customizations.",
    },
];

// ─── Helpers ──────────────────────────────────────────────
function searchKB(query: string): KBArticle[] {
    if (query.trim().length < 3) return [];
    const q = query.toLowerCase();
    return mockKBArticles
        .filter(
            (a) =>
                a.title.toLowerCase().includes(q) ||
                a.excerpt.toLowerCase().includes(q) ||
                a.breadcrumb.toLowerCase().includes(q),
        )
        .slice(0, 3);
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function maskCode(code: string) {
    const parts = code.split("-");
    return parts.map((p, i) => (i === parts.length - 1 ? p : "****")).join("-");
}

function formatBytes(bytes: number) {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon(type: string) {
    const kind = ALLOWED_TYPES[type];
    if (kind === "image") return <ImageIcon className="h-4 w-4" />;
    if (kind === "video") return <Film className="h-4 w-4" />;
    if (kind === "archive") return <FileArchive className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
}

// ─── Add Product Modal ────────────────────────────────────
function AddProductModal({
    onClose,
    onAdd,
}: {
    onClose: () => void;
    onAdd: (product: Product) => void;
}) {
    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState<{
        valid: boolean;
        product?: Product;
        error?: string;
    } | null>(null);

    async function handleVerify() {
        if (!code.trim()) return;
        setVerifying(true);
        setResult(null);
        // TODO: POST /api/envato/verify { purchaseCode: code }
        await new Promise((r) => setTimeout(r, 1500));
        // Mock result
        setResult({
            valid: true,
            product: {
                id: "p-new",
                envatoItemId: 56240617,
                name: "Solarion - Solar & Green Renewable Energy Elementor Template Kit",
                thumbnailUrl: "https://s3.envato.com/files/778140542/thumbnail-solarion.png",
                purchaseCode: code,
                purchaseDate: new Date().toISOString(),
                license: "Regular License",
            },
        });
        setVerifying(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">Add New Product</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-600 transition-colors hover:text-zinc-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Purchase Code
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    setResult(null);
                                }}
                                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 font-mono text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-zinc-600 focus:outline-none"
                            />
                            <button
                                onClick={handleVerify}
                                disabled={!code.trim() || verifying || result?.valid === true}
                                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                    result?.valid
                                        ? "border border-emerald-500/20 bg-emerald-500/20 text-emerald-400"
                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                                }`}
                            >
                                {verifying ? (
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
                                ) : result?.valid ? (
                                    "✓ Valid"
                                ) : (
                                    "Verify"
                                )}
                            </button>
                        </div>
                        <p className="mt-1.5 text-xs text-zinc-600">
                            Find your purchase code on{" "}
                            <a
                                href="https://codecanyon.net/downloads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-400"
                            >
                                Envato Downloads
                            </a>
                        </p>
                    </div>

                    {result?.valid && result.product && (
                        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                            <img
                                src={result.product.thumbnailUrl}
                                alt=""
                                className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-zinc-200">
                                    {result.product.name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {result.product.license}
                                </p>
                            </div>
                        </div>
                    )}

                    {result?.valid === false && (
                        <p className="text-xs text-red-400">
                            Purchase code not found or not an Evocave product.
                        </p>
                    )}

                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-zinc-800 py-2.5 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => result?.product && onAdd(result.product)}
                            disabled={!result?.valid}
                            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Add Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Product Select ───────────────────────────────────────
function ProductSelect({
    products,
    selectedId,
    onSelect,
    onAddProduct,
}: {
    products: Product[];
    selectedId: string;
    onSelect: (id: string) => void;
    onAddProduct: () => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = products.find((p) => p.id === selectedId);

    // Close on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                    open
                        ? "border-zinc-600 bg-zinc-800/60"
                        : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
            >
                {selected ? (
                    <>
                        <img
                            src={selected.thumbnailUrl}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-zinc-200">{selected.name}</p>
                            <p className="text-muted-foreground text-xs">
                                {selected.license} · Purchased on{" "}
                                {formatDate(selected.purchaseDate)} ·{" "}
                                {maskCode(selected.purchaseCode)}
                            </p>
                        </div>
                    </>
                ) : (
                    <span className="text-muted-foreground flex-1 text-sm">
                        Select related product
                    </span>
                )}
                <ChevronDown
                    className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl">
                    {products.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto">
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(product.id);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800 ${
                                        selectedId === product.id ? "bg-blue-500/10" : ""
                                    }`}
                                >
                                    <img
                                        src={product.thumbnailUrl}
                                        alt=""
                                        className="h-9 w-9 shrink-0 rounded-md object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm text-zinc-200">
                                            {product.name}
                                        </p>
                                        <p className="text-muted-foreground mt-0.5 text-xs">
                                            {product.license} · {maskCode(product.purchaseCode)}
                                        </p>
                                    </div>
                                    {selectedId === product.id && (
                                        <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-6 text-center">
                            <p className="text-muted-foreground text-sm">No products yet</p>
                        </div>
                    )}

                    {/* Add product */}
                    <div className="border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                onAddProduct();
                            }}
                            className="text-muted-foreground flex w-full items-center gap-2 px-4 py-3 text-sm transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add product
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── KB Suggestions ───────────────────────────────────────
function KBSuggestions({ articles, onDismiss }: { articles: KBArticle[]; onDismiss: () => void }) {
    if (articles.length === 0) return null;
    return (
        <div className="overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center justify-between border-b border-amber-500/15 px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <svg
                        className="h-3.5 w-3.5 text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                    <span className="text-xs font-medium text-amber-400">
                        These articles might solve your issue
                    </span>
                </div>
                <button
                    onClick={onDismiss}
                    className="text-xs text-amber-600 transition-colors hover:text-amber-400"
                >
                    Dismiss
                </button>
            </div>
            <div className="divide-y divide-amber-500/10">
                {articles.map((article) => (
                    <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-amber-500/10"
                    >
                        <svg
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm text-zinc-200 transition-colors group-hover:text-white">
                                {article.title}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-zinc-600">
                                {article.excerpt}
                            </p>
                            <p className="mt-0.5 text-xs text-amber-600/70">{article.breadcrumb}</p>
                        </div>
                        <svg
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-700 transition-colors group-hover:text-amber-500/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </a>
                ))}
            </div>
            <div className="flex items-center justify-between border-t border-amber-500/15 px-4 py-2">
                <span className="text-xs text-zinc-600">Did one of these help?</span>
                <button
                    onClick={onDismiss}
                    className="text-xs font-medium text-amber-500 transition-colors hover:text-amber-400"
                >
                    Yes, solved it ✓
                </button>
            </div>
        </div>
    );
}

// ─── Tiptap Toolbar ───────────────────────────────────────
function ToolbarButton({
    onClick,
    active,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors ${
                active
                    ? "bg-zinc-700 text-zinc-100"
                    : "text-muted-foreground hover:bg-zinc-800 hover:text-zinc-300"
            }`}
        >
            {children}
        </button>
    );
}

function RichTextEditor({
    onChange,
    placeholder,
}: {
    onChange: (html: string) => void;
    placeholder?: string;
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true },
                orderedList: { keepMarks: true },
            }),
            Underline,
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-blue-400 underline" },
            }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        immediatelyRender: false,
        content: "",
        editorProps: {
            attributes: {
                class: "min-h-[180px] px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none prose prose-invert prose-sm max-w-none",
            },
        },
        onUpdate({ editor }) {
            onChange(editor.isEmpty ? "" : editor.getHTML());
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;
        const url = window.prompt("Enter URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
        else editor.chain().focus().unsetLink().run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-colors focus-within:border-zinc-600">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-800 px-2 py-1.5">
                {/* Text style */}
                <ToolbarButton
                    title="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                >
                    <RiBold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                >
                    <RiItalic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Underline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive("underline")}
                >
                    <RiUnderline className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-4 w-px bg-zinc-800" />

                {/* Lists */}
                <ToolbarButton
                    title="Bullet list"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive("bulletList")}
                >
                    <RiListUnordered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Ordered list"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive("orderedList")}
                >
                    <RiListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-4 w-px bg-zinc-800" />

                {/* Block */}
                <ToolbarButton
                    title="Blockquote"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive("blockquote")}
                >
                    <RiDoubleQuotesR className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Code"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive("code")}
                >
                    <RiCodeLine className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-4 w-px bg-zinc-800" />

                {/* Link */}
                <ToolbarButton title="Link" onClick={setLink} active={editor.isActive("link")}>
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <RiLink className="h-4 w-4" />
                    </svg>
                </ToolbarButton>

                <div className="mx-1 h-4 w-px bg-zinc-800" />

                {/* Undo/Redo */}
                <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6M3 10l6-6"
                        />
                    </svg>
                </ToolbarButton>
                <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
                    <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6M21 10l-6-6"
                        />
                    </svg>
                </ToolbarButton>
            </div>

            {/* Editor area */}
            <EditorContent editor={editor} />

            {/* Placeholder styling */}
            <style>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #52525b;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    );
}

// ─── File Attachment ──────────────────────────────────────
function FileAttachment({
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
                setError(`Max ${MAX_FILES} files allowed`);
                break;
            }
            if (!ALLOWED_TYPES[file.type]) {
                setError(`${file.name}: file type not allowed`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setError(`${file.name}: exceeds ${MAX_FILE_SIZE_MB}MB limit`);
                continue;
            }
            const totalNew = newFiles.reduce((sum, f) => sum + f.file.size, 0);
            if (totalCurrent + totalNew + file.size > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
                setError(`Total size exceeds ${MAX_TOTAL_SIZE_MB}MB`);
                break;
            }

            const id = Math.random().toString(36).slice(2);
            const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
            newFiles.push({ id, file, preview });
        }

        if (newFiles.length > 0) onAdd(newFiles);
        if (inputRef.current) inputRef.current.value = "";
    }

    // Drag and drop
    const [dragging, setDragging] = useState(false);

    return (
        <div className="space-y-2">
            {/* Drop zone */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
                }}
                onClick={() => inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-5 transition-colors ${
                    dragging
                        ? "border-blue-500/50 bg-blue-500/5"
                        : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30"
                }`}
            >
                <Paperclip className="h-5 w-5 text-zinc-600" />
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                        <span className="text-zinc-400">Click to attach</span> or drag and drop
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-600">
                        Images, PDF, ZIP, Video · Max {MAX_FILE_SIZE_MB}MB per file · {MAX_FILES}{" "}
                        files max
                    </p>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={Object.keys(ALLOWED_TYPES).join(",")}
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
            </div>

            {/* Error */}
            {error && <p className="text-xs text-red-400">{error}</p>}

            {/* File list */}
            {files.length > 0 && (
                <div className="space-y-1.5">
                    {files.map((f) => (
                        <div
                            key={f.id}
                            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2.5"
                        >
                            {f.preview ? (
                                <img
                                    src={f.preview}
                                    alt=""
                                    className="h-8 w-8 shrink-0 rounded object-cover"
                                />
                            ) : (
                                <div className="text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded bg-zinc-800">
                                    {getFileIcon(f.file.type)}
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-zinc-300">{f.file.name}</p>
                                <p className="text-xs text-zinc-600">{formatBytes(f.file.size)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemove(f.id)}
                                className="shrink-0 text-zinc-700 transition-colors hover:text-zinc-400"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <p className="text-right text-xs text-zinc-600">
                        {files.length}/{MAX_FILES} files ·{" "}
                        {formatBytes(files.reduce((s, f) => s + f.file.size, 0))} /{" "}
                        {MAX_TOTAL_SIZE_MB}MB
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Priority selector ────────────────────────────────────
const priorities: { value: Priority; label: string; color: string; dot: string }[] = [
    { value: "LOW", label: "Low", color: "text-zinc-400", dot: "bg-muted-foreground" },
    { value: "MEDIUM", label: "Medium", color: "text-blue-400", dot: "bg-blue-500" },
    { value: "HIGH", label: "High", color: "text-amber-400", dot: "bg-amber-500" },
    { value: "URGENT", label: "Urgent", color: "text-red-400", dot: "bg-red-500" },
];

const categories: { value: Category; label: string }[] = [
    { value: "installation", label: "Installation Issue" },
    { value: "bug", label: "Bug Report" },
    { value: "feature", label: "Feature Request" },
    { value: "license", label: "License Question" },
    { value: "other", label: "Other" },
];

// ─── Main Page ───────────────────────────────────────────
export default function NewTicketPage() {
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState<Category | "">("");
    const [priority, setPriority] = useState<Priority>("MEDIUM");
    const [bodyHtml, setBodyHtml] = useState("");
    const [files, setFiles] = useState<AttachedFile[]>([]);

    const [dismissed, setDismissed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedSubject = useDebounce(subject, 400);
    const kbArticles = dismissed ? [] : searchKB(debouncedSubject);

    useEffect(() => {
        setDismissed(false);
    }, [debouncedSubject]);

    const isValid =
        selectedProduct &&
        subject.trim().length >= 5 &&
        bodyHtml.trim().length > 0 &&
        bodyHtml !== "<p></p>";

    async function handleSubmit() {
        if (!isValid || isSubmitting) return;
        setIsSubmitting(true);
        // TODO: POST /api/tickets with FormData (files + JSON fields)
        await new Promise((r) => setTimeout(r, 1200));
        router.push("/dashboard/tickets");
    }

    function handleAddProduct(product: Product) {
        setProducts((prev) => {
            const exists = prev.find((p) => p.id === product.id);
            return exists ? prev : [...prev, product];
        });
        setSelectedProduct(product.id);
    }

    return (
        <>
            {showAddModal && (
                <AddProductModal onClose={() => setShowAddModal(false)} onAdd={handleAddProduct} />
            )}

            <div className="mx-auto space-y-6">
                {/* Header */}
                <div>
                    <Link
                        href="/tickets"
                        className="text-muted-foreground mb-4 inline-flex items-center gap-1.5 text-sm transition-colors hover:text-zinc-300"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to tickets
                    </Link>
                    <h1 className="text-2xl font-semibold text-white">Create New Ticket</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        We respond during business hours 09:00–17:00 (Mon–Fri, GMT+7).
                    </p>
                </div>

                {/* Form card */}
                <div className="bg-secondary/20 space-y-6 rounded-xl border border-zinc-800 p-4 lg:p-6">
                    {/* 1. Product */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Related Product <span className="text-red-400">*</span>
                        </label>
                        <ProductSelect
                            products={products}
                            selectedId={selectedProduct}
                            onSelect={setSelectedProduct}
                            onAddProduct={() => setShowAddModal(true)}
                        />
                    </div>

                    <div className="border-t border-zinc-800/60" />

                    {/* 2. Subject */}
                    <div className="space-y-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Subject <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Brief description of your issue"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                maxLength={120}
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-zinc-600 focus:outline-none"
                            />
                        </div>
                        {/* KB suggestions — appears while typing */}
                        <KBSuggestions articles={kbArticles} onDismiss={() => setDismissed(true)} />
                    </div>

                    {/* 3. Category + Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as Category | "")}
                                className="w-full cursor-pointer appearance-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 transition-colors focus:border-zinc-600 focus:outline-none"
                            >
                                <option value="">Select category</option>
                                {categories.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Priority
                            </label>
                            <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
                                {priorities.map((p) => (
                                    <button
                                        key={p.value}
                                        type="button"
                                        onClick={() => setPriority(p.value)}
                                        className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
                                            priority === p.value
                                                ? `border-zinc-600 bg-zinc-800 ${p.color}`
                                                : "border-zinc-800 bg-zinc-900 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                                        }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${priority === p.value ? p.dot : "bg-zinc-700"}`}
                                        />
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. Description — Tiptap */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <RichTextEditor
                            onChange={setBodyHtml}
                            placeholder="Describe your issue in detail. Include steps to reproduce, browser version, and screenshots if possible."
                        />
                        <p className="mt-1.5 text-xs text-zinc-600">
                            Include steps to reproduce, browser/OS version, and any error messages.
                        </p>
                    </div>

                    {/* 5. Attachments */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Attachments
                            <span className="ml-2 text-xs font-normal text-zinc-600">optional</span>
                        </label>
                        <FileAttachment
                            files={files}
                            onAdd={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
                            onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isValid || isSubmitting}
                        className={`w-full rounded-lg py-3 text-sm font-medium transition-all ${
                            isValid && !isSubmitting
                                ? "cursor-pointer bg-blue-600 text-white hover:bg-blue-500"
                                : "cursor-not-allowed bg-zinc-800 text-zinc-600"
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
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
                                Submitting...
                            </span>
                        ) : (
                            "Submit Ticket"
                        )}
                    </button>
                </div>

                {/* Response time note */}
                <p className="text-center text-xs text-zinc-600">
                    Average response time is under 24 hours on business days.{" "}
                    <a
                        href="https://docs.evocave.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-zinc-400"
                    >
                        Browse documentation →
                    </a>
                </p>
            </div>
        </>
    );
}
