// Wikipedia REST/Action API — public, no API key. Wikipedia's API etiquette
// policy asks for a descriptive User-Agent identifying the app, so every
// request sends one (unrelated to authentication — just good citizenship).
//
// Content pulled here is CC BY-SA: any page that displays wikipediaExtract
// MUST link back to wikipediaUrl for attribution.

const USER_AGENT = 'PixelScry/1.0 (https://pixelscry.com; game database)';

async function fetchJson(url) {
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!response.ok) throw new Error(`Wikipedia request to ${url} failed with ${response.status}`);
    return response.json();
}

// Full-text search biased toward the "X (video game)" disambiguation
// pattern most game articles use, rather than opensearch's prefix
// matching — reduces false positives against unrelated same-named topics.
async function searchTitle(gameName) {
    const query = `"${gameName}" video game`;
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    const data = await fetchJson(url);
    return data.query?.search?.[0]?.title ?? null;
}

export async function findWikipediaSummary(gameName) {
    const title = await searchTitle(gameName);
    if (!title) return null;

    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const summary = await fetchJson(url);

    // Skip disambiguation pages and stub-length extracts — not useful
    // enrichment, and more likely to be a mismatch than real content.
    if (summary.type === 'disambiguation' || !summary.extract || summary.extract.length < 40) {
        return null;
    }

    return {
        title: summary.title,
        extract: summary.extract,
        url: summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
    };
}
