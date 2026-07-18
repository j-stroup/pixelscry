<script>
    import { onNavigate } from '$app/navigation';
    import '../app.css'; // This path is correct for src/app.css
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

<div class="flex flex-col min-h-screen bg-black font-sans selection:bg-fuchsia-500/30">
    
    <div class="flex-grow">
        {@render children()}
    </div>

    <footer class="relative z-50 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800/80 pt-10 pb-8 mt-auto">
        <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-600/50 to-transparent"></div>
        
        <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <div class="flex flex-col items-center md:items-start">
                <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500 tracking-tighter uppercase">PixelScry</span>
                <span class="text-[9px] text-fuchsia-500 font-black uppercase tracking-[0.3em] mt-1">The Database</span>
            </div>
            
            <nav class="flex gap-8">
                <a href="/" class="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-fuchsia-400">Search</a>
                <a href="/tags" class="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-fuchsia-400">Browse Tags</a>
                <a href="/collection" class="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-fuchsia-400">My Collection</a>
                <a href="/about" class="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-fuchsia-400">About</a>
            </nav>

            <div class="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center md:text-right">
                <p>Data powered by <a href="https://rawg.io" target="_blank" class="text-zinc-400 hover:text-purple-400">RAWG</a></p>
                <p class="mt-2 opacity-50">&copy; {new Date().getFullYear()} PixelScry.</p>
            </div>
        </div>
    </footer>
</div>