// ─── Stats ────────────────────────────────────────────────

import { Ticket } from "@/types/user/user-dashboard";

export default function deriveStats(tickets: Ticket[]) {
    return {
        open: tickets.filter((t) => t.status === "OPEN").length,
        pending: tickets.filter((t) =>
            ["IN_PROGRESS", "AWAITING_CUSTOMER", "AWAITING_AGENT"].includes(t.status),
        ).length,
        resolved: tickets.filter((t) => ["RESOLVED", "CLOSED"].includes(t.status)).length,
    };
}
