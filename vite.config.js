import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Self-hosted on a plain VPS (alongside manableed.com) — adapter-auto
			// only produces a runnable server for platforms it recognizes
			// (Vercel/Netlify/Cloudflare), not a bare Node process. adapter-node
			// builds a standalone server started with `node build/index.js`.
			adapter: adapter()
		})
	]
});
