"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Users, Mail, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
type Role = "superadmin" | "admin" | "support" | "technical";

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: Role;
    initials: string;
    joinedAt: string;
    ticketsHandled: number;
    activeTickets: number;
}

// ─── Configs ─────────────────────────────────────────────
const roleConfig: Record<Role, { label: string; color: string; description: string }> = {
    superadmin: {
        label: "Super Admin",
        color: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        description: "Full access to all settings and data",
    },
    admin: {
        label: "Admin",
        color: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        description: "Manage tickets, team, and announcements",
    },
    support: {
        label: "Support",
        color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        description: "Handle and reply to tickets",
    },
    technical: {
        label: "Technical",
        color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        description: "Handle technical tickets only",
    },
};

// ─── Mock Data ───────────────────────────────────────────
const INITIAL_MEMBERS: TeamMember[] = [
    {
        id: "m1",
        name: "Andrian Nugraha",
        email: "andrian@evocave.com",
        role: "superadmin",
        initials: "AN",
        joinedAt: "2026-01-01T00:00:00Z",
        ticketsHandled: 142,
        activeTickets: 5,
    },
    {
        id: "m2",
        name: "Support One",
        email: "support1@evocave.com",
        role: "support",
        initials: "S1",
        joinedAt: "2026-02-15T00:00:00Z",
        ticketsHandled: 67,
        activeTickets: 3,
    },
    {
        id: "m3",
        name: "Support Two",
        email: "support2@evocave.com",
        role: "technical",
        initials: "S2",
        joinedAt: "2026-03-01T00:00:00Z",
        ticketsHandled: 34,
        activeTickets: 1,
    },
];

// Current admin — nanti dari session
const CURRENT_ADMIN_ID = "m1";

