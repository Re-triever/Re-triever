import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  root: path.join(__dirname, 'src/renderer'),
  base: './',
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: path.join(__dirname, 'src/renderer/dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true
  }
});
