"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";

// ─── Types ───────────────────────────────────────────────
interface ProductDetail {
    id: string;
    envatoItemId: number;
    name: string;
    thumbnailUrl: string;
    landscapeUrl: string;
    purchaseCode: string;
    purchaseDate: string;
    supportedUntil: string | null; // null = lifetime
    license: string;
    envatoUrl: string;
    demoUrl: string;
    rating: number;
    ratingCount: number;
    numberOfSales: number;
    publishedAt: string;
    softwareVersion: string[];
    templateKitType: string;
}

interface RelatedTicket {
    id: string;
    referenceNumber: string;
    subject: string;
    status: string;
    updatedAt: string;
}

// ─── Mock data — sesuai struktur JSON Envato ─────────────
const mockProduct: ProductDetail = {
    id: "p1",
    envatoItemId: 56240617,
    name: "Solarion - Solar & Green Renewable Energy Elementor Template Kit",
    thumbnailUrl: "https://s3.envato.com/files/778140542/thumbnail-solarion.png",
    landscapeUrl: "https://s3.envato.com/files/778140603/cover-solarion.jpg",
    purchaseCode: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    purchaseDate: "2026-04-04T01:03:54+11:00",
    supportedUntil: null,
    license: "Regular License",
    envatoUrl:
        "https://themeforest.net/item/solarion-solar-green-renewable-energy-elementor-template-kit/56240617",
    demoUrl: "https://kits.evocave.com/solarion/template-kit/home/",
    rating: 3.67,
    ratingCount: 3,
    numberOfSales: 155,
    publishedAt: "2025-01-15T01:14:30+11:00",
    softwareVersion: ["Elementor 3.10.x"],
    templateKitType: "Envato Template Kit",
};

const mockTickets: RelatedTicket[] = [
    {
        id: "1",
        referenceNumber: "EVO-2026-015",
        subject: "Installation Error on Solarion Template Kit",
        status: "OPEN",
        updatedAt: "2026-04-07T10:30:00Z",
    },
    {
        id: "3",
        referenceNumber: "EVO-2026-012",
        subject: "Mobile responsive issue on homepage",
        status: "IN_PROGRESS",
        updatedAt: "2026-04-06T16:00:00Z",
    },
    {
        id: "4",
        referenceNumber: "EVO-2026-010",
        subject: "License key not working after reinstall",
        status: "RESOLVED",
        updatedAt: "2026-04-04T11:00:00Z",
    },
];

// ─── Helpers ──────────────────────────────────────────────
function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function maskCode(code: string) {
    const parts = code.split("-");
    return parts.map((p, i) => (i === parts.length - 1 ? p : "****")).join("-");
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

// ─── Status config ────────────────────────────────────────
const statusColor: Record<string, string> = {
    OPEN: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    IN_PROGRESS: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    AWAITING_CUSTOMER: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    AWAITING_AGENT: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    CLOSED: "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20",
};

const statusLabel: Record<string, string> = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    AWAITING_CUSTOMER: "Awaiting You",
    AWAITING_AGENT: "Awaiting Agent",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
};

