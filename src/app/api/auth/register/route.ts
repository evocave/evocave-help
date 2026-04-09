import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email and password are required" },
                { status: 400 },
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 },
            );
        }

        // Cek email sudah terdaftar
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }

        // Cek OTP sudah diverifikasi
        const verified = await prisma.verificationToken.findFirst({
            where: {
                email,
                type: "email_verify",
                expiresAt: { gt: new Date() },
            },
        });

        if (!verified) {
            return NextResponse.json({ error: "Please verify your email first" }, { status: 400 });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Buat user
        await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
                emailVerified: false,
                provider: "email",
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Register error:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
