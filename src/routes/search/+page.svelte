<script>
    import GameCoverFallback from '$lib/components/GameCoverFallback.svelte';
    import SeoHead from '$lib/components/SeoHead.svelte';

    let { data } = $props();
</script>

<SeoHead
    title="Search: {data.query} | PixelScry"
    description={`Search results for "${data.query}" on PixelScry.`}
    path="/search"
    noindex={true}
/>

<main class="min-h-screen bg-black text-zinc-100 pt-32 pb-24 px-6 relative selection:bg-fuchsia-500/30">
    <div class="absolute top-0 left-0 w-full h-[500px] pointer-events-none z-0"
         style="background: radial-gradient(ellipse at top, rgba(217,70,239, 0.15) 0%, transparent 70%);">
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
        <div class="mb-12 border-b border-white/10 pb-8">
            <h1 class="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 drop-shadow-md">
                Search Results
            </h1>
            
            <div class="flex items-center gap-3 text-zinc-400 font-bold uppercase tracking-widest text-xs">
                <span>Query:</span>
                <span class="text-white bg-zinc-900 px-3 py-1 rounded border border-white/10 shadow-inner">
                    {data.query}
                </span>
                
                {#each data.parsed?.filters || [] as filter}
                    <span class="text-fuchsia-400 bg-fuchsia-950/30 px-3 py-1 rounded border border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.1)]">
                        {filter.key}{filter.op}{filter.val}
                    </span>
                {/each}
            </div>
        </div>

        {#if data.results.length === 0}
            <div class="text-center py-20 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5">
                <p class="text-zinc-500 font-black tracking-widest uppercase text-xl">0 Results Found.</p>
                <p class="text-zinc-600 text-sm mt-2">Try adjusting your syntax parameters.</p>
            </div>
        {:else}
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {#each data.results as game}
                    <a href="/game/{game.slug}" class="aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden border border-white/10 hover:border-fuchsia-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:-translate-y-1 transition-all duration-300 group">
                        {#if game.background_image}
                            <img src={game.background_image} alt={game.name} class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        {:else}
                            <GameCoverFallback name={game.name} />
                        {/if}
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</main>