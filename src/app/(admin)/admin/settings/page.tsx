"use client";

import { useState } from "react";
import { Save, Shield, Bell, Clock, Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
interface SLARule {
    id: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    firstResponseHrs: number;
    resolutionHrs: number;
}

interface Settings {
    // General
    siteName: string;
    supportEmail: string;
    timezone: string;

    // Notifications
    notifyNewTicket: boolean;
    notifyNewReply: boolean;
    discordWebhook: string;

    // SLA
    slaEnabled: boolean;
    slaRules: SLARule[];

    // Auto-close
    autoCloseEnabled: boolean;
    autoCloseDays: number;

    // Storage
    autoDeleteEnabled: boolean;
    autoDeleteDays: number;
}

// ─── Mock Initial Settings ────────────────────────────────
const INITIAL_SETTINGS: Settings = {
    siteName: "Evocave Help",
    supportEmail: "support@evocave.com",
    timezone: "Asia/Jakarta",

    notifyNewTicket: true,
    notifyNewReply: true,
    discordWebhook: "",

    slaEnabled: false,
    slaRules: [
        { id: "sla1", priority: "URGENT", firstResponseHrs: 1, resolutionHrs: 8 },
        { id: "sla2", priority: "HIGH", firstResponseHrs: 4, resolutionHrs: 24 },
        { id: "sla3", priority: "MEDIUM", firstResponseHrs: 8, resolutionHrs: 48 },
        { id: "sla4", priority: "LOW", firstResponseHrs: 24, resolutionHrs: 72 },
    ],

    autoCloseEnabled: false,
    autoCloseDays: 7,

    autoDeleteEnabled: true,
    autoDeleteDays: 365,
};

const TIMEZONES = [
    "Asia/Jakarta",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Asia/Bangkok",
    "Asia/Kuala_Lumpur",
    "Europe/London",
    "Europe/Berlin",
    "America/New_York",
    "America/Los_Angeles",
    "UTC",
];

const priorityColors: Record<string, string> = {
    URGENT: "text-red-400",
    HIGH: "text-amber-400",
    MEDIUM: "text-blue-400",
    LOW: "text-zinc-400",
};

// ─── Components ───────────────────────────────────────────
function SectionHeader({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="bg-secondary/40 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Icon className="text-muted-foreground h-4 w-4" />
            </div>
            <div>
                <h2 className="text-foreground text-sm font-semibold">{title}</h2>
                <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
            </div>
        </div>
    );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                checked ? "bg-blue-600" : "bg-secondary/60",
            )}
        >
            <span
                className={cn(
                    "absolute top-1 left-0 h-4 w-4 rounded-full bg-white shadow transition-transform",
                    checked ? "translate-x-6" : "translate-x-1",
                )}
            />
        </button>
    );
}

function SettingRow({
    label,
    description,
    children,
}: {
    label: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
                <p className="text-foreground text-sm font-medium">{label}</p>
                {description && (
                    <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
                )}
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-card/40 border-border divide-border/60 divide-y overflow-hidden rounded-xl border">
            {children}
        </div>
    );
}

function CardSection({ children }: { children: React.ReactNode }) {
    return <div className="px-5">{children}</div>;
}

