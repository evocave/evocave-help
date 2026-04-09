"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
interface Label {
    id: string;
    name: string;
    color: string;
    description: string;
    ticketCount: number;
    createdAt: string;
}

// ─── Color options ────────────────────────────────────────
const COLOR_OPTIONS = [
    {
        value: "red",
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/20",
        dot: "bg-red-500",
    },
    {
        value: "orange",
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        border: "border-orange-500/20",
        dot: "bg-orange-500",
    },
    {
        value: "amber",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/20",
        dot: "bg-amber-500",
    },
    {
        value: "green",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        dot: "bg-emerald-500",
    },
    {
        value: "blue",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/20",
        dot: "bg-blue-500",
    },
    {
        value: "purple",
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/20",
        dot: "bg-purple-500",
    },
    {
        value: "pink",
        bg: "bg-pink-500/10",
        text: "text-pink-400",
        border: "border-pink-500/20",
        dot: "bg-pink-500",
    },
    {
        value: "zinc",
        bg: "bg-zinc-500/10",
        text: "text-zinc-400",
        border: "border-zinc-500/20",
        dot: "bg-zinc-500",
    },
];

function getColor(color: string) {
    return COLOR_OPTIONS.find((c) => c.value === color) ?? COLOR_OPTIONS[4];
}

// ─── Mock Data ───────────────────────────────────────────
const INITIAL_LABELS: Label[] = [
    {
        id: "l1",
        name: "Bug",
        color: "red",
        description: "Something is not working as expected",
        ticketCount: 12,
        createdAt: "2026-01-01T00:00:00Z",
    },
    {
        id: "l2",
        name: "Installation",
        color: "blue",
        description: "Issues related to template installation",
        ticketCount: 8,
        createdAt: "2026-01-02T00:00:00Z",
    },
    {
        id: "l3",
        name: "License",
        color: "amber",
        description: "Purchase code and license issues",
        ticketCount: 5,
        createdAt: "2026-01-03T00:00:00Z",
    },
    {
        id: "l4",
        name: "Feature Request",
        color: "purple",
        description: "Suggestions and feature requests",
        ticketCount: 3,
        createdAt: "2026-01-04T00:00:00Z",
    },
    {
        id: "l5",
        name: "General",
        color: "zinc",
        description: "General questions and inquiries",
        ticketCount: 9,
        createdAt: "2026-01-05T00:00:00Z",
    },
    {
        id: "l6",
        name: "Urgent",
        color: "orange",
        description: "Requires immediate attention",
        ticketCount: 2,
        createdAt: "2026-01-06T00:00:00Z",
    },
];

