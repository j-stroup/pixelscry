import { AMAZON_ASSOCIATE_TAG, EBAY_CAMPAIGN_ID } from '$env/static/private';
import { prisma } from '$lib/server/db.js';
import { buildBuyLinks } from '$lib/server/affiliateLinks.js';

const MAX_SLUGS = 200;
const MAX_SUGGESTIONS = 24;

export async function GET({ url }) {
    const requested = (url.searchParams.get('slugs') || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, MAX_SLUGS);

    if (requested.length === 0) {
        return Response.json({ owned: [], suggestions: [], stats: emptyStats() });
    }

    const rows = await prisma.game.findMany({
        where: { slug: { in: requested } }
    });

    const ownedGames = rows.map((row) => JSON.parse(row.rawg_data));
    const ownedSlugs = new Set(ownedGames.map((g) => g.slug));

    // RAWG doesn't expose franchise/similar-game relations on the free
    // tier, so suggestions are computed entirely from our own cache: other
    // cached games sharing a genre with the collection, ranked by how many
    // of their genres overlap with the genres represented in the
    // collection. Zero extra API cost, and gets better as the cache grows.
    const ownedGenreSlugs = new Set();
    for (const game of ownedGames) {
        for (const g of game.genres || []) ownedGenreSlugs.add(g.name.toLowerCase());
    }

    let suggestions = [];

    if (ownedGenreSlugs.size > 0) {
        const candidateRows = await prisma.game.findMany({
            where: {
                slug: { notIn: [...ownedSlugs] },
                genres: { some: { nameLower: { in: [...ownedGenreSlugs] } } }
            }
        });

        suggestions = candidateRows
            .map((row) => {
                const data = JSON.parse(row.rawg_data);
                const overlap = (data.genres || []).filter((g) =>
                    ownedGenreSlugs.has(g.name.toLowerCase())
                ).length;
                return { data, overlap };
            })
            .sort((a, b) => b.overlap - a.overlap)
            .slice(0, MAX_SUGGESTIONS)
            .map(({ data }) => ({
                slug: data.slug,
                name: data.name,
                background_image: data.background_image,
                buyLinks: buildBuyLinks({
                    amazonTag: AMAZON_ASSOCIATE_TAG,
                    ebayCampaignId: EBAY_CAMPAIGN_ID,
                    gameName: data.name
                })
            }));
    }

    return Response.json({
        owned: ownedGames.map((g) => ({
            slug: g.slug,
            name: g.name,
            background_image: g.background_image,
            platforms: g.platforms || [],
            genres: g.genres || []
        })),
        suggestions,
        stats: computeStats(ownedGames)
    });
}

function emptyStats() {
    return { totalOwned: 0, backlogHours: 0, genreCount: 0 };
}

function computeStats(ownedGames) {
    const genres = new Set();
    let backlogHours = 0;

    for (const game of ownedGames) {
        for (const g of game.genres || []) genres.add(g.name);
        backlogHours += game.playtime || 0;
    }

    return {
        totalOwned: ownedGames.length,
        backlogHours,
        genreCount: genres.size
    };
}
