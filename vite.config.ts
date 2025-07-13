import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/app.tsx',
                'resources/js/pages/home.tsx',
                'resources/js/pages/about.tsx',
                'resources/js/pages/contact.tsx',
                'resources/js/pages/menu.tsx',
                'resources/js/pages/reservation.tsx',
                'resources/js/pages/checkout.tsx',
                'resources/js/pages/transaction.tsx',
                'resources/js/pages/auth/login.tsx',
                'resources/js/pages/admin/dashboard.tsx',
                'resources/js/pages/admin/booking.tsx',
                'resources/js/pages/admin/setting.tsx',
                'resources/js/pages/admin/transactions.tsx',
                'resources/js/pages/staff/dashboard.tsx',
                'resources/js/pages/404.tsx'
            ],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
});