// ─── Modal ───────────────────────────────────────────────
function LabelModal({
    initial,
    onSave,
    onClose,
}: {
    initial?: Partial<Label>;
    onSave: (data: Omit<Label, "id" | "ticketCount" | "createdAt">) => void;
    onClose: () => void;
}) {
    const [name, setName] = useState(initial?.name ?? "");
    const [color, setColor] = useState(initial?.color ?? "blue");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [saving, setSaving] = useState(false);

    const isEdit = !!initial?.id;
    const canSave = name.trim();
    const preview = getColor(color);

    async function handleSave() {
        if (!canSave || saving) return;
        setSaving(true);
        await new Promise((r) => setTimeout(r, 400));
        onSave({ name, color, description });
        setSaving(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-popover border-border w-full max-w-md overflow-hidden rounded-2xl border shadow-xl">
                {/* Header */}
                <div className="border-border flex items-center justify-between border-b px-5 py-4">
                    <h2 className="text-foreground text-base font-semibold">
                        {isEdit ? "Edit Label" : "New Label"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 px-5 py-5">
                    {/* Preview */}
                    <div className="flex items-center gap-2">
                        <p className="text-muted-foreground text-xs">Preview:</p>
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                                preview.bg,
                                preview.text,
                                preview.border,
                            )}
                        >
                            <span className={cn("h-1.5 w-1.5 rounded-full", preview.dot)} />
                            {name || "Label name"}
                        </span>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                            Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Bug, Feature Request..."
                            className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                        />
                    </div>

                    {/* Color */}
                    <div>
                        <label className="text-muted-foreground mb-2 block text-xs font-medium tracking-wide uppercase">
                            Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {COLOR_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setColor(opt.value)}
                                    className={cn(
                                        "flex h-7 w-7 items-center justify-center rounded-full transition-all",
                                        opt.dot,
                                        color === opt.value
                                            ? "ring-offset-background scale-110 ring-2 ring-white/40 ring-offset-2"
                                            : "opacity-60 hover:opacity-100",
                                    )}
                                >
                                    {color === opt.value && (
                                        <span className="h-2 w-2 rounded-full bg-white/80" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                            Description <span className="text-muted-foreground/50">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What this label is for..."
                            className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                        />
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

// ─── Delete Confirm ───────────────────────────────────────
function DeleteModal({
    label,
    onConfirm,
    onClose,
}: {
    label: Label;
    onConfirm: () => void;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-popover border-border w-full max-w-sm overflow-hidden rounded-2xl border shadow-xl">
                <div className="px-5 py-5">
                    <h2 className="text-foreground text-base font-semibold">Delete label?</h2>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                        "<span className="text-foreground">{label.name}</span>" will be removed from
                        all {label.ticketCount} tickets.
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
export default function AdminLabelsPage() {
    const [labels, setLabels] = useState<Label[]>(INITIAL_LABELS);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Label | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Label | null>(null);

    function handleSave(data: Omit<Label, "id" | "ticketCount" | "createdAt">) {
        if (editTarget) {
            setLabels((prev) => prev.map((l) => (l.id === editTarget.id ? { ...l, ...data } : l)));
        } else {
            setLabels((prev) => [
                ...prev,
                {
                    ...data,
                    id: `l${Date.now()}`,
                    ticketCount: 0,
                    createdAt: new Date().toISOString(),
                },
            ]);
        }
        setModalOpen(false);
        setEditTarget(null);
    }

    function handleDelete() {
        if (!deleteTarget) return;
        setLabels((prev) => prev.filter((l) => l.id !== deleteTarget.id));
        setDeleteTarget(null);
    }

    function openEdit(label: Label) {
        setEditTarget(label);
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
                    <h1 className="text-foreground text-2xl font-semibold">Labels</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        {labels.length} labels · used to categorize tickets
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                    <Plus className="h-4 w-4" />
                    New Label
                </button>
            </div>

            {/* Labels grid */}
            {labels.length === 0 ? (
                <div className="bg-card/40 border-border flex flex-col items-center gap-3 rounded-xl border py-16">
                    <div className="bg-secondary/40 flex h-12 w-12 items-center justify-center rounded-xl">
                        <Tag className="text-muted-foreground h-6 w-6" />
                    </div>
                    <p className="text-muted-foreground text-sm">No labels yet</p>
                    <button
                        onClick={openNew}
                        className="text-sm text-blue-400 transition-colors hover:text-blue-300"
                    >
                        Create your first label →
                    </button>
                </div>
            ) : (
                <div className="bg-card/40 border-border divide-border/60 divide-y overflow-hidden rounded-xl border">
                    {labels.map((label) => {
                        const c = getColor(label.color);
                        return (
                            <div key={label.id} className="group flex items-center gap-4 px-5 py-4">
                                {/* Label chip */}
                                <span
                                    className={cn(
                                        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                                        c.bg,
                                        c.text,
                                        c.border,
                                    )}
                                >
                                    <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
                                    {label.name}
                                </span>

                                {/* Description */}
                                <p className="text-muted-foreground min-w-0 flex-1 truncate text-sm">
                                    {label.description || (
                                        <span className="italic">No description</span>
                                    )}
                                </p>

                                {/* Ticket count */}
                                <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
                                    {label.ticketCount}{" "}
                                    {label.ticketCount === 1 ? "ticket" : "tickets"}
                                </span>

                                {/* Actions */}
                                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                        onClick={() => openEdit(label)}
                                        className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(label)}
                                        className="text-muted-foreground hover:text-destructive rounded-lg p-2 transition-colors"
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
                <LabelModal
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
                    label={deleteTarget}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}
