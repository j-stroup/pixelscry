<script>
    import { onNavigate } from '$app/navigation';
    import '../app.css'; // This path is correct for src/app.css
    import SiteHeader from '$lib/components/SiteHeader.svelte';
    let { children } = $props();

    onNavigate((navigation) => {
        if (!document.startViewTransition) return;
        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>

<div class="flex flex-col min-h-screen bg-void font-sans selection:bg-signal/30">

    <SiteHeader />

    <div class="flex-grow">
        {@render children()}
    </div>

    <footer class="relative z-50 bg-panel border-t border-line pt-10 pb-8 mt-auto">
        <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <div class="flex flex-col items-center md:items-start">
                <span class="font-display text-2xl uppercase tracking-wide text-ink">Pixel<span class="text-signal">Scry</span></span>
                <span class="font-mono text-[9px] text-ink-faint font-medium uppercase tracking-[0.3em] mt-1">The database</span>
            </div>

            <nav class="flex gap-8 font-mono">
                <a href="/" class="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-faint hover:text-signal">Search</a>
                <a href="/best" class="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-faint hover:text-signal">Best Of</a>
                <a href="/tags" class="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-faint hover:text-signal">Browse Tags</a>
                <a href="/collection" class="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-faint hover:text-signal">My Collection</a>
                <a href="/about" class="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-faint hover:text-signal">About</a>
            </nav>

            <div class="font-mono text-[9px] text-ink-faint font-medium uppercase tracking-widest text-center md:text-right">
                <p>Data powered by <a href="https://rawg.io" target="_blank" class="text-ink-dim hover:text-signal">RAWG</a></p>
                <p class="mt-2 opacity-60">&copy; {new Date().getFullYear()} PixelScry.</p>
            </div>
        </div>
    </footer>
</div>
