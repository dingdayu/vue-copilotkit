<template>
  <main class="demo-page bg-gradient-to-b from-violet-50 to-slate-50">
    <div class="demo-page-shell">
      <section class="mt-3 grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
        <header>
          <h1 class="text-2xl font-bold text-slate-900">{{ t('pages.sdk.title') }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ t('pages.sdk.subtitle') }}</p>
        </header>

        <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <strong>{{ t('common.howToTry') }}</strong>
          <ul class="mt-2 list-disc space-y-1 pl-5">
            <li v-for="item in quickPrompts" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div class="sdk-chat-panel rounded-xl border border-slate-200 bg-white p-3">
            <CopilotChat
              className="h-full"
              :showResponseButton="false"
              instructions="You are helping the user explore the SDK demo page. Focus on practical guidance for chat, agent state, and human-in-the-loop actions."
            >
              <template #messages="{ messages, inProgress, children }">
                <CopilotChatView :messages="messages" :inProgress="inProgress" maxHeight="100%">
                  <template #userMessage="{ message }">
                    <CopilotChatUserMessage :message="message" />
                  </template>
                  <template #assistantMessage="{ message, inProgress: messageInProgress, reasoningOpen }">
                    <CopilotChatAssistantMessage
                      :message="message"
                      :inProgress="messageInProgress"
                      :reasoningOpen="reasoningOpen"
                    />
                  </template>
                  <component v-if="children?.default" :is="children.default" />
                </CopilotChatView>
              </template>
              <template #input="{ send, inProgress, isVisible }">
                <CopilotChatSuggestions
                  :title="chatLabels.suggestionsTitle"
                  :variant="suggestionsVariant"
                  :layout="suggestionsLayout"
                  :scrollable="suggestionsScrollable"
                  :suggestions="sdkSuggestionItems"
                />
                <CopilotChatInput
                  :send="send"
                  :inProgress="inProgress"
                  :isVisible="isVisible"
                  :value="draftMessage"
                  :onChange="value => (draftMessage = value)"
                  :onStop="() => undefined"
                />
              </template>
            </CopilotChat>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-3">
            <h3 class="text-base font-semibold text-slate-900">{{ t('pages.sdk.stateTitle') }}</h3>
            <div class="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <h4 class="text-sm font-semibold text-slate-900">
                {{ locale.value === 'zh-CN' ? '主题演示' : 'Theme demo' }}
              </h4>
              <p class="mt-2 text-sm text-slate-600">
                {{ locale.value === 'zh-CN' ? '当前主题' : 'Theme' }}:
                <strong>{{ activeThemeLabel }}</strong>
              </p>
              <p class="text-sm text-slate-600">
                {{ locale.value === 'zh-CN' ? '当前外观' : 'Appearance' }}:
                <strong>{{ resolvedAppearance }}</strong>
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="applyPreset('default')">
                  Default
                </button>
                <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="applyPreset('copilotkit')">
                  CopilotKit
                </button>
                <button
                  class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  @click="applyPreset('x.ant.design')"
                >
                  x.ant.design
                </button>
                <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="applyCustomTheme">
                  {{ locale.value === 'zh-CN' ? '自定义主题' : 'Custom theme' }}
                </button>
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  @click="suggestionsVariant = 'chips'"
                >
                  Chips
                </button>
                <button
                  class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  @click="suggestionsVariant = 'cards'"
                >
                  Cards
                </button>
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  @click="suggestionsLayout = 'wrap'"
                >
                  Wrap
                </button>
                <button
                  class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  @click="suggestionsLayout = 'horizontal'"
                >
                  Horizontal
                </button>
                <button
                  class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  @click="suggestionsScrollable = !suggestionsScrollable"
                >
                  {{ suggestionsScrollable ? 'Scrollable: On' : 'Scrollable: Off' }}
                </button>
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="setDarkMode('auto')">
                  Auto
                </button>
                <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="setDarkMode(false)">
                  {{ locale.value === 'zh-CN' ? '浅色' : 'Light' }}
                </button>
                <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="setDarkMode(true)">
                  {{ locale.value === 'zh-CN' ? '深色' : 'Dark' }}
                </button>
              </div>
            </div>

            <p class="mt-2 text-sm">
              {{ locale.value === 'zh-CN' ? 'Agent' : 'Agent' }}:
              <strong>{{ agent.id }}</strong>
            </p>
            <p class="text-sm">
              {{ locale.value === 'zh-CN' ? '激活状态' : 'Active' }}:
              <strong>{{ agent.isActive.value ? yesText : noText }}</strong>
            </p>
            <p class="text-sm">
              {{ locale.value === 'zh-CN' ? '会话' : 'Session' }}:
              <code>{{ agent.session.value ? JSON.stringify(agent.session.value) : 'null' }}</code>
            </p>
            <p class="mt-2 text-sm">
              {{ locale.value === 'zh-CN' ? 'Agent 上下文' : 'Agent context' }}:
              <code>{{ JSON.stringify(agentContextValue) }}</code>
            </p>

            <hr class="my-3" />
            <h3 class="text-base font-semibold text-slate-900">{{ t('pages.sdk.configTitle') }}</h3>
            <p class="text-sm text-slate-700">{{ suggestionConfigs.length }}</p>
            <ul class="list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li v-for="(item, index) in suggestionConfigs" :key="index">{{ item.instructions }}</li>
            </ul>

            <hr class="my-3" />
            <h3 class="text-base font-semibold text-slate-900">{{ t('pages.sdk.hitlTitle') }}</h3>
            <p class="text-sm">
              {{ t('pages.sdk.pending') }}:
              <strong>{{ hasPendingInterrupt ? yesText : noText }}</strong>
            </p>
            <pre v-if="hasPendingInterrupt" class="mt-2 rounded-lg bg-slate-50 p-2 text-xs">{{ prettyInterrupt }}</pre>

            <div class="mt-3 inline-flex flex-wrap gap-2">
              <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="simulateInterrupt">
                {{ t('pages.sdk.interrupt') }}
              </button>
              <button
                class="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
                :disabled="!hasPendingInterrupt"
                @click="accept"
              >
                {{ t('pages.sdk.accept') }}
              </button>
              <button
                class="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
                :disabled="!hasPendingInterrupt"
                @click="reject"
              >
                {{ t('pages.sdk.reject') }}
              </button>
              <button
                class="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
                :disabled="!hasPendingInterrupt"
                @click="clear"
              >
                {{ t('pages.sdk.clear') }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <CopilotPopup :defaultOpen="false" />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  useAgent,
  useAgentContext,
  useConfigureSuggestions,
  useCopilotContext,
  useCopilotTheme,
  useHumanInTheLoop,
} from '@dingdayu/vue-copilotkit'
import {
  CopilotChat,
  CopilotChatAssistantMessage,
  CopilotChatInput,
  CopilotChatSuggestions,
  CopilotChatUserMessage,
  CopilotChatView,
  CopilotPopup,
} from '@dingdayu/vue-copilotkit'

