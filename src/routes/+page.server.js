import { rawg } from '$lib/server/rawg.js';
import { sanitizeSearchText } from '$lib/server/rawgClient.js';
import { resolveGenreSlug, resolvePlatformId } from '$lib/server/rawgAliases.js';
import { prisma } from '$lib/server/db.js';
import { getPopularTags } from '$lib/server/tags.js';
import { slugifyTag, resolveSortValue } from '$lib/filterOptions.js';

const MAX_DROPDOWN_TAGS = 20;

export async function load({ url, setHeaders }) {
    // TELL THE BROWSER & CDN TO CACHE THIS PAGE FOR 1 HOUR (3600 seconds)
    setHeaders({
        'Cache-Control': 'public, max-age=3600'
    });

    const searchQuery = sanitizeSearchText(url.searchParams.get('q') || '');
    const platformParam = url.searchParams.get('platform') || '';
    const genreParam = url.searchParams.get('genre') || '';

    const genreSlug = genreParam ? resolveGenreSlug(genreParam) : null;
    const platformId = platformParam ? resolvePlatformId(platformParam) : null;
    const sort = resolveSortValue(url.searchParams.get('sort'));

    // Pagination logic
    const page = parseInt(url.searchParams.get('page')) || 1;
    const pageSize = 24;

    try {
        const params = {
            page,
            page_size: pageSize,
            genres: genreSlug || undefined,
            platforms: platformId || undefined
        };

        if (searchQuery) {
            params.search = searchQuery;
            if (sort) params.ordering = sort;
        } else {
            // Default browse: only well-reviewed games (a quality floor,
            // independent of sort choice), ranked by critic score unless
            // the user picked a different sort.
            // (Sorting by raw user rating alone surfaces low-sample/NSFW titles —
            // see rawgClient.js comments.)
            params.ordering = sort || '-metacritic';
            params.metacritic = '70,100';
        }

        const [data, popularTags] = await Promise.all([
            rawg.listGames(params),
            getPopularTags(prisma)
        ]);

        return {
            success: true,
            games: data.results,
            searchState: { q: searchQuery, platform: platformParam, genre: genreParam, page, sort },
            hasMore: Boolean(data.next),
            popularTags: popularTags
                .slice(0, MAX_DROPDOWN_TAGS)
                .map((t) => ({ name: t.name, slug: slugifyTag(t.name) }))
        };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Network or server error occurred.' };
    }
}
