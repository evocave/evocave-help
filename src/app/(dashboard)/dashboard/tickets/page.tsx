"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";

type TicketStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "AWAITING_CUSTOMER"
    | "AWAITING_AGENT"
    | "RESOLVED"
    | "CLOSED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface Ticket {
    id: string;
    referenceNumber: string;
    subject: string;
    status: TicketStatus;
    priority: Priority;
    productName: string;
    createdAt: string;
    updatedAt: string;
    replyCount: number;
}

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

const priorityConfig: Record<Priority, { label: string; dot: string }> = {
    LOW: { label: "Low", dot: "bg-zinc-500" },
    MEDIUM: { label: "Medium", dot: "bg-blue-500" },
    HIGH: { label: "High", dot: "bg-amber-500" },
    URGENT: { label: "Urgent", dot: "bg-red-500" },
};

const mockTickets: Ticket[] = [
    {
        id: "1",
        referenceNumber: "EVO-2026-015",
        subject: "Installation Error on Solarion Template Kit",
        status: "OPEN",
        priority: "URGENT",
        productName: "Solarion",
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
        productName: "Coworkly",
        createdAt: "2026-04-06T14:00:00Z",
        updatedAt: "2026-04-07T09:00:00Z",
        replyCount: 4,
    },
    {
        id: "3",
        referenceNumber: "EVO-2026-012",
        subject: "Mobile responsive issue on homepage section",
        status: "IN_PROGRESS",
        priority: "HIGH",
        productName: "Solarion",
        createdAt: "2026-04-05T10:00:00Z",
        updatedAt: "2026-04-06T16:00:00Z",
        replyCount: 3,
    },
    {
        id: "4",
        referenceNumber: "EVO-2026-010",
        subject: "License key activation not working",
        status: "RESOLVED",
        priority: "HIGH",
        productName: "Solarion",
        createdAt: "2026-04-03T09:00:00Z",
        updatedAt: "2026-04-04T11:00:00Z",
        replyCount: 5,
    },
    {
        id: "5",
        referenceNumber: "EVO-2026-007",
        subject: "Feature request: dark mode toggle component",
        status: "CLOSED",
        priority: "LOW",
        productName: "Coworkly",
        createdAt: "2026-03-28T15:00:00Z",
        updatedAt: "2026-04-01T10:00:00Z",
        replyCount: 2,
    },
    {
        id: "6",
        referenceNumber: "EVO-2026-006",
        subject: "Font not loading on Safari browser",
        status: "OPEN",
        priority: "MEDIUM",
        productName: "Solarion",
        createdAt: "2026-03-27T10:00:00Z",
        updatedAt: "2026-03-30T10:00:00Z",
        replyCount: 1,
    },
    {
        id: "7",
        referenceNumber: "EVO-2026-005",
        subject: "Elementor widget not showing on frontend",
        status: "OPEN",
        priority: "HIGH",
        productName: "Solarion",
        createdAt: "2026-03-25T10:00:00Z",
        updatedAt: "2026-03-28T10:00:00Z",
        replyCount: 0,
    },
    {
        id: "8",
        referenceNumber: "EVO-2026-004",
        subject: "Contact form not sending emails",
        status: "IN_PROGRESS",
        priority: "HIGH",
        productName: "Elecfix",
        createdAt: "2026-03-20T10:00:00Z",
        updatedAt: "2026-03-22T10:00:00Z",
        replyCount: 3,
    },
    {
        id: "9",
        referenceNumber: "EVO-2026-003",
        subject: "How to add custom CSS to template kit",
        status: "RESOLVED",
        priority: "LOW",
        productName: "Coworkly",
        createdAt: "2026-03-15T10:00:00Z",
        updatedAt: "2026-03-16T10:00:00Z",
        replyCount: 2,
    },
    {
        id: "10",
        referenceNumber: "EVO-2026-002",
        subject: "Images not loading after import",
        status: "CLOSED",
        priority: "MEDIUM",
        productName: "Solarion",
        createdAt: "2026-03-10T10:00:00Z",
        updatedAt: "2026-03-12T10:00:00Z",
        replyCount: 4,
    },
    {
        id: "11",
        referenceNumber: "EVO-2026-001",
        subject: "Template import failed on staging environment",
        status: "CLOSED",
        priority: "HIGH",
        productName: "Elecfix",
        createdAt: "2026-03-05T10:00:00Z",
        updatedAt: "2026-03-07T10:00:00Z",
        replyCount: 6,
    },
    {
        id: "12",
        referenceNumber: "EVO-2025-098",
        subject: "WooCommerce integration issue",
        status: "RESOLVED",
        priority: "HIGH",
        productName: "Solarion",
        createdAt: "2026-02-28T10:00:00Z",
        updatedAt: "2026-03-01T10:00:00Z",
        replyCount: 5,
    },
    {
        id: "13",
        referenceNumber: "EVO-2025-097",
        subject: "Mega menu not working on mobile",
        status: "CLOSED",
        priority: "MEDIUM",
        productName: "Coworkly",
        createdAt: "2026-02-20T10:00:00Z",
        updatedAt: "2026-02-22T10:00:00Z",
        replyCount: 3,
    },
    {
        id: "14",
        referenceNumber: "EVO-2025-096",
        subject: "RTL support request",
        status: "CLOSED",
        priority: "LOW",
        productName: "Solarion",
        createdAt: "2026-02-15T10:00:00Z",
        updatedAt: "2026-02-17T10:00:00Z",
        replyCount: 2,
    },
    {
        id: "15",
        referenceNumber: "EVO-2025-095",
        subject: "Header sticky not working on scroll",
        status: "RESOLVED",
        priority: "MEDIUM",
        productName: "Elecfix",
        createdAt: "2026-02-10T10:00:00Z",
        updatedAt: "2026-02-12T10:00:00Z",
        replyCount: 4,
    },
];

