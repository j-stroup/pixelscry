<script>
    import { page } from '$app/state';
    import { afterNavigate } from '$app/navigation';

    let mobileOpen = $state(false);

    const links = [
        { href: '/', label: 'Search' },
        { href: '/tags', label: 'Browse Tags' },
        { href: '/collection', label: 'My Collection' },
        { href: '/about', label: 'About' }
    ];

    let currentPath = $derived(page.url.pathname);

    afterNavigate(() => {
        mobileOpen = false;
    });
</script>

<header class="sticky top-0 z-50 bg-black/85 backdrop-blur-xl border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <a href="/" class="text-lg font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 to-purple-500 tracking-tighter uppercase shrink-0">
            PixelScry
        </a>

        <nav class="hidden md:flex items-center gap-7">
            {#each links as link}
                <a href={link.href}
                   class="text-[11px] font-black uppercase tracking-[0.15em] transition-colors
                          {currentPath === link.href ? 'text-fuchsia-400' : 'text-zinc-400 hover:text-fuchsia-400'}">
                    {link.label}
                </a>
            {/each}
        </nav>

        <button
            onclick={() => (mobileOpen = !mobileOpen)}
            class="md:hidden text-zinc-400 hover:text-white p-2.5 -mr-2.5"
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
        <nav class="md:hidden flex flex-col border-t border-white/10 px-4 py-3">
            {#each links as link}
                <a href={link.href}
                   class="py-3 text-sm font-black uppercase tracking-[0.15em] border-b border-white/5 last:border-0
                          {currentPath === link.href ? 'text-fuchsia-400' : 'text-zinc-300'}">
                    {link.label}
                </a>
            {/each}
        </nav>
    {/if}
</header>
