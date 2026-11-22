import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

const versionFile = `
// AUTO GENERATED -- DO NOT MODIFY
const VERSION = "${pkg.version}" as const;
export default VERSION;`;

writeFileSync('src/lib/version.ts', versionFile);

// SvelteKit 3 removed svelte.config.js: app config lives in the plugin call.
export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(),
			preprocess: vitePreprocess()
		})
	],
	define: {
		__version__: JSON.stringify(pkg.version)
	}
});
