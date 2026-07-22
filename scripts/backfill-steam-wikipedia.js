// One-off: populates Steam and Wikipedia enrichment for games cached
// before those fields existed. Unlike the publisher backfill, this DOES
// need live network calls (Steam/Wikipedia data isn't already sitting in
// rawg_data) — budget a few seconds per game.
//
// Run with: node --env-file=.env scripts/backfill-steam-wikipedia.js

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { findSteamAppId, getAppDetails } from '../src/lib/server/steamClient.js';
import { findWikipediaSummary } from '../src/lib/server/wikipediaClient.js';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const REQUEST_DELAY_MS = 300;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    const games = await prisma.game.findMany({
        where: { steamAppId: null, wikipediaUrl: null },
        select: { slug: true, name: true, rawg_data: true, lastUpdated: true }
    });

    console.log(`Backfilling Steam/Wikipedia data for ${games.length} cached games...`);

    let steamFound = 0;
    let wikiFound = 0;
    let processed = 0;

    for (const game of games) {
        const gameData = JSON.parse(game.rawg_data);
        const onSteam = (gameData.stores || []).some((s) => s.store?.slug === 'steam');

        let steamAppId = null;
        let steamData = null;

        if (onSteam) {
            try {
                steamAppId = await findSteamAppId(game.name);
                if (steamAppId) {
                    const details = await getAppDetails(steamAppId);
                    steamData = details ? JSON.stringify(details) : null;
                    steamFound++;
                }
            } catch (error) {
                console.error(`Steam lookup failed for "${game.name}":`, error.message);
            }
            await sleep(REQUEST_DELAY_MS);
        }

        let wikipediaUrl = null;
        let wikipediaExtract = null;

        try {
            const summary = await findWikipediaSummary(game.name);
            if (summary) {
                wikipediaUrl = summary.url;
                wikipediaExtract = summary.extract;
                wikiFound++;
            }
        } catch (error) {
            console.error(`Wikipedia lookup failed for "${game.name}":`, error.message);
        }
        await sleep(REQUEST_DELAY_MS);

        await prisma.game.update({
            where: { slug: game.slug },
            data: { steamAppId, steamData, wikipediaUrl, wikipediaExtract }
        });

        // Prisma's @updatedAt auto-bumps lastUpdated on any write — restore
        // the original timestamp so this backfill doesn't reset every
        // game's 30-day staleness clock (see isStale() in gameCache.js).
        await prisma.$executeRawUnsafe(
            `UPDATE Game SET lastUpdated = ? WHERE slug = ?`,
            game.lastUpdated.toISOString(),
            game.slug
        );

        processed++;
        if (processed % 25 === 0) console.log(`...${processed}/${games.length}`);
    }

    console.log(`Done. Processed: ${processed}, Steam matches: ${steamFound}, Wikipedia matches: ${wikiFound}.`);
    await prisma.$disconnect();
}

main();
