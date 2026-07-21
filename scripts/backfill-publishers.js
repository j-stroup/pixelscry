// One-off: populates the new Publisher relation for games cached before
// it existed. Reads publisher names straight out of the rawg_data already
// stored locally — no RAWG API calls needed.
//
// Run with: node --env-file=.env scripts/backfill-publishers.js

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
    const games = await prisma.game.findMany({
        select: { slug: true, rawg_data: true, lastUpdated: true }
    });

    console.log(`Backfilling publishers for ${games.length} cached games...`);

    let updated = 0;
    let skipped = 0;

    for (const game of games) {
        const gameData = JSON.parse(game.rawg_data);

        const publisherConnects = (gameData.publishers || [])
            .map((p) => p.name)
            .filter(Boolean)
            .map((publisherName) => ({
                where: { nameLower: publisherName.toLowerCase() },
                create: { nameLower: publisherName.toLowerCase(), name: publisherName }
            }));

        if (publisherConnects.length === 0) {
            skipped++;
            continue;
        }

        await prisma.game.update({
            where: { slug: game.slug },
            data: { publishers: { connectOrCreate: publisherConnects } }
        });

        // Prisma's @updatedAt auto-bumps lastUpdated on any write — restore
        // the original timestamp so this backfill doesn't reset every
        // game's 30-day staleness clock (see isStale() in gameCache.js).
        await prisma.$executeRawUnsafe(
            `UPDATE Game SET lastUpdated = ? WHERE slug = ?`,
            game.lastUpdated.toISOString(),
            game.slug
        );

        updated++;
    }

    console.log(`Done. Updated: ${updated}, skipped (no publisher data): ${skipped}.`);
    await prisma.$disconnect();
}

main();
