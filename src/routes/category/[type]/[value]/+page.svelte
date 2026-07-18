<script>
    import GameCoverFallback from '$lib/components/GameCoverFallback.svelte';
    import SeoHead from '$lib/components/SeoHead.svelte';
    import { buildItemListSchema } from '$lib/jsonld.js';
    import { SITE_URL } from '$lib/siteConfig.js';

    let { data } = $props();

    let pageTitle = $derived(`${data.value} Games | PixelScry`);
    let pageDescription = $derived(
        data.games.length > 0
            ? `Browse ${data.games.length} ${data.value} game${data.games.length === 1 ? '' : 's'} — including ${data.games
                  .slice(0, 3)
                  .map((g) => g.name)
                  .join(', ')}. Find your next game on PixelScry.`
            : `Browse ${data.value} games on PixelScry, a free video game database.`
    );
    let canonicalPath = $derived(`/category/${data.type}/${encodeURIComponent(data.value)}`);
    let itemListSchema = $derived(
        data.games.length > 0
            ? buildItemListSchema({
                  name: pageTitle,
                  url: `${SITE_URL}${canonicalPath}`,
                  items: data.games.map((g) => ({ url: `${SITE_URL}/game/${g.slug}`, name: g.name }))
              })
            : null
    );

    let facetLabel = $derived(
        data.type === 'genre' ? 'Platform' : data.type === 'platform' ? 'Genre' : ''
    );

    function facetHref(facetName) {
        if (data.type === 'genre') {
            return `/category/genre/${encodeURIComponent(data.value)}/platform/${encodeURIComponent(facetName)}`;
        }
        if (data.type === 'platform') {
            return `/category/genre/${encodeURIComponent(facetName)}/platform/${encodeURIComponent(data.value)}`;
        }
        return '#';
    }
</script>

<SeoHead title={pageTitle} description={pageDescription} path={canonicalPath} jsonLd={itemListSchema} />

<main class="min-h-screen bg-black text-zinc-100 relative selection:bg-fuchsia-500/30 pt-32 pb-24 px-6">
    
    <div class="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0"
         style="background: radial-gradient(ellipse at top, rgba(217,70,239, 0.15) 0%, transparent 70%);">
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
        
        <a href="/" class="text-fuchsia-500 text-[10px] font-black tracking-[0.2em] uppercase mb-8 inline-block hover:underline">
            &larr; Back to Search
        </a>

        <div class="mb-12">
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white drop-shadow-lg mb-4 capitalize">
                {data.category.split(':')[1]} <span class="text-zinc-600">Games</span>
            </h1>
            <p class="text-fuchsia-500 text-sm font-black tracking-[0.2em] uppercase">
                Exploring by {data.category.split(':')[0]}
            </p>
        </div>

        {#if data.facets?.length > 0}
            <div class="mb-10">
                <span class="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Filter by {facetLabel}</span>
                <div class="mt-3 flex flex-wrap gap-2">
                    {#each data.facets.slice(0, 12) as facet}
                        <a href={facetHref(facet.name)}
                           class="bg-zinc-900/80 hover:bg-fuchsia-500 border border-white/10 hover:border-transparent text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors duration-300">
                            {facet.name} <span class="opacity-50">({facet.count})</span>
                        </a>
                    {/each}
                </div>
            </div>
        {/if}

        {#if data.games.length === 0}
            <div class="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center shadow-2xl">
                <p class="text-zinc-300 text-xl font-medium">No games found in your local archive for this category yet.</p>
                <p class="text-zinc-600 mt-2 font-bold uppercase tracking-widest text-xs">Browse more games to populate the cache!</p>
            </div>
        {:else}
            <div class="bg-zinc-950/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {#each data.games as game}
                        <a href="/game/{game.slug}" class="aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden border border-white/10 hover:border-fuchsia-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:-translate-y-1 transition-all duration-300 group relative">
                            {#if game.background_image}
                                <img
                                    src={game.background_image}
                                    alt={game.name}
                                    class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                            {:else}
                                <GameCoverFallback name={game.name} />
                            {/if}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</main>