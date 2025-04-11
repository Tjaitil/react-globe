/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/react-globe',
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**'],
    globals: true,
  },
  plugins: [react(), tailwindcss()],
});
