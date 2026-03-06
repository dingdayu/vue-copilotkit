import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const API_KEY_KEY = 'apiKey'
const RUNTIME_URL_KEY = 'runtimeUrl'
const LOCALE_KEY = 'demo-locale'

export const useAppConfigStore = defineStore('app-config', () => {
  const apiKey = ref(localStorage.getItem(API_KEY_KEY) || '')
  const runtimeUrl = ref(localStorage.getItem(RUNTIME_URL_KEY) || 'http://localhost:4000/copilotkit')
  const language = ref(localStorage.getItem(LOCALE_KEY) || 'zh-CN')

  const copilotKitKey = computed(() => `${apiKey.value}|${runtimeUrl.value}`)

  watch(apiKey, value => localStorage.setItem(API_KEY_KEY, value), { immediate: true })
  watch(runtimeUrl, value => localStorage.setItem(RUNTIME_URL_KEY, value), { immediate: true })
  watch(language, value => localStorage.setItem(LOCALE_KEY, value), { immediate: true })

  return {
    apiKey,
    runtimeUrl,
    language,
    copilotKitKey
  }
})
