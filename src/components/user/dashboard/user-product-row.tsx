import { Product } from "@/types/user/user-dashboard";
import Link from "next/link";

export default function ProductRow({
    product,
    measureRef,
}: {
    product: Product;
    measureRef?: React.Ref<HTMLAnchorElement>;
}) {
    return (
        <Link
            ref={measureRef}
            href={"/dashboard/products/" + product.id}
            className="group border-border hover:bg-card/80 flex h-24 items-center gap-3 border-b px-4 transition-colors last:border-0"
        >
            {/* Thumbnail dari Envato */}
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm transition-colors group-hover:text-white">
                    {product.name}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">{product.license}</p>
            </div>

            {/* Status — null = lifetime = Active */}
            <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                Active
            </span>
        </Link>
    );
}
