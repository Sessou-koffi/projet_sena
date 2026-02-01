import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Base URL pour GitHub Pages
  base: '/projet_sena/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