// ─── Main Page ───────────────────────────────────────────
export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    function update<K extends keyof Settings>(key: K, value: Settings[K]) {
        setSettings((prev) => ({ ...prev, [key]: value }));
        setSaved(false);
    }

    function updateSLA(id: string, field: keyof SLARule, value: number) {
        setSettings((prev) => ({
            ...prev,
            slaRules: prev.slaRules.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
        }));
        setSaved(false);
    }

    async function handleSave() {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-foreground text-2xl font-semibold">Settings</h1>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                        System configuration and preferences
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={cn(
                        "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                        saved
                            ? "bg-emerald-600 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-500",
                        saving && "cursor-not-allowed opacity-70",
                    )}
                >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </button>
            </div>

            {/* ── General ── */}
            <div className="space-y-4">
                <SectionHeader
                    icon={Shield}
                    title="General"
                    description="Basic information about your help center"
                />
                <Card>
                    <CardSection>
                        <SettingRow
                            label="Site Name"
                            description="Displayed in the header and emails"
                        >
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => update("siteName", e.target.value)}
                                className="bg-secondary/20 border-border text-foreground focus:border-ring/70 w-48 rounded-lg border px-3 py-1.5 text-sm transition-colors focus:outline-none"
                            />
                        </SettingRow>
                    </CardSection>
                    <CardSection>
                        <SettingRow
                            label="Support Email"
                            description="Replies to tickets are sent from this address"
                        >
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => update("supportEmail", e.target.value)}
                                className="bg-secondary/20 border-border text-foreground focus:border-ring/70 w-56 rounded-lg border px-3 py-1.5 text-sm transition-colors focus:outline-none"
                            />
                        </SettingRow>
                    </CardSection>
                    <CardSection>
                        <SettingRow
                            label="Timezone"
                            description="Used for timestamps and SLA calculations"
                        >
                            <select
                                value={settings.timezone}
                                onChange={(e) => update("timezone", e.target.value)}
                                className="bg-secondary/20 border-border text-foreground focus:border-ring/70 w-48 cursor-pointer appearance-none rounded-lg border px-3 py-1.5 text-sm transition-colors focus:outline-none"
                            >
                                {TIMEZONES.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                        </SettingRow>
                    </CardSection>
                </Card>
            </div>

            {/* ── Notifications ── */}
            <div className="space-y-4">
                <SectionHeader
                    icon={Bell}
                    title="Notifications"
                    description="Configure when and how you receive alerts"
                />
                <Card>
                    <CardSection>
                        <SettingRow
                            label="New ticket"
                            description="Notify when a customer opens a new ticket"
                        >
                            <Toggle
                                checked={settings.notifyNewTicket}
                                onChange={(v) => update("notifyNewTicket", v)}
                            />
                        </SettingRow>
                    </CardSection>
                    <CardSection>
                        <SettingRow
                            label="New reply"
                            description="Notify when a customer replies to a ticket"
                        >
                            <Toggle
                                checked={settings.notifyNewReply}
                                onChange={(v) => update("notifyNewReply", v)}
                            />
                        </SettingRow>
                    </CardSection>
                    <CardSection>
                        <SettingRow
                            label="Discord Webhook"
                            description="Send notifications to a Discord channel"
                        >
                            <input
                                type="url"
                                value={settings.discordWebhook}
                                onChange={(e) => update("discordWebhook", e.target.value)}
                                placeholder="https://discord.com/api/webhooks/..."
                                className="bg-secondary/20 border-border text-foreground placeholder:text-muted-foreground/40 focus:border-ring/70 w-72 rounded-lg border px-3 py-1.5 text-sm transition-colors focus:outline-none"
                            />
                        </SettingRow>
                    </CardSection>
                </Card>
            </div>

            {/* ── SLA ── */}
            <div className="space-y-4">
                <SectionHeader
                    icon={Clock}
                    title="SLA (Service Level Agreement)"
                    description="Set response time targets per priority. Not active by default."
                />
                <Card>
                    <CardSection>
                        <SettingRow
                            label="Enable SLA"
                            description="Show SLA timers on tickets and alert when breached"
                        >
                            <Toggle
                                checked={settings.slaEnabled}
                                onChange={(v) => update("slaEnabled", v)}
                            />
                        </SettingRow>
                    </CardSection>

                    {/* SLA Rules */}
                    <div
                        className={cn(
                            "transition-opacity",
                            !settings.slaEnabled && "pointer-events-none opacity-40",
                        )}
                    >
                        {/* Table header */}
                        <div className="border-border bg-secondary/10 grid grid-cols-[120px_1fr_1fr] items-center gap-4 border-t px-5 py-2.5">
                            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                Priority
                            </span>
                            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                First Response
                            </span>
                            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                Resolution
                            </span>
                        </div>
                        {settings.slaRules.map((rule) => (
                            <div
                                key={rule.id}
                                className="border-border grid grid-cols-[120px_1fr_1fr] items-center gap-4 border-t px-5 py-3"
                            >
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        priorityColors[rule.priority],
                                    )}
                                >
                                    {rule.priority.charAt(0) + rule.priority.slice(1).toLowerCase()}
                                </span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        max={168}
                                        value={rule.firstResponseHrs}
                                        onChange={(e) =>
                                            updateSLA(
                                                rule.id,
                                                "firstResponseHrs",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="bg-secondary/20 border-border text-foreground focus:border-ring/70 w-16 rounded-lg border px-2 py-1.5 text-center text-sm transition-colors focus:outline-none"
                                    />
                                    <span className="text-muted-foreground text-sm">hours</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        max={720}
                                        value={rule.resolutionHrs}
                                        onChange={(e) =>
                                            updateSLA(
                                                rule.id,
                                                "resolutionHrs",
                                                Number(e.target.value),
                                            )
                                        }
                                        className="bg-secondary/20 border-border text-foreground focus:border-ring/70 w-16 rounded-lg border px-2 py-1.5 text-center text-sm transition-colors focus:outline-none"
                                    />
                                    <span className="text-muted-foreground text-sm">hours</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* ── Auto-close ── */}
            <div className="space-y-4">
                <SectionHeader
                    icon={Clock}
                    title="Auto-close"
                    description="Automatically close resolved tickets after a period of inactivity"
                />
                <Card>
                    <CardSection>
                        <SettingRow
                            label="Enable auto-close"
                            description="Close resolved tickets with no customer reply"
                        >
                            <Toggle
                                checked={settings.autoCloseEnabled}
                                onChange={(v) => update("autoCloseEnabled", v)}
                            />
                        </SettingRow>
                    </CardSection>
                    <CardSection>
                        <div
                            className={cn(
                                "transition-opacity",
                                !settings.autoCloseEnabled && "pointer-events-none opacity-40",
                            )}
                        >
                            <SettingRow
                                label="Close after"
                                description="Days of inactivity before a resolved ticket is closed"
                            >
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        max={90}
                                        value={settings.autoCloseDays}
                                        onChange={(e) =>
                                            update("autoCloseDays", Number(e.target.value))
                                        }
                                        className="bg-secondary/20 border-border text-foreground focus:border-ring/70 w-16 rounded-lg border px-2 py-1.5 text-center text-sm transition-colors focus:outline-none"
                                    />
                                    <span className="text-muted-foreground text-sm">days</span>
                                </div>
                            </SettingRow>
                        </div>
                    </CardSection>
                </Card>
            </div>

            {/* ── Storage / Auto-delete ── */}
            <div className="space-y-4">
                <SectionHeader
                    icon={Trash2}
                    title="Storage Cleanup"
                    description="Automatically delete attachments from old closed tickets to save R2 storage"
                />
                <Card>
                    <CardSection>
                        <SettingRow
                            label="Enable auto-delete"
                            description="Delete attachments from closed/resolved tickets"
                        >
                            <Toggle
                                checked={settings.autoDeleteEnabled}
                                onChange={(v) => update("autoDeleteEnabled", v)}
                            />
                        </SettingRow>
                    </CardSection>
                    <CardSection>
                        <div
                            className={cn(
                                "transition-opacity",
                                !settings.autoDeleteEnabled && "pointer-events-none opacity-40",
                            )}
                        >
                            <SettingRow
                                label="Delete after"
                                description="Days after ticket closed before attachments are deleted"
                            >
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={30}
                                        max={1825}
                                        value={settings.autoDeleteDays}
                                        onChange={(e) =>
                                            update("autoDeleteDays", Number(e.target.value))
                                        }
                                        className="bg-secondary/20 border-border text-foreground focus:border-ring/70 w-20 rounded-lg border px-2 py-1.5 text-center text-sm transition-colors focus:outline-none"
                                    />
                                    <span className="text-muted-foreground text-sm">days</span>
                                </div>
                            </SettingRow>
                        </div>
                    </CardSection>
                </Card>

                {settings.autoDeleteEnabled && (
                    <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                        <p className="text-xs text-blue-400/80">
                            Attachments from closed/resolved tickets older than{" "}
                            <span className="font-medium text-blue-400">
                                {settings.autoDeleteDays} days
                            </span>{" "}
                            will be permanently deleted. Open ticket attachments are never deleted.
                            Cleanup runs weekly.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
