import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

installGlobals()

export default defineConfig({
  build: {
    outDir: 'build/client',
    rollupOptions: {
      output: {
        // Define the chunks output
      }
    }
  },
  plugins: [remix(), tsconfigPaths()]
})
