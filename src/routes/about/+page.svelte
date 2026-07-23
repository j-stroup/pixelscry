<script>
    import SeoHead from '$lib/components/SeoHead.svelte';
</script>

<SeoHead
    title="About | PixelScry"
    description="PixelScry is a fast, ad-light video game database for searching and discovering games by genre, platform, and rating."
    path="/about"
/>

<main class="min-h-screen text-ink relative overflow-x-hidden pt-24 pb-32">

    <div class="relative z-10 max-w-4xl mx-auto px-6">

        <header class="mb-14">
            <h1 class="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.92] uppercase text-ink mb-3">
                Initialization
            </h1>
            <p class="font-mono text-signal text-xs md:text-sm tracking-[0.3em] font-medium uppercase">The architecture of PixelScry</p>
        </header>

        <div class="space-y-6">

            <section class="chassis-cut-sm bg-panel border border-line p-8 md:p-12 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-1 h-full bg-signal"></div>

                <h2 class="font-mono text-signal text-xs tracking-[0.2em] uppercase font-medium mb-6 ml-2">Mission directive</h2>
                <div class="text-ink-dim leading-relaxed text-lg font-normal ml-2 space-y-6">
                    <p>
                        PixelScry was forged to solve a singular problem: standard video game storefronts prioritize algorithms, marketing, and profit margins over pure, unadulterated data.
                    </p>
                    <p>
                        We set out to build the "Scryfall of video games" — a surgical, high-speed database that respects the user's intelligence. Whether you are looking for an isometric sci-fi RPG with drop-in co-op, or just trying to remember the name of that obscure PS2 shooter, PixelScry gives you the tools to isolate your target instantly.
                    </p>
                </div>
            </section>

            <section class="chassis-cut-sm bg-panel-2 border border-hair p-8">
                <h2 class="font-mono text-ink-faint text-[10px] tracking-widest uppercase font-medium mb-6 border-b border-hair pb-3">Technical specifications</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-mono text-ink font-medium uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                            <span class="w-2 h-2 bg-signal"></span> The mainframe
                        </h3>
                        <p class="text-ink-dim text-sm leading-relaxed">
                            All intel is sourced directly from the <strong class="text-ink font-medium">RAWG Video Games Database</strong>. It is crowdsourced, heavily verified, and provides data points that commercial storefronts deliberately hide.
                        </p>
                    </div>
                    <div>
                        <h3 class="font-mono text-ink font-medium uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                            <span class="w-2 h-2 bg-signal"></span> The engine
                        </h3>
                        <p class="text-ink-dim text-sm leading-relaxed">
                            PixelScry is compiled using <strong class="text-ink font-medium">Svelte 5</strong> and styled with a utility-first tactical overlay. It is designed to be lightweight, instantaneous, and aggressively anti-bloat.
                        </p>
                    </div>
                </div>
            </section>

            <section class="chassis-cut-sm bg-panel-2 border border-hair p-8">
                <h2 class="font-mono text-ink-faint text-[10px] tracking-widest uppercase font-medium mb-4 border-b border-hair pb-3">Open a channel</h2>
                <p class="text-ink-dim text-sm leading-relaxed">
                    Questions, feedback, or something broken?
                    <a href="mailto:contact@pixelscry.com" class="text-signal hover:opacity-80">contact@pixelscry.com</a>
                </p>
            </section>

        </div>

    </div>
</main>
