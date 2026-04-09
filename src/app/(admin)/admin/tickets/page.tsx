"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from "lucide-react";
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

interface Ticket {
    id: string;
    referenceNumber: string;
    subject: string;
    status: TicketStatus;
    priority: Priority;
    customerName: string;
    customerInitials: string;
    customerEmail: string;
    productName: string;
    assignedTo: string | null;
    labels: string[];
    createdAt: string;
    updatedAt: string;
    replyCount: number;
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

const priorityConfig: Record<Priority, { label: string; dot: string }> = {
    LOW: { label: "Low", dot: "bg-zinc-500" },
    MEDIUM: { label: "Medium", dot: "bg-blue-500" },
    HIGH: { label: "High", dot: "bg-amber-500" },
    URGENT: { label: "Urgent", dot: "bg-red-500" },
};

const labelColors: Record<string, string> = {
    Bug: "bg-red-500/10 text-red-400 border-red-500/20",
    Installation: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    License: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Feature Request": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    General: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

// ─── Mock Data ───────────────────────────────────────────
const mockTickets: Ticket[] = [
    {
        id: "1",
        referenceNumber: "EVO-2026-015",
        subject: "Installation Error on Solarion Template Kit",
        status: "OPEN",
        priority: "URGENT",
        customerName: "John Doe",
        customerInitials: "JD",
        customerEmail: "john@example.com",
        productName: "Solarion",
        assignedTo: null,
        labels: ["Bug", "Installation"],
        createdAt: "2026-04-07T08:00:00Z",
        updatedAt: "2026-04-07T10:30:00Z",
        replyCount: 2,
    },
    {
        id: "2",
        referenceNumber: "EVO-2026-014",
        subject: "How to customize the color scheme in Figma UI Kit?",
        status: "AWAITING_CUSTOMER",
        priority: "MEDIUM",
        customerName: "Jane Smith",
        customerInitials: "JS",
        customerEmail: "jane@example.com",
        productName: "Coworkly",
        assignedTo: "Andrian",
        labels: [],
        createdAt: "2026-04-06T14:00:00Z",
        updatedAt: "2026-04-07T09:00:00Z",
        replyCount: 4,
    },
    {
        id: "3",
        referenceNumber: "EVO-2026-013",
        subject: "Mobile responsive issue on homepage section",
        status: "IN_PROGRESS",
        priority: "HIGH",
        customerName: "Mike Johnson",
        customerInitials: "MJ",
        customerEmail: "mike@example.com",
        productName: "Solarion",
        assignedTo: "Andrian",
        labels: ["Bug"],
        createdAt: "2026-04-06T10:00:00Z",
        updatedAt: "2026-04-07T08:15:00Z",
        replyCount: 3,
    },
    {
        id: "4",
        referenceNumber: "EVO-2026-012",
        subject: "License key activation not working after reinstall",
        status: "OPEN",
        priority: "HIGH",
        customerName: "Sarah Lee",
        customerInitials: "SL",
        customerEmail: "sarah@example.com",
        productName: "Solarion",
        assignedTo: null,
        labels: ["License"],
        createdAt: "2026-04-05T09:00:00Z",
        updatedAt: "2026-04-06T11:00:00Z",
        replyCount: 1,
    },
    {
        id: "5",
        referenceNumber: "EVO-2026-011",
        subject: "Figma components missing some icons",
        status: "OPEN",
        priority: "MEDIUM",
        customerName: "Tom Brown",
        customerInitials: "TB",
        customerEmail: "tom@example.com",
        productName: "Coworkly",
        assignedTo: null,
        labels: ["Bug"],
        createdAt: "2026-04-05T15:00:00Z",
        updatedAt: "2026-04-06T08:00:00Z",
        replyCount: 0,
    },
    {
        id: "6",
        referenceNumber: "EVO-2026-010",
        subject: "Feature request: dark mode toggle",
        status: "RESOLVED",
        priority: "LOW",
        customerName: "Amy Wilson",
        customerInitials: "AW",
        customerEmail: "amy@example.com",
        productName: "Coworkly",
        assignedTo: "Andrian",
        labels: ["Feature Request"],
        createdAt: "2026-04-03T09:00:00Z",
        updatedAt: "2026-04-04T11:00:00Z",
        replyCount: 5,
    },
    {
        id: "7",
        referenceNumber: "EVO-2026-009",
        subject: "Elementor widget broken on mobile",
        status: "IN_PROGRESS",
        priority: "HIGH",
        customerName: "Chris Black",
        customerInitials: "CB",
        customerEmail: "chris@example.com",
        productName: "Elecfix",
        assignedTo: "Andrian",
        labels: ["Bug"],
        createdAt: "2026-04-04T10:00:00Z",
        updatedAt: "2026-04-06T18:00:00Z",
        replyCount: 3,
    },
    {
        id: "8",
        referenceNumber: "EVO-2026-008",
        subject: "Template import failed on staging environment",
        status: "OPEN",
        priority: "HIGH",
        customerName: "Lisa Green",
        customerInitials: "LG",
        customerEmail: "lisa@example.com",
        productName: "Solarion",
        assignedTo: null,
        labels: ["Installation"],
        createdAt: "2026-04-04T08:00:00Z",
        updatedAt: "2026-04-06T16:00:00Z",
        replyCount: 0,
    },
    {
        id: "9",
        referenceNumber: "EVO-2026-007",
        subject: "Font not loading on Safari browser",
        status: "OPEN",
        priority: "MEDIUM",
        customerName: "Anna White",
        customerInitials: "AW",
        customerEmail: "anna@example.com",
        productName: "Solarion",
        assignedTo: null,
        labels: ["Bug"],
        createdAt: "2026-04-03T14:00:00Z",
        updatedAt: "2026-04-05T10:00:00Z",
        replyCount: 1,
    },
    {
        id: "10",
        referenceNumber: "EVO-2026-006",
        subject: "How to add custom CSS to template",
        status: "RESOLVED",
        priority: "LOW",
        customerName: "Ben Davis",
        customerInitials: "BD",
        customerEmail: "ben@example.com",
        productName: "Coworkly",
        assignedTo: "Andrian",
        labels: ["General"],
        createdAt: "2026-04-02T09:00:00Z",
        updatedAt: "2026-04-03T11:00:00Z",
        replyCount: 6,
    },
    {
        id: "11",
        referenceNumber: "EVO-2026-005",
        subject: "WooCommerce integration not working",
        status: "CLOSED",
        priority: "HIGH",
        customerName: "Carol Kim",
        customerInitials: "CK",
        customerEmail: "carol@example.com",
        productName: "Solarion",
        assignedTo: "Andrian",
        labels: ["Bug"],
        createdAt: "2026-04-01T10:00:00Z",
        updatedAt: "2026-04-02T15:00:00Z",
        replyCount: 8,
    },
    {
        id: "12",
        referenceNumber: "EVO-2026-004",
        subject: "Mega menu not working on mobile",
        status: "CLOSED",
        priority: "MEDIUM",
        customerName: "Dan Evans",
        customerInitials: "DE",
        customerEmail: "dan@example.com",
        productName: "Coworkly",
        assignedTo: "Andrian",
        labels: ["Bug"],
        createdAt: "2026-03-31T09:00:00Z",
        updatedAt: "2026-04-01T10:00:00Z",
        replyCount: 4,
    },
];

const PER_PAGE = 10;

// ─── Helpers ─────────────────────────────────────────────
function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

// ─── Pagination ───────────────────────────────────────────
function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    if (totalPages <= 1) return null;

    function getPages(): (number | "...")[] {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
        if (currentPage >= totalPages - 2)
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    }

    return (
        <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
                Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-border text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                {getPages().map((page, i) =>
                    page === "..." ? (
                        <span
                            key={"e" + i}
                            className="text-muted-foreground flex h-8 w-8 items-center justify-center text-xs"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors",
                                currentPage === page
                                    ? "bg-secondary text-foreground font-medium"
                                    : "border-border text-muted-foreground hover:text-foreground border",
                            )}
                        >
                            {page}
                        </button>
                    ),
                )}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-border text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────
export default function AdminTicketsPage() {
    const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
    const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");
    const [assignFilter, setAssignFilter] = useState<"ALL" | "assigned" | "unassigned">("ALL");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    function resetPage() {
        setCurrentPage(1);
    }

    const filtered = mockTickets
        .filter((t) => statusFilter === "ALL" || t.status === statusFilter)
        .filter((t) => priorityFilter === "ALL" || t.priority === priorityFilter)
        .filter(
            (t) =>
                assignFilter === "ALL" ||
                (assignFilter === "assigned" ? !!t.assignedTo : !t.assignedTo),
        )
        .filter(
            (t) =>
                !search ||
                t.subject.toLowerCase().includes(search.toLowerCase()) ||
                t.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
                t.customerName.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    // Bulk select
    const allSelected = paginated.length > 0 && paginated.every((t) => selected.has(t.id));
    function toggleAll() {
        if (allSelected) {
            setSelected((prev) => {
                const s = new Set(prev);
                paginated.forEach((t) => s.delete(t.id));
                return s;
            });
        } else {
            setSelected((prev) => {
                const s = new Set(prev);
                paginated.forEach((t) => s.add(t.id));
                return s;
            });
        }
    }
    function toggleOne(id: string) {
        setSelected((prev) => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    }

    const statusTabs: { value: TicketStatus | "ALL"; label: string }[] = [
        { value: "ALL", label: "All" },
        { value: "OPEN", label: "Open" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "AWAITING_CUSTOMER", label: "Awaiting Customer" },
        { value: "AWAITING_AGENT", label: "Awaiting Agent" },
        { value: "RESOLVED", label: "Resolved" },
        { value: "CLOSED", label: "Closed" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-foreground text-2xl font-semibold">All Tickets</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        {mockTickets.length} total tickets
                    </p>
                </div>
            </div>

            {/* Search + filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by subject, reference, or customer..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            resetPage();
                        }}
                        className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border py-2.5 pr-4 pl-9 text-sm transition-colors focus:outline-none"
                    />
                </div>

                {/* Priority filter */}
                <select
                    value={priorityFilter}
                    onChange={(e) => {
                        setPriorityFilter(e.target.value as Priority | "ALL");
                        resetPage();
                    }}
                    className="bg-secondary/20 border-border text-foreground focus:border-ring/70 cursor-pointer appearance-none rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                >
                    <option value="ALL">All priorities</option>
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>

                {/* Assign filter */}
                <select
                    value={assignFilter}
                    onChange={(e) => {
                        setAssignFilter(e.target.value as "ALL" | "assigned" | "unassigned");
                        resetPage();
                    }}
                    className="bg-secondary/20 border-border text-foreground focus:border-ring/70 cursor-pointer appearance-none rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                >
                    <option value="ALL">All assignees</option>
                    <option value="assigned">Assigned</option>
                    <option value="unassigned">Unassigned</option>
                </select>
            </div>

            {/* Status tabs */}
            <div className="scrollbar-none flex gap-1 overflow-x-auto pb-1">
                {statusTabs.map((tab) => {
                    const count =
                        tab.value === "ALL"
                            ? mockTickets.length
                            : mockTickets.filter((t) => t.status === tab.value).length;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setStatusFilter(tab.value);
                                resetPage();
                            }}
                            className={cn(
                                "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm whitespace-nowrap transition-colors",
                                statusFilter === tab.value
                                    ? "text-foreground bg-secondary/40 font-medium"
                                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                            )}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span
                                    className={cn(
                                        "flex h-5 w-5 items-center justify-center rounded-full text-center text-xs",
                                        statusFilter === tab.value
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

            {/* Bulk actions bar */}
            {selected.size > 0 && (
                <div className="bg-secondary/40 border-border flex items-center gap-3 rounded-lg border px-4 py-2.5">
                    <span className="text-foreground text-sm font-medium">
                        {selected.size} selected
                    </span>
                    <div className="bg-border h-4 w-px" />
                    <button className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                        Assign to me
                    </button>
                    <button className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                        Mark resolved
                    </button>
                    <button className="text-muted-foreground hover:text-destructive text-sm transition-colors">
                        Close
                    </button>
                    <button
                        onClick={() => setSelected(new Set())}
                        className="text-muted-foreground hover:text-foreground ml-auto text-sm transition-colors"
                    >
                        Clear
                    </button>
                </div>
            )}

            {/* Table */}
            {paginated.length === 0 ? (
                <div className="bg-card/40 border-border flex flex-col items-center gap-3 rounded-xl border py-16">
                    <div className="bg-secondary/40 flex h-12 w-12 items-center justify-center rounded-xl">
                        <SlidersHorizontal className="text-muted-foreground h-6 w-6" />
                    </div>
                    <p className="text-muted-foreground text-sm">No tickets found</p>
                    <button
                        onClick={() => {
                            setSearch("");
                            setStatusFilter("ALL");
                            setPriorityFilter("ALL");
                            setAssignFilter("ALL");
                        }}
                        className="text-sm text-blue-400 transition-colors hover:text-blue-300"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="bg-card/40 border-border overflow-hidden rounded-xl border">
                    {/* Table header */}
                    <div className="border-border bg-secondary/20 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b px-5 py-3 lg:grid-cols-[auto_1fr_160px_120px_80px]">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleAll}
                            className="accent-primary h-4 w-4 cursor-pointer rounded"
                        />
                        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Ticket
                        </span>
                        <span className="text-muted-foreground hidden text-xs font-medium tracking-wide uppercase lg:block">
                            Assignee
                        </span>
                        <span className="text-muted-foreground hidden text-xs font-medium tracking-wide uppercase lg:block">
                            Priority
                        </span>
                        <span className="text-muted-foreground hidden text-right text-xs font-medium tracking-wide uppercase lg:block">
                            Updated
                        </span>
                    </div>

                    {/* Rows */}
                    <div className="divide-border/60 divide-y">
                        {paginated.map((ticket) => {
                            const status = statusConfig[ticket.status];
                            const priority = priorityConfig[ticket.priority];
                            const isSelected = selected.has(ticket.id);

                            return (
                                <div
                                    key={ticket.id}
                                    className={cn(
                                        "group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors lg:grid-cols-[auto_1fr_160px_120px_80px]",
                                        isSelected ? "bg-secondary/30" : "hover:bg-card/80",
                                    )}
                                >
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleOne(ticket.id)}
                                        className="accent-primary h-4 w-4 cursor-pointer rounded"
                                    />

                                    {/* Main info */}
                                    <Link href={"/admin/tickets/" + ticket.id} className="min-w-0">
                                        <div className="mb-0.5 flex flex-wrap items-center gap-2">
                                            <span className="text-muted-foreground font-mono text-xs">
                                                {ticket.referenceNumber}
                                            </span>
                                            <span
                                                className={cn(
                                                    "inline-flex rounded-full px-2 py-0.5 text-xs",
                                                    status.color,
                                                )}
                                            >
                                                {status.label}
                                            </span>
                                            {ticket.labels.map((label) => (
                                                <span
                                                    key={label}
                                                    className={cn(
                                                        "hidden rounded-full border px-2 py-0.5 text-xs sm:inline-flex",
                                                        labelColors[label] ??
                                                            "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
                                                    )}
                                                >
                                                    {label}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-foreground line-clamp-1 text-sm transition-colors group-hover:text-white">
                                            {ticket.subject}
                                        </p>
                                        <div className="mt-0.5 flex items-center gap-2">
                                            <div className="bg-secondary/60 text-muted-foreground flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-medium">
                                                {ticket.customerInitials}
                                            </div>
                                            <span className="text-muted-foreground text-xs">
                                                {ticket.customerName}
                                            </span>
                                            <span className="text-muted-foreground">·</span>
                                            <span className="text-muted-foreground text-xs">
                                                {ticket.productName}
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Assignee */}
                                    <div className="hidden lg:block">
                                        {ticket.assignedTo ? (
                                            <span className="text-foreground text-sm">
                                                @{ticket.assignedTo}
                                            </span>
                                        ) : (
                                            <button className="text-muted-foreground hover:text-foreground border-border hover:border-border/80 rounded-lg border px-2.5 py-1 text-xs transition-colors">
                                                Assign
                                            </button>
                                        )}
                                    </div>

                                    {/* Priority */}
                                    <div className="hidden items-center gap-2 lg:flex">
                                        <span
                                            className={cn("h-1.5 w-1.5 rounded-full", priority.dot)}
                                        />
                                        <span className="text-muted-foreground text-sm">
                                            {priority.label}
                                        </span>
                                    </div>

                                    {/* Updated */}
                                    <div className="hidden text-right lg:block">
                                        <span className="text-muted-foreground text-xs">
                                            {timeAgo(ticket.updatedAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
