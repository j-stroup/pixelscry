// Proactively populates the local game cache from RAWG so:
//   1. Category/price-tracking pages have inventory before a human ever visits.
//   2. sitemap.xml has real URLs for search engines to crawl.
//
// Run with: node --env-file=.env scripts/populate-cache.js
// Optional:  POPULATE_LIMIT=1000 node --env-file=.env scripts/populate-cache.js
//
// Standalone (plain Node, no SvelteKit) — credentials come from process.env
// via --env-file, not $env/static/private.
//
// RAWG's free tier is capped at 20,000 requests/month — this script costs
// roughly (candidates / 40) list requests + 1 detail request per newly
// cached game, so budget POPULATE_LIMIT accordingly if running often.

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createRawgClient } from '../src/lib/server/rawgClient.js';
import { saveGameToCache } from '../src/lib/server/gameCache.js';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const rawg = createRawgClient({ apiKey: process.env.RAWG_API_KEY });

const PAGE_SIZE = 40; // RAWG's max page_size
const TARGET_COUNT = Number(process.env.POPULATE_LIMIT) || 500;
const MIN_METACRITIC = 70;
const REQUEST_DELAY_MS = 250;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchCandidateSlugs() {
    const slugs = [];
    let page = 1;

    while (slugs.length < TARGET_COUNT) {
        const data = await rawg.listGames({
            page,
            page_size: PAGE_SIZE,
            ordering: '-metacritic',
            // Only well-reviewed games — avoids the low-sample/NSFW noise
            // that sorting by raw user rating alone can surface.
            metacritic: `${MIN_METACRITIC},100`
        });

        if (!data.results || data.results.length === 0) break;

        slugs.push(...data.results.map((g) => g.slug).filter(Boolean));

        if (!data.next) break;
        page += 1;
        await sleep(REQUEST_DELAY_MS);
    }

    return slugs.slice(0, TARGET_COUNT);
}

async function main() {
    if (!process.env.RAWG_API_KEY) {
        console.error('Missing RAWG_API_KEY in the environment.');
        process.exit(1);
    }

    console.log(`Populating cache with up to ${TARGET_COUNT} games (metacritic >= ${MIN_METACRITIC})...`);

    const slugs = await fetchCandidateSlugs();
    console.log(`Found ${slugs.length} candidate games.`);

    let newlyCached = 0;
    let alreadyCached = 0;
    let failed = 0;

    for (const slug of slugs) {
        const existing = await prisma.game.findUnique({ where: { slug } });
        if (existing) {
            alreadyCached++;
            continue;
        }

        try {
            const gameData = await rawg.getGame(slug);

            if (!gameData) {
                console.warn(`No detail found for ${slug}, skipping.`);
                continue;
            }

            await saveGameToCache(prisma, gameData, slug);
            newlyCached++;
            console.log(`[${newlyCached}] cached ${slug}`);
        } catch (error) {
            failed++;
            console.error(`Failed to cache ${slug}:`, error.message);
        }

        await sleep(REQUEST_DELAY_MS);
    }

    const requestsUsed = Math.ceil(slugs.length / PAGE_SIZE) + newlyCached + failed;
    console.log(`Done. Newly cached: ${newlyCached}, already had: ${alreadyCached}, failed: ${failed}.`);
    console.log(`Approx. RAWG requests used this run: ${requestsUsed}.`);
    await prisma.$disconnect();
}

main();
