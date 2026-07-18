import sanitizeHtml from 'sanitize-html';

// RAWG's `description` field is crowdsourced HTML (imported from Wikipedia /
// storefront copy) — this is the first {@html} usage in the app, so it gets
// run through a real allowlist sanitizer rather than trusted as-is.
const OPTIONS = {
    allowedTags: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a'
    ],
    allowedAttributes: {
        a: ['href']
    },
    allowedSchemes: ['http', 'https'],
    transformTags: {
        a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' })
    }
};

export function sanitizeDescription(html) {
    if (!html) return '';
    return sanitizeHtml(html, OPTIONS);
}

// Plain-text version (all tags stripped) for use in <meta name="description">
// and JSON-LD, where markup isn't wanted.
export function htmlToPlainText(html) {
    if (!html) return '';
    return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
        .replace(/\s+/g, ' ')
        .trim();
}
