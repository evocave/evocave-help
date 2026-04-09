import { priorityConfig, statusConfig } from "@/components/user/dashboard/user-config";
import timeAgo from "@/lib/user/user-time-ago";
import { Ticket } from "@/types/user/user-dashboard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TicketRow({
    ticket,
    measureRef,
}: {
    ticket: Ticket;
    measureRef?: React.Ref<HTMLAnchorElement>;
}) {
    const status = statusConfig[ticket.status];
    const priority = priorityConfig[ticket.priority];

    return (
        <Link
            ref={measureRef}
            href={`/dashboard/tickets/${ticket.id}`}
            className="group border-border hover:bg-card/80 flex h-24 items-center gap-4 border-b px-5 transition-colors last:border-0"
        >
            <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-muted-foreground font-mono text-xs">
                        {ticket.referenceNumber}
                    </span>
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${status.color}`}
                    >
                        {status.label}
                    </span>
                </div>
                <p className="text-foreground truncate text-sm transition-colors group-hover:text-white">
                    {ticket.subject}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">{ticket.productName}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
                <div className="hidden items-center gap-1.5 sm:flex">
                    <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                    <span className="text-muted-foreground text-xs">{priority.label}</span>
                </div>
                <span className="text-muted-foreground w-14 text-right text-xs">
                    {timeAgo(ticket.updatedAt)}
                </span>
                <ChevronRight className="text-muted-foreground group-hover:text-foreground h-4 w-4" />
            </div>
        </Link>
    );
}