// ─── Helpers ─────────────────────────────────────────────
function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// ─── Member Modal ─────────────────────────────────────────
function MemberModal({
    initial,
    onSave,
    onClose,
    isSelf,
}: {
    initial?: Partial<TeamMember>;
    onSave: (
        data: Omit<TeamMember, "id" | "joinedAt" | "ticketsHandled" | "activeTickets" | "initials">,
    ) => void;
    onClose: () => void;
    isSelf?: boolean;
}) {
    const [name, setName] = useState(initial?.name ?? "");
    const [email, setEmail] = useState(initial?.email ?? "");
    const [role, setRole] = useState<Role>(initial?.role ?? "support");
    const [saving, setSaving] = useState(false);

    const isEdit = !!initial?.id;
    const canSave = name.trim() && email.trim();

    async function handleSave() {
        if (!canSave || saving) return;
        setSaving(true);
        await new Promise((r) => setTimeout(r, 500));
        onSave({ name, email, role });
        setSaving(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-popover border-border w-full max-w-md overflow-hidden rounded-2xl border shadow-xl">
                {/* Header */}
                <div className="border-border flex items-center justify-between border-b px-5 py-4">
                    <h2 className="text-foreground text-base font-semibold">
                        {isEdit ? "Edit Member" : "Invite Team Member"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 px-5 py-5">
                    {/* Name */}
                    <div>
                        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                            Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-muted-foreground mb-1.5 block text-xs font-medium tracking-wide uppercase">
                            Email <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@evocave.com"
                            disabled={isEdit}
                            className={cn(
                                "bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none",
                                isEdit && "cursor-not-allowed opacity-50",
                            )}
                        />
                        {isEdit && (
                            <p className="text-muted-foreground mt-1 text-xs">
                                Email cannot be changed
                            </p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="text-muted-foreground mb-2 block text-xs font-medium tracking-wide uppercase">
                            Role
                        </label>
                        <div className="space-y-2">
                            {(
                                Object.entries(roleConfig) as [Role, (typeof roleConfig)[Role]][]
                            ).map(([val, cfg]) => {
                                // superadmin hanya bisa dipilih oleh superadmin, dan tidak bisa diubah sendiri
                                const disabled =
                                    val === "superadmin" && (isSelf || CURRENT_ADMIN_ID !== "m1");
                                return (
                                    <label
                                        key={val}
                                        className={cn(
                                            "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                                            role === val
                                                ? "border-blue-500/30 bg-blue-500/5"
                                                : "border-border hover:bg-secondary/20",
                                            disabled && "cursor-not-allowed opacity-40",
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={val}
                                            checked={role === val}
                                            disabled={disabled}
                                            onChange={() => !disabled && setRole(val)}
                                            className="mt-0.5 accent-blue-500"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={cn(
                                                        "rounded-full border px-2 py-0.5 text-xs font-medium",
                                                        cfg.color,
                                                    )}
                                                >
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground mt-0.5 text-xs">
                                                {cfg.description}
                                            </p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
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
                        {saving ? "Saving..." : isEdit ? "Save changes" : "Send Invite"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Confirm ───────────────────────────────────────
function DeleteModal({
    member,
    onConfirm,
    onClose,
}: {
    member: TeamMember;
    onConfirm: () => void;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-popover border-border w-full max-w-sm overflow-hidden rounded-2xl border shadow-xl">
                <div className="px-5 py-5">
                    <h2 className="text-foreground text-base font-semibold">Remove member?</h2>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                        <span className="text-foreground">{member.name}</span> will lose access to
                        the admin panel. Their {member.activeTickets} active tickets will become
                        unassigned.
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
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────
export default function AdminTeamPage() {
    const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);

    function handleSave(
        data: Omit<TeamMember, "id" | "joinedAt" | "ticketsHandled" | "activeTickets" | "initials">,
    ) {
        if (editTarget) {
            setMembers((prev) =>
                prev.map((m) =>
                    m.id === editTarget.id
                        ? { ...m, ...data, initials: getInitials(data.name) }
                        : m,
                ),
            );
        } else {
            setMembers((prev) => [
                ...prev,
                {
                    ...data,
                    id: `m${Date.now()}`,
                    initials: getInitials(data.name),
                    joinedAt: new Date().toISOString(),
                    ticketsHandled: 0,
                    activeTickets: 0,
                },
            ]);
        }
        setModalOpen(false);
        setEditTarget(null);
    }

    function handleDelete() {
        if (!deleteTarget) return;
        setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
        setDeleteTarget(null);
    }

    function openEdit(member: TeamMember) {
        setEditTarget(member);
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
                    <h1 className="text-foreground text-2xl font-semibold">Team</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">{members.length} members</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                    <Plus className="h-4 w-4" />
                    Invite Member
                </button>
            </div>

            {/* Role summary */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {(Object.entries(roleConfig) as [Role, (typeof roleConfig)[Role]][]).map(
                    ([role, cfg]) => {
                        const count = members.filter((m) => m.role === role).length;
                        return (
                            <div
                                key={role}
                                className="bg-card/40 border-border rounded-xl border p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className={cn(
                                            "rounded-full border px-2 py-0.5 text-xs font-medium",
                                            cfg.color,
                                        )}
                                    >
                                        {cfg.label}
                                    </span>
                                    <span className="text-foreground text-xl font-semibold tabular-nums">
                                        {count}
                                    </span>
                                </div>
                                <p className="text-muted-foreground mt-2 text-xs">
                                    {cfg.description}
                                </p>
                            </div>
                        );
                    },
                )}
            </div>

            {/* Members list */}
            {members.length === 0 ? (
                <div className="bg-card/40 border-border flex flex-col items-center gap-3 rounded-xl border py-16">
                    <div className="bg-secondary/40 flex h-12 w-12 items-center justify-center rounded-xl">
                        <Users className="text-muted-foreground h-6 w-6" />
                    </div>
                    <p className="text-muted-foreground text-sm">No team members yet</p>
                    <button
                        onClick={openNew}
                        className="text-sm text-blue-400 transition-colors hover:text-blue-300"
                    >
                        Invite your first member →
                    </button>
                </div>
            ) : (
                <div className="bg-card/40 border-border divide-border/60 divide-y overflow-hidden rounded-xl border">
                    {members.map((member) => {
                        const rc = roleConfig[member.role];
                        const isSelf = member.id === CURRENT_ADMIN_ID;
                        return (
                            <div
                                key={member.id}
                                className="group flex items-center gap-4 px-5 py-4"
                            >
                                {/* Avatar */}
                                <div className="bg-secondary/60 text-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                                    {member.initials}
                                </div>

                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-foreground text-sm font-medium">
                                            {member.name}
                                        </p>
                                        {isSelf && (
                                            <span className="bg-secondary/40 text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                                                You
                                            </span>
                                        )}
                                        <span
                                            className={cn(
                                                "rounded-full border px-2 py-0.5 text-xs font-medium",
                                                rc.color,
                                            )}
                                        >
                                            {rc.label}
                                        </span>
                                    </div>
                                    <div className="mt-0.5 flex items-center gap-3">
                                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                                            <Mail className="h-3 w-3" />
                                            {member.email}
                                        </span>
                                        <span className="text-muted-foreground text-xs">·</span>
                                        <span className="text-muted-foreground text-xs">
                                            Joined {formatDate(member.joinedAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="hidden shrink-0 gap-6 lg:flex">
                                    <div className="text-center">
                                        <p className="text-foreground text-sm font-medium tabular-nums">
                                            {member.ticketsHandled}
                                        </p>
                                        <p className="text-muted-foreground text-xs">Handled</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-foreground text-sm font-medium tabular-nums">
                                            {member.activeTickets}
                                        </p>
                                        <p className="text-muted-foreground text-xs">Active</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                        onClick={() => openEdit(member)}
                                        className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    {!isSelf && (
                                        <button
                                            onClick={() => setDeleteTarget(member)}
                                            className="text-muted-foreground hover:text-destructive rounded-lg p-1.5 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            {modalOpen && (
                <MemberModal
                    initial={editTarget ?? undefined}
                    isSelf={editTarget?.id === CURRENT_ADMIN_ID}
                    onSave={handleSave}
                    onClose={() => {
                        setModalOpen(false);
                        setEditTarget(null);
                    }}
                />
            )}
            {deleteTarget && (
                <DeleteModal
                    member={deleteTarget}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
}
