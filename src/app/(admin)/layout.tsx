"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
    Bell,
    ChevronsUpDown,
    LayoutDashboard,
    LogOut,
    Megaphone,
    Settings,
    TicketCheck,
    Users,
    Shield,
    BarChart2,
} from "lucide-react";
import { RiBookmarkLine, RiChat2Line } from "@remixicon/react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationDropdown } from "@/components/notification-dropdown";
import AppLogo from "@/components/app-logo";

// ─── Nav config ───────────────────────────────────────────
const mainNav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    {
        label: "All Tickets",
        href: "/admin/tickets",
        icon: TicketCheck,
        badge: 5,
        badgeVariant: "danger" as const,
    },
    { label: "Canned Responses", href: "/admin/canned-responses", icon: RiChat2Line },
    { label: "Labels", href: "/admin/labels", icon: RiBookmarkLine },
    { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
];

const bottomNav = [
    { label: "Team", href: "/admin/team", icon: Users },
    { label: "Usage", href: "/admin/usage", icon: BarChart2 },
];

const badgeStyles = {
    default: "bg-muted text-muted-foreground border-border border",
    danger: "bg-rose-950 text-rose-300 border-rose-800 border",
    success: "bg-emerald-950 text-emerald-300 border-emerald-800 border",
    warning: "bg-amber-950 text-amber-300 border-amber-800 border",
    info: "bg-blue-950 text-blue-300 border-blue-800 border",
};

// ─── Admin role badge ─────────────────────────────────────
const roleBadge: Record<string, string> = {
    superadmin: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    admin: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    support: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    technical: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

// Mock current admin — nanti dari session
const currentAdmin = {
    name: "Andrian Nugraha",
    email: "andrian@evocave.com",
    initials: "AN",
    role: "superadmin" as const,
};

// ─── Layout ───────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto flex w-full flex-1 flex-col">
            <Header />
            <div className="mx-auto flex w-full max-w-350 flex-1 flex-row px-4 pb-12 lg:px-6 lg:pt-12">
                <Sidebar />
                <main className="w-full min-w-0 flex-1 lg:pl-16">
                    <div className="pt-6 lg:pt-0">{children}</div>
                </main>
            </div>
        </div>
    );
}

// ─── Header ───────────────────────────────────────────────
function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            <header className="bg-background sticky top-0 z-50 w-full border-b dark:bg-[#101415]">
                <div className="mx-auto flex h-16 w-full max-w-350 items-center gap-6 px-4 lg:px-6">
                    {/* Logo */}
                    <Link href="/admin" className="flex shrink-0 items-center gap-2">
                        <AppLogo />
                        <span className="text-muted-foreground text-sm font-normal">help</span>
                    </Link>

                    <div className="flex-1" />

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        {/* Admin Panel badge */}
                        <div className="hidden items-center lg:flex">
                            <span className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                                <Shield className="h-3 w-3" />
                                Admin Panel
                            </span>
                        </div>

                        <NotificationDropdown isAdmin />

                        {/* Hamburger mobile */}
                        <HamburgerMobile isOpen={isOpen} setIsOpen={setIsOpen} />
                    </div>
                </div>
            </header>
            {isOpen && <MobileMenu />}
        </>
    );
}

// ─── Hamburger ────────────────────────────────────────────
function HamburgerMobile({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
}) {
    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex h-9 w-9 items-center justify-center lg:hidden"
            aria-label="Toggle menu"
        >
            <div className="flex flex-col items-center justify-center gap-[8.5px]">
                <motion.span
                    animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-foreground block h-[1.5px] w-5.5 origin-center rounded-full"
                />
                <motion.span
                    animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-foreground block h-[1.5px] w-5.5 origin-center rounded-full"
                />
            </div>
        </button>
    );
}

