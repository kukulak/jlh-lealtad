import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

installGlobals()

export default defineConfig({
  build: {
    outDir: 'build/client',
    rollupOptions: {
      // input: {
      //   main: resolve(__dirname, 'index.html')
      // },
      output: {
        // Define the chunks output
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  plugins: [remix(), tsconfigPaths()]
})
