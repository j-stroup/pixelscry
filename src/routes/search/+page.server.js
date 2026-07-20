import { rawg } from '$lib/server/rawg.js';
import { sanitizeSearchText } from '$lib/server/rawgClient.js';
import { resolveGenreSlug, resolvePlatformId } from '$lib/server/rawgAliases.js';
import { resolveSortValue } from '$lib/filterOptions.js';
import { parseSearch } from '$lib/searchParser.js';

export async function load({ url }) {
    const query = url.searchParams.get('q') || '';
    const sort = resolveSortValue(url.searchParams.get('sort'));
    if (!query) return { results: [], query, parsed: null, sort };

    const parsed = parseSearch(query);

    let dates = null;
    let metacriticMin = null;
    let metacriticMax = null;
    let genreSlug = null;
    let platformId = null;
    let tagSlug = null;
    let excludeAdditions = false;

    parsed.filters.forEach((f) => {
        if (f.key === 'y' && f.op === ':') {
            const rangeMatch = f.val.match(/^(\d{4})-(\d{4})$/);
            const yearMatch = f.val.match(/^\d{4}$/);
            if (rangeMatch) {
                // y:2018-2022 — a decade-bucket or custom range
                dates = `${rangeMatch[1]}-01-01,${rangeMatch[2]}-12-31`;
            } else if (yearMatch) {
                // y:2020 — a single year
                dates = `${f.val}-01-01,${f.val}-12-31`;
            }
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
        } else if (f.key === 'tag' && /^[a-z0-9-]+$/.test(f.val)) {
            // Passed straight through as a RAWG tag slug (see
            // slugifyTag() in $lib/filterOptions.js) — no alias table
            // needed since the dropdown already emits RAWG-shaped slugs.
            tagSlug = f.val;
        } else if (f.key === 'dlc' && f.val === 'no') {
            excludeAdditions = true;
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
            tags: tagSlug || undefined,
            exclude_additions: excludeAdditions || undefined,
            metacritic:
                metacriticMin || metacriticMax
                    ? `${metacriticMin ?? 0},${metacriticMax ?? 100}`
                    : undefined,
            // An explicit sort choice always wins; otherwise fall back to
            // relevance for text searches or top-rated for filter-only ones.
            ordering: sort || (safeText ? undefined : '-metacritic')
        };

        const data = await rawg.listGames(params);

        return {
            results: data.results,
            query,
            parsed, // Returning this so we can show the user how we understood their query
            sort
        };
    } catch (error) {
        console.error(error);
        return { results: [], query, parsed, sort, error: 'Network or server error occurred.' };
    }
}
