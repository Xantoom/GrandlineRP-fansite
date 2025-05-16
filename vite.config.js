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
		reactPlugin({
			fastRefresh: true,
		}),
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
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					ui: ['tailwindcss', 'daisyui'],
				},
			},
		},
		target: 'esnext',
		minify: 'esbuild',
	},
	server: {
		host: '0.0.0.0',
		strictPort: true,
		https: true,
		fs: {
			allow: ['.', sharedDir],
		},
		hmr: {
			overlay: true,
			protocol: 'wss',
			timeout: 60000,
		},
	},
	resolve: {
		alias: {
			'@assets': resolve(basicPlaygroundDir, 'assets'),
			'@node_modules': resolve(basicPlaygroundDir, 'node_modules'),
		},
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.sass'],
	},
	optimizeDeps: {
		include: ['react', 'react-dom', 'react/jsx-runtime', '@tanstack/react-query', '@tanstack/react-form'],
		esbuildOptions: {
			target: 'esnext',
			jsx: 'automatic',
		},
	},
	cacheDir: 'node_modules/.vite',
});
