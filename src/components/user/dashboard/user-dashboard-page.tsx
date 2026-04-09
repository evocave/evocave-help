"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, Ticket } from "@/types/user/user-dashboard";
import deriveStats from "@/components/user/dashboard/user-derive-stats";
import getStatsConfig from "@/components/user/dashboard/user-get-stats-config";

import TicketRow from "@/components/user/dashboard/user-ticket-row";
import ProductRow from "@/components/user/dashboard/user-product-row";
import useIsDesktop from "@/components/user/dashboard/user-use-is-desktop";
import useItemCount from "@/components/user/dashboard/user-use-item-count";
import SectionHeader from "@/components/user/dashboard/user-section-header";

// ─── Configs ─────────────────────────────────────────────

// ─── Mock Data (ganti dengan API call nanti) ──────────────
const mockTickets: Ticket[] = [
    {
        id: "1",
        referenceNumber: "EVO-2026-015",
        subject: "Installation Error on Solarion Template Kit",
        status: "OPEN",
        priority: "URGENT",
        productName: "Solarion - Elementor Kit",
        createdAt: "2026-04-07T08:00:00Z",
        updatedAt: "2026-04-07T10:30:00Z",
    },
    {
        id: "2",
        referenceNumber: "EVO-2026-014",
        subject: "How to customize the color scheme?",
        status: "AWAITING_CUSTOMER",
        priority: "MEDIUM",
        productName: "Coworkly - Figma UI Kit",
        createdAt: "2026-04-06T14:00:00Z",
        updatedAt: "2026-04-07T09:00:00Z",
    },
    {
        id: "3",
        referenceNumber: "EVO-2026-012",
        subject: "Mobile responsive issue on homepage",
        status: "IN_PROGRESS",
        priority: "HIGH",
        productName: "Solarion - Elementor Kit",
        createdAt: "2026-04-05T10:00:00Z",
        updatedAt: "2026-04-06T16:00:00Z",
    },
    {
        id: "4",
        referenceNumber: "EVO-2026-010",
        subject: "License key not working after reinstall",
        status: "RESOLVED",
        priority: "HIGH",
        productName: "Solarion - Elementor Kit",
        createdAt: "2026-04-03T09:00:00Z",
        updatedAt: "2026-04-04T11:00:00Z",
    },
    {
        id: "5",
        referenceNumber: "EVO-2026-008",
        subject: "Dark mode not applying correctly on mobile",
        status: "CLOSED",
        priority: "LOW",
        productName: "Coworkly - Figma UI Kit",
        createdAt: "2026-03-28T10:00:00Z",
        updatedAt: "2026-04-01T10:00:00Z",
    },
    {
        id: "6",
        referenceNumber: "EVO-2026-007",
        subject: "Font not loading on Safari browser",
        status: "OPEN",
        priority: "MEDIUM",
        productName: "Solarion - Elementor Kit",
        createdAt: "2026-03-27T10:00:00Z",
        updatedAt: "2026-03-30T10:00:00Z",
    },
    {
        id: "7",
        referenceNumber: "EVO-2026-006",
        subject: "Elementor widget not showing on frontend",
        status: "OPEN",
        priority: "HIGH",
        productName: "Solarion - Elementor Kit",
        createdAt: "2026-03-25T10:00:00Z",
        updatedAt: "2026-03-28T10:00:00Z",
    },
];

const mockProducts: Product[] = [
    {
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
    },
    {
        id: "p2",
        envatoItemId: 56557806,
        name: "Coworkly - Coworking Creative Space Elementor Template Kit",
        thumbnailUrl: "https://s3.envato.com/files/778143115/thumbnail-coworkly.png",
        landscapeUrl: "https://s3.envato.com/files/778143196/cover-coworkly.jpg",
        purchaseCode: "x9y8z7w6-v5u4-3210-wxyz-ab9876543210",
        purchaseDate: "2025-12-11T04:40:15+11:00",
        supportedUntil: null,
        license: "Regular License",
        envatoUrl:
            "https://themeforest.net/item/coworkly-coworking-creative-space-elementor-template-kit/56557806",
    },
    {
        id: "p3",
        envatoItemId: 56637738,
        name: "Elecfix - Electrician & Electrical Services Elementor Template Kit",
        thumbnailUrl: "https://s3.envato.com/files/778145153/thumbnail-elecfix.png",
        landscapeUrl: "https://s3.envato.com/files/778145205/cover-elecfix.jpg",
        purchaseCode: "f3e2d1c0-b9a8-7654-fedc-ba9876543210",
        purchaseDate: "2026-04-04T00:46:25+11:00",
        supportedUntil: null,
        license: "Regular License",
        envatoUrl:
            "https://themeforest.net/item/elecfix-electrician-electrical-services-elementor-template-kit/56637738",
    },
    {
        id: "p4",
        envatoItemId: 56461819,
        name: "SteelForge - Steel Factory & Industrial Plant Manufacturing Elementor Template Kit",
        thumbnailUrl: "https://s3.envato.com/files/778141819/thumbnail-steelforge.png",
        landscapeUrl: "https://s3.envato.com/files/778141871/cover-steelforge.jpg",
        purchaseCode: "c1d2e3f4-a5b6-7890-cdef-ab1234567890",
        purchaseDate: "2026-01-31T20:25:05+11:00",
        supportedUntil: null,
        license: "Regular License",
        envatoUrl:
            "https://themeforest.net/item/steelforge-steel-factory-industrial-plant-manufacturing-elementor-template-kit/56461819",
    },
];

