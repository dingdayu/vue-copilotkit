<template>
  <main class="demo-page bg-gradient-to-b from-emerald-50 to-slate-50">
    <div class="demo-page-shell">
      <RouterLink class="font-semibold text-blue-700" to="/">{{ t('common.backHome') }}</RouterLink>

      <section class="mt-3 grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
        <header>
          <h1 class="text-2xl font-bold text-slate-900">{{ t('pages.textarea.title') }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ t('pages.textarea.subtitle') }}</p>
        </header>

        <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-slate-700">
          <strong>{{ t('common.howToTry') }}</strong>
          <ul class="mt-2 list-disc space-y-1 pl-5">
            <li v-for="item in quickPrompts" :key="item">{{ item }}</li>
          </ul>
        </div>

        <h3 class="text-lg font-semibold text-slate-900">{{ t('pages.textarea.subject') }}</h3>

        <div class="grid max-h-80 gap-2 overflow-y-auto">
          <article v-for="(item, index) in emails" :key="index" class="rounded-xl border border-slate-200 bg-white p-3">
            <p class="text-xs text-slate-500">{{ item.timestamp }}</p>
            <p class="mt-1 text-sm">
              <strong>{{ t('pages.textarea.from') }}:</strong>
              {{ item.from }}
            </p>
            <p class="text-sm">
              <strong>{{ t('pages.textarea.to') }}:</strong>
              {{ item.to }}
            </p>
            <p class="mt-1 text-sm text-slate-700">{{ item.body }}</p>
          </article>
        </div>

        <div class="grid gap-2">
          <CopilotTextarea
            :value="text"
            :placeholder="t('pages.textarea.replyPlaceholder')"
            :autosuggestionsConfig="{
              textareaPurpose: 'Assist with replying to this email thread and keep important details.',
              chatApiConfigs: {}
            }"
            :onChange="e => setInput(e)"
          />
          <button class="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white" @click="handleReply">
            {{ t('pages.textarea.reply') }}
          </button>
        </div>
      </section>
    </div>

    <CopilotPopup
      :labels="{
        title: locale.value === 'zh-CN' ? '邮件助手' : 'Email Assistant',
        initial:
          locale.value === 'zh-CN'
            ? '我可以根据邮件上下文帮你起草、改写或压缩回复。'
            : 'I can draft, rewrite, or shorten replies based on your thread context.'
      }"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCopilotReadable } from '@dingdayu/vue-copilotkit-core'
import { CopilotPopup, CopilotTextarea, useCopilotChatSuggestions } from '@dingdayu/vue-copilotkit-ui'

type EmailItem = {
  from: string
  to: string
  body: string
  timestamp: string
}

const { t, locale } = useI18n()

const emails = ref<EmailItem[]>([
  {
    from: 'Alice Wong <alice@acme.com>',
    to: 'Project Team <team@acme.com>',
    body: 'Can we lock the final agenda before Thursday? We still need owner updates for the launch checklist.',
    timestamp: '2026-03-01 09:20'
  },
  {
    from: 'Marco Li <marco@acme.com>',
    to: 'Alice Wong <alice@acme.com>',
    body: 'I can provide product and ops updates by Wednesday noon. Please include risks and mitigation in the deck.',
    timestamp: '2026-03-01 10:05'
  }
])

useCopilotReadable({
  description: 'The history of this email thread',
  value: emails
})

const text = ref('')

const setInput = (val: unknown) => {
  if (typeof val === 'string') {
    text.value = val
    return
  }

  const event = val as Event
  const target = event?.target as HTMLTextAreaElement | null
  text.value = target?.value ?? ''
}

const handleReply = () => {
  const content = text.value.trim()
  if (!content) return

  emails.value.push({
    from: 'Me <me@acme.com>',
    to: 'Project Team <team@acme.com>',
    body: content,
    timestamp: new Date().toLocaleString()
  })
  text.value = ''
}

const mailSuggestionInstructions = computed(() =>
  locale.value === 'zh-CN'
    ? '基于当前邮件上下文生成可执行建议，包括起草回复、调整语气、强调截止时间和补充关键信息。'
    : 'Generate actionable suggestions based on this email thread, including draft replies, tone adjustments, deadline emphasis, and missing details.'
)

const mailSuggestions = computed(() =>
  locale.value === 'zh-CN'
    ? [
        { title: '起草跟进回复', message: '起草一封礼貌但坚定的跟进邮件，要求周三中午前给出 owner updates。' },
        { title: '语气改写', message: '把当前回复改成更专业、简洁，控制在 80 字以内。' },
        { title: '强调截止时间', message: '在回复中明确强调：参会名单需在下周二前确认。' },
        { title: '补充风险项', message: '补充一句对风险和缓解措施的请求，保持协作口吻。' }
      ]
    : [
        {
          title: 'Draft follow-up',
          message: 'Draft a polite but firm follow-up asking for owner updates by Wednesday noon.'
        },
        {
          title: 'Professional rewrite',
          message: 'Rewrite my current reply in a more professional tone within 80 words.'
        },
        { title: 'Stress deadline', message: 'Emphasize that attendee confirmation is required before next Tuesday.' },
        {
          title: 'Add risk request',
          message: 'Add one sentence requesting risks and mitigation details in a collaborative tone.'
        }
      ]
)

useCopilotChatSuggestions(
  {
    instructions: mailSuggestionInstructions,
    minSuggestions: 2,
    maxSuggestions: 4,
    suggestions: mailSuggestions
  },
  [locale, mailSuggestions]
)

const quickPrompts = computed(() =>
  locale.value === 'zh-CN'
    ? ['“帮我写一个礼貌但坚定的跟进回复”', '“把语气改成更专业，控制在 80 词以内”', '“强调下周二前需要确认参会名单”']
    : [
        '"Draft a polite but firm follow-up reply"',
        '"Make the tone more professional and keep it under 80 words"',
        '"Emphasize that attendee confirmation is needed before next Tuesday"'
      ]
)
</script>
