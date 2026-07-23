<script>
    import GameCoverFallback from '$lib/components/GameCoverFallback.svelte';
    import SeoHead from '$lib/components/SeoHead.svelte';
    import { buildItemListSchema } from '$lib/jsonld.js';
    import { SITE_URL } from '$lib/siteConfig.js';
    import { getBestOfScore } from '$lib/gameDisplay.js';

    let { data } = $props();

    let pageTitle = $derived(`Best ${data.genre} ${data.platform} Games | PixelScry`);
    let pageDescription = $derived(
        data.games.length > 0
            ? `The best ${data.genre} games on ${data.platform}, ranked by critic and player score — starting with ${data.games
                  .slice(0, 3)
                  .map((g) => g.name)
                  .join(', ')}. A curated ledger from PixelScry.`
            : `The best ${data.genre} games on ${data.platform}, ranked by PixelScry, a free video game database.`
    );
    let canonicalPath = $derived(
        `/category/genre/${encodeURIComponent(data.genre)}/platform/${encodeURIComponent(data.platform)}`
    );
    let itemListSchema = $derived(
        data.games.length > 0
            ? buildItemListSchema({
                  name: pageTitle,
                  url: `${SITE_URL}${canonicalPath}`,
                  items: data.games.map((g) => ({ url: `${SITE_URL}/game/${g.slug}`, name: g.name }))
              })
            : null
    );
</script>

<SeoHead title={pageTitle} description={pageDescription} path={canonicalPath} jsonLd={itemListSchema} />

<main class="min-h-screen text-ink relative selection:bg-signal/30 pt-28 pb-24 px-6">

    <div class="max-w-7xl mx-auto relative z-10">

        <div class="flex flex-wrap items-center gap-2 mb-8 font-mono text-[10px] font-medium tracking-[0.2em] uppercase">
            <a href="/" class="text-signal hover:opacity-80">Search</a>
            <span class="text-ink-faint">/</span>
            <a href="/category/genre/{encodeURIComponent(data.genre)}" class="text-signal hover:opacity-80">{data.genre}</a>
            <span class="text-ink-faint">/</span>
            <a href="/category/platform/{encodeURIComponent(data.platform)}" class="text-signal hover:opacity-80">{data.platform}</a>
        </div>

        <div class="mb-6">
            <p class="font-mono text-signal text-[11px] font-medium tracking-[0.2em] uppercase mb-2">
                A Curated Ledger
            </p>
            <h1 class="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] uppercase text-ink mb-3" style="text-wrap: balance;">
                Best {data.genre} <span class="text-ink-faint">{data.platform} Games</span>
            </h1>
        </div>

        {#if data.games.length > 0}
            <p class="text-ink-dim text-sm max-w-2xl mb-10 leading-relaxed">
                Ranked by critic and player score.
                {#if data.totalCount > data.games.length}
                    The top {data.games.length} of {data.totalCount} {data.genre} games on {data.platform} in the archive.
                {:else}
                    Every {data.genre} game on {data.platform} in the archive, best-rated first.
                {/if}
                Updated automatically as new titles are added.
            </p>
        {/if}

        {#if data.games.length === 0}
            <div class="chassis-cut-sm bg-panel border border-line p-12 text-center">
                <p class="text-ink-dim text-lg font-medium">No {data.genre} games found on {data.platform} in the local archive yet.</p>
                <p class="font-mono text-ink-faint mt-2 uppercase tracking-widest text-xs">Browse more games to populate the cache.</p>
            </div>
        {:else}
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {#each data.games as game, i}
                    <a href="/game/{game.slug}" class="card-cut relative block bg-panel-2 border border-line hover:border-signal/60 transition-colors group overflow-hidden">
                        <div class="rank-tab absolute top-0 left-0 z-10 flex items-center justify-center">
                            <span class="font-display text-sm leading-none">#{i + 1}</span>
                        </div>
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
                            {#if getBestOfScore(game)}
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
