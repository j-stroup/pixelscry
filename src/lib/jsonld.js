import { SITE_URL, SITE_NAME } from './siteConfig.js';
import { getDisplayRating } from './gameDisplay.js';

// <script> tag contents are parsed as raw text by the browser (and by
// Svelte, which doesn't interpolate {expressions} inside a nested <script>
// element) — so JSON-LD has to be injected via {@html}. Escaping every "<"
// as a unicode escape neutralizes any "</script>" (or other tag) sequence
// that might appear inside a game description/name, while remaining valid
// JSON since \uXXXX is a legal JSON string escape.
export function jsonLdScriptTag(schema) {
    const json = JSON.stringify(schema).replace(/</g, '\\u003c');
    return `<script type="application/ld+json">${json}<\/script>`;
}

export function buildWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    };
}

export function buildVideoGameSchema(game, url) {
    const platforms = (game.platforms || []).map((p) => p.platform?.name).filter(Boolean);
    const genres = (game.genres || []).map((g) => g.name);
    const ratingCount =
        game.ratings_count || (game.ratings || []).reduce((sum, r) => sum + (r.count || 0), 0);
    const displayRating = getDisplayRating(game);

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: game.name,
        url
    };

    if (game.description_raw) schema.description = game.description_raw;
    if (game.background_image) schema.image = game.background_image;
    if (genres.length) schema.genre = genres;
    if (platforms.length) schema.gamePlatform = platforms;
    if (game.released) schema.datePublished = game.released;
    if (game.publishers?.[0]?.name) {
        schema.publisher = { '@type': 'Organization', name: game.publishers[0].name };
    }
    if (game.developers?.[0]?.name) {
        schema.author = { '@type': 'Organization', name: game.developers[0].name };
    }
    if (game.esrb_rating?.name) schema.contentRating = game.esrb_rating.name;

    // Only include real, non-fabricated ratings — Google's guidelines flag
    // aggregateRating without a genuine backing count.
    if (displayRating && ratingCount > 0) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: displayRating,
            bestRating: 100,
            worstRating: 0,
            ratingCount
        };
    }

    return schema;
}

// Used for category/genre/platform/tag/year list pages — caps at 50 items
// so the JSON-LD payload doesn't balloon on large lists.
export function buildItemListSchema({ name, url, items }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        url,
        numberOfItems: items.length,
        itemListElement: items.slice(0, 50).map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: item.url,
            name: item.name
        }))
    };
}
