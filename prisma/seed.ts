import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding products...");

    // Upsert semua produk Evocave
    const products = [
        {
            envatoItemId: "56240617",
            name: "Solarion - Solar & Green Renewable Energy Elementor Template Kit",
            slug: "solarion",
            thumbnailUrl: "https://s3.envato.com/files/778140542/thumbnail-solarion.png",
            landscapeUrl: "https://s3.envato.com/files/778140603/cover-solarion.jpg",
        },
        {
            envatoItemId: "56557806",
            name: "Coworkly - Coworking Space Elementor Template Kit",
            slug: "coworkly",
            thumbnailUrl: "https://s3.envato.com/files/778143115/thumbnail-coworkly.png",
            landscapeUrl: null,
        },
        {
            envatoItemId: "56637738",
            name: "Elecfix - Electronics Repair Service Elementor Template Kit",
            slug: "elecfix",
            thumbnailUrl: "https://s3.envato.com/files/778145153/thumbnail-elecfix.png",
            landscapeUrl: null,
        },
        {
            envatoItemId: "56461819",
            name: "SteelForge - Industrial & Manufacturing Elementor Template Kit",
            slug: "steelforge",
            thumbnailUrl: "https://s3.envato.com/files/778141819/thumbnail-steelforge.png",
            landscapeUrl: null,
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { envatoItemId: product.envatoItemId },
            update: {
                name: product.name,
                thumbnailUrl: product.thumbnailUrl,
                landscapeUrl: product.landscapeUrl,
            },
            create: product,
        });
        console.log(`✅ ${product.slug}`);
    }

    console.log("✅ Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
