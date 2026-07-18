// Below this, a tag is usually noise (single-game one-offs, near-duplicate
// community submissions) rather than a genuine browsable category. Shared
// between the /tags hub page and sitemap.xml so they stay in sync.
export const MIN_TAG_GAMES = 3;

export async function getPopularTags(prisma) {
    const tags = await prisma.tag.findMany({
        include: { _count: { select: { games: true } } }
    });

    return tags
        .filter((t) => t._count.games >= MIN_TAG_GAMES)
        .sort((a, b) => b._count.games - a._count.games)
        .map((t) => ({ name: t.name, count: t._count.games }));
}
