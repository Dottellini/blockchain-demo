import adapter from '@sveltejs/adapter-static'; // <-- Wichtig: static adapter
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',   // <-- Das sagt Svelte: "Leg die HTML Dateien hier ab"
			assets: 'build',  // <-- Das sagt Svelte: "Leg CSS/JS hier ab"
			fallback: 'index.html' // Wichtig für Single Page Apps
		})
	}
};

export default config;