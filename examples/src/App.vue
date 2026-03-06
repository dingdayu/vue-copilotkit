<template>
  <ProvideApiKeyDialog />
  <div
    class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_42%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]"
  >
    <CopilotKit :publicApiKey="apiKey || undefined" :key="scopedCopilotKitKey" :runtimeUrl="runtimeUrl">
      <RouterView />
    </CopilotKit>
  </div>
</template>

<script setup lang="ts">
import { CopilotKit } from '@dingdayu/vue-copilotkit-core'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import i18n from './i18n'
import ProvideApiKeyDialog from './components/ProvideApiKeyDialog.vue'
import { useAppConfigStore } from './stores/app-config'

const store = useAppConfigStore()
const { apiKey, runtimeUrl, language, copilotKitKey } = storeToRefs(store)
const route = useRoute()

const scopedCopilotKitKey = computed(() => `${copilotKitKey.value}|${route.path}`)

watch(
  () => language.value,
  locale => {
    i18n.global.locale.value = locale
  },
  { immediate: true }
)
</script>
