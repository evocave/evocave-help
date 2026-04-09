import AppLogo from "@/components/app-logo";
import { LoginForm } from "@/components/auth/login/login-form";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
};

export default function LoginPage() {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex items-center justify-center">
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogo />
                        <span className="text-muted-foreground text-sm font-normal">help</span>
                    </Link>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
