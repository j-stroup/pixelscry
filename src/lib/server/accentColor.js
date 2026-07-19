import sharp from 'sharp';

// Computed once at cache time (see gameCache.js) rather than sampled
// client-side — a client canvas approach was tried first, but loading the
// same cross-origin image both with and without CORS mode (as happens
// when the same URL appears elsewhere on the page without crossorigin)
// makes browsers serve a cached non-CORS response and fail the canvas
// read. Doing this server-side with the raw image bytes sidesteps CORS
// entirely and is more reliable.
export async function extractAccentColor(imageUrl) {
    if (!imageUrl) return null;

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) return null;

        const buffer = Buffer.from(await response.arrayBuffer());
        const { channels } = await sharp(buffer).stats();

        let r = Math.round(channels[0].mean);
        let g = Math.round(channels[1].mean);
        let b = Math.round(channels[2].mean);

        // If the sampled color is too dark/muddy, brighten it so it still
        // reads as a real signal color instead of a gray smudge.
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 100) {
            r = Math.min(255, r + 80);
            g = Math.min(255, g + 80);
            b = Math.min(255, b + 80);
        }

        return `${r}, ${g}, ${b}`;
    } catch (error) {
        console.error(`Failed to extract accent color from ${imageUrl}:`, error.message);
        return null;
    }
}
