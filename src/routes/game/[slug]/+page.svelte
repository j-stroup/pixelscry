<script>
    import { isOwned, toggleOwned } from '$lib/collection.svelte.js';
    import { getDisplayRating, getReleaseYear } from '$lib/gameDisplay.js';
    import GameCoverFallback from '$lib/components/GameCoverFallback.svelte';
    import SeoHead from '$lib/components/SeoHead.svelte';
    import { buildVideoGameSchema } from '$lib/jsonld.js';
    import { SITE_URL } from '$lib/siteConfig.js';

    let { data } = $props();

    let game = $derived(data.game || {});
    let owned = $derived(game.slug ? isOwned(game.slug) : false);

    // Data Helpers
    let developer = $derived(game.developers?.[0]?.name || 'Unknown');
    let publisher = $derived(game.publishers?.[0]?.name || 'Unknown');

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
        if (data.descriptionText) {
            const trimmed = data.descriptionText.trim();
            return trimmed.length > 155 ? `${trimmed.slice(0, 155)}…` : trimmed;
        }
        const year = getReleaseYear(game);
        const genreList = (game.genres || []).map((g) => g.name).join(', ');
        return `${game.name}${year ? ` (${year})` : ''}${genreList ? ` — ${genreList}` : ''} on PixelScry.`;
    });
    let videoGameSchema = $derived(
        data.success ? buildVideoGameSchema(game, `${SITE_URL}${canonicalPath}`, data.descriptionText) : null
    );

    // Per-game accent, computed server-side from the cover art at cache
    // time (see accentColor.js) — the technical core of the "one chassis,
    // every game its own signal" concept. Falls back to the site's own
    // signal amber if extraction ever failed.
    let themeColor = $derived(data.accentColor || '255, 176, 32');
</script>

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