// ─── Mobile fixed count ───────────────────────────────────
const MOBILE_COUNT = 3;

// ─── Section Header ───────────────────────────────────────

// ─── Main Page ───────────────────────────────────────────
export default function UserDashboardPage() {
    const userName = "Andrian";

    // ── Data — nanti ganti dengan API call ──────────────────
    // const { data: tickets = [] } = useQuery({ queryKey: ["tickets"], queryFn: fetchTickets })
    // const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts })
    const tickets = mockTickets;
    const [products] = useState<Product[]>(mockProducts);
    const { open, pending, resolved } = deriveStats(tickets);
    const statsCards = getStatsConfig(open, pending, resolved);

    const sortedTickets = [...tickets].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    // ── Refs untuk pengukuran ────────────────────────────────
    const topRef = useRef<HTMLDivElement>(null); // header + stats
    const ticketColRef = useRef<HTMLDivElement>(null); // kolom ticket
    const productColRef = useRef<HTMLDivElement>(null); // kolom product
    const ticketItemRef = useRef<HTMLAnchorElement>(null);
    const productItemRef = useRef<HTMLAnchorElement>(null);

    // ── Hitung jumlah item yang muat di layar ────────────────
    const isDesktop = useIsDesktop();
    const ticketCount = useItemCount(ticketColRef, ticketItemRef, isDesktop);
    const productCount = useItemCount(productColRef, productItemRef, isDesktop);

    // ── Tentukan item yang dirender ──────────────────────────
    // Desktop: dinamis. Mobile (isDesktop=false): null -> fallback ke MOBILE_COUNT
    const visibleTickets = sortedTickets.slice(0, ticketCount ?? MOBILE_COUNT);
    const visibleProducts = products.slice(0, productCount ?? MOBILE_COUNT);

    return (
        // Tinggi sama persis dengan sidebar: calc(100svh - 10rem)
        // flex-col: bagian atas (header+stats) natural height, bagian bawah flex-1
        <div className="flex flex-col gap-6 lg:h-[calc(100svh-10rem)]">
            {/* ── Atas: header + stats ── */}
            <div ref={topRef} className="flex shrink-0 flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">
                            Welcome back, {userName}
                        </h1>
                        <p className="mt-0.5 text-sm text-zinc-500">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                    <Link href="/tickets/new">
                        <Button className="h-10 cursor-pointer rounded-lg">
                            <Plus className="h-4 w-4" />
                            <span className="h-5 text-sm font-medium">New Ticket</span>
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {statsCards.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.label}
                                className="bg-card/40 border-border flex flex-col gap-3 rounded-xl border p-3 sm:p-4"
                            >
                                <div className="flex items-center gap-2">
                                    <div className={item.iconStyle}>
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-muted-foreground text-xs font-medium sm:text-sm">
                                        {item.label}
                                    </span>
                                </div>
                                <span
                                    className={`text-2xl font-semibold tabular-nums sm:text-3xl ${item.color}`}
                                >
                                    {item.value}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Bawah: tickets + products ──
                flex-1     → mengisi sisa tinggi setelah header+stats
                min-h-0    → wajib agar flex child tidak overflow keluar
                Di desktop: 2 kolom side-by-side
                Di mobile : 1 kolom, tinggi natural (tidak dibatasi)       */}
            <div className="grid grid-cols-1 gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_324px]">
                {/* Kolom Tickets */}
                {/* h-full + flex flex-col: kolom mengisi tinggi grid row penuh */}
                <div ref={ticketColRef} className="flex flex-col lg:h-full">
                    <SectionHeader title="Recent Tickets" href="/dashboard/tickets" />
                    {/* overflow-hidden: pastikan konten tidak meluber keluar card */}
                    <div className="bg-card/40 border-border overflow-hidden rounded-xl border">
                        {visibleTickets.length > 0 ? (
                            visibleTickets.map((ticket, i) => (
                                <TicketRow
                                    key={ticket.id}
                                    ticket={ticket}
                                    // ref hanya di item pertama untuk ngukur tingginya
                                    measureRef={i === 0 ? ticketItemRef : undefined}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center gap-2 py-10">
                                <p className="text-muted-foreground text-sm">No tickets yet</p>
                                <Link
                                    href="/dashboard/tickets/new"
                                    className="text-sm text-blue-400 hover:text-blue-300"
                                >
                                    Create your first ticket →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Kolom Products */}
                <div ref={productColRef} className="flex flex-col lg:h-full">
                    <SectionHeader title="My Products" href="/dashboard/products" />
                    <div className="bg-card/40 border-border overflow-hidden rounded-xl border">
                        {visibleProducts.length > 0 ? (
                            visibleProducts.map((product, i) => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    measureRef={i === 0 ? productItemRef : undefined}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center gap-2 py-10">
                                <p className="text-muted-foreground text-sm">No products yet</p>
                                <Link
                                    href="/dashboard/products"
                                    className="text-sm text-blue-400 hover:text-blue-300"
                                >
                                    Add your first product →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
