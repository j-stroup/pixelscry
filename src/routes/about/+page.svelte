<script>
    import SeoHead from '$lib/components/SeoHead.svelte';
</script>

<SeoHead
    title="About | PixelScry"
    description="PixelScry is a fast, ad-light video game database for searching and discovering games by genre, platform, and rating."
    path="/about"
/>

<main class="text-zinc-100 relative overflow-x-hidden pt-20 pb-32">
    
    <div class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute inset-0" style="background: radial-gradient(ellipse at top, #18181b 0%, #09090b 50%, #000000 100%);"></div>
        <div class="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-fuchsia-900/10 via-transparent to-transparent"></div>
    </div>

    <div class="relative z-10 max-w-4xl mx-auto px-6">
        
        <header class="mb-16">
            <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 via-purple-500 to-violet-600 tracking-tighter drop-shadow-lg mb-4 uppercase">
                Initialization
            </h1>
            <p class="text-zinc-500 text-xs md:text-sm tracking-[0.3em] font-black uppercase drop-shadow">The Architecture of PixelScry</p>
        </header>

        <div class="space-y-8">
            
            <section class="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 p-8 md:p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] ring-1 ring-white/5 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-fuchsia-500 to-purple-600"></div>

                <h2 class="text-fuchsia-500 text-xs tracking-[0.2em] uppercase font-black mb-6 ml-2">Mission Directive</h2>
                <div class="text-zinc-300 leading-relaxed text-lg font-medium ml-2 space-y-6">
                    <p>
                        PixelScry was forged to solve a singular problem: standard video game storefronts prioritize algorithms, marketing, and profit margins over pure, unadulterated data. 
                    </p>
                    <p>
                        We set out to build the "Scryfall of Video Games"—a surgical, high-speed database that respects the user's intelligence. Whether you are looking for an isometric sci-fi RPG with drop-in co-op, or just trying to remember the name of that obscure PS2 shooter, PixelScry gives you the tools to isolate your target instantly.
                    </p>
                </div>
            </section>

            <section class="bg-zinc-950/80 border border-zinc-800/50 p-8 rounded-2xl shadow-inner relative">
                <h2 class="text-zinc-500 text-[10px] tracking-widest uppercase font-black mb-6 border-b border-zinc-800 pb-3">Technical Specifications</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-zinc-100 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                            <span class="w-2 h-2 bg-purple-500 rounded-full"></span> The Mainframe
                        </h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            All intel is sourced directly from the <strong class="text-zinc-200">RAWG Video Games Database</strong>. It is crowdsourced, heavily verified, and provides data points that commercial storefronts deliberately hide.
                        </p>
                    </div>
                    <div>
                        <h3 class="text-zinc-100 font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                            <span class="w-2 h-2 bg-fuchsia-500 rounded-full"></span> The Engine
                        </h3>
                        <p class="text-zinc-400 text-sm leading-relaxed">
                            PixelScry is compiled using <strong class="text-zinc-200">Svelte 5</strong> and styled with a utility-first tactical overlay. It is designed to be lightweight, instantaneous, and aggressively anti-bloat.
                        </p>
                    </div>
                </div>
            </section>

        </div>
        
    </div>
</main>