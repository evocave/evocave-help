"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, TicketCheck, Megaphone, MessageSquare, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiNotification3Fill } from "@remixicon/react";

// ─── Types ───────────────────────────────────────────────
type NotifType = "ticket_reply" | "status_change" | "announcement";

interface Notification {
    id: string;
    type: NotifType;
    title: string;
    body: string;
    href: string;
    read: boolean;
    createdAt: string;
}

// ─── Configs ─────────────────────────────────────────────
const notifConfig: Record<NotifType, { icon: React.ElementType; color: string }> = {
    ticket_reply: { icon: MessageSquare, color: "bg-blue-500/10 text-blue-400" },
    status_change: { icon: TicketCheck, color: "bg-emerald-500/10 text-emerald-400" },
    announcement: { icon: Megaphone, color: "bg-purple-500/10 text-purple-400" },
};

// ─── Mock Data ───────────────────────────────────────────
const MOCK_NOTIFS: Notification[] = [
    {
        id: "n1",
        type: "ticket_reply",
        read: false,
        createdAt: "2026-04-09T10:30:00Z",
        href: "/dashboard/tickets/1",
        title: "New reply on EVO-2026-015",
        body: "Evocave Support replied to your ticket about installation error.",
    },
    {
        id: "n2",
        type: "status_change",
        read: false,
        createdAt: "2026-04-09T09:00:00Z",
        href: "/dashboard/tickets/2",
        title: "Ticket EVO-2026-014 resolved",
        body: "Your ticket has been marked as resolved.",
    },
    {
        id: "n3",
        type: "announcement",
        read: false,
        createdAt: "2026-04-08T14:00:00Z",
        href: "/dashboard/announcements",
        title: "Solarion v2.1 Released",
        body: "New version with 5 new sections and performance improvements.",
    },
    {
        id: "n4",
        type: "ticket_reply",
        read: true,
        createdAt: "2026-04-07T11:00:00Z",
        href: "/dashboard/tickets/3",
        title: "New reply on EVO-2026-013",
        body: "Evocave Support asked for more details about your issue.",
    },
    {
        id: "n5",
        type: "status_change",
        read: true,
        createdAt: "2026-04-07T08:00:00Z",
        href: "/dashboard/tickets/4",
        title: "Ticket EVO-2026-012 updated",
        body: "Your ticket status changed to In Progress.",
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

// ─── Notification Dropdown ────────────────────────────────
export function NotificationDropdown({ isAdmin = false }: { isAdmin?: boolean }) {
    const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFS);
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const unreadCount = notifs.filter((n) => !n.read).length;

    // Close on outside click
    useEffect(() => {
        setMounted(true);
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Close on Escape
    useEffect(() => {
        function handler(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    function markRead(id: string) {
        setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }

    function markAllRead() {
        setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    }

    function dismiss(id: string, e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setNotifs((prev) => prev.filter((n) => n.id !== id));
    }

    // Adjust href based on admin/user context
    function resolveHref(href: string) {
        if (isAdmin) return href.replace("/dashboard/", "/admin/");
        return href;
    }

    return (
        <div ref={ref} className="relative">
            {/* Bell button */}
            <button
                onClick={() => setOpen(!open)}
                className="hover:bg-secondary/40 relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                aria-label="Notifications"
            >
                <RiNotification3Fill className="h-5 w-5" />
                {mounted && unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-center text-[10px] font-medium text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Mobile backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
                        onClick={() => setOpen(false)}
                    />

                    <div
                        className={cn(
                            "bg-popover border-border fixed z-50 overflow-hidden rounded-2xl border shadow-2xl",
                            // Mobile — full width bottom sheet style
                            "right-0 bottom-0 left-0 max-h-[85svh] rounded-b-none sm:rounded-b-2xl",
                            // Desktop — dropdown anchored to bell
                            "sm:absolute sm:top-full sm:right-0 sm:bottom-auto sm:left-auto sm:mt-2 sm:max-h-120 sm:w-95",
                        )}
                    >
                        {/* Handle — mobile only */}
                        <div className="flex justify-center pt-3 pb-1 sm:hidden">
                            <div className="bg-border h-1 w-10 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="border-border flex items-center justify-between border-b px-4 py-3">
                            <div className="flex items-center gap-2">
                                <h2 className="text-foreground text-sm font-semibold">
                                    Notifications
                                </h2>
                                {unreadCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                                >
                                    <Check className="h-3 w-3" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "calc(85svh - 120px)" }}
                        >
                            {notifs.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-12">
                                    <Bell className="text-muted-foreground/40 h-8 w-8" />
                                    <p className="text-muted-foreground text-sm">
                                        No notifications
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-border/60 divide-y">
                                    {notifs.map((notif) => {
                                        const cfg = notifConfig[notif.type];
                                        const Icon = cfg.icon;
                                        return (
                                            <Link
                                                key={notif.id}
                                                href={resolveHref(notif.href)}
                                                onClick={() => {
                                                    markRead(notif.id);
                                                    setOpen(false);
                                                }}
                                                className={cn(
                                                    "group hover:bg-secondary/20 flex items-start gap-3 px-4 py-3.5 transition-colors",
                                                    !notif.read && "bg-blue-500/3",
                                                )}
                                            >
                                                {/* Icon */}
                                                <div
                                                    className={cn(
                                                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                                        cfg.color,
                                                    )}
                                                >
                                                    <Icon className="h-3.5 w-3.5" />
                                                </div>

                                                {/* Content */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p
                                                            className={cn(
                                                                "text-sm leading-snug",
                                                                notif.read
                                                                    ? "text-muted-foreground"
                                                                    : "text-foreground font-medium",
                                                            )}
                                                        >
                                                            {notif.title}
                                                        </p>
                                                        {/* Unread dot */}
                                                        {!notif.read && (
                                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                                                        {notif.body}
                                                    </p>
                                                    <p className="text-muted-foreground/60 mt-1 text-xs">
                                                        {timeAgo(notif.createdAt)}
                                                    </p>
                                                </div>

                                                {/* Dismiss */}
                                                <button
                                                    onClick={(e) => dismiss(notif.id, e)}
                                                    className="text-muted-foreground/40 hover:text-muted-foreground mt-0.5 shrink-0 opacity-0 transition-all group-hover:opacity-100"
                                                    aria-label="Dismiss"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifs.length > 0 && (
                            <div className="border-border border-t px-4 py-3">
                                <Link
                                    href={isAdmin ? "/admin/tickets" : "/dashboard/tickets"}
                                    onClick={() => setOpen(false)}
                                    className="text-muted-foreground hover:text-foreground block text-center text-xs transition-colors"
                                >
                                    View all tickets →
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
