<script>
    import { SITE_URL, SITE_NAME } from '$lib/siteConfig.js';
    import { jsonLdScriptTag } from '$lib/jsonld.js';

    let { title, description, path = '', image = null, noindex = false, jsonLd = null } = $props();

    let canonical = $derived(`${SITE_URL}${path}`);
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    {#if noindex}
        <meta name="robots" content="noindex, follow" />
    {/if}

    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    {#if image}
        <meta property="og:image" content={image} />
    {/if}

    <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {#if image}
        <meta name="twitter:image" content={image} />
    {/if}

    <!-- svelte:head cannot be nested inside {#if} blocks, so any JSON-LD
         for this page has to be rendered here rather than in the page
         template itself, even though the schema logic lives there. -->
    {#if jsonLd}
        {@html jsonLdScriptTag(jsonLd)}
    {/if}
</svelte:head>
