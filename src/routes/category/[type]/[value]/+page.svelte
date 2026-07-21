<script>
    import GameCoverFallback from '$lib/components/GameCoverFallback.svelte';
    import SeoHead from '$lib/components/SeoHead.svelte';
    import { buildItemListSchema } from '$lib/jsonld.js';
    import { SITE_URL } from '$lib/siteConfig.js';
    import { getBestOfScore } from '$lib/gameDisplay.js';

    let { data } = $props();

    let pageTitle = $derived(
        data.ranked ? `Best ${data.value} Games | PixelScry` : `${data.value} Games | PixelScry`
    );
    let pageDescription = $derived(
        data.games.length === 0
            ? data.ranked
                ? `The best ${data.value} games, ranked by PixelScry, a free video game database.`
                : `Browse ${data.value} games on PixelScry, a free video game database.`
            : data.ranked
              ? `The best ${data.value} games, ranked by critic and player score — starting with ${data.games
                    .slice(0, 3)
                    .map((g) => g.name)
                    .join(', ')}. A curated ledger from PixelScry.`
              : `Browse ${data.games.length} ${data.value} game${data.games.length === 1 ? '' : 's'} — including ${data.games
                    .slice(0, 3)
                    .map((g) => g.name)
                    .join(', ')}. Find your next game on PixelScry.`
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

        <div class="mb-6">
            <p class="font-mono text-signal text-[11px] font-medium tracking-[0.2em] uppercase mb-2">
                {data.ranked ? 'A Curated Ledger' : `Exploring by ${data.category.split(':')[0]}`}
            </p>
            <h1 class="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] uppercase text-ink" style="text-wrap: balance;">
                {#if data.ranked}
                    Best {data.value} <span class="text-ink-faint">Games</span>
                {:else}
                    {data.value} <span class="text-ink-faint">Games</span>
                {/if}
            </h1>
        </div>

        {#if data.ranked && data.games.length > 0}
            <p class="text-ink-dim text-sm max-w-2xl mb-4 leading-relaxed">
                Ranked by critic and player score.
                {#if data.totalCount > data.games.length}
                    The top {data.games.length} of {data.totalCount} {data.value} games in the archive.
                {:else}
                    Every {data.value} game in the archive, best-rated first.
                {/if}
                Updated automatically as new titles are added.
            </p>
        {/if}

        {#if data.facets?.length > 0}
            <div class="mb-10 mt-6">
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
        {:else}
            <div class="mb-10"></div>
        {/if}

        {#if data.games.length === 0}
            <div class="chassis-cut-sm bg-panel border border-line p-12 text-center">
                <p class="text-ink-dim text-lg font-medium">No games found in the local archive for this category yet.</p>
                <p class="font-mono text-ink-faint mt-2 uppercase tracking-widest text-xs">Browse more games to populate the cache.</p>
            </div>
        {:else}
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {#each data.games as game, i}
                    <a href="/game/{game.slug}" class="card-cut relative block bg-panel-2 border border-line hover:border-signal/60 transition-colors group overflow-hidden">
                        {#if data.ranked}
                            <div class="rank-tab absolute top-0 left-0 z-10 flex items-center justify-center">
                                <span class="font-display text-sm leading-none">#{i + 1}</span>
                            </div>
                        {/if}
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
                        <div class="p-2 flex items-center justify-between gap-2">
                            <p class="font-sans font-medium text-xs text-ink-dim group-hover:text-ink truncate transition-colors">{game.name}</p>
                            {#if data.ranked && getBestOfScore(game)}
                                <span class="font-mono text-[11px] font-medium text-signal shrink-0">{getBestOfScore(game)}</span>
                            {/if}
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</main>

<style>
    .rank-tab {
        width: 34px;
        height: 26px;
        background: var(--color-signal);
        color: var(--color-signal-ink);
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 60%);
    }
</style>
