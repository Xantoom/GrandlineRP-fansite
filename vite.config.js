import tailwindcss from '@tailwindcss/vite';
import reactPlugin from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import mkcertPlugin from 'vite-plugin-mkcert';
import symfonyPlugin from 'vite-plugin-symfony';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
					tanstack: ['@tanstack/react-query', '@tanstack/react-form', '@tanstack/react-table'],
				},
			},
		},
		target: 'esnext',
		sourcemap: true,
	},
	cacheDir: 'node_modules/.vite',
	optimizeDeps: {
		include: ['react', 'react-dom', 'react/jsx-runtime'],
		esbuildOptions: {
			target: 'esnext',
			jsx: 'automatic',
		},
	},
	plugins: [
		reactPlugin({
			fastRefresh: true,
			jsxImportSource: 'react',
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
			'@': resolve(__dirname, './assets'),
			'~': resolve(__dirname, './node_modules'),
		},
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
	},
	server: {
		fs: {
			allow: ['.'],
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
