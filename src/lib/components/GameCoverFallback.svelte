<script>
    let { name = '' } = $props();
</script>

<div class="w-full h-full flex flex-col items-center justify-center gap-3 p-4 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-zinc-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 8.25h10.5a2.25 2.25 0 012.121 3.001l-1.5 4.5A2.25 2.25 0 0115.75 17.25h-7.5a2.25 2.25 0 01-2.121-1.499l-1.5-4.5A2.25 2.25 0 016.75 8.25z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h1.5m3 0H15M9.75 9.75v-1a2.25 2.25 0 114.5 0v1" />
    </svg>
    <span class="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-snug line-clamp-3">{name}</span>
</div>
