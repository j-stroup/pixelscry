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

<main class="min-h-screen bg-black text-zinc-100 p-6 font-sans selection:bg-fuchsia-500/30 relative overflow-x-hidden">
    
    <div class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute inset-0" style="background: radial-gradient(ellipse at top, #18181b 0%, #09090b 50%, #000000 100%);"></div>
        <div class="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-fuchsia-900/15 via-transparent to-transparent"></div>
    </div>

    <div class="relative z-10">
        
        <header class="max-w-6xl mx-auto mb-12 mt-6 flex flex-col items-center">
            <h1 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 via-purple-500 to-violet-600 tracking-tighter drop-shadow-lg mb-2">
                PixelScry
            </h1>
            <p class="text-zinc-500 text-xs tracking-[0.2em] font-bold uppercase drop-shadow">The Database</p>
        </header>

        <section class="max-w-5xl mx-auto mb-14 relative">

<div class="max-w-3xl mx-auto w-full relative group">
    <div class="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
    
    <form action="/search" method="GET" class="relative z-10">
        <input 
            type="text" 
            name="q" 
            bind:value={searchQuery}
            placeholder="Search games, or use the filters below..." 
            autocomplete="off"
            class="w-full bg-zinc-950 border border-white/10 text-white placeholder-zinc-600 text-lg md:text-xl font-medium px-8 py-6 rounded-2xl outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 shadow-2xl transition-all"
        />
        <button type="submit" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-fuchsia-500 text-zinc-400 hover:text-white p-3 rounded-xl transition-colors border border-white/5 hover:border-transparent">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
    </form>
    
    <div class="mt-4 flex flex-wrap items-center justify-center gap-3 relative z-10">
        <span class="text-[10px] uppercase tracking-widest font-black text-zinc-600">Filters:</span>
        
        <select 
            onchange={(e) => appendFilter(e, 'platform')} 
            class="bg-zinc-900 border border-white/10 text-zinc-400 text-xs font-bold px-3 py-1.5 rounded-lg outline-none focus:border-fuchsia-500 hover:bg-zinc-800 transition-colors appearance-none cursor-pointer"
        >
            <option value="">+ Platform</option>
            <option value="ps5">PlayStation 5</option>
            <option value="xbox">Xbox Series X</option>
            <option value="switch">Nintendo Switch</option>
            <option value="pc">PC</option>
        </select>

        <select 
            onchange={(e) => appendFilter(e, 'genre')} 
            class="bg-zinc-900 border border-white/10 text-zinc-400 text-xs font-bold px-3 py-1.5 rounded-lg outline-none focus:border-fuchsia-500 hover:bg-zinc-800 transition-colors appearance-none cursor-pointer"
        >
            <option value="">+ Genre</option>
            <option value="rpg">RPG</option>
            <option value="shooter">Shooter</option>
            <option value="platform">Platformer</option>
            <option value="indie">Indie</option>
        </select>

        <select 
            onchange={(e) => appendFilter(e, 'rating')} 
            class="bg-zinc-900 border border-white/10 text-zinc-400 text-xs font-bold px-3 py-1.5 rounded-lg outline-none focus:border-fuchsia-500 hover:bg-zinc-800 transition-colors appearance-none cursor-pointer"
        >
            <option value="">+ Rating</option>
            <option value=">90">Masterpiece (90+)</option>
            <option value=">80">Great (80+)</option>
            <option value=">70">Good (70+)</option>
        </select>
    </div>
</div>
        </section>

        <div class="max-w-7xl mx-auto relative z-10">
            {#if data.success}
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 md:gap-7">
                    {#each data.games as game}
                    <a href="/game/{game.slug}" data-sveltekit-reload class="block group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/30 shadow-[0_15px_35px_rgba(0,0,0,0.8)] ring-1 ring-white/5 transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,70,239,0.2)] hover:border-fuchsia-600/50 hover:-translate-y-1.5 cursor-pointer">
                        
                        <div class="aspect-[3/4] w-full bg-zinc-950">
                            {#if game.background_image}
                                <img src={game.background_image} alt="{game.name} cover" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-85 group-hover:opacity-100" loading="lazy" />
                            {:else}
                                <GameCoverFallback name={game.name} />
                            {/if}
                        </div>

                        <div class="absolute bottom-0 left-0 w-full p-3 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-700/50 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h2 class="text-sm font-black text-zinc-100 truncate mb-1 tracking-tight drop-shadow-md">{game.name}</h2>
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{getReleaseYear(game) ?? 'N/A'}</span>
                                {#if getDisplayRating(game)}
                                    <span class="text-xs font-black text-fuchsia-400 bg-fuchsia-950/60 px-1.5 py-0.5 rounded shadow-inner ring-1 ring-fuchsia-900/50">{getDisplayRating(game)}</span>
                                {/if}
                            </div>
                        </div>
                    </a>
                    {/each}
                </div>
                
            {#if data.games.length === 0}
                <div class="text-center py-20 text-zinc-500 font-bold tracking-widest uppercase">
                    No results found in the void.
                </div>
                    {/if}

                    {#if data.games.length > 0}
                        <div class="mt-16 mb-8 flex items-center justify-center gap-6">
                            {#if data.searchState.page > 1}
                                <a href={getPageUrl(data.searchState.page - 1)} class="bg-zinc-950 border border-zinc-700 hover:border-fuchsia-600 text-zinc-400 hover:text-fuchsia-400 font-black uppercase tracking-[0.2em] text-[10px] px-6 py-3 rounded shadow-lg transition-all">
                                    &larr; Previous
                                </a>
                            {/if}
                            
                            <span class="text-zinc-600 font-black tracking-widest text-xs uppercase">
                                Page {data.searchState.page}
                            </span>

                            {#if data.hasMore}
                                <a href={getPageUrl(data.searchState.page + 1)} class="bg-zinc-950 border border-fuchsia-800/50 hover:border-fuchsia-500 text-fuchsia-500 hover:text-fuchsia-300 font-black uppercase tracking-[0.2em] text-[10px] px-6 py-3 rounded shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all">
                                    Next Sequence &rarr;
                                </a>
                            {/if}
                        </div>
                    {/if}

                {:else}
                <div class="bg-red-950/30 backdrop-blur-md border border-red-900/50 p-6 rounded-xl text-center max-w-lg mx-auto shadow-2xl">
                    <h2 class="text-xl font-black text-red-500 mb-2 uppercase tracking-widest drop-shadow">Critical Failure</h2>
                    <p class="text-red-400/80 text-sm">{data.error}</p>
                </div>
            {/if}
        </div>
    </div>
    {#if scrollY > 500}
        <button 
            onclick={scrollToTop} 
            class="fixed bottom-8 right-8 z-50 bg-zinc-950 border border-fuchsia-600/50 hover:border-fuchsia-500 text-fuchsia-500 p-3 rounded-full shadow-[0_0_20px_rgba(217,70,239,0.2)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:-translate-y-1 transition-all group"
            aria-label="Back to top"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    {/if}

</main>