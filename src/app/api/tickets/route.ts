import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Generate EVO-{YEAR}-{SEQ}
async function generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const counter = await prisma.ticketCounter.upsert({
        where: { year },
        update: { count: { increment: 1 } },
        create: { year, count: 1 },
    });
    return `EVO-${year}-${counter.count.toString().padStart(3, "0")}`;
}

// ── GET /api/tickets ──────────────────────────────────────
export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;

    const isAdmin = ["admin", "superadmin", "support", "technical"].includes(
        (session.user as any).role,
    );

    const where = {
        ...(!isAdmin && { customerId: session.user.id }),
        ...(status && status !== "ALL" && { status: status as any }),
    };

    const [tickets, total] = await Promise.all([
        prisma.ticket.findMany({
            where,
            orderBy: { updatedAt: "desc" },
            skip,
            take: limit,
            include: {
                customer: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, name: true, thumbnailUrl: true } },
                assignedTo: { select: { id: true, name: true } },
                labels: { include: { label: true } },
                _count: { select: { messages: true } },
            },
        }),
        prisma.ticket.count({ where }),
    ]);

    return NextResponse.json({
        tickets,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    });
}

// ── POST /api/tickets ─────────────────────────────────────
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, content, productId, priority, category } = await req.json();

    if (!subject?.trim() || !content?.trim() || !productId) {
        return NextResponse.json(
            { error: "Subject, content and product are required" },
            { status: 400 },
        );
    }

    // Verifikasi user punya produk ini
    const userProduct = await prisma.userProduct.findFirst({
        where: { userId: session.user.id, productId },
    });

    if (!userProduct) {
        return NextResponse.json({ error: "You don't own this product" }, { status: 403 });
    }

    const referenceNumber = await generateReferenceNumber();

    const ticket = await prisma.ticket.create({
        data: {
            referenceNumber,
            subject: subject.trim(),
            priority: priority ?? "MEDIUM",
            category: category ?? "general",
            customerId: session.user.id,
            productId,
            messages: {
                create: {
                    content: content.trim(),
                    authorId: session.user.id,
                    isFromAgent: false,
                },
            },
        },
        include: {
            product: { select: { name: true, thumbnailUrl: true } },
            messages: true,
            _count: { select: { messages: true } },
        },
    });

    // Activity log
    await prisma.activityLog.create({
        data: {
            ticketId: ticket.id,
            actorId: session.user.id,
            type: "ticket_created",
            text: `Ticket created by ${session.user.name}`,
        },
    });

    return NextResponse.json(ticket, { status: 201 });
}
