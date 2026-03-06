import type { UserConfig } from 'vite'
import { defineConfig } from '@dingdayu/vue-copilotkit-vite-config'

// https://vitejs.dev/config/
const config: UserConfig = defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', '@copilotkit/runtime-client-gql', '@copilotkit/shared']
    }
  }
})

export default config
