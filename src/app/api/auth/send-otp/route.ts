import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Cek email sudah terdaftar
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }

        // Hapus token lama kalau ada
        await prisma.verificationToken.deleteMany({
            where: { email, type: "email_verify" },
        });

        // Generate OTP 6 digit
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

        await prisma.verificationToken.create({
            data: { email, token: otp, type: "email_verify", expiresAt },
        });

        // Kirim email
        await resend.emails.send({
            from: "Evocave Help <noreply@evocave.com>",
            to: email,
            subject: "Verify your email — Evocave Help",
            html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                    <h2 style="margin: 0 0 16px;">Verify your email</h2>
                    <p>Your verification code is:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px; background: #f4f4f5; border-radius: 8px; text-align: center; margin: 16px 0;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, you can ignore this email.</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Send OTP error:", err);
        return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
    }
}
