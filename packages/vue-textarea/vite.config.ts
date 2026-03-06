import type { UserConfig } from 'vite'
import { defineConfig } from '@dingdayu/vue-copilotkit-vite-config'

// https://vitejs.dev/config/
const config: UserConfig = defineConfig({
  build: {
    rollupOptions: {
      external: [
        'vue',
        '@dingdayu/vue-copilotkit-core',
        '@copilotkit/runtime-client-gql',
        '@copilotkit/shared',
        'element-plus'
      ]
    }
  }
})

export default config
