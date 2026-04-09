import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import EnvatoProvider from "@/lib/envato-provider";

// ── Custom Adapter — map image -> avatarUrl ───────────────
function CustomPrismaAdapter() {
    const adapter = PrismaAdapter(prisma);

    function toAdapterUser(user: any) {
        return {
            ...user,
            image: user.avatarUrl ?? null,
            emailVerified: user.emailVerified ? new Date() : null,
        };
    }

    return {
        ...adapter,
        createUser: async (data: any) => {
            const { image, emailVerified, ...rest } = data;
            const user = await prisma.user.create({
                data: {
                    ...rest,
                    avatarUrl: image ?? null,
                    emailVerified: !!emailVerified,
                    provider: rest.provider ?? "email",
                },
            });
            return toAdapterUser(user);
        },
        updateUser: async (data: any) => {
            const { image, emailVerified, ...rest } = data;
            const user = await prisma.user.update({
                where: { id: rest.id },
                data: {
                    ...rest,
                    ...(image !== undefined && { avatarUrl: image }),
                    ...(emailVerified !== undefined && { emailVerified: !!emailVerified }),
                },
            });
            return toAdapterUser(user);
        },
        getUser: async (id: string) => {
            const user = await prisma.user.findUnique({ where: { id } });
            return user ? toAdapterUser(user) : null;
        },
        getUserByEmail: async (email: string) => {
            const user = await prisma.user.findUnique({ where: { email } });
            return user ? toAdapterUser(user) : null;
        },
    };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: CustomPrismaAdapter(),
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
                token.role = (user as any).role ?? "user";
            }
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
            if (account?.provider === "envato" && account.access_token) {
                try {
                    await syncEnvatoProducts(
                        user.id!,
                        account.access_token,
                        (profile as any)?.username,
                    );
                } catch (err) {
                    console.error("Failed to sync Envato products:", err);
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
    const res = await fetch(
        "https://api.envato.com/v3/market/buyer/purchases?filter_by=app_creator_items",
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!res.ok) return;
    const data = await res.json();
    const purchases = data.purchases ?? [];

    // Update envatoUsername
    if (envatoUsername) {
        await prisma.user.update({
            where: { id: userId },
            data: { envatoUsername },
        });
    }

    // Upsert tiap produk yang dibeli
    for (const purchase of purchases) {
        const envatoItemId = purchase.item?.id;
        if (!envatoItemId) continue;

        const product = await prisma.product.findUnique({
            where: { envatoItemId: String(envatoItemId) },
        });

        if (!product) continue;

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
