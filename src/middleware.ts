import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;

    // Protect /dashboard
    if (pathname.startsWith("/dashboard") && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Protect /admin — hanya role admin ke atas
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        const adminRoles = ["ADMIN", "SUPERADMIN", "SUPPORT", "TECHNICAL"];
        if (!adminRoles.includes(userRole ?? "")) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    // Redirect logged in user dari login page
    if (pathname === "/login" && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
