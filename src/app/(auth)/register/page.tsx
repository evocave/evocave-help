import AppLogo from "@/components/app-logo";
import { RegisterForm } from "@/components/auth/register/register-form";
import LogoEvocave from "@/components/logo/logo-evocave";
import Link from "next/link";

export default function SignupPage() {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex items-center justify-center">
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogo />
                        <span className="text-muted-foreground text-sm font-normal">help</span>
                    </Link>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}
