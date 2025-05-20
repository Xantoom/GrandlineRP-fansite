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
	build: {
		minify: 'esbuild',
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
	},
	cacheDir: 'node_modules/.vite',
	optimizeDeps: {
		include: ['react', 'react-dom', 'react/jsx-runtime', '@tanstack/react-query', '@tanstack/react-form'],
		esbuildOptions: {
			target: 'esnext',
			jsx: 'automatic',
		},
	},
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
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./assets', import.meta.url)),
			'~': fileURLToPath(new URL('./node_modules', import.meta.url)),
		},
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.sass'],
	},
	server: {
		fs: {
			allow: ['.', sharedDir],
		},
		hmr: {
			overlay: true,
			protocol: 'wss',
			timeout: 60000,
		},
		host: '0.0.0.0',
		https: true,
		strictPort: true,
	},
});
