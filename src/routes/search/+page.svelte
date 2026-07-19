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

<main class="min-h-screen bg-void text-ink pt-28 pb-24 px-6 relative selection:bg-signal/30">
    <div class="max-w-7xl mx-auto relative z-10">
        <div class="mb-10 border-b border-line pb-8">
            <h1 class="font-display text-4xl md:text-6xl leading-[0.92] uppercase text-ink mb-4">
                Search Results
            </h1>

            <div class="flex flex-wrap items-center gap-2.5 font-mono text-ink-dim font-medium uppercase tracking-widest text-xs">
                <span class="text-ink-faint">Query</span>
                <span class="text-ink bg-panel px-3 py-1.5 border border-hair">
                    {data.query}
                </span>

                {#each data.parsed?.filters || [] as filter}
                    <span class="text-signal bg-panel px-3 py-1.5 border border-signal/30">
                        {filter.key}{filter.op}{filter.val}
                    </span>
                {/each}
            </div>
        </div>

        {#if data.results.length === 0}
            <div class="text-center py-20 bg-panel border border-hair">
                <p class="font-mono text-ink-faint font-medium tracking-widest uppercase text-xl">0 results found</p>
                <p class="text-ink-dim text-sm mt-2">Try adjusting your syntax parameters.</p>
            </div>
        {:else}
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {#each data.results as game}
                    <a href="/game/{game.slug}" class="card-cut block bg-panel-2 border border-line hover:border-signal/60 transition-colors group overflow-hidden">
                        <div class="aspect-[3/4] w-full">
                            {#if game.background_image}
                                <img src={game.background_image} alt={game.name} class="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
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
