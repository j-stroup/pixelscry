import { EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_ENVIRONMENT, EBAY_CAMPAIGN_ID } from '$env/static/private';
import { createEbayClient } from './ebayClient.js';

// null when client id/secret aren't configured yet — callers must check.
export const ebay = createEbayClient({
    clientId: EBAY_CLIENT_ID,
    clientSecret: EBAY_CLIENT_SECRET,
    environment: EBAY_ENVIRONMENT,
    campaignId: EBAY_CAMPAIGN_ID
});