// ─── Mobile Menu ──────────────────────────────────────────
function MobileMenu() {
    const pathname = usePathname();
    return (
        <div className="bg-background fixed inset-0 top-16 z-40 overflow-y-auto lg:hidden">
            <div className="flex flex-col gap-0.5 px-4 py-4">
                {/* Admin info */}
                <div className="mb-2 flex items-center gap-3 px-2.5 py-3">
                    <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                        {currentAdmin.initials}
                    </div>
                    <div>
                        <p className="text-foreground text-sm font-medium">{currentAdmin.name}</p>
                        <p className="text-muted-foreground text-xs">{currentAdmin.email}</p>
                    </div>
                    <span
                        className={cn(
                            "ml-auto rounded-full px-2 py-0.5 text-xs",
                            roleBadge[currentAdmin.role],
                        )}
                    >
                        {currentAdmin.role}
                    </span>
                </div>

                <div className="bg-border mb-2 h-px" />

                <p className="text-muted-foreground px-2 py-1.5 text-[10px] tracking-widest uppercase">
                    Menu
                </p>
                {mainNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href + "/") || pathname === item.href;
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

                <div className="bg-border my-2 h-px" />

                <p className="text-muted-foreground px-2 py-1.5 text-[10px] tracking-widest uppercase">
                    System
                </p>
                {bottomNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                <div className="bg-border mt-3 mb-2 h-px" />

                <button className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm transition-colors">
                    <LogOut className="text-destructive h-4 w-4 shrink-0" />
                    <span>Sign out</span>
                </button>
            </div>
        </div>
    );
}

// ─── Sidebar ──────────────────────────────────────────────
function Sidebar() {
    return (
        <aside className="sticky top-28 hidden h-[calc(100svh-10rem)] w-full max-w-71.5 flex-col overscroll-none bg-transparent lg:flex">
            <div className="flex flex-1 flex-col gap-0.5 pr-8">
                <div className="via-border absolute top-12 right-0 bottom-0 hidden h-full w-px bg-linear-to-b from-transparent to-transparent lg:flex" />
                <SidebarNav />
                <div className="flex-1" />
                <SidebarBottomNav />
            </div>
        </aside>
    );
}

function SidebarNav() {
    const pathname = usePathname();
    return (
        <div>
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

            <p className="text-muted-foreground mt-4 px-2 py-1.5 text-[10px] tracking-widest uppercase">
                System
            </p>
            {bottomNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}

function SidebarBottomNav() {
    const pathname = usePathname();
    const isActiveRoute = (href: string) => pathname === href || pathname.startsWith(href + "/");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="outline"
                        className="flex h-17 items-center gap-2 rounded-xl px-2"
                    />
                }
            >
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-11 w-11">
                            <AvatarFallback className="text-xs">
                                {currentAdmin.initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col-reverse items-start gap-1">
                            <span
                                className={cn(
                                    "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                                    roleBadge[currentAdmin.role],
                                )}
                            >
                                {currentAdmin.role}
                            </span>
                            <p className="text-foreground text-sm font-medium">
                                {currentAdmin.name}
                            </p>
                        </div>
                    </div>
                    <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="bg-background flex max-w-full flex-col gap-1 rounded-lg p-2"
                align="end"
                sideOffset={6}
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel>{currentAdmin.email}</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        render={<Link href="/admin/settings" />}
                        className={cn(
                            "cursor-pointer rounded-md text-sm",
                            isActiveRoute("/admin/settings")
                                ? "bg-muted text-foreground font-medium"
                                : "text-muted-foreground hover:bg-muted! focus:bg-muted!",
                        )}
                    >
                        <Settings
                            className={cn(
                                "h-4 w-4",
                                isActiveRoute("/admin/settings") ? "opacity-100" : "opacity-60",
                            )}
                        />
                        <span>Settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        render={<Link href="/login" />}
                        variant="destructive"
                        className="cursor-pointer rounded-md"
                    >
                        <LogOut className="h-4 w-4 opacity-60" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
