import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // Ensures correct routing
  build: {
    outDir: 'dist' // Default, but explicit is better
  },
  server: {
    fs: {
      allow: ['../'], // Allows access to node_modules outside the root
    }
  }
});
