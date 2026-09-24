import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

export default defineConfig(
	{
		// formerly .eslintignore (+ ignorePatterns: ['*.cjs'] from .eslintrc.js)
		ignores: [
			'.DS_Store',
			'node_modules',
			// flat-config patterns are not gitignore-anchored: a leading '/' does
			// NOT match the config-root path, so these must be bare.
			'build',
			'.svelte-kit',
			'package',
			'.env',
			'.env.*',
			'!.env.example',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock',
			'*.cjs'
		]
	},
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		// Parse TypeScript inside Svelte files (flat-config TS recipe from
		// eslint-plugin-svelte README). Covers runes and legacy syntax.
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		// The Svelte 5 port deliberately preserved the app's legacy unkeyed
		// {#each} blocks: adding keys changes list-removal semantics for live
		// state (porting contract: "preserve each keying").
		rules: {
			'svelte/require-each-key': 'off'
		}
	},
	{
		// Official typescript-eslint guidance: TypeScript already checks all
		// identifiers, so core no-undef only false-positives on TS namespaces/
		// types in these files (e.g. WebMidi from @types/webmidi).
		files: ['**/*.ts', '**/*.svelte'],
		rules: {
			'no-undef': 'off'
		}
	}
);