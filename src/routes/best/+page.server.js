import { prisma } from '$lib/server/db.js';
import { getPopularGenrePlatformCombos } from '$lib/server/genrePlatformCombos.js';

// Caps how many combos the hub links out to directly — the rest are still
// indexed via sitemap.xml, just not surfaced here to keep the page scannable.
const MAX_COMBOS_SHOWN = 40;

export async function load({ setHeaders }) {
    setHeaders({ 'Cache-Control': 'public, max-age=3600' });

    const [genres, platforms, combos] = await Promise.all([
        prisma.genre.findMany({
            include: { _count: { select: { games: true } } },
            orderBy: { name: 'asc' }
        }),
        prisma.platform.findMany({
            include: { _count: { select: { games: true } } },
            orderBy: { name: 'asc' }
        }),
        getPopularGenrePlatformCombos(prisma)
    ]);

    return {
        genres: genres.map((g) => ({ name: g.name, count: g._count.games })),
        platforms: platforms.map((p) => ({ name: p.name, count: p._count.games })),
        combos: combos.slice(0, MAX_COMBOS_SHOWN)
    };
}
