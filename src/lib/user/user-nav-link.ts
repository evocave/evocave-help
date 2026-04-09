import {
    Bell,
    BookOpen,
    LayoutDashboard,
    Megaphone,
    Package,
    Settings,
    TicketCheck,
} from "lucide-react";

export const navLinks = [
    { label: "Support", href: "/dashboard" },
    { label: "Docs", href: "https://docs.evocave.com", external: true },
    { label: "Products", href: "#" },
];

export const mainNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
    {
        label: "My tickets",
        href: "/dashboard/tickets",
        icon: TicketCheck,
        badge: 2,
        badgeVariant: "danger" as const,
    },
    {
        label: "My products",
        href: "/dashboard/products",
        icon: Package,
        badge: 3,
        badgeVariant: "default" as const,
    },
    {
        label: "Announcements",
        href: "/dashboard/announcements",
        icon: Bell,
        badge: 1,
        badgeVariant: "info" as const,
    },
];

export const resourceNav = [
    {
        label: "Documentation",
        href: "https://docs.evocave.com",
        icon: BookOpen,
        external: true,
    },
    {
        label: "Changelog",
        href: "https://docs.evocave.com/changelog",
        icon: Megaphone,
        external: true,
    },
];

export const bottomNav = [
    {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

// badges style color

export const badgeStyles = {
    default: "bg-muted text-muted-foreground border-border border",
    danger: "bg-rose-950 text-rose-300 border-rose-800 border",
    success: "bg-emerald-950 text-emerald-300 border-emerald-800 border",
    warning: "bg-amber-950 text-amber-300 border-amber-800 border",
    info: "bg-blue-950 text-blue-300 border-blue-800 border",
};
