import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── GET /api/tickets/[id] ─────────────────────────────────
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = ["admin", "superadmin", "support", "technical"].includes(
        (session.user as any).role,
    );

    const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
            customer: { select: { id: true, name: true, email: true, avatarUrl: true } },
            product: { select: { id: true, name: true, thumbnailUrl: true, landscapeUrl: true } },
            assignedTo: { select: { id: true, name: true } },
            labels: { include: { label: true } },
            messages: {
                // User biasa tidak lihat internal notes
                where: isAdmin ? {} : { isNote: false },
                orderBy: { createdAt: "asc" },
                include: {
                    author: { select: { id: true, name: true, avatarUrl: true, role: true } },
                    attachments: true,
                },
            },
            activityLogs: {
                orderBy: { createdAt: "desc" },
                take: 10,
                include: {
                    actor: { select: { id: true, name: true } },
                },
            },
            _count: { select: { messages: true } },
        },
    });

    if (!ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // User biasa hanya bisa lihat tiket miliknya
    if (!isAdmin && ticket.customerId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(ticket);
}

// ── PATCH /api/tickets/[id] — update status/priority/assignee (admin) ──
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = ["admin", "superadmin", "support", "technical"].includes(
        (session.user as any).role,
    );

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Hanya admin atau pemilik tiket yang bisa update
    if (!isAdmin && ticket.customerId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status, priority, assignedToId } = body;

    const updateData: any = {};
    const activityLogs: any[] = [];

    if (status && status !== ticket.status) {
        updateData.status = status;
        if (status === "RESOLVED") updateData.resolvedAt = new Date();
        if (status === "CLOSED") updateData.closedAt = new Date();
        activityLogs.push({
            type: "ticket_status_changed",
            text: `Status changed from ${ticket.status} → ${status}`,
            meta: { from: ticket.status, to: status },
        });
    }

    if (priority && priority !== ticket.priority && isAdmin) {
        updateData.priority = priority;
        activityLogs.push({
            type: "ticket_priority_changed",
            text: `Priority changed from ${ticket.priority} → ${priority}`,
            meta: { from: ticket.priority, to: priority },
        });
    }

    if (assignedToId !== undefined && isAdmin) {
        updateData.assignedToId = assignedToId || null;
        activityLogs.push({
            type: "ticket_assigned",
            text: assignedToId ? `Ticket assigned` : `Ticket unassigned`,
        });
    }

    const updated = await prisma.ticket.update({
        where: { id },
        data: updateData,
    });

    // Buat activity logs
    for (const log of activityLogs) {
        await prisma.activityLog.create({
            data: {
                ticketId: id,
                actorId: session.user.id,
                type: log.type,
                text: log.text,
                meta: log.meta,
            },
        });
    }

    return NextResponse.json(updated);
}

// ── POST /api/tickets/[id]/messages ──────────────────────
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isAdmin = ["admin", "superadmin", "support", "technical"].includes(
        (session.user as any).role,
    );

    const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: { customer: { select: { email: true, name: true } } },
    });

    if (!ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (!isAdmin && ticket.customerId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { content, isNote } = await req.json();

    if (!content?.trim()) {
        return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Internal notes hanya untuk admin
    if (isNote && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const message = await prisma.message.create({
        data: {
            ticketId: id,
            authorId: session.user.id,
            content: content.trim(),
            isFromAgent: isAdmin,
            isNote: isNote ?? false,
        },
        include: {
            author: { select: { id: true, name: true, avatarUrl: true, role: true } },
        },
    });

    // Update ticket updatedAt + status
    const updateData: any = { updatedAt: new Date() };
    if (isAdmin && !isNote && ticket.status === "OPEN") {
        updateData.status = "IN_PROGRESS";
    }
    if (!isAdmin && ticket.status === "AWAITING_CUSTOMER") {
        updateData.status = "IN_PROGRESS";
    }

    await prisma.ticket.update({ where: { id }, data: updateData });

    // Activity log
    await prisma.activityLog.create({
        data: {
            ticketId: id,
            actorId: session.user.id,
            type: isNote ? "note_added" : "reply_sent",
            text: isNote ? "Internal note added" : `${session.user.name} replied`,
        },
    });

    // Kirim notifikasi email ke customer (hanya kalau admin reply, bukan internal note)
    if (isAdmin && !isNote && ticket.customer.email) {
        try {
            await resend.emails.send({
                from: "Evocave Help <support@evocave.com>",
                to: ticket.customer.email,
                subject: `Re: [${ticket.referenceNumber}] ${ticket.subject}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                        <h2 style="margin: 0 0 16px;">New reply on your ticket</h2>
                        <p>Hi ${ticket.customer.name},</p>
                        <p>You have a new reply on your support ticket <strong>${ticket.referenceNumber}</strong>:</p>
                        <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
                            <p style="margin: 0; white-space: pre-line;">${content.trim()}</p>
                        </div>
                        <a href="https://help.evocave.com/dashboard/tickets/${id}"
                           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">
                            View ticket
                        </a>
                        <p style="color: #666; font-size: 14px; margin-top: 24px;">
                            Evocave Help · <a href="https://help.evocave.com">help.evocave.com</a>
                        </p>
                    </div>
                `,
            });
        } catch (err) {
            console.error("Failed to send email notification:", err);
        }
    }

    // Buat notifikasi in-app untuk customer
    if (isAdmin && !isNote) {
        await prisma.notification.create({
            data: {
                userId: ticket.customerId,
                ticketId: id,
                type: "ticket_reply",
                title: `New reply on ${ticket.referenceNumber}`,
                body: content.trim().slice(0, 100),
                href: `/dashboard/tickets/${id}`,
            },
        });
    }

    return NextResponse.json(message, { status: 201 });
}
