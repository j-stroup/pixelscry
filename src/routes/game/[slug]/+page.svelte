<script>
    import { isOwned, toggleOwned } from '$lib/collection.svelte.js';
    import { getDisplayRating, getReleaseYear } from '$lib/gameDisplay.js';
    import GameCoverFallback from '$lib/components/GameCoverFallback.svelte';
    import SeoHead from '$lib/components/SeoHead.svelte';
    import { buildVideoGameSchema } from '$lib/jsonld.js';
    import { SITE_URL } from '$lib/siteConfig.js';

    let { data } = $props();

    let game = $derived(data.game || {});
    let scrollY = $state(0);
    let owned = $derived(game.slug ? isOwned(game.slug) : false);

    // Data Helpers
    let developer = $derived(game.developers?.[0]?.name || 'Unknown');
    let publisher = $derived(game.publishers?.[0]?.name || 'Unknown');
    let heroImage = $derived(game.background_image_additional || game.background_image);

    let esrb = $derived(game.esrb_rating?.name || null);
    let engTags = $derived((game.tags || []).filter((t) => t.language === 'eng').slice(0, 14));
    let storeNames = $derived([...new Set((game.stores || []).map((s) => s.store?.name).filter(Boolean))]);
    let ratingBreakdown = $derived([...(game.ratings || [])].sort((a, b) => b.percent - a.percent));
    let alsoKnownAs = $derived(
        game.name_original && game.name_original !== game.name ? game.name_original : null
    );
    let releaseLabel = $derived(
        game.tba
            ? 'Coming Soon'
            : game.released
              ? new Date(game.released).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
              : 'Unknown'
    );

    let canonicalPath = $derived(`/game/${game.slug}`);
    let metaDescription = $derived.by(() => {
        if (game.description_raw) {
            const trimmed = game.description_raw.trim();
            return trimmed.length > 155 ? `${trimmed.slice(0, 155)}…` : trimmed;
        }
        const year = getReleaseYear(game);
        const genreList = (game.genres || []).map((g) => g.name).join(', ');
        return `${game.name}${year ? ` (${year})` : ''}${genreList ? ` — ${genreList}` : ''} on PixelScry.`;
    });
    let videoGameSchema = $derived(
        data.success ? buildVideoGameSchema(game, `${SITE_URL}${canonicalPath}`) : null
    );

    // Theme Color Logic
    let themeColor = $state('217, 70, 239'); // Default Fuchsia (rgb components)

    $effect(() => {
        if (!game.background_image) return;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = game.background_image;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1; canvas.height = 1;
            ctx.drawImage(img, 0, 0, 1, 1);
            let [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

            // THE BOOSTER: If the color is too dark, crank it up!
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            if (brightness < 100) {
                r = Math.min(255, r + 80);
                g = Math.min(255, g + 80);
                b = Math.min(255, b + 80);
            }

            themeColor = `${r}, ${g}, ${b}`;
        };
    });
</script>

<svelte:window bind:scrollY={scrollY} />

