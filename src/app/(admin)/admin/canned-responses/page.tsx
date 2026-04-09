"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
interface CannedResponse {
    id: string;
    title: string;
    shortcut: string;
    category: string;
    content: string;
    createdAt: string;
}

// ─── Mock Data ───────────────────────────────────────────
const INITIAL_CANNED: CannedResponse[] = [
    {
        id: "c1",
        title: "Thanks for reaching out",
        shortcut: "/thanks",
        category: "General",
        createdAt: "2026-01-01T00:00:00Z",
        content:
            "Thank you for reaching out to Evocave support! We appreciate your patience and will get back to you as soon as possible.",
    },
    {
        id: "c2",
        title: "Installation Guide",
        shortcut: "/install",
        category: "Installation",
        createdAt: "2026-01-02T00:00:00Z",
        content:
            "To install the template kit, please follow these steps:\n1. Download the .zip file from Envato\n2. Extract the archive\n3. In WordPress, go to Elementor > Template Kit\n4. Import the .json file\n\nLet me know if you encounter any issues!",
    },
    {
        id: "c3",
        title: "Marking as Resolved",
        shortcut: "/resolved",
        category: "General",
        createdAt: "2026-01-03T00:00:00Z",
        content:
            "I'm glad we could help! I'm marking this ticket as resolved. If you have any further questions, don't hesitate to reach out.",
    },
    {
        id: "c4",
        title: "Purchase Code Location",
        shortcut: "/code",
        category: "License",
        createdAt: "2026-01-04T00:00:00Z",
        content:
            "To find your purchase code:\n1. Log in to your Envato account\n2. Go to Downloads\n3. Find your product\n4. Click 'License Certificate'\n\nYour purchase code will be displayed there.",
    },
    {
        id: "c5",
        title: "Awaiting More Information",
        shortcut: "/info",
        category: "General",
        createdAt: "2026-01-05T00:00:00Z",
        content:
            "We need a bit more information to help you effectively. Could you please provide:\n- Screenshots of the error\n- Your WordPress and Elementor versions\n- Steps to reproduce the issue\n\nThank you!",
    },
    {
        id: "c6",
        title: "Browser Cache Fix",
        shortcut: "/cache",
        category: "Installation",
        createdAt: "2026-01-06T00:00:00Z",
        content:
            "Please try clearing your browser cache and cookies, then reload the page. This usually resolves most display issues.",
    },
    {
        id: "c7",
        title: "Refund Policy",
        shortcut: "/refund",
        category: "License",
        createdAt: "2026-01-07T00:00:00Z",
        content:
            "Refunds are handled directly through Envato. Please visit help.market.envato.com to submit a refund request. We're unable to process refunds on our end.",
    },
];

const ALL_CATEGORIES = ["General", "Installation", "License", "Bug", "Feature"];

