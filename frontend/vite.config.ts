import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: {
      overlay: false  // Disable the HMR error overlay
    }
  },
  resolve: {
    alias: {
      '@': '/src' // Optional: add path alias for convenience
    }
  }
})