// ─── Star Rating ──────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                            star <= Math.round(rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-zinc-700 text-zinc-700"
                        }`}
                    />
                ))}
            </div>
            <span className="text-xs text-zinc-500">
                {rating.toFixed(1)} ({count} reviews)
            </span>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────
export default function ProductDetailPage() {
    // Nanti: const { data: product } = useQuery(...)
    const product = mockProduct;
    const tickets = mockTickets;

    const [showCode, setShowCode] = useState(false);

    return (
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
            {/* Back */}
            <Link
                href="/dashboard/products"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
                <ArrowLeft className="h-4 w-4" />
                My Products
            </Link>

            {/* Cover image */}
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                <img
                    src={product.landscapeUrl}
                    alt={product.name}
                    className="h-48 w-full object-cover sm:h-64"
                />

                {/* Product header */}
                <div className="flex items-start gap-4 p-5">
                    <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="-mt-10 h-16 w-16 shrink-0 rounded-xl border-2 border-zinc-900 object-cover shadow-lg"
                    />
                    <div className="min-w-0 flex-1 pt-1">
                        <h1 className="text-lg leading-snug font-semibold text-white">
                            {product.name}
                        </h1>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3">
                            <StarRating rating={product.rating} count={product.ratingCount} />
                            <span className="text-xs text-zinc-600">
                                {product.numberOfSales.toLocaleString()} sales
                            </span>
                            <span className="text-xs text-zinc-600">
                                Published {formatDate(product.publishedAt)}
                            </span>
                        </div>
                    </div>
                    {/* External links */}
                    <div className="flex shrink-0 items-center gap-2">
                        <a
                            href={product.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
                        >
                            Demo
                            <ExternalLink className="h-3 w-3" />
                        </a>
                        <a
                            href={product.envatoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
                        >
                            Envato
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
                {/* Left — License info */}
                <div className="space-y-4">
                    {/* License details */}
                    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                        <h2 className="text-sm font-medium tracking-wide text-zinc-400 uppercase">
                            License Details
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "License Type", value: product.license },
                                { label: "Purchase Date", value: formatDate(product.purchaseDate) },
                                {
                                    label: "Support",
                                    value:
                                        product.supportedUntil === null
                                            ? "Lifetime"
                                            : formatDate(product.supportedUntil),
                                },
                                { label: "Template Type", value: product.templateKitType },
                                { label: "Software", value: product.softwareVersion.join(", ") },
                                { label: "Item ID", value: `#${product.envatoItemId}` },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="mb-0.5 text-xs text-zinc-600">{item.label}</p>
                                    <p className="text-sm text-zinc-200">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Purchase code */}
                    <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                        <h2 className="text-sm font-medium tracking-wide text-zinc-400 uppercase">
                            Purchase Code
                        </h2>
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
                            <span className="truncate font-mono text-sm text-zinc-300">
                                {showCode ? product.purchaseCode : maskCode(product.purchaseCode)}
                            </span>
                            <button
                                onClick={() => setShowCode(!showCode)}
                                className="shrink-0 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
                            >
                                {showCode ? "Hide" : "Show"}
                            </button>
                        </div>
                        <p className="text-xs text-zinc-600">
                            Keep your purchase code private. Do not share it with anyone.
                        </p>
                    </div>
                </div>

                {/* Right — Status + Tickets */}
                <div className="space-y-4">
                    {/* Support status */}
                    <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                        <h2 className="text-sm font-medium tracking-wide text-zinc-400 uppercase">
                            Support Status
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <div>
                                <p className="text-sm font-medium text-zinc-200">Active</p>
                                <p className="text-xs text-zinc-600">Lifetime support included</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/tickets/new"
                            className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-500"
                        >
                            Create Support Ticket
                        </Link>
                    </div>

                    {/* Related tickets */}
                    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                            <h2 className="text-sm font-medium tracking-wide text-zinc-400 uppercase">
                                Tickets
                            </h2>
                            <span className="text-xs text-zinc-600">{tickets.length} total</span>
                        </div>

                        {tickets.length > 0 ? (
                            <div className="divide-y divide-zinc-800/60">
                                {tickets.map((ticket) => (
                                    <Link
                                        key={ticket.id}
                                        href={`/dashboard/tickets/${ticket.id}`}
                                        className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-zinc-800/40"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs text-zinc-200 transition-colors group-hover:text-white">
                                                {ticket.subject}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span
                                                    className={`inline-flex rounded-full px-1.5 py-0.5 text-xs ${statusColor[ticket.status]}`}
                                                >
                                                    {statusLabel[ticket.status]}
                                                </span>
                                                <span className="text-xs text-zinc-600">
                                                    {timeAgo(ticket.updatedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-zinc-600">No tickets for this product</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// useState import needed
import { useState } from "react";
