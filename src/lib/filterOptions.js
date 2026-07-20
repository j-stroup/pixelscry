// Canonical filter option lists, shared between the homepage dropdowns
// (client) and the RAWG alias resolvers (server) so there's one source of
// truth instead of two lists that can drift out of sync.

export const PLATFORM_OPTIONS = [
    { value: 'pc', label: 'PC', rawgId: 4 },
    { value: 'ps5', label: 'PlayStation 5', rawgId: 187 },
    { value: 'ps4', label: 'PlayStation 4', rawgId: 18 },
    { value: 'xbox', label: 'Xbox Series X|S', rawgId: 186 },
    { value: 'xbox-one', label: 'Xbox One', rawgId: 1 },
    { value: 'switch', label: 'Nintendo Switch', rawgId: 7 },
    { value: 'ios', label: 'iOS', rawgId: 3 },
    { value: 'android', label: 'Android', rawgId: 21 },
    { value: 'mac', label: 'macOS', rawgId: 5 },
    { value: 'linux', label: 'Linux', rawgId: 6 }
];

export const GENRE_OPTIONS = [
    { value: 'action', label: 'Action', rawgSlug: 'action' },
    { value: 'adventure', label: 'Adventure', rawgSlug: 'adventure' },
    { value: 'rpg', label: 'RPG', rawgSlug: 'role-playing-games-rpg' },
    { value: 'shooter', label: 'Shooter', rawgSlug: 'shooter' },
    { value: 'strategy', label: 'Strategy', rawgSlug: 'strategy' },
    { value: 'simulation', label: 'Simulation', rawgSlug: 'simulation' },
    { value: 'puzzle', label: 'Puzzle', rawgSlug: 'puzzle' },
    { value: 'arcade', label: 'Arcade', rawgSlug: 'arcade' },
    { value: 'platformer', label: 'Platformer', rawgSlug: 'platformer' },
    { value: 'racing', label: 'Racing', rawgSlug: 'racing' },
    { value: 'sports', label: 'Sports', rawgSlug: 'sports' },
    { value: 'fighting', label: 'Fighting', rawgSlug: 'fighting' },
    { value: 'mmo', label: 'MMO', rawgSlug: 'massively-multiplayer' },
    { value: 'indie', label: 'Indie', rawgSlug: 'indie' },
    { value: 'casual', label: 'Casual', rawgSlug: 'casual' },
    { value: 'family', label: 'Family', rawgSlug: 'family' },
    { value: 'card', label: 'Card', rawgSlug: 'card' },
    { value: 'educational', label: 'Educational', rawgSlug: 'educational' }
];

// Coarse decade buckets rather than a free-form year picker — enough to
// narrow results meaningfully without building a custom range widget.
export const YEAR_OPTIONS = [
    { value: '2026-2026', label: '2026' },
    { value: '2020-2025', label: '2020 – 2025' },
    { value: '2010-2019', label: '2010s' },
    { value: '2000-2009', label: '2000s' },
    { value: '1970-1999', label: "90s & Earlier" }
];

// RAWG's `ordering` param — a leading "-" means descending.
export const SORT_OPTIONS = [
    { value: '-metacritic', label: 'Highest Rated' },
    { value: '-added', label: 'Most Popular' },
    { value: '-released', label: 'Newest' },
    { value: 'released', label: 'Oldest' },
    { value: 'name', label: 'Name (A–Z)' },
    { value: '-name', label: 'Name (Z–A)' }
];

export function resolveSortValue(value) {
    return SORT_OPTIONS.some((o) => o.value === value) ? value : null;
}

// Best-effort match against RAWG's own tag slugs (lowercase, hyphenated).
// Good enough for the common case; an occasional mismatch on an unusual
// tag name just yields zero results for that one filter, not a crash.
export function slugifyTag(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
