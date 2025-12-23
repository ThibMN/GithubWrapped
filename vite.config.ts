import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/GithubWrapped/',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // Augmenter la limite à 1000 KB pour ce projet
  },
})

