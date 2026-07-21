// RAWG gives two ratings: `metacritic` (0-100 critic score, often null for
// lesser-known titles) and `rating` (0-5 user average, always present once
// a game has reviews). Prefer metacritic since it matches the 0-100 scale
// the rest of the UI expects; fall back to the user rating scaled up.
export function getDisplayRating(game) {
    if (game?.metacritic) return game.metacritic;
    if (game?.rating) return Math.round(game.rating * 20);
    return null;
}

// Used for "Best of" ranked ledgers, where a single game's spotlight badge
// (getDisplayRating) isn't the right signal — a mediocre-but-reviewed game
// shouldn't outrank a beloved one just because it's the only score present.
// Blends both scales (0-100) when both exist, weighted toward the critic
// score since it's the more standardized measure; falls back to whichever
// single score is available, same as getDisplayRating.
const CRITIC_WEIGHT = 0.6;
const USER_WEIGHT = 0.4;

// A "curated ledger" reads as a shortlist, not an exhaustive dump — every
// ranked "Best of" page caps its list to this many entries.
export const MAX_RANKED_GAMES = 30;

export function getBestOfScore(game) {
    const metacritic = game?.metacritic || null;
    const userScore = game?.rating ? game.rating * 20 : null;

    if (metacritic && userScore) {
        return Math.round(metacritic * CRITIC_WEIGHT + userScore * USER_WEIGHT);
    }
    return metacritic || userScore || null;
}

export function getReleaseYear(game) {
    if (!game?.released) return null;
    const year = new Date(game.released).getFullYear();
    return Number.isFinite(year) ? year : null;
}
