// Pure (no $env import) so it can be called from both app routes and
// standalone scripts, each passing in their own PrismaClient instance.
export async function saveGameToCache(prisma, gameData, fallbackSlug) {
    const slug = gameData.slug || fallbackSlug;
    const name = gameData.name || 'Unknown Title';

    const genreConnects = (gameData.genres || []).map((genre) => ({
        where: { nameLower: genre.name.toLowerCase() },
        create: { nameLower: genre.name.toLowerCase(), name: genre.name }
    }));

    // RAWG nests platform info one level deeper than IGDB did:
    // platforms: [{ platform: { name, slug, ... }, released_at }]
    const platformConnects = (gameData.platforms || [])
        .map((p) => p.platform?.name)
        .filter(Boolean)
        .map((platformName) => ({
            where: { nameLower: platformName.toLowerCase() },
            create: { nameLower: platformName.toLowerCase(), name: platformName }
        }));

    // English-only — RAWG's tags are community-submitted across many
    // languages, so keeping just one locale avoids fragmenting the same
    // real-world tag (e.g. "Co-op" / "Кооператив") into separate rows.
    const tagConnects = (gameData.tags || [])
        .filter((t) => t.language === 'eng')
        .map((tag) => ({
            where: { nameLower: tag.name.toLowerCase() },
            create: { nameLower: tag.name.toLowerCase(), name: tag.name }
        }));

    return prisma.game.upsert({
        where: { slug },
        create: {
            slug,
            name,
            rawg_data: JSON.stringify(gameData),
            genres: { connectOrCreate: genreConnects },
            platforms: { connectOrCreate: platformConnects },
            tags: { connectOrCreate: tagConnects }
        },
        update: {
            name,
            rawg_data: JSON.stringify(gameData),
            genres: { connectOrCreate: genreConnects },
            platforms: { connectOrCreate: platformConnects },
            tags: { connectOrCreate: tagConnects }
        }
    });
}
