// Steam Web/Storefront API — all three endpoints used here are public and
// require no API key (confirmed 2026-07-21 against the live API). Pure
// module (no $env import) so it's usable from both app routes and
// standalone scripts.
//
// findSteamAppId() is a best-effort name match, not an authoritative
// lookup — Steam's storesearch is a general search endpoint, not a game
// database keyed the way RAWG's slugs are. Only an exact (case-insensitive)
// name match is accepted; anything else is treated as "no match" rather
// than guessing, since a wrong appid would misattribute price/DLC/player
// data to the wrong game.

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Steam request to ${url} failed with ${response.status}`);
    return response.json();
}

// Word-boundary roman-numeral -> arabic conversion (RAWG favors "Baldur's
// Gate III", Steam's own listing is often "Baldur's Gate 3") — longest
// tokens first so e.g. "viii" isn't partially matched by "iii".
const ROMAN_NUMERALS = [
    ['viii', '8'], ['vii', '7'], ['iii', '3'], ['ii', '2'],
    ['iv', '4'], ['vi', '6'], ['ix', '9'], ['x', '10'], ['v', '5']
];

function normalizeName(name) {
    let result = name
        .replace(/[™®©]/g, '')
        .replace(/[’‘]/g, "'")
        .replace(/[–—]/g, '-')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

    for (const [roman, arabic] of ROMAN_NUMERALS) {
        result = result.replace(new RegExp(`\\b${roman}\\b`, 'g'), arabic);
    }

    return result;
}

export async function findSteamAppId(gameName) {
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(gameName)}&cc=us&l=en`;
    const data = await fetchJson(url);

    const normalizedTarget = normalizeName(gameName);
    const match = (data.items || []).find(
        (item) => item.type === 'app' && normalizeName(item.name) === normalizedTarget
    );

    return match?.id ?? null;
}

// Price/DLC snapshot — cached alongside the rest of the game record and
// refreshed on the normal 30-day cycle, not fetched live.
export async function getAppDetails(appId) {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us`;
    const data = await fetchJson(url);
    const entry = data[String(appId)];

    if (!entry?.success || !entry.data) return null;

    const { data: app } = entry;

    return {
        isFree: Boolean(app.is_free),
        priceFinal: app.price_overview?.final_formatted || null,
        discountPercent: app.price_overview?.discount_percent || 0,
        dlcCount: Array.isArray(app.dlc) ? app.dlc.length : 0
    };
}

// Deliberately NOT cached — fetched live on each game page view, since a
// stored player count would be stale within minutes.
export async function getCurrentPlayers(appId) {
    const url = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`;
    const data = await fetchJson(url);
    return data?.response?.result === 1 ? data.response.player_count : null;
}
