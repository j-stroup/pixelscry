const RAWG_BASE = 'https://api.rawg.io/api';

// Pure factory (no SvelteKit $env import) so it can be used both from app
// routes (via rawg.js, which supplies the key from $env/static/private)
// and from standalone maintenance scripts run with plain `node` (which
// supply the key from process.env instead).
export function createRawgClient({ apiKey }) {
    async function request(path, params = {}) {
        const url = new URL(`${RAWG_BASE}${path}`);
        url.searchParams.set('key', apiKey);

        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.set(key, value);
            }
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`RAWG request to ${path} failed with ${response.status}`);
        }

        return response.json();
    }

    async function getGame(slugOrId) {
        const url = new URL(`${RAWG_BASE}/games/${slugOrId}`);
        url.searchParams.set('key', apiKey);

        const response = await fetch(url.toString());

        if (response.status === 404) return null;
        if (!response.ok) {
            throw new Error(`RAWG request to /games/${slugOrId} failed with ${response.status}`);
        }

        return response.json();
    }

    return {
        // params: search, genres (slug), platforms (id), dates (YYYY-MM-DD,YYYY-MM-DD),
        // metacritic ("min,max"), ordering, page, page_size
        listGames: (params) => request('/games', params),
        getGame
    };
}

// RAWG's search is a plain REST query param (not embedded in a custom query
// language like IGDB's Apicalypse), so there's no injection surface —
// URLSearchParams handles encoding. This just trims defensively.
export function sanitizeSearchText(value) {
    return String(value).trim().slice(0, 200);
}
