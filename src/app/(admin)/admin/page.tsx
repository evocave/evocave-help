"use client";

import Link from "next/link";
import {
    ChevronRight,
    Clock,
    AlertCircle,
    CheckCircle2,
    TicketCheck,
    Users,
    TrendingUp,
    Timer,
    MoveRight,
    MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type TicketStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "AWAITING_CUSTOMER"
    | "AWAITING_AGENT"
    | "RESOLVED"
    | "CLOSED";

interface RecentTicket {
    id: string;
    referenceNumber: string;
    subject: string;
    status: TicketStatus;
    priority: Priority;
    customerName: string;
    customerInitials: string;
    productName: string;
    assignee?: string;
    updatedAt: string;
}

// ─── Configs ─────────────────────────────────────────────
const statusConfig: Record<TicketStatus, { label: string; color: string }> = {
    OPEN: { label: "Open", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
    IN_PROGRESS: {
        label: "In Progress",
        color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    AWAITING_CUSTOMER: {
        label: "Awaiting Customer",
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

const priorityConfig: Record<Priority, { dot: string }> = {
    LOW: { dot: "bg-zinc-500" },
    MEDIUM: { dot: "bg-blue-500" },
    HIGH: { dot: "bg-amber-500" },
    URGENT: { dot: "bg-red-500" },
};

// ─── Mock Data ───────────────────────────────────────────
const mockStats = {
    open: 8,
    inProgress: 3,
    awaitingAgent: 2,
    resolvedToday: 5,
    avgResponseHrs: 2.4,
    totalUsers: 142,
    openChange: "+2 from yesterday",
    resolvedChange: "+3 from yesterday",
};

const mockTickets: RecentTicket[] = [
    {
        id: "1",
        referenceNumber: "EVO-2026-015",
        subject: "Installation Error on Solarion Template Kit",
        status: "OPEN",
        priority: "URGENT",
        customerName: "John Doe",
        customerInitials: "JD",
        productName: "Solarion",
        updatedAt: "2026-04-07T10:30:00Z",
    },
    {
        id: "2",
        referenceNumber: "EVO-2026-014",
        subject: "How to customize the color scheme?",
        status: "AWAITING_CUSTOMER",
        priority: "MEDIUM",
        customerName: "Jane Smith",
        customerInitials: "JS",
        productName: "Coworkly",
        assignee: "Andrian",
        updatedAt: "2026-04-07T09:00:00Z",
    },
    {
        id: "3",
        referenceNumber: "EVO-2026-013",
        subject: "Mobile responsive issue on homepage",
        status: "IN_PROGRESS",
        priority: "HIGH",
        customerName: "Mike Johnson",
        customerInitials: "MJ",
        productName: "Solarion",
        assignee: "Andrian",
        updatedAt: "2026-04-07T08:15:00Z",
    },
    {
        id: "4",
        referenceNumber: "EVO-2026-012",
        subject: "License key not working after reinstall",
        status: "OPEN",
        priority: "HIGH",
        customerName: "Sarah Lee",
        customerInitials: "SL",
        productName: "Solarion",
        updatedAt: "2026-04-07T07:45:00Z",
    },
    {
        id: "5",
        referenceNumber: "EVO-2026-011",
        subject: "Figma components missing icons",
        status: "OPEN",
        priority: "MEDIUM",
        customerName: "Tom Brown",
        customerInitials: "TB",
        productName: "Coworkly",
        updatedAt: "2026-04-06T22:00:00Z",
    },
    {
        id: "6",
        referenceNumber: "EVO-2026-010",
        subject: "Font not loading on Safari",
        status: "OPEN",
        priority: "MEDIUM",
        customerName: "Anna White",
        customerInitials: "AW",
        productName: "Solarion",
        updatedAt: "2026-04-06T20:00:00Z",
    },
    {
        id: "7",
        referenceNumber: "EVO-2026-009",
        subject: "Elementor widget broken on mobile",
        status: "IN_PROGRESS",
        priority: "HIGH",
        customerName: "Chris Black",
        customerInitials: "CB",
        productName: "Elecfix",
        assignee: "Andrian",
        updatedAt: "2026-04-06T18:00:00Z",
    },
    {
        id: "8",
        referenceNumber: "EVO-2026-008",
        subject: "Template import failed on staging",
        status: "OPEN",
        priority: "HIGH",
        customerName: "Lisa Green",
        customerInitials: "LG",
        productName: "Solarion",
        updatedAt: "2026-04-06T16:00:00Z",
    },
];

// ─── Activity ─────────────────────────────────────────────
type ActivityType = "reply" | "resolved" | "assigned" | "opened";

interface Activity {
    id: string;
    type: ActivityType;
    text: string;
    createdAt: string;
}

const activityConfig: Record<ActivityType, { icon: React.ElementType; color: string }> = {
    reply: { icon: MessageSquare, color: "bg-blue-500/10 text-blue-400" },
    resolved: { icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-400" },
    assigned: { icon: Users, color: "bg-purple-500/10 text-purple-400" },
    opened: { icon: TicketCheck, color: "bg-amber-500/10 text-amber-400" },
};

const mockActivity: Activity[] = [
    {
        id: "ac1",
        type: "reply",
        text: "Andrian replied to EVO-2026-015",
        createdAt: "2026-04-07T10:28:00Z",
    },
    {
        id: "ac2",
        type: "resolved",
        text: "EVO-2026-010 marked as resolved",
        createdAt: "2026-04-07T09:45:00Z",
    },
    {
        id: "ac3",
        type: "assigned",
        text: "EVO-2026-013 assigned to Andrian",
        createdAt: "2026-04-07T08:10:00Z",
    },
];

// ─── Helpers ─────────────────────────────────────────────
function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

// ─── Stat Card ────────────────────────────────────────────
function StatCard({
    label,
    value,
    sub,
    icon: Icon,
    iconClass,
}: {
    label: string;
    value: number | string;
    sub?: string;
    icon: React.ElementType;
    iconClass: string;
}) {
    return (
        <div className="bg-card/40 border-border space-y-3 rounded-xl border p-4">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {label}
                </p>
                <div
                    className={cn("flex h-7 w-7 items-center justify-center rounded-lg", iconClass)}
                >
                    <Icon className="h-3.5 w-3.5" />
                </div>
            </div>
            <p className="text-foreground text-3xl font-semibold tabular-nums">{value}</p>
            {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
        </div>
    );
}

// ─── Ticket Row ───────────────────────────────────────────
function TicketRow({ ticket }: { ticket: RecentTicket }) {
    const status = statusConfig[ticket.status];
    const priority = priorityConfig[ticket.priority];
    return (
        <Link
            href={"/admin/tickets/" + ticket.id}
            className="group hover:bg-card/80 border-border flex items-center gap-4 border-b px-5 py-3.5 transition-colors last:border-0"
        >
            <div className="bg-secondary/40 text-muted-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                {ticket.customerInitials}
            </div>
            <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-muted-foreground font-mono text-xs">
                        {ticket.referenceNumber}
                    </span>
                    <span
                        className={cn("inline-flex rounded-full px-2 py-0.5 text-xs", status.color)}
                    >
                        {status.label}
                    </span>
                </div>
                <p className="text-foreground line-clamp-1 text-sm transition-colors group-hover:text-white">
                    {ticket.subject}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">{ticket.customerName}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground text-xs">{ticket.productName}</span>
                    {ticket.assignee && (
                        <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-xs text-emerald-500">@{ticket.assignee}</span>
                        </>
                    )}
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
                <span className={cn("h-1.5 w-1.5 rounded-full", priority.dot)} />
                <span className="text-muted-foreground w-14 text-right text-xs">
                    {timeAgo(ticket.updatedAt)}
                </span>
                <ChevronRight className="text-muted-foreground group-hover:text-foreground h-4 w-4" />
            </div>
        </Link>
    );
}

// ─── Constants ────────────────────────────────────────────
const RECENT_TICKETS_COUNT = 4; // sesuaikan sendiri
const UNASSIGNED_COUNT = 3; // sesuaikan sendiri
const ACTIVITY_COUNT = 3; // sesuaikan sendiri

// ─── Main Page ───────────────────────────────────────────
export default function AdminPage() {
    // Unassigned
    const unassigned = mockTickets.filter(
        (t) => !t.assignee && ["OPEN", "AWAITING_AGENT"].includes(t.status),
    );

    // Sort by updatedAt desc — tiket terbaru selalu di atas
    const sortedTickets = [...mockTickets].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-foreground text-2xl font-semibold">Dashboard</h1>
                <p className="text-muted-foreground mt-0.5 text-sm">
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    label="Open"
                    value={mockStats.open}
                    sub={mockStats.openChange}
                    icon={TicketCheck}
                    iconClass="bg-blue-500/10 text-blue-400"
                />
                <StatCard
                    label="In Progress"
                    value={mockStats.inProgress}
                    sub={`${mockStats.awaitingAgent} awaiting agent`}
                    icon={Clock}
                    iconClass="bg-amber-500/10 text-amber-400"
                />
                <StatCard
                    label="Resolved Today"
                    value={mockStats.resolvedToday}
                    sub={mockStats.resolvedChange}
                    icon={CheckCircle2}
                    iconClass="bg-emerald-500/10 text-emerald-400"
                />
                <StatCard
                    label="Avg. Response"
                    value={mockStats.avgResponseHrs + "h"}
                    sub="Last 7 days"
                    icon={Timer}
                    iconClass="bg-purple-500/10 text-purple-400"
                />
            </div>

            {/* Main content */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* Kiri: recent tickets */}
                <div className="col-span-2 min-w-0 flex-1">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-foreground text-sm font-semibold">Recent Tickets</h2>
                        <Link
                            href="/admin/tickets"
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                        >
                            View all <MoveRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    <div className="bg-card/40 border-border overflow-hidden rounded-xl border">
                        {sortedTickets.slice(0, RECENT_TICKETS_COUNT).map((ticket) => (
                            <TicketRow key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                </div>

                {/* Kanan: unassigned + recent activity — natural height */}
                <div className="w-full shrink-0 space-y-4 lg:w-72">
                    {/* Unassigned — max 5 item */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                                <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                                Unassigned
                                <span className="ml-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 text-[10px] text-rose-400">
                                    {unassigned.length}
                                </span>
                            </h2>
                            <Link
                                href="/admin/tickets?filter=unassigned"
                                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                            >
                                View all →
                            </Link>
                        </div>
                        <div className="bg-card/40 border-border divide-border/60 divide-y overflow-hidden rounded-xl border">
                            {unassigned.length > 0 ? (
                                unassigned.slice(0, UNASSIGNED_COUNT).map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        href={"/admin/tickets/" + ticket.id}
                                        className="group hover:bg-card/80 flex items-start gap-3 px-4 py-3 transition-colors"
                                    >
                                        <span
                                            className={cn(
                                                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                                                priorityConfig[ticket.priority].dot,
                                            )}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-foreground line-clamp-1 text-xs font-medium transition-colors group-hover:text-white">
                                                {ticket.subject}
                                            </p>
                                            <p className="text-muted-foreground mt-0.5 text-xs">
                                                {ticket.customerName} · {timeAgo(ticket.updatedAt)}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center">
                                    <p className="text-muted-foreground text-xs">
                                        All tickets assigned ✓
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity — fix 3 item terakhir */}
                    <div>
                        <h2 className="text-foreground mb-2 text-sm font-semibold">
                            Recent Activity
                        </h2>
                        <div className="bg-card/40 border-border divide-border/60 divide-y overflow-hidden rounded-xl border">
                            {mockActivity.slice(0, ACTIVITY_COUNT).map((activity) => {
                                const Icon = activityConfig[activity.type].icon;
                                const color = activityConfig[activity.type].color;
                                return (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 px-4 py-3"
                                    >
                                        <div
                                            className={cn(
                                                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                                                color,
                                            )}
                                        >
                                            <Icon className="h-3 w-3" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-foreground text-xs leading-snug">
                                                {activity.text}
                                            </p>
                                            <p className="text-muted-foreground mt-0.5 text-xs">
                                                {timeAgo(activity.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
