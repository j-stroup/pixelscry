import { prisma } from '$lib/server/db.js';
import { getPopularTags } from '$lib/server/tags.js';

export async function load({ setHeaders }) {
    setHeaders({ 'Cache-Control': 'public, max-age=3600' });

    const tags = await getPopularTags(prisma);

    return { tags };
}
