import UserInfo from "@/components/user/user-info";
import { badgeStyles, bottomNav, mainNav, navLinks, resourceNav } from "@/lib/user/user-nav-link";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileMenu() {
    const pathname = usePathname();

    return (
        <>
            <div className="bg-background fixed inset-0 top-16 z-40 overflow-y-auto lg:hidden">
                <div className="flex flex-col gap-0.5 px-4 py-4">
                    {/* User info */}
                    <UserInfo />

                    <div className="bg-border mb-2 h-px" />

                    {/* Nav links */}
                    <p className="text-muted-foreground px-2 py-1.5 text-[10px] tracking-widest uppercase">
                        Navigate
                    </p>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            className={cn(
                                "flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm transition-colors",
                                !link.external && pathname.startsWith(link.href)
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {link.label}
                            {link.external && (
                                <svg
                                    className="ml-auto h-3 w-3 opacity-40"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            )}
                        </Link>
                    ))}

                    <div className="bg-border my-2 h-px" />

                    <p className="text-muted-foreground px-2 py-1.5 text-[10px] tracking-widest uppercase">
                        Menu
                    </p>

                    {mainNav.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm transition-colors",
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
                                {item.badge !== undefined && (
                                    <span
                                        className={cn(
                                            "flex h-5 w-5 items-center justify-center rounded-full text-center text-[11px] font-medium",
                                            badgeStyles[item.badgeVariant] || badgeStyles.default,
                                        )}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}

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
                                className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm transition-colors"
                            >
                                <Icon className="h-4 w-4 shrink-0 opacity-60" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className="bg-border mt-3 mb-2 h-px" />

                    {/* Bottom nav */}
                    {bottomNav.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.75 text-sm transition-colors",
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
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* Sign out */}
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm transition-colors"
                    >
                        <LogOut className="text-destructive size-4 shrink-0" />
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        </>
    );
}
