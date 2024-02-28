import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  build: {
    sourcemap: true
  },

  plugins: [uni()]
})