{#if data.success}
    <SeoHead
        title="{game.name} | PixelScry"
        description={metaDescription}
        path={canonicalPath}
        image={game.background_image}
        jsonLd={videoGameSchema}
    />
{:else}
    <SeoHead
        title="Game Not Found | PixelScry"
        description="This game could not be found on PixelScry."
        path="/game/{data.slug}"
        noindex={true}
    />
{/if}

<main class="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-fuchsia-500/30 overflow-x-hidden"
      style="--theme-rgb: {themeColor}">

<div class="fixed inset-0 z-0">
    <div class="absolute inset-0 bg-zinc-950/80 z-10"></div>

    {#if heroImage}
        <img
            src={heroImage}
            alt=""
            class="w-full h-full object-cover opacity-100"
        />
    {/if}
</div>

            <div class="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0"
                     style="background: radial-gradient(ellipse at top, rgba(var(--theme-rgb), 0.25) 0%, transparent 70%);">
                </div>

                {#if data.success}
                    <div class="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-24">

                        <div class="flex flex-col md:flex-row gap-12 items-start">

                            <div class="shrink-0 w-64 flex flex-col gap-6" style="view-transition-name: game-cover-{game.slug}">
                                <div class="rounded-xl overflow-hidden aspect-[3/4] bg-zinc-900 border border-[rgba(var(--theme-rgb),0.5)] shadow-[0_0_80px_rgba(var(--theme-rgb),0.4)] relative">
                                    <div class="absolute inset-0 shadow-[inset_0_0_30px_rgba(var(--theme-rgb),0.3)] pointer-events-none z-10"></div>
                                    {#if game.background_image}
                                        <img src={game.background_image} alt="{game.name}" class="w-full h-full object-cover" />
                                    {:else}
                                        <GameCoverFallback name={game.name} />
                                    {/if}
                                </div>

                                <div class="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 flex flex-col gap-4">
                                    <div>
                                        <h4 class="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Release</h4>
                                        <p class="text-zinc-200 text-sm font-bold">{releaseLabel}</p>
                                    </div>
                                    <div>
                                        <h4 class="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Publisher</h4>
                                        <p class="text-zinc-200 text-sm font-bold">{publisher}</p>
                                    </div>
                                    {#if esrb}
                                        <div>
                                            <h4 class="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">ESRB Rating</h4>
                                            <p class="text-zinc-200 text-sm font-bold">{esrb}</p>
                                        </div>
                                    {/if}
                                    {#if game.playtime}
                                        <div>
                                            <h4 class="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Time to Beat</h4>
                                            <p class="text-zinc-200 text-sm font-bold">~{game.playtime} hours</p>
                                        </div>
                                    {/if}
                                    {#if game.added}
                                        <div>
                                            <h4 class="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Community</h4>
                                            <p class="text-zinc-200 text-sm font-bold">{game.added.toLocaleString()} tracking this game</p>
                                            {#if game.added_by_status?.beaten}
                                                <p class="text-zinc-500 text-xs mt-0.5">{game.added_by_status.beaten.toLocaleString()} beaten it</p>
                                            {/if}
                                        </div>
                                    {/if}
                                    {#if alsoKnownAs}
                                        <div>
                                            <h4 class="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-1">Also Known As</h4>
                                            <p class="text-zinc-200 text-sm font-bold">{alsoKnownAs}</p>
                                        </div>
                                    {/if}
                                    {#if ratingBreakdown.length > 0}
                                        <div>
                                            <h4 class="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-2">User Ratings</h4>
                                            <div class="flex flex-col gap-1.5">
                                                {#each ratingBreakdown as r}
                                                    <div class="flex items-center gap-2 text-xs">
                                                        <span class="text-zinc-400 capitalize w-16 shrink-0 truncate">{r.title}</span>
                                                        <div class="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                            <div class="h-full bg-[rgba(var(--theme-rgb),0.8)]" style="width: {r.percent}%"></div>
                                                        </div>
                                                        <span class="text-zinc-500 w-9 text-right shrink-0">{r.percent}%</span>
                                                    </div>
                                                {/each}
                                            </div>
                                        </div>
                                    {/if}
                                    {#if game.website || game.reddit_url}
                                        <div class="flex flex-col gap-1.5 pt-1 border-t border-white/5">
                                            {#if game.website}
                                                <a href={game.website} target="_blank" rel="noopener" class="text-fuchsia-400 hover:text-fuchsia-300 text-xs font-bold">Official Website &rarr;</a>
                                            {/if}
                                            {#if game.reddit_url}
                                                <a href={game.reddit_url} target="_blank" rel="noopener" class="text-fuchsia-400 hover:text-fuchsia-300 text-xs font-bold">Subreddit &rarr;</a>
                                            {/if}
                                        </div>
                                    {/if}
                                </div>

                                </div>

                            <div class="flex-1 min-w-0"> <h1 class="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 text-white drop-shadow-[0_4px_20px_rgba(var(--theme-rgb),0.3)]">
                    {game.name}
                </h1>

                <div class="flex flex-wrap items-center gap-4 mb-8">
                    <span class="bg-[rgba(var(--theme-rgb),0.15)] border border-[rgba(var(--theme-rgb),0.4)] text-[rgba(var(--theme-rgb),1)] font-black px-4 py-1.5 rounded-md shadow-[0_0_15px_rgba(var(--theme-rgb),0.15)] text-sm tracking-widest">
                        RATING: {getDisplayRating(game) ?? 'N/A'}
                    </span>
                    <span class="text-zinc-300 font-bold text-xs uppercase tracking-widest bg-zinc-900/80 px-4 py-1.5 rounded-md border border-white/5">
                        {developer} <span class="text-zinc-600 mx-2">|</span> {getReleaseYear(game) ?? 'N/A'}
                    </span>
                </div>

                <div class="mb-10">
                    <div class="flex flex-wrap gap-3">
                        <button onclick={() => toggleOwned(game.slug)}
                                class="font-black text-xs uppercase tracking-widest px-5 py-3 rounded-lg transition-colors duration-300 border
                                {owned
                                    ? 'bg-[rgba(var(--theme-rgb),0.2)] border-[rgba(var(--theme-rgb),0.6)] text-white'
                                    : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white hover:border-[rgba(var(--theme-rgb),0.5)]'}">
                            {owned ? '✓ In Your Collection' : '+ Add to Collection'}
                        </button>
                        {#if data.buyLinks?.amazon}
                            <a href={data.buyLinks.amazon} target="_blank" rel="sponsored noopener"
                               class="bg-[rgba(var(--theme-rgb),0.15)] hover:bg-[rgba(var(--theme-rgb),0.3)] border border-[rgba(var(--theme-rgb),0.4)] text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-lg transition-colors duration-300">
                                Buy on Amazon
                            </a>
                        {/if}
                        {#if data.buyLinks?.ebay}
                            <a href={data.buyLinks.ebay} target="_blank" rel="sponsored noopener"
                               class="bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-[rgba(var(--theme-rgb),0.5)] text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-lg transition-colors duration-300">
                                Search on eBay
                            </a>
                        {/if}
                    </div>
                    {#if data.buyLinks?.amazon || data.buyLinks?.ebay}
                        <p class="text-zinc-600 text-[10px] mt-3 tracking-wide">
                            As an affiliate, PixelScry may earn a commission from qualifying purchases made through these links.
                        </p>
                    {/if}
                </div>

                    <div class="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-10 shadow-2xl relative overflow-hidden group">
                        <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(var(--theme-rgb),0.8)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <h3 class="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] mb-3">Overview</h3>
                        <p class="text-zinc-300 text-lg md:text-xl leading-relaxed font-medium">
                            {game.description_raw || 'No summary available.'}
                        </p>

                        <div class="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                            {#each game.genres || [] as genre}
                                <a href="/category/genre/{encodeURIComponent(genre.name)}" class="bg-zinc-950/50 hover:bg-[rgba(var(--theme-rgb),0.2)] border border-white/5 hover:border-[rgba(var(--theme-rgb),0.5)] text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded transition-colors duration-300">
                                    {genre.name}
                                </a>
                            {/each}
                            {#each game.platforms || [] as p}
                                {#if p.platform?.name}
                                    <a href="/category/platform/{encodeURIComponent(p.platform.name)}" class="bg-zinc-950/50 hover:bg-[rgba(var(--theme-rgb),0.2)] border border-white/5 hover:border-[rgba(var(--theme-rgb),0.5)] text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded transition-colors duration-300">
                                        {p.platform.name}
                                    </a>
                                {/if}
                            {/each}
                        </div>

                        {#if engTags.length > 0}
                            <div class="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                                {#each engTags as tag}
                                    <a href="/category/tag/{encodeURIComponent(tag.name)}" class="bg-zinc-950/30 hover:bg-[rgba(var(--theme-rgb),0.2)] text-zinc-500 hover:text-white text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded transition-colors duration-300">
                                        {tag.name}
                                    </a>
                                {/each}
                            </div>
                        {/if}

                        {#if storeNames.length > 0}
                            <div class="mt-4 flex flex-wrap items-baseline gap-2">
                                <span class="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Available On</span>
                                <span class="text-zinc-400 text-xs font-bold">{storeNames.join(' · ')}</span>
                            </div>
                        {/if}

                </div>

                {#if data.moreLikeThis?.length > 0}
                    <h3 class="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] mb-4">More Like This</h3>
                    <div class="bg-zinc-950/50 border border-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {#each data.moreLikeThis as rec}
                                <a href="/game/{rec.slug}" class="aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden border border-white/10 hover:border-[rgba(var(--theme-rgb),0.8)] hover:shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)] hover:-translate-y-1 transition-all duration-300 relative group">
                                    {#if rec.background_image}
                                        <img src={rec.background_image} alt="{rec.name}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    {:else}
                                        <GameCoverFallback name={rec.name} />
                                    {/if}
                                </a>
                            {/each}
                        </div>
                    </div>
                {/if}
                </div>
                </div>
                </div>
{/if}
</main>
