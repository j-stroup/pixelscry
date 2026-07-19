import { AMAZON_ASSOCIATE_TAG, EBAY_CAMPAIGN_ID } from '$env/static/private';
import { prisma } from '$lib/server/db.js';
import { rawg } from '$lib/server/rawg.js';
import { saveGameToCache } from '$lib/server/gameCache.js';
import { buildBuyLinks } from '$lib/server/affiliateLinks.js';
import { sanitizeDescription, htmlToPlainText } from '$lib/server/sanitizeDescription.js';

export async function load({ params, setHeaders }) {
    const { slug } = params;
    setHeaders({ 'Cache-Control': 'public, max-age=3600' });

    try {
        let gameData;
        let accentColor;

        // ==============================================================
        // STEP 1: THE LOCAL CHECK (Fast Path)
        // ==============================================================
        const localGame = await prisma.game.findUnique({
            where: { slug: slug }
        });

        if (localGame) {
            // Parse the stored string back into a JSON object and serve it instantly
            gameData = JSON.parse(localGame.rawg_data);
            accentColor = localGame.accentColor;
        } else {
            // ==============================================================
            // STEP 2: THE API FETCH (Cache Miss)
            // ==============================================================
            gameData = await rawg.getGame(slug);

            if (!gameData) return { success: false, error: 'Game not found in the void.', slug };

            // ==============================================================
            // STEP 3: THE INCREMENTAL SAVE
            // ==============================================================
            const saved = await saveGameToCache(prisma, gameData, slug);
            accentColor = saved.accentColor;
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

        return {
            success: true,
            game: gameData,
            accentColor: accentColor || '255, 176, 32',
            descriptionHtml: sanitizeDescription(gameData.description),
            descriptionText: htmlToPlainText(gameData.description) || gameData.description_raw || '',
            moreLikeThis,
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
