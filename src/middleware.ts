import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
    });

    const isLoggedIn = !!token;
    const userRole = token?.role as string | undefined;

    // Protect /dashboard
    if (pathname.startsWith("/dashboard") && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Protect /admin
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        const adminRoles = ["admin", "superadmin", "support", "technical"];
        if (!adminRoles.includes(userRole ?? "")) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    // Redirect logged in user dari login page
    if (pathname === "/login" && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
