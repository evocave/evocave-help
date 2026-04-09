"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (res?.error) {
            setError("Invalid email or password.");
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    async function handleGoogle() {
        await signIn("google", { callbackUrl: "/dashboard" });
    }

    async function handleEnvato() {
        await signIn("envato", { callbackUrl: "/dashboard" });
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Login with your Envato or Google account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field className="grid grid-cols-2 gap-4">
                                <Button variant="outline" type="button" onClick={handleEnvato}>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="shrink-0"
                                    >
                                        <rect width="16" height="16" rx="3.2" fill="#87E64C" />
                                        <path
                                            d="M8.51971 12.8149C8.81387 12.8149 9.05242 13.0535 9.05242 13.3476C9.05229 13.6417 8.81379 13.8799 8.51971 13.8799C8.22569 13.8798 7.98712 13.6417 7.98699 13.3476C7.98699 13.0535 8.22561 12.815 8.51971 12.8149Z"
                                            fill="#191919"
                                        />
                                        <path
                                            d="M9.10076 2.35839C9.62032 1.83883 10.4547 1.82177 10.9743 2.3413C11.546 2.89625 11.4937 3.84988 10.8698 4.33593L7.70428 6.75292C7.65958 6.7883 7.68943 6.85949 7.74529 6.85204L10.9387 6.38427C11.3558 6.33212 11.6858 6.59317 11.738 6.99169C11.79 7.25231 11.6671 7.49448 11.4772 7.65087L8.53826 9.93944C8.49377 9.97481 8.52164 10.0435 8.57733 10.0381L11.5812 9.71581L11.5871 9.71776C12.1252 9.66576 12.4026 10.3436 11.9855 10.6899L9.64276 12.6157C9.3821 12.8055 9.07117 12.4759 9.26092 12.2339L9.97234 11.355C10.0058 11.3141 9.96872 11.2542 9.91668 11.2671L5.35565 12.3901C4.80074 12.5278 4.22717 12.1981 4.10613 11.6265C3.9852 11.1926 4.15852 10.7586 4.54022 10.5166L7.59051 8.56347C7.64079 8.52995 7.60909 8.44984 7.54949 8.46288L4.799 9.02343C4.32973 9.10907 3.86211 8.79788 3.77459 8.3286C3.72245 8.03437 3.81023 7.7569 4.00018 7.54833L9.10076 2.35839Z"
                                            fill="#191919"
                                        />
                                    </svg>
                                    Envato
                                </Button>
                                <Button variant="outline" type="button" onClick={handleGoogle}>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        className="shrink-0"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            {error && (
                                <p className="text-destructive rounded-lg bg-red-500/10 px-3 py-2 text-sm">
                                    {error}
                                </p>
                            )}

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="/forgot-password"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <a href="/register">Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
