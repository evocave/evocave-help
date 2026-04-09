"use client";

import { badgeStyles, mainNav, resourceNav } from "@/lib/user/user-nav-link";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNav() {
    const pathname = usePathname();
    return (
        <div>
            {/* Main nav */}
            <p className="text-muted-foreground px-2 py-1.5 text-[10px] tracking-widest uppercase">
                Menu
            </p>
            {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "mb-1 flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                            isActive
                                ? "bg-muted text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                    >
                        <Icon
                            className={cn(
                                "h-4 w-4 shrink-0",
                                isActive ? "opacity-100" : "opacity-60",
                            )}
                        />
                        <span className="flex-1">{item.label}</span>
                        {"badge" in item && item.badge !== undefined && (
                            <span
                                className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium",
                                    badgeStyles[item.badgeVariant ?? "default"],
                                )}
                            >
                                {item.badge}
                            </span>
                        )}
                    </Link>
                );
            })}

            {/* Resources nav */}
            <p className="text-muted-foreground mt-3 px-2 py-1.5 text-[10px] tracking-widest uppercase">
                Resources
            </p>
            {resourceNav.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted mb-1 flex items-center gap-2 rounded-md px-2.5 py-1.75 text-sm transition-colors"
                    >
                        <Icon className="h-4 w-4 shrink-0 opacity-60" />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
