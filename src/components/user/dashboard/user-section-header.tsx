import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function SectionHeader({ title, href }: { title: string; href: string }) {
    return (
        <div className="mb-3 flex shrink-0 items-center justify-between">
            <h2 className="text-foreground text-base font-semibold">{title}</h2>
            <Link
                href={href}
                className="flex items-center gap-1 text-sm text-blue-400 transition-colors hover:text-blue-300"
            >
                View all <MoveRight className="h-4 w-4" />
            </Link>
        </div>
    );
}
