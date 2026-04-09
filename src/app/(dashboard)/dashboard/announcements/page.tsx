"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────
type AnnouncementType = "update" | "maintenance" | "news" | "security";

interface Announcement {
    id: string;
    type: AnnouncementType;
    title: string;
    excerpt: string;
    content: string;
    productTag?: string;
    isNew: boolean;
    publishedAt: string;
}

// ─── Mock Data ───────────────────────────────────────────
const mockAnnouncements: Announcement[] = [
    {
        id: "a1",
        type: "update",
        title: "Solarion v2.1.0 — Major update released",
        excerpt:
            "We have released a major update for Solarion with new sections, improved mobile responsiveness, and bug fixes. All license holders can download the latest version from Envato.",
        content: "",
        productTag: "Solarion",
        isNew: true,
        publishedAt: "2026-04-03T08:00:00Z",
    },
    {
        id: "a2",
        type: "maintenance",
        title: "Scheduled maintenance — April 10, 2026",
        excerpt:
            "Our support system will be undergoing scheduled maintenance on April 10 from 02:00 to 04:00 GMT+7. During this time, ticket submissions may be temporarily unavailable.",
        content: "",
        isNew: true,
        publishedAt: "2026-04-02T10:00:00Z",
    },
    {
        id: "a3",
        type: "news",
        title: "Figma UI Kit Vol.2 — Coming soon",
        excerpt:
            "We are working on the next volume of our Figma UI Kit with over 500 new components. Stay tuned for the release announcement.",
        content: "",
        isNew: false,
        publishedAt: "2026-03-28T09:00:00Z",
    },
    {
        id: "a4",
        type: "update",
        title: "Coworkly v1.4.2 — Patch update",
        excerpt:
            "Minor patch fixing an issue with the contact form widget and updating compatibility with the latest version of Elementor.",
        content: "",
        productTag: "Coworkly",
        isNew: false,
        publishedAt: "2026-03-10T08:00:00Z",
    },
    {
        id: "a5",
        type: "security",
        title: "Important: Update your Elementor plugin",
        excerpt:
            "A security vulnerability has been discovered in Elementor versions below 3.20.0. We strongly recommend updating your Elementor plugin immediately.",
        content: "",
        isNew: false,
        publishedAt: "2026-02-20T08:00:00Z",
    },
];

// ─── Configs ─────────────────────────────────────────────
// Tetap pakai warna semantic karena ini status badge — tidak ada CSS variable yang cocok
const typeConfig: Record<AnnouncementType, { label: string; color: string }> = {
    update: {
        label: "Update",
        color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    },
    maintenance: {
        label: "Maintenance",
        color: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    },
    news: { label: "News", color: "bg-blue-500/15 text-blue-400 border border-blue-500/20" },
    security: { label: "Security", color: "bg-red-500/15 text-red-400 border border-red-500/20" },
};

const INITIAL_COUNT = 3;
const LOAD_MORE_COUNT = 3;

// ─── Helpers ─────────────────────────────────────────────
function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

// ─── Announcement Card ────────────────────────────────────
function AnnouncementCard({
    announcement,
    onRead,
}: {
    announcement: Announcement;
    onRead: (id: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const type = typeConfig[announcement.type];

    function handleClick() {
        setExpanded(!expanded);
        if (announcement.isNew) onRead(announcement.id);
    }

    return (
        <div
            onClick={handleClick}
            className={`bg-card/40 hover:bg-card/80 cursor-pointer rounded-xl border p-5 transition-colors ${
                announcement.isNew ? "border-border/80" : "border-border"
            }`}
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Type badge */}
                    <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${type.color}`}
                    >
                        {type.label}
                    </span>

                    {/* Product tag */}
                    {announcement.productTag && (
                        <span className="border-border bg-secondary/40 text-muted-foreground inline-flex rounded-full border px-2.5 py-0.5 text-xs">
                            {announcement.productTag}
                        </span>
                    )}

                    {/* New badge */}
                    {announcement.isNew && (
                        <span className="flex items-center gap-1 text-xs text-rose-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            New
                        </span>
                    )}
                </div>

                {/* Date */}
                <span className="text-muted-foreground shrink-0 text-xs">
                    {formatDate(announcement.publishedAt)}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-foreground mt-3 text-base leading-snug font-semibold">
                {announcement.title}
            </h3>

            {/* Excerpt */}
            <p
                className={`text-muted-foreground mt-1.5 text-sm leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
            >
                {announcement.excerpt}
            </p>

            {/* Read more toggle */}
            {announcement.excerpt.length > 120 && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                    className="text-muted-foreground hover:text-foreground mt-2 text-xs transition-colors"
                >
                    {expanded ? "Show less ↑" : "Read more ↓"}
                </button>
            )}
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────
export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
    const [filter, setFilter] = useState<AnnouncementType | "all">("all");
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    const newCount = announcements.filter((a) => a.isNew).length;

    function handleRead(id: string) {
        setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, isNew: false } : a)));
    }

    function markAllRead() {
        setAnnouncements((prev) => prev.map((a) => ({ ...a, isNew: false })));
    }

    function handleFilter(val: AnnouncementType | "all") {
        setFilter(val);
        setVisibleCount(INITIAL_COUNT);
    }

    const filtered =
        filter === "all" ? announcements : announcements.filter((a) => a.type === filter);

    const filters: { value: AnnouncementType | "all"; label: string }[] = [
        { value: "all", label: "All" },
        { value: "update", label: "Updates" },
        { value: "maintenance", label: "Maintenance" },
        { value: "news", label: "News" },
        { value: "security", label: "Security" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-foreground text-2xl font-semibold">Announcements</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        {newCount > 0
                            ? `${newCount} new announcement${newCount > 1 ? "s" : ""}`
                            : "You're all caught up"}
                    </p>
                </div>
                {newCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-muted-foreground hover:text-foreground shrink-0 text-sm transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Filter tabs — sama persis dengan tickets page */}
            <div className="scrollbar-none flex gap-1 overflow-x-auto pb-1">
                {filters.map((f) => {
                    const count =
                        f.value === "all"
                            ? announcements.length
                            : announcements.filter((a) => a.type === f.value).length;
                    return (
                        <button
                            key={f.value}
                            onClick={() => handleFilter(f.value)}
                            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                                filter === f.value
                                    ? "text-foreground bg-secondary/40 font-medium"
                                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                            }`}
                        >
                            {f.label}
                            {count > 0 && (
                                <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full text-center text-xs ${
                                        filter === f.value
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

            {/* List */}
            <div className="space-y-3">
                {filtered.length > 0 ? (
                    <>
                        {filtered.slice(0, visibleCount).map((announcement) => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                                onRead={handleRead}
                            />
                        ))}

                        {/* Load more */}
                        {visibleCount < filtered.length && (
                            <button
                                onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
                                className="border-border text-muted-foreground hover:border-border/80 hover:text-foreground w-full rounded-xl border py-3 text-sm transition-colors"
                            >
                                Load more
                                <span className="text-muted-foreground/50 ml-1.5">
                                    ({filtered.length - visibleCount} remaining)
                                </span>
                            </button>
                        )}
                    </>
                ) : (
                    <div className="border-border flex flex-col items-center gap-2 rounded-xl border border-dashed py-16">
                        <p className="text-muted-foreground text-sm">
                            No announcements in this category
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
