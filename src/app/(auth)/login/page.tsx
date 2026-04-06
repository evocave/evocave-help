import { LoginForm } from "@/components/auth/login/login-form";
import LogoEvocave from "@/components/logo/logo-evocave";

export default function LoginPage() {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex items-center justify-center">
                    <LogoEvocave showHelp />
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
