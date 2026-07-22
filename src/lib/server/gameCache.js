import { extractAccentColor } from './accentColor.js';
import { findSteamAppId, getAppDetails } from './steamClient.js';
import { findWikipediaSummary } from './wikipediaClient.js';

// A cached game older than this is served as-is but triggers a
// background-free, synchronous refresh from RAWG on next visit — keeps
// scores/descriptions/art from going permanently stale without re-fetching
// on every single page load.
const STALE_AFTER_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function isStale(lastUpdated) {
    return Date.now() - new Date(lastUpdated).getTime() > STALE_AFTER_MS;
}

// Steam/Wikipedia enrichment is best-effort — a failed lookup (no match,
// network hiccup) just means those fields stay null, it never blocks the
// core RAWG cache write.
async function findSteamEnrichment(gameData) {
    const onSteam = (gameData.stores || []).some((s) => s.store?.slug === 'steam');
    if (!onSteam) return { steamAppId: null, steamData: null };

    try {
        const appId = await findSteamAppId(gameData.name);
        if (!appId) return { steamAppId: null, steamData: null };

        const details = await getAppDetails(appId);
        return { steamAppId: appId, steamData: details ? JSON.stringify(details) : null };
    } catch (error) {
        console.error(`Steam enrichment failed for "${gameData.name}":`, error.message);
        return { steamAppId: null, steamData: null };
    }
}

async function findWikipediaEnrichment(gameData) {
    try {
        const summary = await findWikipediaSummary(gameData.name);
        if (!summary) return { wikipediaUrl: null, wikipediaExtract: null };
        return { wikipediaUrl: summary.url, wikipediaExtract: summary.extract };
    } catch (error) {
        console.error(`Wikipedia enrichment failed for "${gameData.name}":`, error.message);
        return { wikipediaUrl: null, wikipediaExtract: null };
    }
}

// Pure (no $env import) so it can be called from both app routes and
// standalone scripts, each passing in their own PrismaClient instance.
export async function saveGameToCache(prisma, gameData, fallbackSlug) {
    const slug = gameData.slug || fallbackSlug;
    const name = gameData.name || 'Unknown Title';
    const accentColor = await extractAccentColor(gameData.background_image);

    const [{ steamAppId, steamData }, { wikipediaUrl, wikipediaExtract }] = await Promise.all([
        findSteamEnrichment(gameData),
        findWikipediaEnrichment(gameData)
    ]);

    const genreConnects = (gameData.genres || []).map((genre) => ({
        where: { nameLower: genre.name.toLowerCase() },
        create: { nameLower: genre.name.toLowerCase(), name: genre.name }
    }));

    // RAWG nests platform info one level deeper than IGDB did:
    // platforms: [{ platform: { name, slug, ... }, released_at }]
    const platformConnects = (gameData.platforms || [])
        .map((p) => p.platform?.name)
        .filter(Boolean)
        .map((platformName) => ({
            where: { nameLower: platformName.toLowerCase() },
            create: { nameLower: platformName.toLowerCase(), name: platformName }
        }));

    // English-only — RAWG's tags are community-submitted across many
    // languages, so keeping just one locale avoids fragmenting the same
    // real-world tag (e.g. "Co-op" / "Кооператив") into separate rows.
    const tagConnects = (gameData.tags || [])
        .filter((t) => t.language === 'eng')
        .map((tag) => ({
            where: { nameLower: tag.name.toLowerCase() },
            create: { nameLower: tag.name.toLowerCase(), name: tag.name }
        }));

    const publisherConnects = (gameData.publishers || [])
        .map((publisher) => publisher.name)
        .filter(Boolean)
        .map((publisherName) => ({
            where: { nameLower: publisherName.toLowerCase() },
            create: { nameLower: publisherName.toLowerCase(), name: publisherName }
        }));

    return prisma.game.upsert({
        where: { slug },
        create: {
            slug,
            name,
            rawg_data: JSON.stringify(gameData),
            accentColor,
            steamAppId,
            steamData,
            wikipediaUrl,
            wikipediaExtract,
            genres: { connectOrCreate: genreConnects },
            platforms: { connectOrCreate: platformConnects },
            tags: { connectOrCreate: tagConnects },
            publishers: { connectOrCreate: publisherConnects }
        },
        update: {
            name,
            rawg_data: JSON.stringify(gameData),
            accentColor,
            steamAppId,
            steamData,
            wikipediaUrl,
            wikipediaExtract,
            genres: { connectOrCreate: genreConnects },
            platforms: { connectOrCreate: platformConnects },
            tags: { connectOrCreate: tagConnects },
            publishers: { connectOrCreate: publisherConnects }
        }
    });
}
