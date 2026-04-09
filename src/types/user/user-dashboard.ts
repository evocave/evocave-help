// ─── Types ───────────────────────────────────────────────
export type TicketStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "AWAITING_CUSTOMER"
    | "AWAITING_AGENT"
    | "RESOLVED"
    | "CLOSED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Ticket {
    id: string;
    referenceNumber: string;
    subject: string;
    status: TicketStatus;
    priority: Priority;
    productName: string;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: string;
    envatoItemId: number;
    name: string;
    thumbnailUrl: string;
    landscapeUrl: string;
    purchaseCode: string;
    purchaseDate: string; // sale.sold_at
    supportedUntil: string | null; // null = lifetime/active
    license: string; // sale.license
    envatoUrl: string;
}
