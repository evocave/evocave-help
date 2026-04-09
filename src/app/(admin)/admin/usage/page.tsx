"use client";

import { useState } from "react";
import {
    RefreshCw,
    HardDrive,
    FileText,
    ImageIcon,
    Film,
    FileArchive,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
interface StorageCategory {
    label: string;
    bytes: number;
    icon: React.ElementType;
    color: string;
    barColor: string;
}

interface RecentFile {
    id: string;
    name: string;
    type: string;
    size: number;
    ticketRef: string;
    uploadedAt: string;
}

// ─── Mock Data ───────────────────────────────────────────
const STORAGE_LIMIT_GB = 10;
const STORAGE_LIMIT_BYTES = STORAGE_LIMIT_GB * 1024 * 1024 * 1024;

const mockCategories: StorageCategory[] = [
    {
        label: "Images",
        bytes: 1.24 * 1024 * 1024 * 1024,
        icon: ImageIcon,
        color: "text-blue-400",
        barColor: "bg-blue-500",
    },
    {
        label: "Videos",
        bytes: 0.86 * 1024 * 1024 * 1024,
        icon: Film,
        color: "text-purple-400",
        barColor: "bg-purple-500",
    },
    {
        label: "Archives",
        bytes: 0.43 * 1024 * 1024 * 1024,
        icon: FileArchive,
        color: "text-amber-400",
        barColor: "bg-amber-500",
    },
    {
        label: "Documents",
        bytes: 0.18 * 1024 * 1024 * 1024,
        icon: FileText,
        color: "text-emerald-400",
        barColor: "bg-emerald-500",
    },
];

const totalUsed = mockCategories.reduce((sum, c) => sum + c.bytes, 0);
const usagePercent = (totalUsed / STORAGE_LIMIT_BYTES) * 100;

const mockRecentFiles: RecentFile[] = [
    {
        id: "f1",
        name: "error-screenshot.png",
        type: "image/png",
        size: 245000,
        ticketRef: "EVO-2026-015",
        uploadedAt: "2026-04-07T10:30:00Z",
    },
    {
        id: "f2",
        name: "elementor-debug-log.zip",
        type: "application/zip",
        size: 1240000,
        ticketRef: "EVO-2026-013",
        uploadedAt: "2026-04-07T08:15:00Z",
    },
    {
        id: "f3",
        name: "screen-recording.mp4",
        type: "video/mp4",
        size: 18500000,
        ticketRef: "EVO-2026-012",
        uploadedAt: "2026-04-06T11:00:00Z",
    },
    {
        id: "f4",
        name: "template-backup.json",
        type: "application/pdf",
        size: 340000,
        ticketRef: "EVO-2026-011",
        uploadedAt: "2026-04-06T08:00:00Z",
    },
    {
        id: "f5",
        name: "homepage-issue.png",
        type: "image/png",
        size: 890000,
        ticketRef: "EVO-2026-010",
        uploadedAt: "2026-04-05T14:00:00Z",
    },
];

// Auto-delete policy
const AUTO_DELETE_DAYS = 365;

// ─── Helpers ─────────────────────────────────────────────
function formatBytes(bytes: number, decimals = 1) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

function getFileIcon(type: string) {
    if (type.startsWith("image/")) return ImageIcon;
    if (type.startsWith("video/")) return Film;
    if (type.includes("zip")) return FileArchive;
    return FileText;
}

function getFileColor(type: string) {
    if (type.startsWith("image/")) return "text-blue-400 bg-blue-500/10";
    if (type.startsWith("video/")) return "text-purple-400 bg-purple-500/10";
    if (type.includes("zip")) return "text-amber-400 bg-amber-500/10";
    return "text-emerald-400 bg-emerald-500/10";
}

// ─── Main Page ───────────────────────────────────────────
export default function AdminUsagePage() {
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(new Date());

    async function handleRefresh() {
        if (refreshing) return;
        setRefreshing(true);
        await new Promise((r) => setTimeout(r, 1200));
        setLastRefreshed(new Date());
        setRefreshing(false);
    }

    const isNearLimit = usagePercent >= 80;
    const barColor =
        usagePercent >= 90 ? "bg-red-500" : usagePercent >= 80 ? "bg-amber-500" : "bg-blue-500";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-foreground text-2xl font-semibold">Storage Usage</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        Cloudflare R2 · refreshed{" "}
                        {lastRefreshed.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="border-border text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* Near limit warning */}
            {isNearLimit && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <div>
                        <p className="text-sm font-medium text-amber-400">Storage usage is high</p>
                        <p className="mt-0.5 text-xs text-amber-400/70">
                            You've used {usagePercent.toFixed(0)}% of your storage. Attachments from
                            closed tickets older than {AUTO_DELETE_DAYS} days are automatically
                            deleted.
                        </p>
                    </div>
                </div>
            )}

            {/* Main usage card */}
            <div className="bg-card/40 border-border rounded-xl border p-6">
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-foreground text-3xl font-semibold tabular-nums">
                                {formatBytes(totalUsed)}
                            </span>
                            <span className="text-muted-foreground text-sm">
                                / {STORAGE_LIMIT_GB} GB
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            {usagePercent.toFixed(1)}% used ·{" "}
                            {formatBytes(STORAGE_LIMIT_BYTES - totalUsed)} remaining
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <HardDrive className="text-muted-foreground h-4 w-4" />
                        <span className="text-muted-foreground text-sm">R2</span>
                    </div>
                </div>

                {/* Main progress bar */}
                <div className="bg-secondary/40 h-3 w-full overflow-hidden rounded-full">
                    <div
                        className={cn("h-full rounded-full transition-all", barColor)}
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                </div>

                {/* Category breakdown */}
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {mockCategories.map((cat) => {
                        const Icon = cat.icon;
                        const percent = (cat.bytes / STORAGE_LIMIT_BYTES) * 100;
                        return (
                            <div key={cat.label}>
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Icon className={cn("h-3.5 w-3.5", cat.color)} />
                                        <span className="text-muted-foreground text-xs">
                                            {cat.label}
                                        </span>
                                    </div>
                                    <span className="text-foreground text-xs font-medium tabular-nums">
                                        {formatBytes(cat.bytes)}
                                    </span>
                                </div>
                                <div className="bg-secondary/40 h-1.5 w-full overflow-hidden rounded-full">
                                    <div
                                        className={cn("h-full rounded-full", cat.barColor)}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Auto-delete policy */}
            <div className="bg-card/40 border-border rounded-xl border p-5">
                <h2 className="text-foreground mb-1 text-sm font-semibold">Auto-delete Policy</h2>
                <p className="text-muted-foreground text-sm">
                    Attachments from{" "}
                    <span className="text-foreground">closed or resolved tickets</span> are
                    automatically deleted after{" "}
                    <span className="text-foreground">{AUTO_DELETE_DAYS} days</span>. Open ticket
                    attachments are never deleted automatically. Cleanup runs every week.
                </p>
            </div>

            {/* Recent uploads */}
            <div>
                <h2 className="text-foreground mb-3 text-sm font-semibold">Recent Uploads</h2>
                <div className="bg-card/40 border-border divide-border/60 divide-y overflow-hidden rounded-xl border">
                    {mockRecentFiles.map((file) => {
                        const Icon = getFileIcon(file.type);
                        const color = getFileColor(file.type);
                        return (
                            <div key={file.id} className="flex items-center gap-4 px-5 py-3.5">
                                <div
                                    className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                        color,
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-foreground truncate text-sm font-medium">
                                        {file.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {file.ticketRef} · {timeAgo(file.uploadedAt)}
                                    </p>
                                </div>
                                <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
                                    {formatBytes(file.size)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
