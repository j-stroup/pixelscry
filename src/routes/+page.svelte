<script>
    import { getDisplayRating, getReleaseYear } from '$lib/gameDisplay.js';
    import GameCoverFallback from '$lib/components/GameCoverFallback.svelte';
    import SeoHead from '$lib/components/SeoHead.svelte';
    import { buildWebsiteSchema } from '$lib/jsonld.js';

    let { data } = $props();

    const websiteSchema = buildWebsiteSchema();

    // Svelte 5 state to track scroll position for the Back to Top button
    let scrollY = $state(0);

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Helper to generate Next/Prev URLs without losing our tactical filter selections
    function getPageUrl(targetPage) {
        const params = new URLSearchParams();
        const s = data.searchState;
        if (s.q) params.set('q', s.q);
        if (s.platform) params.set('platform', s.platform);
        if (s.genre) params.set('genre', s.genre);
        params.set('page', targetPage);
        return `/?${params.toString()}`;
    }

    // Bind the input to this variable
    let searchQuery = $state('');

    // This function adds the syntax to the bar when a user uses a dropdown
    function appendFilter(event, prefix) {
        const value = event.target.value;
        if (!value) return; // Ignore the "Select..." placeholder

        // Check if the prefix (e.g., "genre:") is already in the bar
        const regex = new RegExp(`${prefix}:[^ ]+`);

        if (regex.test(searchQuery)) {
            // Replace existing (e.g., change genre:rpg to genre:shooter)
            searchQuery = searchQuery.replace(regex, `${prefix}:${value}`);
        } else {
            // Append new
            searchQuery = `${searchQuery} ${prefix}:${value}`.trim();
        }

        // Reset the dropdown back to its default placeholder
        event.target.value = "";
    }
</script>

<SeoHead
    title="PixelScry — Discover & Search Video Games by Genre, Platform & Rating"
    description="Search and browse thousands of video games by genre, platform, and rating. Find your next game fast with PixelScry, a free, ad-light video game database."
    path="/"
    jsonLd={websiteSchema}
/>

<svelte:window bind:scrollY={scrollY} />

