"use client";

import SidebarBottomNav from "@/components/user/user-sidebar-bottom-nav";
import SidebarNav from "@/components/user/user-sidebar-nav";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sticky top-28 hidden h-[calc(100svh-10rem)] w-full max-w-71.5 flex-col overscroll-none bg-transparent lg:flex">
            <div className="flex flex-1 flex-col gap-0.5 pr-8">
                <div className="via-border absolute top-12 right-0 bottom-0 hidden h-full w-px bg-linear-to-b from-transparent to-transparent lg:flex" />

                {/* Sidebar nav */}

                <SidebarNav />

                {/* Spacer */}
                <div className="flex-1" />

                {/* Bottom nav */}
                <SidebarBottomNav />
            </div>
        </aside>
    );
}
