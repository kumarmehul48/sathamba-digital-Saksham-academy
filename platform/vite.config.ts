import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: process.env.SDSA_BASE_PATH || '/', server: { port: 3000 }, build: { rollupOptions: { output: { manualChunks(id: string) { if (id.includes('node_modules/@supabase/supabase-js') || id.includes('node_modules/@supabase')) return 'supabase'; if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react'; } } } } });
