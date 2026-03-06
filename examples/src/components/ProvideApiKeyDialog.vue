<template>
  <div
    class="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 text-xs text-slate-700 backdrop-blur"
  >
    <span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium">
      {{ isConfigured ? t('app.toolbar.configured') : t('app.toolbar.notConfigured') }}
    </span>

    <div class="ml-auto flex items-center gap-2">
      <div class="relative">
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
          :title="t('common.language')"
          @click="toggleLanguageMenu"
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c2.5 2.7 2.5 15.3 0 18" />
            <path d="M12 3c-2.5 2.7-2.5 15.3 0 18" />
          </svg>
        </button>

        <div
          v-if="isLanguageMenuOpen"
          class="absolute right-0 top-10 z-40 min-w-28 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
        >
          <button
            class="block w-full px-3 py-1.5 text-left text-xs transition hover:bg-slate-100"
            :class="configDraft.language === 'zh-CN' ? 'font-semibold text-slate-900' : 'text-slate-600'"
            @click="setLanguage('zh-CN')"
          >
            {{ t('common.chinese') }}
          </button>
          <button
            class="block w-full px-3 py-1.5 text-left text-xs transition hover:bg-slate-100"
            :class="configDraft.language === 'en-US' ? 'font-semibold text-slate-900' : 'text-slate-600'"
            @click="setLanguage('en-US')"
          >
            {{ t('common.english') }}
          </button>
        </div>
      </div>

      <button
        class="inline-flex h-8 items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
        :title="t('app.toolbar.change')"
        @click="openConfigDialog"
      >
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z"
          />
        </svg>
        <span class="hidden sm:inline">{{ t('app.toolbar.change') }}</span>
      </button>
    </div>
  </div>

  <div v-if="isConfigDialogOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-black/45 p-4">
    <div class="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
      <h2 class="text-xl font-semibold text-slate-900">{{ t('app.toolbar.title') }}</h2>
      <p class="mt-1 text-sm text-slate-500">{{ t('app.toolbar.helper') }}</p>

      <div class="mt-4 grid gap-3">
        <label class="grid gap-1 text-xs text-slate-700">
          <span>{{ t('app.toolbar.runtimeLabel') }}</span>
          <input
            v-model="configDraft.runtimeUrl"
            :placeholder="t('app.toolbar.runtimePlaceholder')"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </label>

        <label class="grid gap-1 text-xs text-slate-700">
          <span>{{ t('app.toolbar.apiKeyLabel') }}</span>
          <input
            v-model="configDraft.apiKey"
            :placeholder="t('app.toolbar.apiKeyPlaceholder')"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </label>
      </div>

      <div class="mt-5 flex justify-end gap-2">
        <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="cancel">
          {{ t('common.cancel') }}
        </button>
        <button class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white" @click="saveConfig">
          {{ t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useAppConfigStore } from '../stores/app-config'

const { t } = useI18n()
const store = useAppConfigStore()
const { apiKey, runtimeUrl, language } = storeToRefs(store)

const isConfigDialogOpen = ref(false)
const isLanguageMenuOpen = ref(false)

const configDraft = reactive({
  apiKey: apiKey.value,
  runtimeUrl: runtimeUrl.value,
  language: language.value
})

watch(
  () => language.value,
  value => {
    configDraft.language = value
  },
  { immediate: true }
)

watch(
  () => configDraft.language,
  value => {
    language.value = value || 'zh-CN'
  }
)

const isConfigured = computed(() => Boolean(runtimeUrl.value || apiKey.value))

const openConfigDialog = () => {
  isLanguageMenuOpen.value = false
  isConfigDialogOpen.value = true
}

const toggleLanguageMenu = () => {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

const setLanguage = (nextLanguage: 'zh-CN' | 'en-US') => {
  configDraft.language = nextLanguage
  language.value = nextLanguage
  isLanguageMenuOpen.value = false
}

const saveConfig = () => {
  apiKey.value = configDraft.apiKey || ''
  runtimeUrl.value = configDraft.runtimeUrl || ''
  language.value = configDraft.language || 'zh-CN'
  isLanguageMenuOpen.value = false
  isConfigDialogOpen.value = false
}

const cancel = () => {
  configDraft.apiKey = apiKey.value
  configDraft.runtimeUrl = runtimeUrl.value
  configDraft.language = language.value
  isLanguageMenuOpen.value = false
  isConfigDialogOpen.value = false
}

onMounted(() => {
  if (!runtimeUrl.value && !apiKey.value) {
    isConfigDialogOpen.value = true
  }
})
</script>
