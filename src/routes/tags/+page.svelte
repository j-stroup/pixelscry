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
        if (ratio > 0.5) return 'text-lg px-5 py-2.5';
        if (ratio > 0.2) return 'text-base px-4 py-2';
        if (ratio > 0.08) return 'text-sm px-3.5 py-1.5';
        return 'text-xs px-3 py-1.5';
    }
</script>

<SeoHead title={pageTitle} description={pageDescription} path="/tags" jsonLd={itemListSchema} />

<main class="min-h-screen bg-black text-zinc-100 relative selection:bg-fuchsia-500/30 pt-32 pb-24 px-6">
    <div class="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0"
         style="background: radial-gradient(ellipse at top, rgba(217,70,239, 0.15) 0%, transparent 70%);">
    </div>

    <div class="max-w-5xl mx-auto relative z-10">
        <a href="/" class="text-fuchsia-500 text-[10px] font-black tracking-[0.2em] uppercase mb-8 inline-block hover:underline">
            &larr; Back to Search
        </a>

        <div class="mb-12">
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white drop-shadow-lg mb-4">
                Browse by <span class="text-zinc-600">Tag</span>
            </h1>
            <p class="text-fuchsia-500 text-sm font-black tracking-[0.2em] uppercase">
                {data.tags.length} tags in the archive
            </p>
        </div>

        {#if data.tags.length === 0}
            <div class="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center shadow-2xl">
                <p class="text-zinc-300 text-xl font-medium">No tags yet — browse more games to populate the cache!</p>
            </div>
        {:else}
            <div class="bg-zinc-950/50 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                <div class="flex flex-wrap gap-2.5">
                    {#each data.tags as tag}
                        <a href="/category/tag/{encodeURIComponent(tag.name)}"
                           class="{sizeClass(tag.count, maxCount)} bg-zinc-900/80 hover:bg-fuchsia-500 border border-white/10 hover:border-transparent text-zinc-400 hover:text-white font-bold rounded-lg transition-colors duration-300">
                            {tag.name} <span class="opacity-50">({tag.count})</span>
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</main>
