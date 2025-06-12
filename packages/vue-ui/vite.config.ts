import { defineConfig } from '@copilotkit/vite-config'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            external: ['vue','@dingdayu/vue-copilotkit-core','@copilotkit/runtime-client-gql','@copilotkit/shared']
        }
    }
})