type FilterStatus = "ALL" | TicketStatus;

const filterTabs: { value: FilterStatus; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "AWAITING_CUSTOMER", label: "Awaiting You" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" },
];

const PER_PAGE = 10;

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
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
        <div className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground text-xs">
                Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-border text-muted-foreground hover:border-border/80 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-30"
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
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors ${
                                currentPage === page
                                    ? "bg-secondary text-foreground font-medium"
                                    : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground border"
                            }`}
                        >
                            {page}
                        </button>
                    ),
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-border text-muted-foreground hover:border-border/80 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────
export default function TicketsPage() {
    const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    function handleFilter(val: FilterStatus) {
        setActiveFilter(val);
        setCurrentPage(1);
    }

    function handleSearch(val: string) {
        setSearch(val);
        setCurrentPage(1);
    }

    const filtered = mockTickets.filter((t) => {
        const matchesStatus = activeFilter === "ALL" || t.status === activeFilter;
        const matchesSearch =
            !search ||
            t.subject.toLowerCase().includes(search.toLowerCase()) ||
            t.referenceNumber.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-foreground text-2xl font-semibold">My Tickets</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        {mockTickets.length} total tickets
                    </p>
                </div>
                <Link href="/tickets/new">
                    <Button className="h-10 cursor-pointer rounded-lg">
                        <Plus className="h-4 w-4" />
                        <span className="text-sm font-medium">New Ticket</span>
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search by subject or reference number..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-secondary/20 border-border text-foreground placeholder-muted-foreground/50 focus:border-ring/70 w-full rounded-lg border py-2.5 pr-4 pl-9 text-sm transition-colors focus:outline-none"
                />
            </div>

            {/* Filter Tabs */}
            <div className="scrollbar-none flex gap-1 overflow-x-auto pb-1">
                {filterTabs.map((tab) => {
                    const count =
                        tab.value === "ALL"
                            ? mockTickets.length
                            : mockTickets.filter((t) => t.status === tab.value).length;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => handleFilter(tab.value)}
                            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                                activeFilter === tab.value
                                    ? "text-foreground bg-secondary/40 font-medium"
                                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                            }`}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full text-center text-xs ${
                                        activeFilter === tab.value
                                            ? "bg-foreground/90 text-background"
                                            : "bg-secondary/80 text-muted-foreground"
                                    }`}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tickets List */}
            {paginated.length === 0 ? (
                <div className="border-border bg-card/40 flex flex-col items-center gap-3 rounded-xl border py-16">
                    <div className="bg-secondary/40 flex h-12 w-12 items-center justify-center rounded-xl">
                        <svg
                            className="text-muted-foreground h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                            />
                        </svg>
                    </div>
                    <p className="text-muted-foreground text-sm">No tickets found</p>
                </div>
            ) : (
                <div className="bg-card/40 border-border divide-border divide-y overflow-hidden rounded-xl border">
                    {paginated.map((ticket) => {
                        const status = statusConfig[ticket.status];
                        const priority = priorityConfig[ticket.priority];
                        return (
                            <Link
                                key={ticket.id}
                                href={"/tickets/" + ticket.id}
                                className="group hover:bg-card/80 flex items-start gap-4 px-5 py-4 transition-colors"
                            >
                                <div
                                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${priority.dot}`}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="text-muted-foreground font-mono text-xs">
                                            {ticket.referenceNumber}
                                        </span>
                                        <span
                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs ${status.color}`}
                                        >
                                            {status.label}
                                        </span>
                                    </div>
                                    <p className="text-foreground line-clamp-1 text-sm transition-colors group-hover:text-white">
                                        {ticket.subject}
                                    </p>
                                    <div className="mt-1.5 flex items-center gap-3">
                                        <span className="text-muted-foreground text-xs">
                                            {ticket.productName}
                                        </span>
                                        <span className="text-muted-foreground">·</span>
                                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                                            <svg
                                                className="h-3 w-3"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                />
                                            </svg>
                                            {ticket.replyCount}
                                        </span>
                                        <span className="text-muted-foreground">·</span>
                                        <span className="text-muted-foreground text-xs">
                                            {timeAgo(ticket.updatedAt)}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="text-muted-foreground group-hover:text-foreground mt-1 h-4 w-4 shrink-0" />
                            </Link>
                        );
                    })}
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
