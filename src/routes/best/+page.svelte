<script>
    import SeoHead from '$lib/components/SeoHead.svelte';
    import { buildItemListSchema } from '$lib/jsonld.js';
    import { SITE_URL } from '$lib/siteConfig.js';

    let { data } = $props();

    const pageTitle = 'Best Of — Every Ranked Collection | PixelScry';
    const pageDescription =
        "Every 'best of' ledger on PixelScry — top games by genre, by platform, and by genre+platform combination, ranked with a blend of critic and player scores.";

    let itemListSchema = $derived(
        buildItemListSchema({
            name: pageTitle,
            url: `${SITE_URL}/best`,
            items: [
                ...data.genres.map((g) => ({
                    url: `${SITE_URL}/category/genre/${encodeURIComponent(g.name)}`,
                    name: `Best ${g.name} Games`
                })),
                ...data.platforms.map((p) => ({
                    url: `${SITE_URL}/category/platform/${encodeURIComponent(p.name)}`,
                    name: `Best ${p.name} Games`
                }))
            ]
        })
    );
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/best" jsonLd={itemListSchema} />

<main class="min-h-screen bg-void text-ink relative selection:bg-signal/30 pt-28 pb-24 px-6">
    <div class="max-w-5xl mx-auto relative z-10">
        <a href="/" class="font-mono text-signal text-[10px] font-medium tracking-[0.2em] uppercase mb-8 inline-block hover:opacity-80">
            &larr; Back to search
        </a>

        <div class="mb-14">
            <p class="font-mono text-signal text-[11px] font-medium tracking-[0.2em] uppercase mb-2">
                Every Curated Ledger
            </p>
            <h1 class="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.92] uppercase text-ink mb-4">
                Best <span class="text-ink-faint">Of</span>
            </h1>
            <p class="text-ink-dim text-sm max-w-2xl leading-relaxed">
                Ranked collections across the archive, scored using a blend of critic and player
                ratings — not just a raw Metacritic dump. Pick a genre, a platform, or a
                genre+platform combination to see the top-rated games.
            </p>
        </div>

        {#if data.genres.length > 0}
            <section class="mb-14">
                <p class="font-mono text-ink-faint text-[10px] font-medium uppercase tracking-widest mb-4 pb-3 border-b border-line">
                    By Genre
                </p>
                <div class="flex flex-wrap gap-2.5 font-mono">
                    {#each data.genres as genre}
                        <a href="/category/genre/{encodeURIComponent(genre.name)}"
                           class="chip-cut text-sm px-4 py-2.5 bg-panel hover:bg-signal border border-hair hover:border-transparent text-ink-dim hover:text-signal-ink font-medium transition-colors duration-300">
                            Best {genre.name} <span class="opacity-60">({genre.count})</span>
                        </a>
                    {/each}
                </div>
            </section>
        {/if}

        {#if data.platforms.length > 0}
            <section class="mb-14">
                <p class="font-mono text-ink-faint text-[10px] font-medium uppercase tracking-widest mb-4 pb-3 border-b border-line">
                    By Platform
                </p>
                <div class="flex flex-wrap gap-2.5 font-mono">
                    {#each data.platforms as platform}
                        <a href="/category/platform/{encodeURIComponent(platform.name)}"
                           class="chip-cut text-sm px-4 py-2.5 bg-panel hover:bg-signal border border-hair hover:border-transparent text-ink-dim hover:text-signal-ink font-medium transition-colors duration-300">
                            Best {platform.name} <span class="opacity-60">({platform.count})</span>
                        </a>
                    {/each}
                </div>
            </section>
        {/if}

        {#if data.combos.length > 0}
            <section>
                <p class="font-mono text-ink-faint text-[10px] font-medium uppercase tracking-widest mb-4 pb-3 border-b border-line">
                    By Genre &amp; Platform
                </p>
                <div class="flex flex-wrap gap-2.5 font-mono">
                    {#each data.combos as combo}
                        <a href="/category/genre/{encodeURIComponent(combo.genre)}/platform/{encodeURIComponent(combo.platform)}"
                           class="chip-cut text-xs px-3.5 py-2 bg-panel hover:bg-signal border border-hair hover:border-transparent text-ink-dim hover:text-signal-ink font-medium transition-colors duration-300">
                            Best {combo.genre} {combo.platform} <span class="opacity-60">({combo.count})</span>
                        </a>
                    {/each}
                </div>
            </section>
        {/if}
    </div>
</main>
