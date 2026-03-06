<template>
  <main class="demo-page space-y-6 bg-gradient-to-b from-slate-100 to-blue-50">
    <div class="demo-page-shell space-y-6">
      <header class="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{{ t('home.eyebrow') }}</p>
        <h1 class="mt-2 text-4xl font-bold text-slate-900">{{ t('home.title') }}</h1>
        <p class="mt-2 max-w-3xl text-slate-600">{{ t('home.subtitle') }}</p>
      </header>

      <section class="space-y-3">
        <div>
          <h2 class="text-2xl font-semibold text-slate-900">{{ t('home.workflowTitle') }}</h2>
          <p class="text-slate-600">{{ t('home.workflowDesc') }}</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RouterLink
            v-for="item in workflowCards"
            :key="item.to"
            :to="item.to"
            class="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-inherit no-underline transition hover:-translate-y-0.5 hover:shadow"
          >
            <h3 class="m-0 text-lg font-semibold text-slate-900">{{ item.title }}</h3>
            <p class="m-0 text-sm text-slate-600">{{ item.desc }}</p>
          </RouterLink>
        </div>
      </section>

      <section class="space-y-3">
        <div>
          <h2 class="text-2xl font-semibold text-slate-900">{{ t('home.dataTitle') }}</h2>
          <p class="text-slate-600">{{ t('home.dataDesc') }}</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="item in dataCards"
            :key="item.to"
            :to="item.to"
            class="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-inherit no-underline transition hover:-translate-y-0.5 hover:shadow"
          >
            <h3 class="m-0 text-lg font-semibold text-slate-900">{{ item.title }}</h3>
            <p class="m-0 text-sm text-slate-600">{{ item.desc }}</p>
          </RouterLink>
        </div>
      </section>

      <section class="space-y-3">
        <div>
          <h2 class="text-2xl font-semibold text-slate-900">{{ t('home.sdkTitle') }}</h2>
          <p class="text-slate-600">{{ t('home.sdkDesc') }}</p>
        </div>
        <div class="grid max-w-xl gap-3">
          <RouterLink
            :to="'/sdk'"
            class="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-inherit no-underline transition hover:-translate-y-0.5 hover:shadow"
          >
            <h3 class="m-0 text-lg font-semibold text-slate-900">{{ t('home.cards.sdkTitle') }}</h3>
            <p class="m-0 text-sm text-slate-600">{{ t('home.cards.sdkDesc') }}</p>
          </RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const workflowCards = computed(() => [
  { to: '/todolist', title: t('home.cards.todolistTitle'), desc: t('home.cards.todolistDesc') },
  { to: '/form', title: t('home.cards.formTitle'), desc: t('home.cards.formDesc') },
  { to: '/textarea', title: t('home.cards.textareaTitle'), desc: t('home.cards.textareaDesc') },
  { to: '/table', title: t('home.cards.tableTitle'), desc: t('home.cards.tableDesc') }
])

const dataCards = computed(() => [
  { to: '/chat-with-your-data', title: t('home.cards.dataTitle'), desc: t('home.cards.dataDesc') },
  { to: '/spreadsheet', title: t('home.cards.sheetTitle'), desc: t('home.cards.sheetDesc') },
  { to: '/presentation', title: t('home.cards.deckTitle'), desc: t('home.cards.deckDesc') }
])
</script>
