<script>
    import { page } from '$app/state';
    import { onNavigate } from '$app/navigation';
    import '../app.css'; // This path is correct for src/app.css
    import SiteHeader from '$lib/components/SiteHeader.svelte';
    import Analytics from '$lib/components/Analytics.svelte';
    let { children } = $props();

    // The game detail page draws its own per-title accent glow — skip the
    // site-wide texture there so the two don't compete.
    let isGamePage = $derived(page.url.pathname.startsWith('/game/'));

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

<Analytics />

<a href="#main-content"
   class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-signal focus:text-signal-ink focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-medium focus:uppercase focus:tracking-widest">
    Skip to content
</a>

<div class="flex flex-col min-h-screen font-sans selection:bg-signal/30 {isGamePage ? 'bg-void' : 'page-texture'}">

    <SiteHeader />

    <div id="main-content" class="flex-grow">
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
                <a href="/privacy" class="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-faint hover:text-signal">Privacy</a>
            </nav>

            <div class="font-mono text-[9px] text-ink-faint font-medium uppercase tracking-widest text-center md:text-right">
                <p>Data powered by <a href="https://rawg.io" target="_blank" class="text-ink-dim hover:text-signal">RAWG</a></p>
                <p class="mt-2 opacity-60">&copy; {new Date().getFullYear()} PixelScry.</p>
            </div>
        </div>
    </footer>
</div>

<style>
    /* Option D from the background-texture review: a soft signal-amber
       glow under fine diagonal scanlines. Fixed attachment so it reads as
       one ambient backdrop rather than scrolling with tall pages. Not
       used on the game detail page — see isGamePage above. */
    .page-texture {
        background-color: var(--color-void);
        background-image:
            radial-gradient(ellipse 900px 500px at 50% -8%, rgba(255, 176, 32, 0.1) 0%, transparent 70%),
            repeating-linear-gradient(
                115deg,
                rgba(236, 238, 242, 0.035) 0px,
                rgba(236, 238, 242, 0.035) 1px,
                transparent 1px,
                transparent 5px
            );
        background-attachment: fixed;
    }
</style>
