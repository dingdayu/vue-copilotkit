import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [vue(), vueJsx(), dts(), nodePolyfills()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: 'index'
    },
    minify: false,
    cssMinify: false,
    rollupOptions: {
      external: ['vue', '@dingdayu/vue-copilotkit-core', '@copilotkit/runtime-client-gql', '@copilotkit/shared']
    }
  }
})