const { t, locale } = useI18n()

const { agent } = useAgent({ agentId: 'default', autoActivate: true })
const { setHumanInTheLoopEvent, chatSuggestionConfiguration } = useCopilotContext()
const { activeThemeName, resolvedAppearance, setTheme, setDarkMode } = useCopilotTheme()
let draftMessage = ''
const suggestionsVariant = ref<'chips' | 'cards'>('chips')
const suggestionsLayout = ref<'wrap' | 'horizontal'>('wrap')
const suggestionsScrollable = ref(false)

const agentContextValue = computed(() => ({
  route: '/sdk',
  locale: locale.value,
  activeTheme: activeThemeName.value,
  appearance: resolvedAppearance.value,
  activeAgentId: agent.id,
}))

useAgentContext({
  description: 'SDK demo page state',
  value: agentContextValue,
})

const customTheme = {
  name: 'custom-demo',
  light: {
    primaryColor: '#ea580c',
    primaryStrongColor: '#c2410c',
    accentColor: '#f59e0b',
    backgroundColor: '#fff7ed',
    surfaceColor: '#ffffff',
    surfaceElevatedColor: '#fffbeb',
    secondaryColor: '#ffedd5',
    secondaryContrastColor: '#7c2d12',
    suggestionBackgroundColor: 'rgba(234, 88, 12, 0.12)',
    suggestionHoverBackgroundColor: 'rgba(234, 88, 12, 0.2)',
    suggestionTextColor: '#9a3412',
  },
  dark: {
    primaryColor: '#fb923c',
    primaryStrongColor: '#f97316',
    accentColor: '#fbbf24',
    backgroundColor: '#1c1917',
    surfaceColor: '#292524',
    surfaceElevatedColor: '#292524',
    secondaryColor: '#44403c',
    secondaryContrastColor: '#ffedd5',
    suggestionBackgroundColor: 'rgba(251, 146, 60, 0.16)',
    suggestionHoverBackgroundColor: 'rgba(251, 146, 60, 0.26)',
    suggestionTextColor: '#fed7aa',
  },
} as const

