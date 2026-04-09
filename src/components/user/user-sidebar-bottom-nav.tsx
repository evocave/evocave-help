"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { bottomNav } from "@/lib/user/user-nav-link";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarBottomNav() {
    const pathname = usePathname();

    const isActiveRoute = (href: string) => {
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        className="border-foreground/10 flex h-14 items-center gap-2 rounded-lg border px-2"
                    />
                }
            >
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                            {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                            <AvatarFallback className="text-xs">AN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <p className="text-foreground text-sm font-medium">Andrian Nugraha</p>
                            <p className="text-muted-foreground text-xs">andrian@evocave.com</p>
                        </div>
                    </div>
                    <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="bg-background flex max-w-full flex-col gap-2 rounded-lg p-2"
                align="end"
                sideOffset={6}
            >
                {bottomNav.map((item) => {
                    const Icon = item.icon;
                    return (
                        <DropdownMenuItem
                            key={item.href}
                            render={<Link href={item.href} />}
                            className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-md py-2 text-sm",
                                isActiveRoute(item.href)
                                    ? "bg-muted text-foreground hover:bg-muted! focus:bg-muted! font-medium"
                                    : "text-muted-foreground hover:bg-muted! focus:bg-muted!",
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-4 w-4",
                                    isActiveRoute(item.href) ? "opacity-100" : "opacity-60",
                                )}
                            />
                            <span className="text-sm">{item.label}</span>
                        </DropdownMenuItem>
                    );
                })}

                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    variant="destructive"
                    className={"cursor-pointer rounded-md"}
                >
                    <LogOut
                        className={cn(
                            "h-4 w-4",
                            isActiveRoute("/profile") ? "opacity-100" : "opacity-60",
                        )}
                    />
                    <span className="text-sm font-medium">Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
