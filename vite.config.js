import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/auction-website/', 
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        auctions: resolve(__dirname, 'pages/auctions.html'),
        profile: resolve(__dirname, 'pages/profile.html'),
        'listing-details': resolve(__dirname, 'pages/listing-details.html'),
        registration: resolve(__dirname, 'registration.html'),
      }
    }
  }
});


