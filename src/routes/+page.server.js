import { rawg } from '$lib/server/rawg.js';
import { sanitizeSearchText } from '$lib/server/rawgClient.js';
import { resolveGenreSlug, resolvePlatformId } from '$lib/server/rawgAliases.js';

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
        } else {
            // Default browse: only well-reviewed games, ranked by critic score.
            // (Sorting by raw user rating alone surfaces low-sample/NSFW titles —
            // see rawgClient.js comments.)
            params.ordering = '-metacritic';
            params.metacritic = '70,100';
        }

        const data = await rawg.listGames(params);

        return {
            success: true,
            games: data.results,
            searchState: { q: searchQuery, platform: platformParam, genre: genreParam, page },
            hasMore: Boolean(data.next)
        };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Network or server error occurred.' };
    }
}
