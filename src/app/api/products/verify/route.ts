import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { purchaseCode } = await req.json();

    if (!purchaseCode?.trim()) {
        return NextResponse.json({ error: "Purchase code is required" }, { status: 400 });
    }

    // Cek purchase code sudah pernah dipakai
    const existing = await prisma.userProduct.findUnique({
        where: { purchaseCode },
    });

    if (existing) {
        return NextResponse.json({ error: "Purchase code already registered" }, { status: 409 });
    }

    // Verify ke Envato Author API
    const res = await fetch(`https://api.envato.com/v3/market/author/sale?code=${purchaseCode}`, {
        headers: {
            Authorization: `Bearer ${process.env.ENVATO_AUTHOR_TOKEN}`,
        },
    });

    if (!res.ok) {
        if (res.status === 404) {
            return NextResponse.json({ error: "Invalid purchase code" }, { status: 404 });
        }
        return NextResponse.json({ error: "Failed to verify purchase code" }, { status: 502 });
    }

    const sale = await res.json();

    // Cek apakah produk ada di database kita
    const product = await prisma.product.findUnique({
        where: { envatoItemId: String(sale.item?.id) },
    });

    if (!product) {
        return NextResponse.json({ error: "This product is not supported" }, { status: 404 });
    }

    // Simpan ke user_products
    const userProduct = await prisma.userProduct.create({
        data: {
            userId: session.user.id,
            productId: product.id,
            purchaseCode,
            licenseType: sale.license ?? "Regular License",
            supportedUntil: sale.supported_until ? new Date(sale.supported_until) : null,
            envatoSaleId: sale.id?.toString() ?? null,
        },
        include: { product: true },
    });

    return NextResponse.json({
        success: true,
        product: {
            id: product.id,
            name: product.name,
            thumbnailUrl: product.thumbnailUrl,
            licenseType: userProduct.licenseType,
            supportedUntil: userProduct.supportedUntil,
        },
    });
}
