import { CircleCheckBig, Clock, TicketCheck } from "lucide-react";

export default function getStatsConfig(open: number, pending: number, resolved: number) {
    return [
        {
            label: "Open",
            icon: TicketCheck,
            iconStyle:
                "bg-blue-950 text-blue-300 border border-zinc-800 size-6 flex items-center justify-center rounded",
            value: open,
            color: "text-blue-300",
        },
        {
            label: "Pending",
            icon: Clock,
            iconStyle:
                "bg-amber-950 text-amber-300 border border-zinc-800 size-6 flex items-center justify-center rounded",
            value: pending,
            color: "text-amber-300",
        },
        {
            label: "Resolved",
            icon: CircleCheckBig,
            iconStyle:
                "bg-emerald-950 text-emerald-300 border border-zinc-800 size-6 flex items-center justify-center rounded",
            value: resolved,
            color: "text-emerald-300",
        },
    ];
}
