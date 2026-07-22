<script>
    import { page } from '$app/state';
    import { afterNavigate } from '$app/navigation';

    let mobileOpen = $state(false);

    const links = [
        { href: '/', label: 'Search' },
        { href: '/best', label: 'Best Of' },
        { href: '/tags', label: 'Browse Tags' },
        { href: '/collection', label: 'My Collection' },
        { href: '/about', label: 'About' }
    ];

    let currentPath = $derived(page.url.pathname);

    afterNavigate(() => {
        mobileOpen = false;
    });
</script>

<header class="sticky top-0 z-50 bg-void/95 backdrop-blur-sm border-b border-line">
    <div class="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <a href="/" class="font-display text-2xl tracking-wide uppercase shrink-0 text-ink">
            Pixel<span class="text-signal">Scry</span>
        </a>

        <nav class="hidden md:flex items-center gap-7 font-mono">
            {#each links as link}
                <a href={link.href}
                   class="relative text-[11px] font-medium uppercase tracking-[0.15em] transition-colors py-1
                          {currentPath === link.href ? 'text-signal' : 'text-ink-dim hover:text-ink'}">
                    {link.label}
                    {#if currentPath === link.href}
                        <span class="absolute -bottom-1 left-0 right-0 h-[2px] bg-signal"></span>
                    {/if}
                </a>
            {/each}
        </nav>

        <button
            onclick={() => (mobileOpen = !mobileOpen)}
            class="md:hidden text-ink-dim hover:text-ink p-2.5 -mr-2.5"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
        >
            {#if mobileOpen}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            {/if}
        </button>
    </div>

    {#if mobileOpen}
        <nav class="md:hidden flex flex-col border-t border-line px-4 py-3 font-mono">
            {#each links as link}
                <a href={link.href}
                   class="py-3 text-sm font-medium uppercase tracking-[0.15em] border-b border-hair last:border-0
                          {currentPath === link.href ? 'text-signal' : 'text-ink-dim'}">
                    {link.label}
                </a>
            {/each}
        </nav>
    {/if}
</header>
