import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProducts = await prisma.userProduct.findMany({
        where: { userId: session.user.id },
        include: { product: true },
        orderBy: { createdAt: "desc" },
    });

    const products = userProducts.map((up) => ({
        id: up.product.id,
        envatoItemId: up.product.envatoItemId,
        name: up.product.name,
        thumbnailUrl: up.product.thumbnailUrl,
        landscapeUrl: up.product.landscapeUrl,
        purchaseCode: up.purchaseCode,
        createdAt: up.createdAt,
        supportedUntil: up.supportedUntil,
        licenseType: up.licenseType,
    }));

    return NextResponse.json({ products });
}
