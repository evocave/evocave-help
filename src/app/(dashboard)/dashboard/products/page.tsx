"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────
interface Product {
    id: string;
    envatoItemId: number;
    name: string;
    thumbnailUrl: string;
    landscapeUrl: string;
    purchaseCode: string;
    purchaseDate: string;
    supportedUntil: string | null;
    license: string;
    envatoUrl: string;
}

// ─── Mock Data ───────────────────────────────────────────
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
        envatoUrl: "https://themeforest.net/item/solarion/56240617",
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
        envatoUrl: "https://themeforest.net/item/coworkly/56557806",
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
        envatoUrl: "https://themeforest.net/item/elecfix/56637738",
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
        envatoUrl: "https://themeforest.net/item/steelforge/56461819",
    },
];

// ─── Helpers ─────────────────────────────────────────────
function maskCode(code: string) {
    const parts = code.split("-");
    return parts.map((p, i) => (i === parts.length - 1 ? p : "****")).join("-");
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// ─── Add Product Modal ────────────────────────────────────
function AddProductModal({
    onClose,
    onAdd,
}: {
    onClose: () => void;
    onAdd: (product: Product) => void;
}) {
    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState<{ valid: boolean; product?: Product } | null>(null);

    async function handleVerify() {
        if (!code.trim()) return;
        setVerifying(true);
        setResult(null);
        // TODO: POST /api/envato/verify { purchaseCode: code }
        await new Promise((r) => setTimeout(r, 1500));
        setResult({
            valid: true,
            product: {
                id: "p-new",
                envatoItemId: 56240617,
                name: "Solarion - Solar & Green Renewable Energy Elementor Template Kit",
                thumbnailUrl: "https://s3.envato.com/files/778140542/thumbnail-solarion.png",
                landscapeUrl: "https://s3.envato.com/files/778140603/cover-solarion.jpg",
                purchaseCode: code,
                purchaseDate: new Date().toISOString(),
                supportedUntil: null,
                license: "Regular License",
                envatoUrl: "https://themeforest.net/item/solarion/56240617",
            },
        });
        setVerifying(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">Add New Product</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-600 transition-colors hover:text-zinc-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Purchase Code
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    setResult(null);
                                }}
                                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 font-mono text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-zinc-600 focus:outline-none"
                            />
                            <button
                                onClick={handleVerify}
                                disabled={!code.trim() || verifying || result?.valid === true}
                                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                    result?.valid
                                        ? "border border-emerald-500/20 bg-emerald-500/20 text-emerald-400"
                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                                }`}
                            >
                                {verifying ? (
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                ) : result?.valid ? (
                                    "✓ Valid"
                                ) : (
                                    "Verify"
                                )}
                            </button>
                        </div>
                        <p className="mt-1.5 text-xs text-zinc-600">
                            Find your purchase code on{" "}
                            <a
                                href="https://codecanyon.net/downloads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-400"
                            >
                                Envato Downloads
                            </a>
                        </p>
                    </div>

                    {result?.valid && result.product && (
                        <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                            <img
                                src={result.product.landscapeUrl}
                                alt=""
                                className="h-24 w-full object-cover"
                            />
                            <div className="flex items-center gap-3 p-3">
                                <img
                                    src={result.product.thumbnailUrl}
                                    alt=""
                                    className="h-9 w-9 shrink-0 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-zinc-200">
                                        {result.product.name}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {result.product.license} · Lifetime support
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {result?.valid === false && (
                        <p className="text-xs text-red-400">
                            Purchase code not found or not an Evocave product.
                        </p>
                    )}

                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-zinc-800 py-2.5 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => result?.product && onAdd(result.product)}
                            disabled={!result?.valid}
                            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Add Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Product Card ─────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
    const [showCode, setShowCode] = useState(false);

    return (
        <Link
            href={"/products/" + product.id}
            className="group block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700"
        >
            {/* Cover landscape */}
            <div className="relative h-36 overflow-hidden bg-zinc-800">
                <img
                    src={product.landscapeUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Active badge */}
                <div className="absolute top-3 right-3">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400 backdrop-blur-sm">
                        Active
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <img
                        src={product.thumbnailUrl}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm leading-snug font-medium text-zinc-200 transition-colors group-hover:text-white">
                            {product.name}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-600">
                            {product.license} · {formatDate(product.purchaseDate)}
                        </p>
                    </div>
                </div>

                {/* Purchase code */}
                <div
                    className="mt-3 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2"
                    onClick={(e) => e.preventDefault()}
                >
                    <span className="flex-1 truncate font-mono text-xs text-zinc-500">
                        {showCode ? product.purchaseCode : maskCode(product.purchaseCode)}
                    </span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowCode(!showCode);
                        }}
                        className="shrink-0 text-xs text-zinc-600 transition-colors hover:text-zinc-400"
                    >
                        {showCode ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
        </Link>
    );
}

// ─── Main Page ───────────────────────────────────────────
export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [showModal, setShowModal] = useState(false);

    function handleAddProduct(product: Product) {
        setProducts((prev) => {
            const exists = prev.find((p) => p.id === product.id);
            return exists ? prev : [...prev, product];
        });
    }

    return (
        <>
            {showModal && (
                <AddProductModal
                    onClose={() => setShowModal(false)}
                    onAdd={(p) => {
                        handleAddProduct(p);
                        setShowModal(false);
                    }}
                />
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">My Products</h1>
                        <p className="mt-0.5 text-sm text-zinc-500">
                            {products.length} verified{" "}
                            {products.length === 1 ? "license" : "licenses"}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </button>
                </div>

                {/* Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-800 py-16">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800">
                            <svg
                                className="h-6 w-6 text-zinc-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                        <p className="text-sm text-zinc-500">No products added yet</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-sm text-blue-400 transition-colors hover:text-blue-300"
                        >
                            Add your first product →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
