// Plain URL-tagged affiliate links — no API access required, just an
// Associates tracking ID / EPN campaign ID from each program's dashboard.
// Returns null when the corresponding env var isn't set yet, so callers
// can hide the buy module entirely until credentials exist.

export function buildAmazonSearchLink({ tag, query }) {
    if (!tag) return null;

    const params = new URLSearchParams({
        k: query,
        i: 'videogames',
        tag
    });

    return `https://www.amazon.com/s?${params.toString()}`;
}

// Standard EPN "General Text Link" query params. Once a real campaign
// exists in the eBay Partner Network dashboard, compare against their
// generated link — some tools/campaign types add extra params
// (mkrid, customid) worth mirroring here.
export function buildEbaySearchLink({ campaignId, query }) {
    if (!campaignId) return null;

    const params = new URLSearchParams({
        _nkw: query,
        campid: campaignId,
        toolid: '10001',
        mkevt: '1',
        mkcid: '1'
    });

    return `https://www.ebay.com/sch/i.html?${params.toString()}`;
}

export function buildBuyLinks({ amazonTag, ebayCampaignId, gameName }) {
    return {
        amazon: buildAmazonSearchLink({ tag: amazonTag, query: gameName }),
        ebay: buildEbaySearchLink({ campaignId: ebayCampaignId, query: gameName })
    };
}
