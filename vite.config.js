import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    open: false,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (normalizedId.includes('node_modules')) {
            if (normalizedId.includes('/react/') || normalizedId.includes('/react-dom/')) {
              return 'vendor-react';
            }
            if (normalizedId.includes('/lucide-react/')) {
              return 'vendor-icons';
            }
            return 'vendor-libs';
          }
          if (normalizedId.includes('src/data/products.ts')) {
            return 'catalog-data';
          }
        },
      },
    },
  },
});

