import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
        }

        // Cari token
        const token = await prisma.verificationToken.findFirst({
            where: {
                email,
                token: code,
                type: "email_verify",
                expiresAt: { gt: new Date() },
            },
        });

        if (!token) {
            return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
        }

        // Mark email as verified
        await prisma.user.update({
            where: { email },
            data: { emailVerified: true },
        });

        // Hapus token yang sudah dipakai
        await prisma.verificationToken.delete({
            where: { id: token.id },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Verify email error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
