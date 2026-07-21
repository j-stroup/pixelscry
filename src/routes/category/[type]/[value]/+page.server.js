import { prisma } from '$lib/server/db.js';
import { getBestOfScore, MAX_RANKED_GAMES } from '$lib/gameDisplay.js';

const RELATION_MODELS = { genre: 'genre', platform: 'platform', tag: 'tag', publisher: 'publisher' };

// Genre/platform/tag pages are ranked "Best of" ledgers; publisher pages
// stay a plain browsable filmography — "best Electronic Arts games" isn't
// really what a publisher page is for.
const RANKED_TYPES = new Set(['genre', 'platform', 'tag']);

export async function load({ params }) {
    const { type, value } = params;
    const nameLower = value.toLowerCase();

    // Query only the games belonging to this genre/platform/tag via the
    // relation, instead of loading the entire cache and filtering parsed
    // JSON in JS.
    const modelKey = RELATION_MODELS[type];
    let matchedGames = [];

    if (modelKey) {
        const entry = await prisma[modelKey].findUnique({
            where: { nameLower },
            include: { games: true }
        });
        matchedGames = entry?.games ?? [];
    }

    // Parse the JSON data back into objects and ensure the slug is attached
    let games = matchedGames.map((g) => {
        const parsedGame = JSON.parse(g.rawg_data);
        parsedGame.slug = g.slug;
        return parsedGame;
    });

    // Cross-filter facets — derived from the actual result set (not the
    // full reference list) so every facet link is guaranteed non-empty.
    // Only genre<->platform combo pages exist so far, so facets are only
    // computed for those two types.
    const facets = computeFacets(type, games);

    const ranked = RANKED_TYPES.has(type);
    const totalCount = games.length;

    if (ranked) {
        // Unrated titles sort last rather than being treated as a 0 — a
        // missing score isn't evidence of a bad game.
        games = [...games]
            .sort((a, b) => (getBestOfScore(b) ?? -1) - (getBestOfScore(a) ?? -1))
            .slice(0, MAX_RANKED_GAMES);
    }

    return {
        category: `${type}: ${value}`,
        type,
        value,
        games,
        facets,
        ranked,
        totalCount
    };
}

function computeFacets(type, games) {
    if (type === 'genre') {
        return countBy(games, (game) => (game.platforms || []).map((p) => p.platform?.name));
    }
    if (type === 'platform') {
        return countBy(games, (game) => (game.genres || []).map((g) => g.name));
    }
    return [];
}

function countBy(games, getNames) {
    const counts = new Map();

    for (const game of games) {
        for (const name of getNames(game)) {
            if (!name) continue;
            counts.set(name, (counts.get(name) || 0) + 1);
        }
    }

    return [...counts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}
