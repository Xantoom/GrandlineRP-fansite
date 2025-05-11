import tailwindcss from '@tailwindcss/vite';
import reactPlugin from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import mkcertPlugin from 'vite-plugin-mkcert';
import symfonyPlugin from 'vite-plugin-symfony';

const basicPlaygroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(basicPlaygroundDir, '../../shared');

export default defineConfig({
	plugins: [
		reactPlugin(),
		symfonyPlugin({
			stimulus: true,
			viteDevServerHostname: 'localhost',
		}),
		mkcertPlugin(),
		tailwindcss(),
	],
	build: {
		rollupOptions: {
			input: {
				app: './assets/app.ts',
			},
		},
	},
	server: {
		host: '0.0.0.0',
		strictPort: true,
		https: true,
		watch: {
			ignored: ['**/!(assets)/**'],
		},
		fs: {
			allow: ['.', sharedDir],
		},
	},
	resolve: {
		alias: {
			'@': './assets',
			'~': './node_modules',
		},
	},
});
