<script>
    import GameCoverFallback from '$lib/components/GameCoverFallback.svelte';
    import SeoHead from '$lib/components/SeoHead.svelte';
    import { buildItemListSchema } from '$lib/jsonld.js';
    import { SITE_URL } from '$lib/siteConfig.js';

    let { data } = $props();

    let pageTitle = $derived(`${data.genre} Games on ${data.platform} | PixelScry`);
    let pageDescription = $derived(
        data.games.length > 0
            ? `Browse ${data.games.length} ${data.genre} game${data.games.length === 1 ? '' : 's'} on ${data.platform} — including ${data.games
                  .slice(0, 3)
                  .map((g) => g.name)
                  .join(', ')}. Find your next game on PixelScry.`
            : `Browse ${data.genre} games on ${data.platform} on PixelScry, a free video game database.`
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

<main class="min-h-screen bg-void text-ink relative selection:bg-signal/30 pt-28 pb-24 px-6">

    <div class="max-w-7xl mx-auto relative z-10">

        <div class="flex flex-wrap items-center gap-2 mb-8 font-mono text-[10px] font-medium tracking-[0.2em] uppercase">
            <a href="/" class="text-signal hover:opacity-80">Search</a>
            <span class="text-ink-faint">/</span>
            <a href="/category/genre/{encodeURIComponent(data.genre)}" class="text-signal hover:opacity-80">{data.genre}</a>
            <span class="text-ink-faint">/</span>
            <a href="/category/platform/{encodeURIComponent(data.platform)}" class="text-signal hover:opacity-80">{data.platform}</a>
        </div>

        <div class="mb-10">
            <h1 class="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] uppercase text-ink mb-3" style="text-wrap: balance;">
                {data.genre} <span class="text-ink-faint">on {data.platform}</span>
            </h1>
            <p class="font-mono text-signal text-[11px] font-medium tracking-[0.2em] uppercase">
                {data.games.length} game{data.games.length === 1 ? '' : 's'} found
            </p>
        </div>

        {#if data.games.length === 0}
            <div class="chassis-cut-sm bg-panel border border-line p-12 text-center">
                <p class="text-ink-dim text-lg font-medium">No {data.genre} games found on {data.platform} in the local archive yet.</p>
                <p class="font-mono text-ink-faint mt-2 uppercase tracking-widest text-xs">Browse more games to populate the cache.</p>
            </div>
        {:else}
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {#each data.games as game}
                    <a href="/game/{game.slug}" class="card-cut aspect-[3/4] bg-panel-2 border border-line hover:border-signal/60 transition-colors group relative overflow-hidden">
                        {#if game.background_image}
                            <img
                                src={game.background_image}
                                alt={game.name}
                                class="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                            />
                        {:else}
                            <GameCoverFallback name={game.name} />
                        {/if}
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</main>
