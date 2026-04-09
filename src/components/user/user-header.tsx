"use client";

import AppLogo from "@/components/app-logo";
import MobileMenu from "@/components/user/user-mobile-menu";
import HamburgerMobile from "@/components/hamburger-anim";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { navLinks } from "@/lib/user/user-nav-link";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
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
                <div className="mx-auto flex h-16 w-full max-w-350 items-center gap-10 px-4 lg:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogo />
                        <span className="text-muted-foreground text-sm font-normal">help</span>
                    </Link>

                    {/* Desktop nav links */}
                    <nav className="hidden flex-1 items-center gap-6 lg:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noopener noreferrer" : undefined}
                                className={cn(
                                    "text-sm font-medium transition-colors duration-150",
                                    !link.external && pathname.startsWith(link.href)
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Spacer mobile */}
                    <div className="flex-1 lg:hidden" />

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Notification */}
                        <NotificationDropdown />

                        {/* Hamburger — mobile only */}
                        <HamburgerMobile isOpen={isOpen} setIsOpen={setIsOpen} />
                    </div>
                </div>
            </header>
            {/* Mobile menu */}
            {isOpen && <MobileMenu />}
        </>
    );
}
