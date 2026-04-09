"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Megaphone, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
type AnnouncementType = "update" | "maintenance" | "news" | "security";

interface Announcement {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    type: AnnouncementType;
    product: string | null;
    published: boolean;
    createdAt: string;
}

// ─── Configs ─────────────────────────────────────────────
const typeConfig: Record<AnnouncementType, { label: string; color: string }> = {
    update: { label: "Update", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
    maintenance: {
        label: "Maintenance",
        color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    news: {
        label: "News",
        color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    security: { label: "Security", color: "bg-red-500/10 text-red-400 border border-red-500/20" },
};

const PRODUCTS = ["All Products", "Solarion", "Coworkly", "Elecfix", "SteelForge"];

// ─── Mock Data ───────────────────────────────────────────
const INITIAL_ANNOUNCEMENTS: Announcement[] = [
    {
        id: "a1",
        title: "Solarion v2.1 Released",
        type: "update",
        product: "Solarion",
        published: true,
        createdAt: "2026-04-07T10:00:00Z",
        excerpt: "We've released Solarion v2.1 with new sections and performance improvements.",
        content:
            "We're excited to announce the release of Solarion v2.1!\n\nWhat's new:\n- 5 new page sections\n- Improved mobile responsiveness\n- Performance optimizations\n- Bug fixes for Elementor 3.20+\n\nUpdate your template kit from your Envato downloads page.",
    },
    {
        id: "a2",
        title: "Scheduled Maintenance — April 15",
        type: "maintenance",
        product: null,
        published: true,
        createdAt: "2026-04-06T09:00:00Z",
        excerpt:
            "Our support system will be down for maintenance on April 15, 2026 from 2:00–4:00 AM UTC.",
        content:
            "We will be performing scheduled maintenance on April 15, 2026 from 2:00 AM to 4:00 AM UTC.\n\nDuring this time:\n- Support tickets will be unavailable\n- Existing tickets will not be affected\n\nWe apologize for any inconvenience.",
    },
    {
        id: "a3",
        title: "Coworkly Figma Kit Update",
        type: "update",
        product: "Coworkly",
        published: true,
        createdAt: "2026-04-05T14:00:00Z",
        excerpt:
            "Coworkly Figma UI Kit has been updated with new components and auto-layout support.",
        content:
            "The Coworkly Figma UI Kit has been updated to v1.3.\n\nChanges:\n- Added 20+ new components\n- Full auto-layout support\n- Variables for colors and typography\n- Dark mode variants",
    },
    {
        id: "a4",
        title: "New Security Advisory",
        type: "security",
        product: null,
        published: false,
        createdAt: "2026-04-04T11:00:00Z",
        excerpt: "Important security update for all WordPress template users.",
        content:
            "We recommend updating your WordPress installation to the latest version.\n\nA vulnerability has been discovered in older versions of Elementor. Please update immediately.",
    },
    {
        id: "a5",
        title: "Welcome to Evocave Help Center",
        type: "news",
        product: null,
        published: true,
        createdAt: "2026-04-01T08:00:00Z",
        excerpt:
            "We've launched our new help center to provide better support for all Evocave products.",
        content:
            "We're thrilled to launch the Evocave Help Center!\n\nYou can now:\n- Submit and track support tickets\n- Browse our knowledge base\n- Get faster responses from our team\n\nThank you for being part of the Evocave community!",
    },
];

// ─── Helpers ─────────────────────────────────────────────
function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// ─── Modal ───────────────────────────────────────────────
function AnnouncementModal({
    initial,
    onSave,
    onClose,
}: {
    initial?: Partial<Announcement>;
    onSave: (data: Omit<Announcement, "id" | "createdAt">) => void;
    onClose: () => void;
}) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [type, setType] = useState<AnnouncementType>(initial?.type ?? "news");
    const [product, setProduct] = useState(initial?.product ?? null);
    const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
    const [content, setContent] = useState(initial?.content ?? "");
    const [published, setPublished] = useState(initial?.published ?? false);
    const [saving, setSaving] = useState(false);

    const isEdit = !!initial?.id;
    const canSave = title.trim() && excerpt.trim() && content.trim();

    async function handleSave() {
        if (!canSave || saving) return;
        setSaving(true);
        await new Promise((r) => setTimeout(r, 500));
        onSave({ title, type, product: product || null, excerpt, content, published });
        setSaving(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-popover border-border my-8 w-full max-w-xl overflow-hidden rounded-2xl border shadow-xl">
                {/* Header */}
                <div className="border-border flex items-center justify-between border-b px-5 py-4">
                    <h2 className="text-foreground text-base font-semibold">
                        {isEdit ? "Edit Announcement" : "New Announcement"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

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
                            placeholder="Announcement title..."
                            className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                        />
                    </div>

                    {/* Type + Product */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                                Type
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as AnnouncementType)}
                                className="bg-secondary/20 border-border text-foreground focus:border-ring/70 w-full cursor-pointer appearance-none rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                            >
                                {Object.entries(typeConfig).map(([val, cfg]) => (
                                    <option key={val} value={val}>
                                        {cfg.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                                Product
                            </label>
                            <select
                                value={product ?? ""}
                                onChange={(e) => setProduct(e.target.value || null)}
                                className="bg-secondary/20 border-border text-foreground focus:border-ring/70 w-full cursor-pointer appearance-none rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                            >
                                <option value="">All Products</option>
                                {PRODUCTS.filter((p) => p !== "All Products").map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                            Excerpt <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Short summary shown in the list..."
                            rows={2}
                            className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full resize-none rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                            Content <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Full announcement content..."
                            rows={8}
                            className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full resize-none rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                        />
                        <p className="text-muted-foreground mt-1 text-xs">
                            {content.length} characters
                        </p>
                    </div>

                    {/* Published toggle */}
                    <div className="border-border bg-secondary/20 flex items-center justify-between rounded-lg border px-4 py-3">
                        <div>
                            <p className="text-foreground text-sm font-medium">
                                Publish immediately
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Visible to all users when published
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPublished(!published)}
                            className={cn(
                                "relative h-6 w-11 rounded-full transition-colors",
                                published ? "bg-blue-600" : "bg-secondary/60",
                            )}
                        >
                            <span
                                className={cn(
                                    "absolute top-1 left-0 h-4 w-4 rounded-full bg-white shadow transition-transform",
                                    published ? "translate-x-6" : "translate-x-1",
                                )}
                            />
                        </button>
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
                        {saving
                            ? "Saving..."
                            : isEdit
                              ? "Save changes"
                              : published
                                ? "Publish"
                                : "Save as draft"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Confirm ───────────────────────────────────────
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
                        Delete announcement?
                    </h2>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                        "<span className="text-foreground">{title}</span>" will be permanently
                        deleted.
                    </p>
                </div>
                <div className="border-border flex justify-end gap-2 border-t px-5 py-4">
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
export default function AdminAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
    const [typeFilter, setTypeFilter] = useState<AnnouncementType | "ALL">("ALL");
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Announcement | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

    const filtered = announcements
        .filter((a) => typeFilter === "ALL" || a.type === typeFilter)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const publishedCount = announcements.filter((a) => a.published).length;
    const draftCount = announcements.filter((a) => !a.published).length;

    function handleSave(data: Omit<Announcement, "id" | "createdAt">) {
        if (editTarget) {
            setAnnouncements((prev) =>
                prev.map((a) => (a.id === editTarget.id ? { ...a, ...data } : a)),
            );
        } else {
            setAnnouncements((prev) => [
                { ...data, id: `a${Date.now()}`, createdAt: new Date().toISOString() },
                ...prev,
            ]);
        }
        setModalOpen(false);
        setEditTarget(null);
    }

    function handleDelete() {
        if (!deleteTarget) return;
        setAnnouncements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        setDeleteTarget(null);
    }

    function togglePublish(id: string) {
        setAnnouncements((prev) =>
            prev.map((a) => (a.id === id ? { ...a, published: !a.published } : a)),
        );
    }

    function openEdit(item: Announcement) {
        setEditTarget(item);
        setModalOpen(true);
    }

    function openNew() {
        setEditTarget(null);
        setModalOpen(true);
    }

    const typeTabs: { value: AnnouncementType | "ALL"; label: string }[] = [
        { value: "ALL", label: "All" },
        { value: "update", label: "Updates" },
        { value: "maintenance", label: "Maintenance" },
        { value: "news", label: "News" },
        { value: "security", label: "Security" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-foreground text-2xl font-semibold">Announcements</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        {publishedCount} published · {draftCount} draft
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                    <Plus className="h-4 w-4" />
                    New Announcement
                </button>
            </div>

            {/* Type tabs */}
            <div className="scrollbar-none flex gap-1 overflow-x-auto pb-1">
                {typeTabs.map((tab) => {
                    const count =
                        tab.value === "ALL"
                            ? announcements.length
                            : announcements.filter((a) => a.type === tab.value).length;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => setTypeFilter(tab.value)}
                            className={cn(
                                "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm whitespace-nowrap transition-colors",
                                typeFilter === tab.value
                                    ? "bg-secondary/40 text-foreground font-medium"
                                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                            )}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span
                                    className={cn(
                                        "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                                        typeFilter === tab.value
                                            ? "bg-foreground/90 text-background"
                                            : "bg-secondary/80 text-muted-foreground",
                                    )}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="bg-card/40 border-border flex flex-col items-center gap-3 rounded-xl border py-16">
                    <div className="bg-secondary/40 flex h-12 w-12 items-center justify-center rounded-xl">
                        <Megaphone className="text-muted-foreground h-6 w-6" />
                    </div>
                    <p className="text-muted-foreground text-sm">No announcements found</p>
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
                        const tc = typeConfig[item.type];
                        return (
                            <div key={item.id} className="group flex items-start gap-4 px-5 py-4">
                                {/* Left */}
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                        <span
                                            className={cn(
                                                "inline-flex rounded-full px-2 py-0.5 text-xs",
                                                tc.color,
                                            )}
                                        >
                                            {tc.label}
                                        </span>
                                        {item.product && (
                                            <span className="bg-secondary/40 text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                                                {item.product}
                                            </span>
                                        )}
                                        {!item.published && (
                                            <span className="rounded-full border border-zinc-500/20 bg-zinc-500/10 px-2 py-0.5 text-xs text-zinc-500">
                                                Draft
                                            </span>
                                        )}
                                        <span className="text-muted-foreground text-xs">
                                            {formatDate(item.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-foreground text-sm font-medium">
                                        {item.title}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">
                                        {item.excerpt}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    {/* Toggle publish */}
                                    <button
                                        onClick={() => togglePublish(item.id)}
                                        title={item.published ? "Unpublish" : "Publish"}
                                        className={cn(
                                            "rounded-lg p-1.5 transition-colors",
                                            item.published
                                                ? "hover:text-muted-foreground text-emerald-400"
                                                : "text-muted-foreground hover:text-emerald-400",
                                        )}
                                    >
                                        {item.published ? (
                                            <Eye className="h-4 w-4" />
                                        ) : (
                                            <EyeOff className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(item)}
                                        className="text-muted-foreground hover:text-destructive rounded-lg p-1.5 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            {modalOpen && (
                <AnnouncementModal
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
