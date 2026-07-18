import { prisma } from '$lib/server/db.js';
import { SITE_URL } from '$lib/siteConfig.js';
import { getPopularTags } from '$lib/server/tags.js';
import { getPopularGenrePlatformCombos } from '$lib/server/genrePlatformCombos.js';

export async function GET() {
    const [games, genres, platforms, tags, combos] = await Promise.all([
        prisma.game.findMany({ select: { slug: true, lastUpdated: true } }),
        prisma.genre.findMany({ select: { name: true } }),
        prisma.platform.findMany({ select: { name: true } }),
        getPopularTags(prisma),
        getPopularGenrePlatformCombos(prisma)
    ]);

    const gameUrls = games.map(
        (game) => `
        <url>
            <loc>${SITE_URL}/game/${game.slug}</loc>
            <lastmod>${game.lastUpdated.toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>`
    );

    const genreUrls = genres.map(
        (genre) => `
        <url>
            <loc>${SITE_URL}/category/genre/${encodeURIComponent(genre.name)}</loc>
            <changefreq>daily</changefreq>
            <priority>0.6</priority>
        </url>`
    );

    const platformUrls = platforms.map(
        (platform) => `
        <url>
            <loc>${SITE_URL}/category/platform/${encodeURIComponent(platform.name)}</loc>
            <changefreq>daily</changefreq>
            <priority>0.6</priority>
        </url>`
    );

    const tagUrls = tags.map(
        (tag) => `
        <url>
            <loc>${SITE_URL}/category/tag/${encodeURIComponent(tag.name)}</loc>
            <changefreq>daily</changefreq>
            <priority>0.5</priority>
        </url>`
    );

    const comboUrls = combos.map(
        (combo) => `
        <url>
            <loc>${SITE_URL}/category/genre/${encodeURIComponent(combo.genre)}/platform/${encodeURIComponent(combo.platform)}</loc>
            <changefreq>daily</changefreq>
            <priority>0.5</priority>
        </url>`
    );

    const body = `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${SITE_URL}/</loc>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>${SITE_URL}/about</loc>
            <changefreq>monthly</changefreq>
            <priority>0.3</priority>
        </url>
        <url>
            <loc>${SITE_URL}/tags</loc>
            <changefreq>daily</changefreq>
            <priority>0.5</priority>
        </url>
        ${[...genreUrls, ...platformUrls, ...tagUrls, ...comboUrls, ...gameUrls].join('')}
    </urlset>`;

    return new Response(body, {
        headers: {
            'Cache-Control': 'max-age=0, s-maxage=3600',
            'Content-Type': 'application/xml'
        }
    });
}
