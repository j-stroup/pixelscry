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

<main class="min-h-screen bg-black text-zinc-100 relative selection:bg-fuchsia-500/30 pt-32 pb-24 px-6">

    <div class="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0"
         style="background: radial-gradient(ellipse at top, rgba(217,70,239, 0.15) 0%, transparent 70%);">
    </div>

    <div class="max-w-7xl mx-auto relative z-10">

        <div class="flex flex-wrap items-center gap-2 mb-8 text-[10px] font-black tracking-[0.2em] uppercase">
            <a href="/" class="text-fuchsia-500 hover:underline">Search</a>
            <span class="text-zinc-700">/</span>
            <a href="/category/genre/{encodeURIComponent(data.genre)}" class="text-fuchsia-500 hover:underline">{data.genre}</a>
            <span class="text-zinc-700">/</span>
            <a href="/category/platform/{encodeURIComponent(data.platform)}" class="text-fuchsia-500 hover:underline">{data.platform}</a>
        </div>

        <div class="mb-12">
            <h1 class="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white drop-shadow-lg mb-4">
                {data.genre} <span class="text-zinc-600">on {data.platform}</span>
            </h1>
            <p class="text-fuchsia-500 text-sm font-black tracking-[0.2em] uppercase">
                {data.games.length} game{data.games.length === 1 ? '' : 's'} found
            </p>
        </div>

        {#if data.games.length === 0}
            <div class="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center shadow-2xl">
                <p class="text-zinc-300 text-xl font-medium">No {data.genre} games found on {data.platform} in the local archive yet.</p>
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
