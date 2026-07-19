<script>
    import SeoHead from '$lib/components/SeoHead.svelte';
    import { buildItemListSchema } from '$lib/jsonld.js';
    import { SITE_URL } from '$lib/siteConfig.js';

    let { data } = $props();

    const pageTitle = 'Browse Games by Tag | PixelScry';
    const pageDescription =
        "Discover games by tag — co-op, open world, story rich, atmospheric, and more. Browse PixelScry's full tag index.";

    let itemListSchema = $derived(
        data.tags.length > 0
            ? buildItemListSchema({
                  name: pageTitle,
                  url: `${SITE_URL}/tags`,
                  items: data.tags.map((t) => ({
                      url: `${SITE_URL}/category/tag/${encodeURIComponent(t.name)}`,
                      name: t.name
                  }))
              })
            : null
    );

    let maxCount = $derived(Math.max(...data.tags.map((t) => t.count), 1));

    function sizeClass(count, max) {
        const ratio = count / max;
        if (ratio > 0.5) return 'text-lg px-5 py-3';
        if (ratio > 0.2) return 'text-base px-4 py-2.5';
        if (ratio > 0.08) return 'text-sm px-3.5 py-2';
        return 'text-xs px-3 py-2';
    }
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/tags" jsonLd={itemListSchema} />

<main class="min-h-screen bg-void text-ink relative selection:bg-signal/30 pt-28 pb-24 px-6">
    <div class="max-w-5xl mx-auto relative z-10">
        <a href="/" class="font-mono text-signal text-[10px] font-medium tracking-[0.2em] uppercase mb-8 inline-block hover:opacity-80">
            &larr; Back to search
        </a>

        <div class="mb-10">
            <h1 class="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.92] uppercase text-ink mb-3">
                Browse by <span class="text-ink-faint">Tag</span>
            </h1>
            <p class="font-mono text-signal text-[11px] font-medium tracking-[0.2em] uppercase">
                {data.tags.length} tags in the archive
            </p>
        </div>

        {#if data.tags.length === 0}
            <div class="chassis-cut-sm bg-panel border border-line p-12 text-center">
                <p class="text-ink-dim text-lg font-medium">No tags yet — browse more games to populate the cache.</p>
            </div>
        {:else}
            <div class="flex flex-wrap gap-2.5 font-mono">
                {#each data.tags as tag}
                    <a href="/category/tag/{encodeURIComponent(tag.name)}"
                       class="chip-cut {sizeClass(tag.count, maxCount)} bg-panel hover:bg-signal border border-hair hover:border-transparent text-ink-dim hover:text-signal-ink font-medium transition-colors duration-300">
                        {tag.name} <span class="opacity-60">({tag.count})</span>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</main>
