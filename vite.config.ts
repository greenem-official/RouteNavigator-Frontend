import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // nodePolyfills({ include: ['crypto'] }), // because of "TypeError: crypto$2.getRandomValues is not a function"
  ],
})