// ─── Modal ───────────────────────────────────────────────
function CannedModal({
    initial,
    onSave,
    onClose,
}: {
    initial?: Partial<CannedResponse>;
    onSave: (data: Omit<CannedResponse, "id" | "createdAt">) => void;
    onClose: () => void;
}) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [shortcut, setShortcut] = useState(initial?.shortcut ?? "");
    const [category, setCategory] = useState(initial?.category ?? "General");
    const [content, setContent] = useState(initial?.content ?? "");
    const [saving, setSaving] = useState(false);

    const isEdit = !!initial?.id;
    const canSave = title.trim() && content.trim();

    async function handleSave() {
        if (!canSave || saving) return;
        setSaving(true);
        await new Promise((r) => setTimeout(r, 500));
        onSave({ title, shortcut, category, content });
        setSaving(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-popover border-border w-full max-w-lg overflow-hidden rounded-2xl border shadow-xl">
                {/* Header */}
                <div className="border-border flex items-center justify-between border-b px-5 py-4">
                    <h2 className="text-foreground text-base font-semibold">
                        {isEdit ? "Edit Canned Response" : "New Canned Response"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-4 px-5 py-5">
                    {/* Title */}
                    <div>
                        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Template import steps"
                            className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                        />
                    </div>

                    {/* Shortcut + Category */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                                Shortcut
                            </label>
                            <input
                                type="text"
                                value={shortcut}
                                onChange={(e) => setShortcut(e.target.value)}
                                placeholder="/shortcut"
                                className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border px-3 py-2.5 font-mono text-sm transition-colors focus:outline-none"
                            />
                            <p className="text-muted-foreground mt-1 text-xs">
                                Type this in reply box to insert
                            </p>
                        </div>
                        <div>
                            <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="bg-secondary/20 border-border text-foreground focus:border-ring/70 w-full cursor-pointer appearance-none rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                            >
                                {ALL_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                            Content <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write the canned response content..."
                            rows={6}
                            className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full resize-none rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                        />
                        <p className="text-muted-foreground mt-1 text-xs">
                            {content.length} characters
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-border flex items-center justify-end gap-2 border-t px-5 py-4">
                    <button
                        onClick={onClose}
                        className="border-border text-muted-foreground hover:text-foreground rounded-lg border px-4 py-2 text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!canSave || saving}
                        className={cn(
                            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                            canSave && !saving
                                ? "bg-blue-600 text-white hover:bg-blue-500"
                                : "cursor-not-allowed bg-zinc-800 text-zinc-600",
                        )}
                    >
                        {saving ? "Saving..." : isEdit ? "Save changes" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Confirm Modal ─────────────────────────────────
function DeleteModal({
    title,
    onConfirm,
    onClose,
}: {
    title: string;
    onConfirm: () => void;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-popover border-border w-full max-w-sm overflow-hidden rounded-2xl border shadow-xl">
                <div className="px-5 py-5">
                    <h2 className="text-foreground text-base font-semibold">
                        Delete canned response?
                    </h2>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                        "<span className="text-foreground">{title}</span>" will be permanently
                        deleted.
                    </p>
                </div>
                <div className="border-border flex items-center justify-end gap-2 border-t px-5 py-4">
                    <button
                        onClick={onClose}
                        className="border-border text-muted-foreground hover:text-foreground rounded-lg border px-4 py-2 text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────
export default function AdminCannedResponsesPage() {
    const [canned, setCanned] = useState<CannedResponse[]>(INITIAL_CANNED);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CannedResponse | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CannedResponse | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const categories = ["All", ...ALL_CATEGORIES];

    const filtered = canned
        .filter((c) => categoryFilter === "All" || c.category === categoryFilter)
        .filter(
            (c) =>
                !search ||
                c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.shortcut.toLowerCase().includes(search.toLowerCase()) ||
                c.content.toLowerCase().includes(search.toLowerCase()),
        );

    function handleSave(data: Omit<CannedResponse, "id" | "createdAt">) {
        if (editTarget) {
            setCanned((prev) => prev.map((c) => (c.id === editTarget.id ? { ...c, ...data } : c)));
        } else {
            setCanned((prev) => [
                ...prev,
                { ...data, id: `c${Date.now()}`, createdAt: new Date().toISOString() },
            ]);
        }
        setModalOpen(false);
        setEditTarget(null);
    }

    function handleDelete() {
        if (!deleteTarget) return;
        setCanned((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
    }

    function openEdit(item: CannedResponse) {
        setEditTarget(item);
        setModalOpen(true);
    }

    function openNew() {
        setEditTarget(null);
        setModalOpen(true);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-foreground text-2xl font-semibold">Canned Responses</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        {canned.length} templates · type "/" in reply box to use
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                    <Plus className="h-4 w-4" />
                    New Response
                </button>
            </div>

            {/* Search + category filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search responses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border py-2.5 pr-4 pl-9 text-sm transition-colors focus:outline-none"
                    />
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={cn(
                                "rounded-lg px-3 py-2 text-sm transition-colors",
                                categoryFilter === cat
                                    ? "bg-secondary/40 text-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="bg-card/40 border-border flex flex-col items-center gap-3 rounded-xl border py-16">
                    <p className="text-muted-foreground text-sm">No canned responses found</p>
                    <button
                        onClick={openNew}
                        className="text-sm text-blue-400 transition-colors hover:text-blue-300"
                    >
                        Create one →
                    </button>
                </div>
            ) : (
                <div className="bg-card/40 border-border divide-border/60 divide-y overflow-hidden rounded-xl border">
                    {filtered.map((item) => {
                        const isExpanded = expandedId === item.id;
                        return (
                            <div key={item.id} className="px-5 py-4">
                                <div className="flex items-start gap-3">
                                    {/* Left */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-foreground text-sm font-medium">
                                                {item.title}
                                            </p>
                                            {item.shortcut && (
                                                <span className="bg-secondary/40 text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                                                    {item.shortcut}
                                                </span>
                                            )}
                                            <span className="bg-secondary/20 text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                                                {item.category}
                                            </span>
                                        </div>

                                        {/* Content preview / expanded */}
                                        <p
                                            className={cn(
                                                "text-muted-foreground mt-1.5 text-sm leading-relaxed whitespace-pre-line",
                                                !isExpanded && "line-clamp-2",
                                            )}
                                        >
                                            {item.content}
                                        </p>

                                        {item.content.length > 120 && (
                                            <button
                                                onClick={() =>
                                                    setExpandedId(isExpanded ? null : item.id)
                                                }
                                                className="text-muted-foreground hover:text-foreground mt-1 text-xs transition-colors"
                                            >
                                                {isExpanded ? "Show less ↑" : "Show more ↓"}
                                            </button>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(item)}
                                            className="text-muted-foreground hover:text-destructive rounded-lg p-2 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            {modalOpen && (
                <CannedModal
                    initial={editTarget ?? undefined}
                    onSave={handleSave}
                    onClose={() => {
                        setModalOpen(false);
                        setEditTarget(null);
                    }}
                />
            )}
            {deleteTarget && (
                <DeleteModal
                    title={deleteTarget.title}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}
