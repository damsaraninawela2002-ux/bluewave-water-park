import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      ignored: [
        '**/*.~tmp',
        '**/*.~tmp*',
        '**/*.tmp',
        '**/*.tmp*',
        '**/~$*',
        '**/.DS_Store',
        '**/desktop.ini',
        '**/Thumbs.db',
        '**/node_modules/**',
        '**/.git/**',
      ],
    },
  },
})
