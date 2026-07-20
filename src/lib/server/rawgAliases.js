// Maps the short genre/platform words users type or select in the
// y:/genre:/platform: search syntax to RAWG's actual genre slugs and
// numeric platform IDs. RAWG's genres filter takes a slug, and platforms
// filter takes a numeric ID — neither does fuzzy text matching the way
// IGDB's `~ *"val"*` did, so unmatched input is dropped rather than sent
// through (verified against RAWG's /genres and /platforms reference lists
// on 2026-07-17).
//
// The canonical value/label lists live in $lib/filterOptions.js (shared
// with the homepage dropdowns); this file just builds the lookup maps
// from them.

import { GENRE_OPTIONS, PLATFORM_OPTIONS } from '../filterOptions.js';

export const GENRE_SLUG_ALIASES = Object.fromEntries(
    GENRE_OPTIONS.map((g) => [g.value, g.rawgSlug])
);
// Legacy alias from before the dropdown had a dedicated "platformer" entry.
GENRE_SLUG_ALIASES.platform = 'platformer';

export const PLATFORM_ID_ALIASES = Object.fromEntries(
    PLATFORM_OPTIONS.map((p) => [p.value, p.rawgId])
);

export function resolveGenreSlug(value) {
    return GENRE_SLUG_ALIASES[value.toLowerCase()] || null;
}

export function resolvePlatformId(value) {
    return PLATFORM_ID_ALIASES[value.toLowerCase()] || null;
}