<main class="min-h-screen bg-void text-ink selection:bg-signal/30 overflow-x-hidden relative" style="--accent: {themeColor};">

    <div class="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0"
         style="background: radial-gradient(ellipse at top, rgba(var(--accent), 0.12) 0%, transparent 70%);">
    </div>

    {#if data.success}
        <div class="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-24">

            <div class="chassis-cut bg-[color-mix(in_srgb,rgb(var(--accent))_45%,var(--color-line))] p-px">
                <div class="chassis-cut bg-panel grid md:grid-cols-[300px_1fr]">

                    <div class="art-frame relative aspect-[3/4] md:aspect-auto bg-panel-2 border-b md:border-b-0 md:border-r border-line overflow-hidden" style="view-transition-name: game-cover-{game.slug}">
                        {#if game.background_image}
                            <img src={game.background_image} alt="{game.name}" class="w-full h-full object-cover" />
                        {:else}
                            <GameCoverFallback name={game.name} />
                        {/if}
                        {#if getDisplayRating(game)}
                            <div class="rating-tab absolute top-0 right-0 flex flex-col items-end px-4 pt-2.5 pb-2">
                                <span class="font-display text-3xl leading-none">{getDisplayRating(game)}</span>
                                <span class="font-mono text-[9px] font-medium tracking-[0.12em] uppercase">Score</span>
                            </div>
                        {/if}
                    </div>

                    <div class="p-6 md:p-9 min-w-0">
                        <div class="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] uppercase mb-2 text-accent">
                            <span class="w-5 h-[2px] bg-accent"></span>
                            {(game.genres || []).map((g) => g.name).join(' · ') || 'Uncategorized'}
                        </div>

                        <h1 class="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] uppercase text-ink mb-4" style="text-wrap: balance;">
                            {game.name}
                        </h1>

                        <p class="font-mono text-[13px] text-ink-dim mb-6">
                            <span class="text-ink font-medium">{developer}</span> &nbsp;/&nbsp; {releaseLabel} &nbsp;/&nbsp; Rated {esrb ?? 'Unrated'}
                        </p>

                        <div class="mb-6">
                            <div class="flex flex-wrap gap-2.5">
                                <button onclick={() => toggleOwned(game.slug)}
                                        class="btn-cut font-mono font-medium text-[11px] uppercase tracking-[0.1em] px-5 py-3 transition-colors border
                                        {owned
                                            ? 'bg-accent text-signal-ink border-accent'
                                            : 'bg-transparent border-accent/60 text-ink hover:bg-accent hover:text-signal-ink'}">
                                    {owned ? 'In your collection' : 'Add to collection'}
                                </button>
                                {#if data.buyLinks?.amazon}
                                    <a href={data.buyLinks.amazon} target="_blank" rel="sponsored noopener"
                                       class="btn-cut font-mono font-medium text-[11px] uppercase tracking-[0.1em] px-5 py-3 border border-hair bg-panel-2 text-ink-dim hover:text-ink hover:border-ink-faint transition-colors">
                                        Buy on Amazon
                                    </a>
                                {/if}
                                {#if data.buyLinks?.ebay}
                                    <a href={data.buyLinks.ebay} target="_blank" rel="sponsored noopener"
                                       class="btn-cut font-mono font-medium text-[11px] uppercase tracking-[0.1em] px-5 py-3 border border-hair bg-panel-2 text-ink-dim hover:text-ink hover:border-ink-faint transition-colors">
                                        Search on eBay
                                    </a>
                                {/if}
                            </div>
                            {#if data.buyLinks?.amazon || data.buyLinks?.ebay}
                                <p class="font-mono text-ink-faint text-[10px] mt-3 tracking-wide">
                                    As an affiliate, PixelScry may earn a commission from qualifying purchases made through these links.
                                </p>
                            {/if}
                        </div>

                        <div class="spec-block grid grid-cols-2 sm:grid-cols-4 border border-hair bg-panel-2 mb-6">
                            <div class="spec-cell p-3 border-hair">
                                <p class="font-mono text-[9px] tracking-[0.12em] uppercase text-ink-faint mb-1">Released</p>
                                <p class="font-mono text-sm font-medium text-ink">{getReleaseYear(game) ?? 'Unknown'}</p>
                            </div>
                            <div class="spec-cell p-3 border-hair">
                                <p class="font-mono text-[9px] tracking-[0.12em] uppercase text-ink-faint mb-1">Publisher</p>
                                <p class="font-mono text-sm font-medium text-ink truncate">{publisher}</p>
                            </div>
                            <div class="spec-cell p-3 border-hair">
                                <p class="font-mono text-[9px] tracking-[0.12em] uppercase text-ink-faint mb-1">Time to beat</p>
                                <p class="font-mono text-sm font-medium text-ink">{game.playtime ? `~${game.playtime} hrs` : 'N/A'}</p>
                            </div>
                            <div class="spec-cell p-3">
                                <p class="font-mono text-[9px] tracking-[0.12em] uppercase text-ink-faint mb-1">Community</p>
                                <p class="font-mono text-sm font-medium text-ink">{game.added ? game.added.toLocaleString() : 'N/A'}</p>
                            </div>
                        </div>

                        {#if data.descriptionHtml}
                            <div class="prose prose-invert max-w-none mb-6
                                        prose-p:text-ink-dim prose-p:leading-relaxed prose-p:font-normal
                                        prose-headings:font-display prose-headings:text-ink prose-headings:uppercase prose-headings:tracking-wide prose-h3:text-xl
                                        prose-strong:text-ink prose-a:text-accent hover:prose-a:opacity-80
                                        prose-li:text-ink-dim prose-blockquote:text-ink-faint prose-blockquote:border-accent/50">
                                {@html data.descriptionHtml}
                            </div>
                        {:else}
                            <p class="text-ink-dim leading-relaxed mb-6">No summary available.</p>
                        {/if}

                        {#if alsoKnownAs || ratingBreakdown.length > 0}
                            <div class="mb-6 font-mono text-xs">
                                {#if alsoKnownAs}
                                    <p class="text-ink-faint mb-2">Also known as <span class="text-ink-dim">{alsoKnownAs}</span></p>
                                {/if}
                                {#if ratingBreakdown.length > 0}
                                    <div class="flex flex-col gap-1.5 max-w-sm">
                                        {#each ratingBreakdown as r}
                                            <div class="flex items-center gap-2">
                                                <span class="text-ink-faint capitalize w-20 shrink-0 truncate">{r.title}</span>
                                                <div class="flex-1 h-1 bg-panel-2">
                                                    <div class="h-full bg-accent" style="width: {r.percent}%"></div>
                                                </div>
                                                <span class="text-ink-faint w-9 text-right shrink-0">{r.percent}%</span>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/if}

                        <div class="flex flex-wrap gap-2 mb-4">
                            {#each game.genres || [] as genre}
                                <a href="/category/genre/{encodeURIComponent(genre.name)}" class="chip-cut bg-panel-2 hover:bg-accent hover:text-signal-ink border border-hair text-ink-dim text-[10px] font-mono font-medium uppercase tracking-widest px-3 py-1.5 transition-colors">
                                    {genre.name}
                                </a>
                            {/each}
                            {#each game.platforms || [] as p}
                                {#if p.platform?.name}
                                    <a href="/category/platform/{encodeURIComponent(p.platform.name)}" class="chip-cut bg-panel-2 hover:bg-accent hover:text-signal-ink border border-hair text-ink-dim text-[10px] font-mono font-medium uppercase tracking-widest px-3 py-1.5 transition-colors">
                                        {p.platform.name}
                                    </a>
                                {/if}
                            {/each}
                        </div>

                        {#if engTags.length > 0}
                            <div class="flex flex-wrap gap-1.5 mb-4 pt-4 border-t border-hair">
                                {#each engTags as tag}
                                    <a href="/category/tag/{encodeURIComponent(tag.name)}" class="font-mono text-[9px] uppercase tracking-wide text-ink-faint hover:text-accent bg-panel-2 px-2 py-1 transition-colors">
                                        {tag.name}
                                    </a>
                                {/each}
                            </div>
                        {/if}

                        {#if storeNames.length > 0}
                            <p class="font-mono text-xs text-ink-faint">
                                <span class="uppercase tracking-widest text-[9px]">Available on</span> {storeNames.join(' · ')}
                            </p>
                        {/if}
                    </div>
                </div>
            </div>

            {#if data.moreLikeThis?.length > 0}
                <p class="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint mt-12 mb-4 pb-3 border-b border-line">More like this</p>
                <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {#each data.moreLikeThis as rec}
                        <a href="/game/{rec.slug}" class="card-cut block bg-panel-2 border border-line hover:border-accent/60 transition-colors group overflow-hidden">
                            <div class="aspect-[3/4] w-full">
                                {#if rec.background_image}
                                    <img src={rec.background_image} alt="{rec.name}" class="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
                                {:else}
                                    <GameCoverFallback name={rec.name} />
                                {/if}
                            </div>
                            <p class="font-sans font-medium text-xs text-ink-dim group-hover:text-ink truncate p-2 transition-colors">{rec.name}</p>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</main>

<style>
    .art-frame::before {
        content: '';
        position: absolute;
        inset: 14px;
        border: 1.5px solid color-mix(in srgb, rgb(var(--accent)) 70%, transparent);
        clip-path: polygon(0 18px, 18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%);
        opacity: 0.85;
        pointer-events: none;
    }
    .rating-tab {
        background: rgb(var(--accent));
        color: var(--color-signal-ink);
        clip-path: polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px);
    }
    .text-accent { color: rgb(var(--accent)); }
    .bg-accent { background-color: rgb(var(--accent)); }
    .border-accent\/60 { border-color: rgb(var(--accent) / 0.6); }
</style>
