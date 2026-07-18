import { rawg } from '$lib/server/rawg.js';
import { sanitizeSearchText } from '$lib/server/rawgClient.js';
import { resolveGenreSlug, resolvePlatformId } from '$lib/server/rawgAliases.js';
import { parseSearch } from '$lib/searchParser.js';

export async function load({ url }) {
    const query = url.searchParams.get('q') || '';
    if (!query) return { results: [], query, parsed: null };

    const parsed = parseSearch(query);

    let dates = null;
    let metacriticMin = null;
    let metacriticMax = null;
    let genreSlug = null;
    let platformId = null;

    parsed.filters.forEach((f) => {
        if (f.key === 'y' && f.op === ':' && /^\d{4}$/.test(f.val)) {
            // Convert year (e.g., y:2020) to a RAWG release-date range
            dates = `${f.val}-01-01,${f.val}-12-31`;
        } else if (f.key === 'rating' && Number.isFinite(Number(f.val))) {
            const value = Number(f.val);
            if (f.op === '<' || f.op === '<=') {
                metacriticMax = value;
            } else {
                // ':' and '>'/'>=' all mean "at least this rating"
                metacriticMin = value;
            }
        } else if (f.key === 'genre') {
            genreSlug = resolveGenreSlug(f.val);
        } else if (f.key === 'platform') {
            platformId = resolvePlatformId(f.val);
        }
    });

    const safeText = sanitizeSearchText(parsed.text);

    try {
        const params = {
            page_size: 48,
            search: safeText || undefined,
            dates: dates || undefined,
            genres: genreSlug || undefined,
            platforms: platformId || undefined,
            metacritic:
                metacriticMin || metacriticMax
                    ? `${metacriticMin ?? 0},${metacriticMax ?? 100}`
                    : undefined,
            // If we have filters but no text, we need something to sort by.
            ordering: safeText ? undefined : '-metacritic'
        };

        const data = await rawg.listGames(params);

        return {
            results: data.results,
            query,
            parsed // Returning this so we can show the user how we understood their query
        };
    } catch (error) {
        console.error(error);
        return { results: [], query, parsed, error: 'Network or server error occurred.' };
    }
}