<main class="min-h-screen bg-void text-ink p-6 font-sans selection:bg-signal/30 relative overflow-x-hidden">

    <div class="relative z-10">

        <section class="max-w-3xl mx-auto mt-10 mb-14 relative">
            <p class="font-mono text-[11px] tracking-[0.2em] uppercase text-signal text-center mb-3">Search the archive</p>

            <form action="/search" method="GET" class="relative">
                <input
                    type="text"
                    name="q"
                    bind:value={searchQuery}
                    placeholder="Search games, or use the filters below..."
                    autocomplete="off"
                    class="chassis-cut-sm w-full bg-panel border border-line text-ink placeholder-ink-faint text-base md:text-lg font-medium px-6 py-5 outline-none focus:border-signal transition-colors"
                />
                <button type="submit" class="btn-cut absolute right-3 top-1/2 -translate-y-1/2 bg-panel-2 hover:bg-signal text-ink-dim hover:text-signal-ink p-2.5 transition-colors border border-hair hover:border-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </form>

            <div class="mt-4 flex flex-wrap items-center justify-center gap-2.5 font-mono">
                <span class="text-[10px] uppercase tracking-widest font-medium text-ink-faint">Filters</span>

                <select
                    onchange={(e) => appendFilter(e, 'platform')}
                    class="chip-cut bg-panel-2 border border-hair text-ink-dim text-xs font-medium px-3 py-1.5 outline-none focus:border-signal hover:text-ink transition-colors appearance-none cursor-pointer"
                >
                    <option value="">+ Platform</option>
                    <option value="ps5">PlayStation 5</option>
                    <option value="xbox">Xbox Series X</option>
                    <option value="switch">Nintendo Switch</option>
                    <option value="pc">PC</option>
                </select>

                <select
                    onchange={(e) => appendFilter(e, 'genre')}
                    class="chip-cut bg-panel-2 border border-hair text-ink-dim text-xs font-medium px-3 py-1.5 outline-none focus:border-signal hover:text-ink transition-colors appearance-none cursor-pointer"
                >
                    <option value="">+ Genre</option>
                    <option value="rpg">RPG</option>
                    <option value="shooter">Shooter</option>
                    <option value="platform">Platformer</option>
                    <option value="indie">Indie</option>
                </select>

                <select
                    onchange={(e) => appendFilter(e, 'rating')}
                    class="chip-cut bg-panel-2 border border-hair text-ink-dim text-xs font-medium px-3 py-1.5 outline-none focus:border-signal hover:text-ink transition-colors appearance-none cursor-pointer"
                >
                    <option value="">+ Rating</option>
                    <option value=">90">Masterpiece (90+)</option>
                    <option value=">80">Great (80+)</option>
                    <option value=">70">Good (70+)</option>
                </select>
            </div>
        </section>

        <div class="max-w-7xl mx-auto relative z-10">
            {#if data.success}
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 md:gap-6">
                    {#each data.games as game}
                    <a href="/game/{game.slug}" data-sveltekit-reload class="card-cut block group relative bg-panel border border-line hover:border-signal/60 transition-colors duration-300 cursor-pointer">

                        <div class="aspect-[3/4] w-full bg-panel-2 border-b-[3px] border-signal">
                            {#if game.background_image}
                                <img src={game.background_image} alt="{game.name} cover" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" loading="lazy" />
                            {:else}
                                <GameCoverFallback name={game.name} />
                            {/if}
                        </div>

                        <div class="p-3">
                            <h2 class="font-sans font-semibold text-sm text-ink truncate mb-1">{game.name}</h2>
                            <div class="flex items-center justify-between font-mono">
                                <span class="text-[10px] font-medium text-ink-faint uppercase tracking-wider">{getReleaseYear(game) ?? 'N/A'}</span>
                                {#if getDisplayRating(game)}
                                    <span class="text-xs font-medium text-signal">{getDisplayRating(game)}</span>
                                {/if}
                            </div>
                        </div>
                    </a>
                    {/each}
                </div>

            {#if data.games.length === 0}
                <div class="text-center py-20 text-ink-faint font-mono font-medium tracking-widest uppercase text-sm">
                    No results found in the void.
                </div>
                    {/if}

                    {#if data.games.length > 0}
                        <div class="mt-16 mb-8 flex items-center justify-center gap-6 font-mono">
                            {#if data.searchState.page > 1}
                                <a href={getPageUrl(data.searchState.page - 1)} class="btn-cut bg-panel border border-line hover:border-signal text-ink-dim hover:text-signal font-medium uppercase tracking-[0.2em] text-[10px] px-6 py-3 transition-colors">
                                    &larr; Previous
                                </a>
                            {/if}

                            <span class="text-ink-faint font-medium tracking-widest text-xs uppercase">
                                Page {data.searchState.page}
                            </span>

                            {#if data.hasMore}
                                <a href={getPageUrl(data.searchState.page + 1)} class="btn-cut bg-panel border border-signal/50 hover:border-signal text-signal font-medium uppercase tracking-[0.2em] text-[10px] px-6 py-3 transition-colors">
                                    Next Sequence &rarr;
                                </a>
                            {/if}
                        </div>
                    {/if}

                {:else}
                <div class="chassis-cut-sm bg-panel border border-line p-6 text-center max-w-lg mx-auto">
                    <h2 class="font-display text-2xl text-signal mb-2 uppercase tracking-wide">Critical Failure</h2>
                    <p class="font-mono text-ink-dim text-sm">{data.error}</p>
                </div>
            {/if}
        </div>
    </div>
    {#if scrollY > 500}
        <button
            onclick={scrollToTop}
            class="btn-cut fixed bottom-8 right-8 z-50 bg-panel border border-signal/50 hover:border-signal text-signal p-3 transition-all"
            aria-label="Back to top"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    {/if}

</main>