const applyPreset = (themeName: 'default' | 'copilotkit' | 'x.ant.design') => {
  setTheme(themeName)
}

const applyCustomTheme = () => {
  setTheme(customTheme)
}

const activeThemeLabel = computed(() => activeThemeName.value)

const chatLabels = computed(() =>
  locale.value === 'zh-CN'
    ? {
        placeholder: '输入消息...',
        suggestionsTitle: '建议操作',
      }
    : {
        placeholder: 'Type a message...',
        suggestionsTitle: 'Suggestions',
      }
)

const sdkSuggestionItems = computed(() =>
  locale.value === 'zh-CN'
    ? [
        {
          label: '查看 Agent 状态',
          message: '请说明当前 agent 是否激活，并解释 session 字段。',
          description: '快速确认 agent 是否激活，并理解 session 结构。',
        },
        {
          label: '触发一次中断',
          message: '帮我触发一次模拟中断，然后告诉我如何 accept 或 reject。',
        },
        {
          label: '触发操作建议',
          message: '基于当前页面状态给我 3 条下一步操作建议。',
          description: '让 Copilot 给出更贴近当前页面状态的建议。',
        },
        {
          label: '组件能力清单',
          message: '总结 CopilotChat、CopilotPopup 和 SDK hooks 的典型使用场景。',
          description: '梳理主要组件与 hooks 的职责和场景。',
        },
      ]
    : [
        {
          label: 'Inspect agent state',
          message: 'Explain whether the current agent is active and what the session field means.',
          description: 'Quickly verify agent activation and decode the session payload.',
        },
        {
          label: 'Trigger interrupt',
          message: 'Help me trigger a simulated interrupt, then explain accept and reject flows.',
          description: 'Test the human-in-the-loop flow and follow-up actions.',
        },
        {
          label: 'Recommend next steps',
          message: 'Based on the current page state, give me 3 concrete next actions to try.',
          description: 'Ask for practical actions tailored to the current SDK page state.',
        },
        {
          label: 'Component overview',
          message: 'Summarize practical usage scenarios for CopilotChat, CopilotPopup, and SDK hooks.',
          description: 'Review how the main SDK pieces fit together in real usage.',
        },
      ]
)

useConfigureSuggestions(
  {
    instructions:
      'Generate practical follow-up suggestions for this demo. Focus on trying chat interactions, using agent tools, and testing popup or human-in-the-loop flows.',
    minSuggestions: 2,
    maxSuggestions: 4,
  },
  [locale]
)

const { pendingInterrupt, hasPendingInterrupt, accept, reject, clear } = useHumanInTheLoop()

const prettyInterrupt = computed(() => {
  if (!pendingInterrupt.value) return ''
  return JSON.stringify(pendingInterrupt.value, null, 2)
})

const suggestionConfigs = computed(() => Object.values(chatSuggestionConfiguration.value || {}))
const yesText = computed(() => (locale.value === 'zh-CN' ? '是' : 'Yes'))
const noText = computed(() => (locale.value === 'zh-CN' ? '否' : 'No'))

const simulateInterrupt = () => {
  setHumanInTheLoopEvent({
    name: 'LangGraphInterruptEvent',
    value: { reason: 'Demo interrupt', message: 'Approve sending this action?' },
  })
}

const quickPrompts = computed(() =>
  locale.value === 'zh-CN'
    ? [
        '“解释当前 Agent 状态和 session 字段”',
        '“帮我触发一次模拟中断并给出处理建议”',
        '“给我 3 条可以立即尝试的下一步操作”',
      ]
    : [
        '"Explain the current agent state and session field"',
        '"Trigger one simulated interrupt and suggest how to handle it"',
        '"Give me 3 concrete next actions I can try now"',
      ]
)
</script>

<style scoped>
.sdk-chat-panel {
  min-height: 620px;
  height: 620px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
