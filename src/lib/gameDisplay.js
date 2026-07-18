// RAWG gives two ratings: `metacritic` (0-100 critic score, often null for
// lesser-known titles) and `rating` (0-5 user average, always present once
// a game has reviews). Prefer metacritic since it matches the 0-100 scale
// the rest of the UI expects; fall back to the user rating scaled up.
export function getDisplayRating(game) {
    if (game?.metacritic) return game.metacritic;
    if (game?.rating) return Math.round(game.rating * 20);
    return null;
}

export function getReleaseYear(game) {
    if (!game?.released) return null;
    const year = new Date(game.released).getFullYear();
    return Number.isFinite(year) ? year : null;
}
