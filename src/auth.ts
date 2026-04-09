import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import EnvatoProvider from "@/lib/envato-provider";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        // ── Google OAuth ──────────────────────────────
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),

        // ── Envato OAuth ──────────────────────────────
        EnvatoProvider({
            clientId: process.env.ENVATO_CLIENT_ID!,
            clientSecret: process.env.ENVATO_CLIENT_SECRET!,
        }),

        // ── Email + Password ──────────────────────────
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) return null;

                const valid = await bcrypt.compare(credentials.password as string, user.password);

                if (!valid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                } as any;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role ?? "USER";
            }

            // Kalau login via Envato — simpan access token untuk sync produk
            if (account?.provider === "envato") {
                token.envatoAccessToken = account.access_token;
            }

            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        },

        async signIn({ user, account, profile }) {
            // Kalau login via Envato — sync produk yang dibeli
            if (account?.provider === "envato" && account.access_token) {
                try {
                    await syncEnvatoProducts(
                        user.id!,
                        account.access_token,
                        (profile as any)?.username,
                    );
                } catch (err) {
                    console.error("Failed to sync Envato products:", err);
                    // Tidak block login meski sync gagal
                }
            }
            return true;
        },
    },

    pages: {
        signIn: "/login",
    },
});

// ── Sync produk Envato setelah login ─────────────────────
async function syncEnvatoProducts(userId: string, accessToken: string, envatoUsername?: string) {
    // Fetch semua pembelian produk Evocave dari Envato
    const res = await fetch(
        "https://api.envato.com/v3/market/buyer/purchases?filter_by=app_creator_items",
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        },
    );

    if (!res.ok) return;
    const data = await res.json();
    const purchases = data.purchases ?? [];

    // Simpan envatoUsername ke user
    if (envatoUsername) {
        await prisma.user.upsert({
            where: { id: userId },
            update: { envatoUsername },
            create: {
                id: userId,
                name: envatoUsername,
                email: "",
                envatoUsername,
                provider: "envato",
            },
        });
    }

    // Upsert tiap produk yang dibeli
    for (const purchase of purchases) {
        const envatoItemId = purchase.item?.id;
        if (!envatoItemId) continue;

        // Cek apakah produk ada di database kita
        const product = await prisma.product.findUnique({
            where: { envatoItemId },
        });

        if (!product) continue; // Skip produk yang bukan milik Evocave

        // Upsert UserProduct
        await prisma.userProduct.upsert({
            where: { purchaseCode: purchase.code },
            update: {
                supportedUntil: purchase.supported_until
                    ? new Date(purchase.supported_until)
                    : null,
                envatoSaleId: purchase.id?.toString() ?? null,
            },
            create: {
                userId,
                productId: product.id,
                purchaseCode: purchase.code,
                licenseType: purchase.license ?? "Regular License",
                supportedUntil: purchase.supported_until
                    ? new Date(purchase.supported_until)
                    : null,
                envatoSaleId: purchase.id?.toString() ?? null,
            },
        });
    }
}
