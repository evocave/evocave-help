"use client";

import { useState, useEffect } from "react";
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
    createdAt: string;
    supportedUntil: string | null;
    licenseType: string;
}

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
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<{
        valid: boolean;
        product?: {
            name: string;
            thumbnailUrl: string;
            landscapeUrl?: string;
            licenseType: string;
            supportedUntil: string | null;
        };
        purchaseCode?: string;
        productId?: string;
    } | null>(null);

    async function handleVerify() {
        if (!code.trim() || verifying) return;
        setVerifying(true);
        setError("");
        setResult(null);

        const res = await fetch("/api/products/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ purchaseCode: code.trim() }),
        });

        const data = await res.json();
        setVerifying(false);

        if (!res.ok) {
            setError(data.error ?? "Verification failed");
            setResult({ valid: false });
            return;
        }

        setResult({
            valid: true,
            product: data.product,
            purchaseCode: code.trim(),
            productId: data.product.id,
        });
    }

    async function handleAdd() {
        if (!result?.valid || !result.product || adding) return;
        setAdding(true);

        // Data sudah disimpan saat verify, tinggal update UI
        onAdd({
            id: result.productId!,
            envatoItemId: 0,
            name: result.product.name,
            thumbnailUrl: result.product.thumbnailUrl,
            landscapeUrl: result.product.landscapeUrl ?? "",
            purchaseCode: result.purchaseCode!,
            createdAt: new Date().toISOString(),
            supportedUntil: result.product.supportedUntil,
            licenseType: result.product.licenseType,
        });

        setAdding(false);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="bg-popover border-border w-full max-w-md rounded-2xl border p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-foreground text-base font-semibold">Add New Product</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">
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
                                    setError("");
                                }}
                                className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-ring/70 flex-1 rounded-lg border px-4 py-2.5 font-mono text-sm transition-colors focus:outline-none"
                            />
                            <button
                                onClick={handleVerify}
                                disabled={!code.trim() || verifying || result?.valid === true}
                                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                    result?.valid
                                        ? "border border-emerald-500/20 bg-emerald-500/20 text-emerald-400"
                                        : "bg-secondary/40 text-foreground hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-50"
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
                        <p className="text-muted-foreground mt-1.5 text-xs">
                            Find your purchase code on{" "}
                            <a
                                href="https://themeforest.net/downloads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                            >
                                Envato Downloads
                            </a>
                        </p>
                    </div>

                    {error && <p className="text-xs text-red-400">{error}</p>}

                    {result?.valid && result.product && (
                        <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                            {result.product.landscapeUrl && (
                                <img
                                    src={result.product.landscapeUrl}
                                    alt=""
                                    className="h-24 w-full object-cover"
                                />
                            )}
                            <div className="flex items-center gap-3 p-3">
                                <img
                                    src={result.product.thumbnailUrl}
                                    alt=""
                                    className="h-9 w-9 shrink-0 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-foreground truncate text-sm font-medium">
                                        {result.product.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {result.product.licenseType} ·{" "}
                                        {result.product.supportedUntil
                                            ? "Support until " +
                                              formatDate(result.product.supportedUntil)
                                            : "Lifetime support"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {result?.valid === false && !error && (
                        <p className="text-xs text-red-400">
                            Purchase code not found or not an Evocave product.
                        </p>
                    )}

                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={onClose}
                            className="border-border text-muted-foreground hover:text-foreground flex-1 rounded-lg border py-2.5 text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={!result?.valid || adding}
                            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {adding ? "Adding..." : "Add Product"}
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
            href={"/dashboard/products/" + product.id}
            className="group border-border bg-card/40 hover:border-border/80 block overflow-hidden rounded-xl border transition-colors"
        >
            {/* Cover */}
            <div className="bg-secondary/40 relative h-36 overflow-hidden">
                {product.landscapeUrl ? (
                    <img
                        src={product.landscapeUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <img
                            src={product.thumbnailUrl}
                            alt={product.name}
                            className="h-16 w-16 rounded-xl object-cover"
                        />
                    </div>
                )}
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
                        <p className="text-foreground line-clamp-2 text-sm leading-snug font-medium transition-colors group-hover:text-white">
                            {product.name}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            {product.licenseType} · {formatDate(product.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Purchase code */}
                <div
                    className="border-border bg-secondary/20 mt-3 flex items-center gap-2 rounded-lg border px-3 py-2"
                    onClick={(e) => e.preventDefault()}
                >
                    <span className="text-muted-foreground flex-1 truncate font-mono text-xs">
                        {showCode ? product.purchaseCode : maskCode(product.purchaseCode)}
                    </span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowCode(!showCode);
                        }}
                        className="text-muted-foreground hover:text-foreground shrink-0 text-xs transition-colors"
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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch("/api/products")
            .then((r) => r.json())
            .then((data) => {
                setProducts(data.products ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            {showModal && (
                <AddProductModal
                    onClose={() => setShowModal(false)}
                    onAdd={(p) => {
                        setProducts((prev) => {
                            const exists = prev.find(
                                (x) => x.id === p.id && x.purchaseCode === p.purchaseCode,
                            );
                            return exists ? prev : [...prev, p];
                        });
                        setShowModal(false);
                    }}
                />
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-foreground text-2xl font-semibold">My Products</h1>
                        <p className="text-muted-foreground mt-0.5 text-sm">
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
                {loading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="border-border bg-card/40 h-64 animate-pulse rounded-xl border"
                            />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id + product.purchaseCode}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="border-border flex flex-col items-center gap-3 rounded-xl border border-dashed py-16">
                        <p className="text-muted-foreground text-sm">No products added yet</p>
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
