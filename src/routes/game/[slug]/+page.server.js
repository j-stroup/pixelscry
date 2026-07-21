import { AMAZON_ASSOCIATE_TAG, EBAY_CAMPAIGN_ID } from '$env/static/private';
import { prisma } from '$lib/server/db.js';
import { rawg } from '$lib/server/rawg.js';
import { ebay } from '$lib/server/ebay.js';
import { saveGameToCache, isStale } from '$lib/server/gameCache.js';
import { buildBuyLinks } from '$lib/server/affiliateLinks.js';
import { sanitizeDescription, htmlToPlainText } from '$lib/server/sanitizeDescription.js';

export async function load({ params, setHeaders }) {
    const { slug } = params;
    setHeaders({ 'Cache-Control': 'public, max-age=3600' });

    try {
        let gameData;
        let accentColor;
        let lastUpdated;

        // ==============================================================
        // STEP 1: THE LOCAL CHECK (Fast Path)
        // ==============================================================
        const localGame = await prisma.game.findUnique({
            where: { slug: slug }
        });

        if (localGame && !isStale(localGame.lastUpdated)) {
            // Parse the stored string back into a JSON object and serve it instantly
            gameData = JSON.parse(localGame.rawg_data);
            accentColor = localGame.accentColor;
            lastUpdated = localGame.lastUpdated;
        } else if (localGame) {
            // ==============================================================
            // STEP 2a: STALE CACHE REFRESH (cached > 30 days ago)
            // ==============================================================
            // Re-pull from RAWG so scores/descriptions/art don't go stale
            // forever. If RAWG is unreachable, serve the stale copy rather
            // than breaking the page — a slightly outdated page beats none.
            try {
                const fresh = await rawg.getGame(slug);
                if (fresh) {
                    const saved = await saveGameToCache(prisma, fresh, slug);
                    gameData = fresh;
                    accentColor = saved.accentColor;
                    lastUpdated = saved.lastUpdated;
                } else {
                    gameData = JSON.parse(localGame.rawg_data);
                    accentColor = localGame.accentColor;
                    lastUpdated = localGame.lastUpdated;
                }
            } catch (error) {
                console.error(`Failed to refresh stale cache for ${slug}:`, error.message);
                gameData = JSON.parse(localGame.rawg_data);
                accentColor = localGame.accentColor;
                lastUpdated = localGame.lastUpdated;
            }
        } else {
            // ==============================================================
            // STEP 2b: THE API FETCH (Cache Miss)
            // ==============================================================
            gameData = await rawg.getGame(slug);

            if (!gameData) return { success: false, error: 'Game not found in the void.', slug };

            // ==============================================================
            // STEP 3: THE INCREMENTAL SAVE
            // ==============================================================
            const saved = await saveGameToCache(prisma, gameData, slug);
            accentColor = saved.accentColor;
            lastUpdated = saved.lastUpdated;
        }

        // "More like this": other cached games sharing a genre, computed
        // locally at zero API cost — RAWG's own similar-games endpoint is
        // gated to paid plans. Gets better as the cache grows.
        const genreSlugs = (gameData.genres || []).map((g) => g.name.toLowerCase());
        let moreLikeThis = [];

        if (genreSlugs.length > 0) {
            const related = await prisma.game.findMany({
                where: {
                    slug: { not: gameData.slug },
                    genres: { some: { nameLower: { in: genreSlugs } } }
                },
                take: 12
            });
            moreLikeThis = related.map((g) => JSON.parse(g.rawg_data));
        }

        // Live eBay listing previews are a nice-to-have, not load-bearing —
        // any failure (bad credentials, sandbox quirks, network hiccup)
        // just falls back to the plain search link below.
        let ebayListings = [];
        if (ebay) {
            try {
                ebayListings = await ebay.searchItems({ query: gameData.name, limit: 6 });
            } catch (error) {
                console.error(`eBay listing search failed for "${gameData.name}":`, error.message);
            }
        }

        return {
            success: true,
            game: gameData,
            accentColor: accentColor || '255, 176, 32',
            descriptionHtml: sanitizeDescription(gameData.description),
            descriptionText: htmlToPlainText(gameData.description) || gameData.description_raw || '',
            moreLikeThis,
            ebayListings,
            lastUpdated: lastUpdated.toISOString(),
            buyLinks: buildBuyLinks({
                amazonTag: AMAZON_ASSOCIATE_TAG,
                ebayCampaignId: EBAY_CAMPAIGN_ID,
                gameName: gameData.name
            })
        };

    } catch (error) {
        console.error(error);
        return { success: false, error: 'Network or database error occurred.', slug };
    }
}
