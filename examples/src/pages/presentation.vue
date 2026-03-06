<template>
  <main class="demo-page bg-gradient-to-b from-rose-50 to-slate-50">
    <div class="demo-page-shell">
      <RouterLink class="font-semibold text-blue-700" to="/">{{ t('common.backHome') }}</RouterLink>

      <section class="mt-3 grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
        <header>
          <h1 class="text-2xl font-bold text-slate-900">{{ t('pages.presentation.title') }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ t('pages.presentation.subtitle') }}</p>
        </header>

        <div class="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-slate-700">
          <strong>{{ t('common.howToTry') }}</strong>
          <ul class="mt-2 list-disc space-y-1 pl-5">
            <li v-for="item in quickPrompts" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="rounded-xl bg-slate-900 p-5 text-slate-100">
          <h2 class="text-2xl font-semibold">{{ slides[currentSlide]?.title }}</h2>
          <div class="mt-3 text-base leading-7" v-html="slides[currentSlide]?.content"></div>
        </div>

        <div class="inline-flex flex-wrap items-center gap-2">
          <button
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            :disabled="currentSlide === 0"
            @click="prevSlide"
          >
            {{ t('pages.presentation.prev') }}
          </button>
          <span class="min-w-16 text-center text-sm text-slate-500">{{ currentSlide + 1 }} / {{ slides.length }}</span>
          <button
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            :disabled="currentSlide >= slides.length - 1"
            @click="nextSlide"
          >
            {{ t('pages.presentation.next') }}
          </button>
        </div>

        <div class="inline-flex flex-wrap gap-2">
          <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="addSlide">
            {{ t('pages.presentation.add') }}
          </button>
          <button
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            :disabled="slides.length === 0"
            @click="editCurrentSlide"
          >
            {{ t('pages.presentation.edit') }}
          </button>
          <button
            class="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            :disabled="slides.length === 0"
            @click="deleteCurrentSlide"
          >
            {{ t('pages.presentation.remove') }}
          </button>
        </div>
      </section>
    </div>

    <CopilotPopup />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCopilotAction, useCopilotReadable } from '@dingdayu/vue-copilotkit-core'
import { CopilotPopup, useCopilotChatSuggestions } from '@dingdayu/vue-copilotkit-ui'

type Slide = {
  title: string
  content: string
}

const { t, locale } = useI18n()

const slides = ref<Slide[]>([
  { title: 'Kickoff Goals', content: '<ul><li>Align scope</li><li>Confirm owners</li><li>Lock milestones</li></ul>' },
  {
    title: 'Execution Plan',
    content: '<ul><li>Week 1: discovery</li><li>Week 2: implementation</li><li>Week 3: validation</li></ul>'
  },
  { title: 'Risks', content: '<p>Key risk: delayed data handoff from external team.</p>' }
])

const currentSlide = ref(0)

const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value -= 1
}

const nextSlide = () => {
  if (currentSlide.value < slides.value.length - 1) currentSlide.value += 1
}

const addSlide = () => {
  slides.value.push({ title: `Slide ${slides.value.length + 1}`, content: '<p>New slide content</p>' })
  currentSlide.value = slides.value.length - 1
}

const editCurrentSlide = () => {
  const current = slides.value[currentSlide.value]
  if (!current) return

  const title = prompt('Slide title', current.title)
  const content = prompt('Slide content (HTML)', current.content)

  if (title !== null) current.title = title
  if (content !== null) current.content = content
}

const deleteCurrentSlide = () => {
  if (!slides.value[currentSlide.value]) return
  slides.value.splice(currentSlide.value, 1)
  if (currentSlide.value >= slides.value.length) {
    currentSlide.value = Math.max(0, slides.value.length - 1)
  }
}

useCopilotReadable({
  description: 'The current presentation slides. Each slide has a title and HTML content.',
  value: slides
})

useCopilotReadable({
  description: 'The currently active slide index (0-based)',
  value: currentSlide
})

useCopilotAction({
  name: 'setSlideTitle',
  description: 'Set the title of the current slide',
  parameters: [
    { name: 'title', type: 'string', description: 'The title to set for the current slide', required: true }
  ],
  handler: ({ title }) => {
    if (!slides.value[currentSlide.value]) return
    slides.value[currentSlide.value].title = title
  }
})

useCopilotAction({
  name: 'setSlideContent',
  description: 'Set the HTML content of the current slide',
  parameters: [
    { name: 'content', type: 'string', description: 'The HTML content to set for the current slide', required: true }
  ],
  handler: ({ content }) => {
    if (!slides.value[currentSlide.value]) return
    slides.value[currentSlide.value].content = content
  }
})

useCopilotAction({
  name: 'addNewSlide',
  description: 'Add a new slide with the specified title and content',
  parameters: [
    { name: 'title', type: 'string', description: 'The title for the new slide', required: true },
    { name: 'content', type: 'string', description: 'The HTML content for the new slide', required: true }
  ],
  handler: ({ title, content }) => {
    slides.value.push({ title, content })
    currentSlide.value = slides.value.length - 1
  }
})

useCopilotAction({
  name: 'deleteCurrentSlide',
  description: 'Delete the currently active slide',
  parameters: [],
  handler: deleteCurrentSlide
})

useCopilotAction({
  name: 'goToSlide',
  description: 'Navigate to a specific slide',
  parameters: [
    { name: 'index', type: 'number', description: 'The slide index to navigate to (0-based)', required: true }
  ],
  handler: ({ index }) => {
    if (index >= 0 && index < slides.value.length) {
      currentSlide.value = index
    }
  }
})

const deckSuggestionInstructions = computed(() =>
  locale.value === 'zh-CN'
    ? '围绕当前演示文稿生成可执行建议，包括新增页面、改写标题内容、跳转页面和快速生成整套大纲。'
    : 'Generate actionable presentation suggestions, including creating slides, revising title/content, navigating slides, and drafting full deck outlines.'
)

const deckSuggestions = computed(() =>
  locale.value === 'zh-CN'
    ? [
        { title: '新增发布计划页', message: '新增一页“发布计划”，并给出 3 个关键执行要点。' },
        { title: '重写当前标题', message: '把当前页标题改成 Execution Risks。' },
        { title: '精简当前内容', message: '将当前页内容精简为 3 条更有行动性的 bullet points。' },
        { title: '跳转并优化', message: '跳转到第 2 页，并把内容改成更适合管理层阅读的版本。' }
      ]
    : [
        {
          title: 'Add release-plan slide',
          message: 'Add a new slide titled Release Plan with 3 key execution bullets.'
        },
        { title: 'Rename current title', message: 'Rename the current slide title to Execution Risks.' },
        {
          title: 'Simplify content',
          message: 'Rewrite current slide content into 3 concise actionable bullet points.'
        },
        { title: 'Jump and refine', message: 'Go to slide 2 and revise the content for an executive audience.' }
      ]
)

useCopilotChatSuggestions(
  {
    instructions: deckSuggestionInstructions,
    minSuggestions: 2,
    maxSuggestions: 4,
    suggestions: deckSuggestions
  },
  [locale, deckSuggestions]
)

const quickPrompts = computed(() =>
  locale.value === 'zh-CN'
    ? ['“新增一页，主题是发布计划，包含 3 个要点”', '“把当前页标题改成 Execution Risks”', '“跳转到第 2 页并精简内容”']
    : [
        '"Add a new slide about release plan with 3 bullet points"',
        '"Rename current slide title to Execution Risks"',
        '"Go to slide 2 and simplify the content"'
      ]
)
</script>
