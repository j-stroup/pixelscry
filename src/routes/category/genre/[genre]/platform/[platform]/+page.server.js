import { prisma } from '$lib/server/db.js';

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

    const games = rows.map((g) => {
        const parsedGame = JSON.parse(g.rawg_data);
        parsedGame.slug = g.slug;
        return parsedGame;
    });

    return { genre, platform, games };
}
