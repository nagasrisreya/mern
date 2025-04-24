import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Optional: Visualizer plugin to see what's inside your bundle
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,         // auto open in browser after build
      gzipSize: true,
      brotliSize: true
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000 // Increase chunk size limit from 500KB to 1000KB
  }
});
