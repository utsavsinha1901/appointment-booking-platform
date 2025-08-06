import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Listen on all addresses
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 3000
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for security
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          axios: ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  }
})


