import { sveltekit } from '@sveltejs/kit/vite';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	define: {
		__version__ : JSON.stringify(pkg.version),
	}
};

const versionFile = `
// AUTO GENERATED -- DO NOT MODIFY
const VERSION: "${pkg.version}" = "${pkg.version}";
export default VERSION;`;

writeFileSync('src/lib/version.ts', versionFile);

export default config;
