// eBay Browse API client — OAuth2 client-credentials flow with an
// in-memory cached token (tokens last 7200s). Environment-aware: reads
// EBAY_ENVIRONMENT to pick sandbox vs production hostnames, so switching
// to real production keys later is just an env var change, no code change.
//
// Sandbox note: eBay's sandbox only contains fake seeded test data, never
// real listings — this client will authenticate and query correctly
// against sandbox, but don't expect real search results until production
// credentials are in place.

const HOSTS = {
    sandbox: {
        auth: 'https://api.sandbox.ebay.com/identity/v1/oauth2/token',
        api: 'https://api.sandbox.ebay.com'
    },
    production: {
        auth: 'https://api.ebay.com/identity/v1/oauth2/token',
        api: 'https://api.ebay.com'
    }
};

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function createEbayClient({ clientId, clientSecret, environment, campaignId }) {
    if (!clientId || !clientSecret) return null;

    const hosts = HOSTS[environment] || HOSTS.sandbox;

    async function getAccessToken() {
        const now = Date.now();
        if (cachedToken && now < cachedTokenExpiresAt) return cachedToken;

        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const response = await fetch(hosts.auth, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                scope: 'https://api.ebay.com/oauth/api_scope'
            })
        });

        if (!response.ok) {
            throw new Error(`eBay OAuth token request failed: ${response.status} ${await response.text()}`);
        }

        const data = await response.json();
        cachedToken = data.access_token;
        // Refresh a little early to avoid edge-of-expiry failures.
        cachedTokenExpiresAt = now + (data.expires_in - 60) * 1000;
        return cachedToken;
    }

    async function searchItems({ query, limit = 6 }) {
        const token = await getAccessToken();

        const params = new URLSearchParams({
            q: query,
            limit: String(limit)
        });

        const headers = {
            Authorization: `Bearer ${token}`,
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        };

        if (campaignId) {
            headers['X-EBAY-C-ENDUSERCTX'] = `affiliateCampaignId=${campaignId}`;
        }

        const response = await fetch(`${hosts.api}/buy/browse/v1/item_summary/search?${params}`, {
            headers
        });

        if (!response.ok) {
            throw new Error(`eBay Browse API search failed: ${response.status} ${await response.text()}`);
        }

        const data = await response.json();

        return (data.itemSummaries || []).map((item) => ({
            title: item.title,
            price: item.price ? { value: item.price.value, currency: item.price.currency } : null,
            image: item.image?.imageUrl || null,
            condition: item.condition || null,
            url: item.itemAffiliateWebUrl || item.itemWebUrl
        }));
    }

    return { searchItems };
}

export { createEbayClient };
