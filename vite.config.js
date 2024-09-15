import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  define: {
    'import.meta.env': {
      VITE_API_KEY: JSON.stringify(process.env.VITE_API_KEY),
      VITE_API_BASE: JSON.stringify(process.env.VITE_API_BASE),
    },
  }
});



