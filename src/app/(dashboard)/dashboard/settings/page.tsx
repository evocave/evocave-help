"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────
interface ConnectedAccount {
    id: string;
    name: string;
    username: string | null;
    connected: boolean;
    icon: React.ReactNode;
}

interface NotificationSetting {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
}

// ─── Mock Data ───────────────────────────────────────────
const mockProfile = {
    name: "Andrian Nugraha",
    email: "andrian@evocave.com",
    memberSince: "January 15, 2026",
    avatar: "",
};

// ─── Icons ───────────────────────────────────────────────
function GoogleIcon() {
    return (
        <svg className="h-4 w-4" viewBox="0 0 24 24">
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
    );
}

function EnvatoIcon() {
    return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#81B441"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ─── Toggle Switch ────────────────────────────────────────
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                enabled ? "bg-primary" : "bg-secondary"
            }`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ${
                    enabled ? "translate-x-5" : "translate-x-0"
                }`}
            />
        </button>
    );
}

// ─── Section Card ─────────────────────────────────────────
function SectionCard({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-card/40 border-border space-y-5 rounded-xl border p-6">
            <div>
                <h2 className="text-foreground text-base font-semibold">{title}</h2>
                {description && (
                    <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
}

// ─── Input Field ──────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-foreground block text-sm font-medium">{label}</label>
            {children}
        </div>
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground focus:border-ring/70 w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none"
        />
    );
}

// ─── Main Page ───────────────────────────────────────────
export default function SettingsPage() {
    const [profile, setProfile] = useState(mockProfile);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [notifications, setNotifications] = useState<NotificationSetting[]>([
        {
            id: "ticket_replies",
            label: "Ticket replies",
            description: "Get notified when support replies to your ticket",
            enabled: true,
        },
        {
            id: "ticket_status",
            label: "Ticket status changes",
            description: "Get notified when your ticket is closed or updated",
            enabled: true,
        },
        {
            id: "announcements",
            label: "Announcements",
            description: "Product updates, maintenance notices, and news",
            enabled: false,
        },
    ]);

    const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
        {
            id: "google",
            name: "Google",
            username: "andrian@gmail.com",
            connected: true,
            icon: <GoogleIcon />,
        },
        {
            id: "envato",
            name: "Envato Market",
            username: "@andrian_dev",
            connected: true,
            icon: <EnvatoIcon />,
        },
    ]);

    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const initials = profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    async function handleSaveProfile() {
        setSavingProfile(true);
        await new Promise((r) => setTimeout(r, 800));
        setSavingProfile(false);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
    }

    async function handleSavePassword() {
        setPasswordError("");
        if (passwords.new !== passwords.confirm) {
            setPasswordError("New passwords do not match.");
            return;
        }
        if (passwords.new.length < 8) {
            setPasswordError("Password must be at least 8 characters.");
            return;
        }
        setSavingPassword(true);
        await new Promise((r) => setTimeout(r, 800));
        setSavingPassword(false);
        setPasswordSaved(true);
        setPasswords({ current: "", new: "", confirm: "" });
        setTimeout(() => setPasswordSaved(false), 3000);
    }

    function toggleNotification(id: string) {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
        );
    }

    function toggleAccount(id: string) {
        setConnectedAccounts((prev) =>
            prev.map((a) =>
                a.id === id
                    ? { ...a, connected: !a.connected, username: !a.connected ? a.username : null }
                    : a,
            ),
        );
    }

    return (
        <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-foreground text-2xl font-semibold">Profile</h1>
                <p className="text-muted-foreground mt-0.5 text-sm">
                    Manage your account and connected providers
                </p>
            </div>

            {/* Account */}
            <SectionCard title="Account">
                {/* Avatar + info */}
                <div className="flex items-center gap-4">
                    {/* Avatar dengan overlay change photo + tooltip */}
                    <div className="group relative shrink-0">
                        <div className="bg-primary/20 text-primary flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold">
                            {profile.avatar ? (
                                <img
                                    src={profile.avatar}
                                    alt=""
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <svg
                                className="h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && file.size <= 2 * 1024 * 1024) {
                                        const url = URL.createObjectURL(file);
                                        setProfile({ ...profile, avatar: url });
                                    }
                                }}
                            />
                        </label>
                        {/* Tooltip */}
                        <div className="bg-popover border-border text-popover-foreground pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg border px-2.5 py-1.5 text-xs whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            JPG or PNG, max 2MB
                            <div className="border-popover absolute top-full left-1/2 -translate-x-1/2 border-4 border-t-current opacity-20" />
                        </div>
                    </div>
                    <div>
                        <p className="text-foreground text-lg font-semibold">{profile.name}</p>
                        <p className="text-muted-foreground text-sm">{profile.email}</p>
                        <p className="text-muted-foreground text-xs">
                            Member since {profile.memberSince}
                        </p>
                    </div>
                </div>

                <div className="border-border border-t" />

                {/* Fields */}
                <Field label="Full name">
                    <Input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                </Field>

                <Field label="Email">
                    <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                </Field>

                {/* Save */}
                <div className="flex items-center justify-between pt-1">
                    {profileSaved && (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Saved
                        </span>
                    )}
                    <Button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="ml-auto cursor-pointer"
                    >
                        {savingProfile ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </SectionCard>

            {/* Change Password */}
            <SectionCard title="Change password">
                <Field label="Current password">
                    <Input
                        type="password"
                        placeholder="Enter current password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                </Field>
                <Field label="New password">
                    <Input
                        type="password"
                        placeholder="Min. 8 characters"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                </Field>
                <Field label="Confirm new password">
                    <Input
                        type="password"
                        placeholder="Repeat new password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                </Field>

                {passwordError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-400">
                        <svg
                            className="h-3.5 w-3.5 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {passwordError}
                    </p>
                )}

                <div className="flex items-center justify-between pt-1">
                    {passwordSaved && (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Password updated
                        </span>
                    )}
                    <Button
                        onClick={handleSavePassword}
                        disabled={
                            savingPassword ||
                            !passwords.current ||
                            !passwords.new ||
                            !passwords.confirm
                        }
                        className="ml-auto cursor-pointer"
                    >
                        {savingPassword ? "Updating..." : "Update password"}
                    </Button>
                </div>
            </SectionCard>

            {/* Connected Accounts */}
            <SectionCard
                title="Connected accounts"
                description="Connected accounts are used for login and product verification"
            >
                <div className="space-y-3">
                    {connectedAccounts.map((account) => (
                        <div
                            key={account.id}
                            className="border-border bg-secondary/20 flex items-center justify-between rounded-lg border px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="border-border flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-white/5">
                                    {account.icon}
                                </div>
                                <div>
                                    <p className="text-foreground text-sm font-medium">
                                        {account.name}
                                    </p>
                                    {account.username && (
                                        <p className="text-muted-foreground text-xs">
                                            {account.username}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {account.connected ? (
                                <div className="flex items-center gap-3">
                                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
                                        Connected
                                    </span>
                                    <button
                                        onClick={() => toggleAccount(account.id)}
                                        className="border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive rounded-lg border px-3 py-1.5 text-xs transition-colors"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => toggleAccount(account.id)}
                                    className="border-border text-muted-foreground hover:text-foreground rounded-lg border px-3 py-1.5 text-xs transition-colors"
                                >
                                    Connect
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Notifications */}
            <SectionCard title="Notifications">
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-foreground text-sm font-medium">{notif.label}</p>
                                <p className="text-muted-foreground mt-0.5 text-xs">
                                    {notif.description}
                                </p>
                            </div>
                            <Toggle
                                enabled={notif.enabled}
                                onChange={() => toggleNotification(notif.id)}
                            />
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Danger Zone */}
            <div className="border-destructive/20 bg-destructive/5 rounded-xl border p-6">
                <h2 className="text-destructive mb-4 text-base font-semibold">Danger zone</h2>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-foreground text-sm font-medium">Delete account</p>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            Permanently delete your account and all associated data. This action
                            cannot be undone.
                        </p>
                    </div>
                    <button className="border-destructive/30 text-destructive hover:border-destructive/60 shrink-0 rounded-lg border px-3 py-1.5 text-xs transition-colors">
                        Delete account
                    </button>
                </div>
            </div>
        </div>
    );
}
