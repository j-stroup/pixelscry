<script>
    import { PUBLIC_GA_MEASUREMENT_ID } from '$env/static/public';

    // Only load in production builds — local dev traffic shouldn't pollute
    // real analytics. import.meta.env.PROD is Vite's built-in flag, true
    // for `vite build` output and false for `vite dev`.
    const enabled = import.meta.env.PROD && Boolean(PUBLIC_GA_MEASUREMENT_ID);
</script>

<svelte:head>
    {#if enabled}
        <script async src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_GA_MEASUREMENT_ID}"></script>
        {@html `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${PUBLIC_GA_MEASUREMENT_ID}');</script>`}
    {/if}
</svelte:head>
