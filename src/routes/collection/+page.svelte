<script>
    import { getOwnedSlugs, toggleOwned } from '$lib/collection.svelte.js';
    import GameCoverFallback from '$lib/components/GameCoverFallback.svelte';
    import SeoHead from '$lib/components/SeoHead.svelte';

    let slugs = $derived(getOwnedSlugs());
    let result = $state(null);
    let loading = $state(true);

    $effect(() => {
        const currentSlugs = slugs;

        if (currentSlugs.length === 0) {
            result = { owned: [], suggestions: [], stats: { totalOwned: 0, platformCount: 0, genreCount: 0 } };
            loading = false;
            return;
        }

        loading = true;
        fetch(`/api/collection?slugs=${encodeURIComponent(currentSlugs.join(','))}`)
            .then((r) => r.json())
            .then((data) => {
                result = data;
                loading = false;
            })
            .catch(() => {
                loading = false;
            });
    });
</script>

<SeoHead
    title="My Collection | PixelScry"
    description="Track the games you own and discover what to play next, stored locally in your browser."
    path="/collection"
    noindex={true}
/>

<main class="min-h-screen bg-black text-zinc-100 relative selection:bg-fuchsia-500/30 pt-32 pb-24 px-6">

    <div class="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0"
         style="background: radial-gradient(ellipse at top, rgba(217,70,239, 0.15) 0%, transparent 70%);">
    </div>

    <div class="max-w-7xl mx-auto relative z-10">

        <div class="mb-12">
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white drop-shadow-lg mb-4">
                My <span class="text-zinc-600">Collection</span>
            </h1>
            <p class="text-zinc-500 text-sm font-bold tracking-widest uppercase">
                Tracked locally in this browser — no account needed.
            </p>
        </div>

        {#if loading}
            <div class="text-center py-20 text-zinc-500 font-black tracking-widest uppercase">
                Loading...
            </div>
        {:else if result.owned.length === 0}
            <div class="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center shadow-2xl">
                <p class="text-zinc-300 text-xl font-medium">Your collection is empty.</p>
                <p class="text-zinc-600 mt-2 font-bold uppercase tracking-widest text-xs">
                    Visit a game page and click "Add to Collection" to start tracking it.
                </p>
            </div>
        {:else}
            <div class="flex flex-wrap gap-4 mb-12">
                <div class="bg-zinc-900/40 border border-white/10 rounded-xl px-6 py-4">
                    <div class="text-3xl font-black text-white">{result.stats.totalOwned}</div>
                    <div class="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Games Owned</div>
                </div>
                <div class="bg-zinc-900/40 border border-white/10 rounded-xl px-6 py-4">
                    <div class="text-3xl font-black text-white">{result.stats.platformCount}</div>
                    <div class="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Platforms</div>
                </div>
                <div class="bg-zinc-900/40 border border-white/10 rounded-xl px-6 py-4">
                    <div class="text-3xl font-black text-white">{result.stats.genreCount}</div>
                    <div class="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Genres</div>
                </div>
            </div>

            <h2 class="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] mb-4">Your Games</h2>
            <div class="bg-zinc-950/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm mb-14">
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {#each result.owned as game}
                        <div class="relative group">
                            <a href="/game/{game.slug}" class="block aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden border border-white/10 hover:border-fuchsia-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:-translate-y-1 transition-all duration-300">
                                {#if game.background_image}
                                    <img src={game.background_image} alt={game.name} class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                {:else}
                                    <GameCoverFallback name={game.name} />
                                {/if}
                            </a>
                            <button onclick={() => toggleOwned(game.slug)}
                                    class="absolute top-2 right-2 bg-black/70 hover:bg-red-950/80 border border-white/10 hover:border-red-500/50 text-zinc-400 hover:text-red-400 text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                Remove
                            </button>
                        </div>
                    {/each}
                </div>
            </div>

            {#if result.suggestions.length > 0}
                <h2 class="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] mb-4">Complete Your Collection</h2>
                <p class="text-zinc-600 text-xs mb-4">
                    Games sharing genres with your collection that you don't own yet.
                </p>
                <div class="bg-zinc-950/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {#each result.suggestions as game}
                            <div class="flex flex-col gap-2">
                                <a href="/game/{game.slug}" class="block aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden border border-white/10 hover:border-fuchsia-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:-translate-y-1 transition-all duration-300">
                                    {#if game.background_image}
                                        <img src={game.background_image} alt={game.name} class="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                                    {:else}
                                        <GameCoverFallback name={game.name} />
                                    {/if}
                                </a>
                                {#if game.buyLinks?.amazon || game.buyLinks?.ebay}
                                    <div class="flex gap-1">
                                        {#if game.buyLinks.amazon}
                                            <a href={game.buyLinks.amazon} target="_blank" rel="sponsored noopener"
                                               class="flex-1 text-center bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white text-[9px] font-black uppercase tracking-wider px-2 py-1.5 rounded">
                                                Amazon
                                            </a>
                                        {/if}
                                        {#if game.buyLinks.ebay}
                                            <a href={game.buyLinks.ebay} target="_blank" rel="sponsored noopener"
                                               class="flex-1 text-center bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white text-[9px] font-black uppercase tracking-wider px-2 py-1.5 rounded">
                                                eBay
                                            </a>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</main>
