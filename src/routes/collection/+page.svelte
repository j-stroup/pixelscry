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
            result = { owned: [], suggestions: [], stats: { totalOwned: 0, backlogHours: 0, genreCount: 0 } };
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

<main class="min-h-screen text-ink relative selection:bg-signal/30 pt-28 pb-24 px-6">

    <div class="max-w-7xl mx-auto relative z-10">

        <div class="mb-10">
            <h1 class="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] uppercase text-ink mb-3">
                My <span class="text-ink-faint">Collection</span>
            </h1>
            <p class="font-mono text-ink-faint text-[11px] font-medium tracking-widest uppercase">
                Tracked locally in this browser — no account needed
            </p>
        </div>

        {#if loading}
            <div class="text-center py-20 font-mono text-ink-faint tracking-widest uppercase text-sm">
                Loading&hellip;
            </div>
        {:else if result.owned.length === 0}
            <div class="chassis-cut-sm bg-panel border border-line p-12 text-center">
                <p class="text-ink-dim text-lg font-medium">Your collection is empty.</p>
                <p class="font-mono text-ink-faint mt-2 uppercase tracking-widest text-xs">
                    Visit a game page and click "Add to collection" to start tracking it.
                </p>
            </div>
        {:else}
            <div class="flex flex-wrap gap-4 mb-12 font-mono">
                <div class="chip-cut bg-panel border border-hair px-6 py-4">
                    <div class="font-display text-3xl text-signal leading-none">{result.stats.totalOwned}</div>
                    <div class="text-[10px] text-ink-faint font-medium uppercase tracking-widest mt-1">Games owned</div>
                </div>
                <div class="chip-cut bg-panel border border-hair px-6 py-4">
                    <div class="font-display text-3xl text-signal leading-none">{result.stats.backlogHours.toLocaleString()}</div>
                    <div class="text-[10px] text-ink-faint font-medium uppercase tracking-widest mt-1">Hrs to beat</div>
                </div>
                <div class="chip-cut bg-panel border border-hair px-6 py-4">
                    <div class="font-display text-3xl text-signal leading-none">{result.stats.genreCount}</div>
                    <div class="text-[10px] text-ink-faint font-medium uppercase tracking-widest mt-1">Genres</div>
                </div>
            </div>

            <p class="font-mono text-ink-faint text-[11px] uppercase font-medium tracking-[0.2em] mb-4 pb-3 border-b border-line">Your games</p>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mb-14">
                {#each result.owned as game}
                    <div class="relative group">
                        <a href="/game/{game.slug}" class="card-cut block bg-panel-2 border border-line hover:border-signal/60 transition-colors overflow-hidden">
                            <div class="aspect-[3/4] w-full relative">
                                {#if game.background_image}
                                    <img src={game.background_image} alt={game.name} class="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
                                {:else}
                                    <GameCoverFallback name={game.name} />
                                {/if}
                            </div>
                            <p class="font-sans font-medium text-xs text-ink-dim group-hover:text-ink truncate p-2 transition-colors">{game.name}</p>
                        </a>
                        <button onclick={() => toggleOwned(game.slug)}
                                class="btn-cut absolute top-2 right-2 bg-void/80 hover:bg-signal border border-hair hover:border-transparent text-ink-dim hover:text-signal-ink font-mono text-[9px] font-medium uppercase tracking-widest px-3 py-2 transition-colors">
                            Remove
                        </button>
                    </div>
                {/each}
            </div>

            {#if result.suggestions.length > 0}
                <p class="font-mono text-ink-faint text-[11px] uppercase font-medium tracking-[0.2em] mb-2 pb-3 border-b border-line">Complete your collection</p>
                <p class="text-ink-dim text-xs mb-4">
                    Games sharing genres with your collection that you don't own yet.
                </p>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                    {#each result.suggestions as game}
                        <div class="flex flex-col gap-2">
                            <a href="/game/{game.slug}" class="card-cut block bg-panel-2 border border-line hover:border-signal/60 transition-colors overflow-hidden group">
                                <div class="aspect-[3/4] w-full">
                                    {#if game.background_image}
                                        <img src={game.background_image} alt={game.name} class="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
                                    {:else}
                                        <GameCoverFallback name={game.name} />
                                    {/if}
                                </div>
                                <p class="font-sans font-medium text-xs text-ink-dim group-hover:text-ink truncate p-2 transition-colors">{game.name}</p>
                            </a>
                            {#if game.buyLinks?.amazon || game.buyLinks?.ebay}
                                <div class="flex gap-1 font-mono">
                                    {#if game.buyLinks.amazon}
                                        <a href={game.buyLinks.amazon} target="_blank" rel="sponsored noopener"
                                           class="btn-cut flex-1 text-center bg-panel hover:bg-panel-2 border border-hair text-ink-faint hover:text-ink text-[9px] font-medium uppercase tracking-wider px-2 py-1.5 transition-colors">
                                            Amazon
                                        </a>
                                    {/if}
                                    {#if game.buyLinks.ebay}
                                        <a href={game.buyLinks.ebay} target="_blank" rel="sponsored noopener"
                                           class="btn-cut flex-1 text-center bg-panel hover:bg-panel-2 border border-hair text-ink-faint hover:text-ink text-[9px] font-medium uppercase tracking-wider px-2 py-1.5 transition-colors">
                                            eBay
                                        </a>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</main>
