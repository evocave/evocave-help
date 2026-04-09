import { Priority, TicketStatus } from "@/types/user/user-dashboard";

export const statusConfig: Record<TicketStatus, { label: string; color: string }> = {
    OPEN: { label: "Open", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
    IN_PROGRESS: {
        label: "In Progress",
        color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    AWAITING_CUSTOMER: {
        label: "Awaiting You",
        color: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    },
    AWAITING_AGENT: {
        label: "Awaiting Agent",
        color: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
    },
    RESOLVED: {
        label: "Resolved",
        color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    CLOSED: { label: "Closed", color: "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20" },
};

export const priorityConfig: Record<Priority, { label: string; dot: string }> = {
    LOW: { label: "Low", dot: "bg-zinc-500" },
    MEDIUM: { label: "Medium", dot: "bg-blue-500" },
    HIGH: { label: "High", dot: "bg-amber-500" },
    URGENT: { label: "Urgent", dot: "bg-red-500" },
};
