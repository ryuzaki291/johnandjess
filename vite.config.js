import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react({
            include: "**/*.{jsx,tsx}",
        }),
        tailwindcss(),
    ],
    server: {
        host: '127.0.0.1',
        port: 5174,
        hmr: {
            host: '127.0.0.1',
            port: 5174,
        },
    },
});
