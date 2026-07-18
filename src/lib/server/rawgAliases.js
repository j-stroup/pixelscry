// Maps the short genre/platform words users type in the y:/genre:/platform:
// search syntax to RAWG's actual genre slugs and numeric platform IDs.
// RAWG's genres filter takes a slug, and platforms filter takes a numeric
// ID — neither does fuzzy text matching the way IGDB's `~ *"val"*` did, so
// unmatched input is dropped rather than sent through (verified against
// RAWG's /genres and /platforms reference lists on 2026-07-17).

export const GENRE_SLUG_ALIASES = {
    action: 'action',
    indie: 'indie',
    adventure: 'adventure',
    rpg: 'role-playing-games-rpg',
    strategy: 'strategy',
    shooter: 'shooter',
    casual: 'casual',
    simulation: 'simulation',
    puzzle: 'puzzle',
    arcade: 'arcade',
    platform: 'platformer', // matches the homepage dropdown's legacy value
    platformer: 'platformer',
    mmo: 'massively-multiplayer',
    racing: 'racing',
    sports: 'sports',
    fighting: 'fighting',
    family: 'family',
    card: 'card',
    educational: 'educational'
};

export const PLATFORM_ID_ALIASES = {
    pc: 4,
    ps5: 187,
    ps4: 18,
    xbox: 186, // Xbox Series S/X — matches the homepage dropdown's legacy value
    'xbox-one': 1,
    switch: 7,
    ios: 3,
    android: 21,
    mac: 5,
    linux: 6
};

export function resolveGenreSlug(value) {
    return GENRE_SLUG_ALIASES[value.toLowerCase()] || null;
}

export function resolvePlatformId(value) {
    return PLATFORM_ID_ALIASES[value.toLowerCase()] || null;
}
