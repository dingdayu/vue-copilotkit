import { defineConfig } from '@vue-copilotkit/vite-config'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            external: ['vue', '@vue-copilotkit/vue-core', '@copilotkit/runtime-client-gql', '@copilotkit/shared']
        }
    }
})
