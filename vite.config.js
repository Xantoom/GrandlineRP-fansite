/* if you're using React */
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
    plugins: [
        react(), // if you're using React */
        symfonyPlugin({
	        stimulus: true,
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                app: "./assets/app.js"
            },
        }
    },
});
