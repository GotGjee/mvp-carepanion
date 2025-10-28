import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Add buffer polyfill for Solana
      buffer: 'buffer',
    },
  },
  define: {
    // Add global Buffer for Solana
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})