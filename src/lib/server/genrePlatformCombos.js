// Below this, a genre+platform combo is usually too thin to be worth a
// dedicated page (e.g. a single obscure title). Mirrors tags.js's threshold
// pattern — shared here just for sitemap generation, not live page queries
// (those always resolve on demand, however few games match).
export const MIN_COMBO_GAMES = 3;

// Computes every non-empty genre+platform pair across the cache, with a
// count, from the relation tables — no need to parse the stored JSON.
export async function getPopularGenrePlatformCombos(prisma) {
    const games = await prisma.game.findMany({
        select: {
            genres: { select: { name: true, nameLower: true } },
            platforms: { select: { name: true, nameLower: true } }
        }
    });

    const combos = new Map();

    for (const game of games) {
        for (const genre of game.genres) {
            for (const platform of game.platforms) {
                const key = `${genre.nameLower}::${platform.nameLower}`;
                const existing = combos.get(key);
                if (existing) {
                    existing.count += 1;
                } else {
                    combos.set(key, { genre: genre.name, platform: platform.name, count: 1 });
                }
            }
        }
    }

    return [...combos.values()]
        .filter((c) => c.count >= MIN_COMBO_GAMES)
        .sort((a, b) => b.count - a.count);
}
