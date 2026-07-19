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

<main class="min-h-screen bg-void text-ink relative selection:bg-signal/30 pt-28 pb-24 px-6">

    <div class="max-w-7xl mx-auto relative z-10">

        <a href="/" class="font-mono text-signal text-[10px] font-medium tracking-[0.2em] uppercase mb-8 inline-block hover:opacity-80">
            &larr; Back to search
        </a>

        <div class="mb-10">
            <p class="font-mono text-signal text-[11px] font-medium tracking-[0.2em] uppercase mb-2">
                Exploring by {data.category.split(':')[0]}
            </p>
            <h1 class="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] uppercase text-ink" style="text-wrap: balance;">
                {data.category.split(':')[1]} <span class="text-ink-faint">Games</span>
            </h1>
        </div>

        {#if data.facets?.length > 0}
            <div class="mb-10">
                <span class="font-mono text-ink-faint text-[9px] font-medium uppercase tracking-widest">Filter by {facetLabel}</span>
                <div class="mt-3 flex flex-wrap gap-2 font-mono">
                    {#each data.facets.slice(0, 12) as facet}
                        <a href={facetHref(facet.name)}
                           class="chip-cut inline-flex items-center min-h-[44px] bg-panel hover:bg-signal border border-hair hover:border-transparent text-ink-dim hover:text-signal-ink text-[10px] font-medium uppercase tracking-widest px-3.5 transition-colors">
                            {facet.name} <span class="opacity-60 ml-1">({facet.count})</span>
                        </a>
                    {/each}
                </div>
            </div>
        {/if}

        {#if data.games.length === 0}
            <div class="chassis-cut-sm bg-panel border border-line p-12 text-center">
                <p class="text-ink-dim text-lg font-medium">No games found in the local archive for this category yet.</p>
                <p class="font-mono text-ink-faint mt-2 uppercase tracking-widest text-xs">Browse more games to populate the cache.</p>
            </div>
        {:else}
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {#each data.games as game}
                    <a href="/game/{game.slug}" class="card-cut block bg-panel-2 border border-line hover:border-signal/60 transition-colors group overflow-hidden">
                        <div class="aspect-[3/4] w-full">
                            {#if game.background_image}
                                <img
                                    src={game.background_image}
                                    alt={game.name}
                                    class="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                                />
                            {:else}
                                <GameCoverFallback name={game.name} />
                            {/if}
                        </div>
                        <p class="font-sans font-medium text-xs text-ink-dim group-hover:text-ink truncate p-2 transition-colors">{game.name}</p>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</main>
