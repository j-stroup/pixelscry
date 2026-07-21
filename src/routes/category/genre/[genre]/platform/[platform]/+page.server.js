import { prisma } from '$lib/server/db.js';
import { getBestOfScore, MAX_RANKED_GAMES } from '$lib/gameDisplay.js';

export async function load({ params }) {
    const { genre, platform } = params;
    const genreLower = genre.toLowerCase();
    const platformLower = platform.toLowerCase();

    const rows = await prisma.game.findMany({
        where: {
            genres: { some: { nameLower: genreLower } },
            platforms: { some: { nameLower: platformLower } }
        }
    });

    const ranked = rows
        .map((g) => {
            const parsedGame = JSON.parse(g.rawg_data);
            parsedGame.slug = g.slug;
            return parsedGame;
        })
        // Unrated titles sort last rather than being treated as a 0 — a
        // missing score isn't evidence of a bad game.
        .sort((a, b) => (getBestOfScore(b) ?? -1) - (getBestOfScore(a) ?? -1));

    return {
        genre,
        platform,
        games: ranked.slice(0, MAX_RANKED_GAMES),
        totalCount: ranked.length
    };
}
