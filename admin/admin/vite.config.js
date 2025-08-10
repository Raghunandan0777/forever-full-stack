import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // ensures relative paths for Render hosting
  envDir: '../', // Look for .env files in the parent directory
  envPrefix: ['VITE_'] // Prefixes for environment variables
})
