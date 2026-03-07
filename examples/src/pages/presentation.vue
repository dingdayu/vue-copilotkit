<template>
  <main class="demo-page bg-gradient-to-b from-violet-50 via-white to-slate-100">
    <div class="demo-page-shell">
      <section class="mt-3 grid gap-4 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm">
        <header class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">{{ t('pages.presentation.title') }}</h1>
            <p class="mt-1 text-sm text-slate-500">{{ t('pages.presentation.subtitle') }}</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" @click="loadSampleMarkdown">
              {{ labels.loadSample }}
            </button>
            <button class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" @click="applyMarkdownDraft">
              {{ labels.applyMarkdown }}
            </button>
            <button class="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm" @click="resetDeck">
              {{ labels.reset }}
            </button>
            <button
              class="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
              :disabled="!slides.length || isExporting"
              @click="exportPptx"
            >
              {{ isExporting ? labels.exportingPptx : labels.exportPptx }}
            </button>
          </div>
        </header>

        <div class="rounded-2xl border border-violet-200 bg-violet-50/80 p-4 text-sm text-slate-700">
          <div class="flex items-start justify-between gap-4">
            <div>
              <strong>{{ t('common.howToTry') }}</strong>
              <ul class="mt-2 list-disc space-y-1 pl-5">
                <li v-for="item in quickPrompts" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="hidden rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs text-slate-500 md:block">
              <p class="font-semibold text-slate-700">{{ labels.marpHintTitle }}</p>
              <p class="mt-1 max-w-56 leading-5">{{ labels.marpHintBody }}</p>
            </div>
          </div>
        </div>

        <div class="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <section class="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-600">
                  {{ labels.markdownEditor }}
                </h2>
                <p class="mt-1 text-xs text-slate-500">{{ labels.markdownHelper }}</p>
              </div>
              <span class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-500">
                {{ slides.length }} {{ labels.slideCount }}
              </span>
            </div>

            <textarea
              v-model="markdownDraft"
              rows="22"
              class="w-full rounded-2xl border border-slate-300 bg-slate-950 px-4 py-4 font-mono text-xs leading-6 text-slate-100 outline-none focus:border-violet-400"
              spellcheck="false"
            />

            <p v-if="parseError" class="text-sm text-rose-600">{{ parseError }}</p>
            <p v-if="exportError" class="text-sm text-rose-600">{{ exportError }}</p>
          </section>

          <section class="grid gap-4">
            <div class="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-600">
                    {{ labels.templateTitle }}
                  </h2>
                  <p class="mt-1 text-xs text-slate-500">{{ labels.templateHelper }}</p>
                </div>
                <div class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                  {{ currentSlide + 1 }} / {{ slides.length || 1 }}
                </div>
              </div>

              <div class="grid gap-2 sm:grid-cols-3">
                <button
                  v-for="theme in deckThemes"
                  :key="theme.id"
                  class="rounded-xl border p-2 text-left transition"
                  :class="
                    selectedTheme.id === theme.id
                      ? 'border-violet-400 ring-2 ring-violet-100'
                      : 'border-slate-200 hover:border-slate-300'
                  "
                  @click="selectedThemeId = theme.id"
                >
                  <div class="mb-2 h-10 rounded-lg" :style="{ background: theme.previewGradient }"></div>
                  <p class="text-xs font-semibold text-slate-800">{{ theme.label }}</p>
                </button>
              </div>
            </div>

            <div class="overflow-hidden rounded-[28px] border border-slate-200 shadow-lg">
              <div
                class="flex items-center justify-between border-b border-white/10 px-5 py-3"
                :style="previewHeaderStyle"
              >
                <div>
                  <p class="text-xs uppercase tracking-[0.25em]" :style="{ color: selectedTheme.kickerColor }">
                    {{ labels.previewKicker }}
                  </p>
                  <p class="mt-1 text-sm font-medium" :style="{ color: selectedTheme.metaTextColor }">
                    {{ activeSlide?.title || labels.emptyDeck }}
                  </p>
                </div>
                <div class="rounded-full px-2.5 py-1 text-xs" :style="previewBadgeStyle">{{ selectedTheme.label }}</div>
              </div>

              <div class="aspect-[16/9] p-8" :style="previewBodyStyle">
                <div class="flex h-full flex-col justify-between gap-6">
                  <div>
                    <h3
                      class="max-w-3xl text-3xl font-bold leading-tight"
                      :style="{ color: selectedTheme.titleTextColor }"
                    >
                      {{ activeSlide?.title || labels.emptyDeck }}
                    </h3>

                    <ul v-if="activeSlide?.bullets?.length" class="mt-6 grid gap-3">
                      <li
                        v-for="(bullet, index) in activeSlide.bullets"
                        :key="`${currentSlide}-${index}`"
                        class="flex items-start gap-3 rounded-2xl px-4 py-3"
                        :style="bulletCardStyle"
                      >
                        <span
                          class="mt-1 h-2.5 w-2.5 rounded-full"
                          :style="{ backgroundColor: selectedTheme.accentColor }"
                        ></span>
                        <span class="text-base leading-7" :style="{ color: selectedTheme.bodyTextColor }">
                          {{ bullet }}
                        </span>
                      </li>
                    </ul>
                    <p v-else class="mt-6 text-sm" :style="{ color: selectedTheme.metaTextColor }">
                      {{ labels.emptySlide }}
                    </p>
                  </div>

                  <div class="grid gap-3 border-t pt-4" :style="{ borderColor: selectedTheme.dividerColor }">
                    <p
                      class="text-xs font-semibold uppercase tracking-[0.2em]"
                      :style="{ color: selectedTheme.kickerColor }"
                    >
                      {{ labels.speakerNotes }}
                    </p>
                    <p class="text-sm leading-6" :style="{ color: selectedTheme.metaTextColor }">
                      {{ activeSlide?.speakerNotes || labels.emptyNotes }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div class="inline-flex items-center gap-2">
                <button
                  class="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  :disabled="currentSlide === 0"
                  @click="prevSlide"
                >
                  {{ t('pages.presentation.prev') }}
                </button>
                <button
                  class="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  :disabled="currentSlide >= slides.length - 1"
                  @click="nextSlide"
                >
                  {{ t('pages.presentation.next') }}
                </button>
              </div>

              <div class="inline-flex flex-wrap gap-2">
                <button class="rounded-xl border border-slate-300 px-3 py-2 text-sm" @click="addSlide">
                  {{ t('pages.presentation.add') }}
                </button>
                <button
                  class="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                  :disabled="slides.length <= 1"
                  @click="deleteCurrentSlide"
                >
                  {{ t('pages.presentation.remove') }}
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>

    <CopilotPopup />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCopilotAction, useCopilotReadable } from '@dingdayu/vue-copilotkit'
import { CopilotPopup, useCopilotChatSuggestions } from '@dingdayu/vue-copilotkit'

type Slide = {
  title: string
  bullets: string[]
  speakerNotes?: string
}

type DeckTheme = {
  id: string
  label: string
  previewGradient: string
  headerGradient: string
  slideBackgroundColor: string
  titleTextColor: string
  bodyTextColor: string
  metaTextColor: string
  kickerColor: string
  accentColor: string
  dividerColor: string
  cardBackground: string
  cardBorder: string
}

type PptShapeType = {
  rect: string
  roundRect: string
  line: string
}

type PptTextRun = {
  text: string
  options?: Record<string, unknown>
}

type PptSlide = {
  background?: { color: string }
  addShape: (shape: string, options: Record<string, unknown>) => void
  addText: (text: string | PptTextRun[], options: Record<string, unknown>) => void
  addNotes: (notes: string) => PptSlide
}

type PptInstance = {
  layout: string
  author: string
  subject: string
  title: string
  company: string
  addSlide: () => PptSlide
  writeFile: (options: { fileName: string }) => Promise<string>
}

type PptxConstructor = {
  new (): PptInstance
  ShapeType: PptShapeType
}

const { t, locale } = useI18n()

const sampleMarkdown = `---
marp: true
theme: default
paginate: true
---

# Kickoff Goals

- Align scope with stakeholders
- Confirm owners and dependencies
- Lock milestones and timeline

Note: Use this slide to align cross-functional expectations.

---

# Execution Plan

- Week 1: discovery and requirements
- Week 2: implementation
- Week 3: QA + launch prep

Note: Call out critical path and resource constraints.

---

# Risk Mitigation

- External API delay risk
- Fallback data source ready
- Daily risk review in standup

Note: Emphasize proactive mitigation and owner accountability.`

const markdownDraft = ref(sampleMarkdown)
const slides = ref<Slide[]>([])
const parseError = ref('')
const exportError = ref('')
const isExporting = ref(false)
const currentSlide = ref(0)
const selectedThemeId = ref('midnight')

const deckThemes = computed<DeckTheme[]>(() =>
  locale.value === 'zh-CN'
    ? [
        {
          id: 'midnight',
          label: '深空董事会',
          previewGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          headerGradient: 'linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.96) 100%)',
          slideBackgroundColor: '0F172A',
          titleTextColor: '#F8FAFC',
          bodyTextColor: '#E2E8F0',
          metaTextColor: '#CBD5E1',
          kickerColor: '#7DD3FC',
          accentColor: '#38BDF8',
          dividerColor: 'rgba(148, 163, 184, 0.28)',
          cardBackground: 'rgba(255,255,255,0.06)',
          cardBorder: 'rgba(148,163,184,0.18)'
        },
        {
          id: 'sunrise',
          label: '晨光发布会',
          previewGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
          headerGradient: 'linear-gradient(135deg, rgba(255,247,237,0.98) 0%, rgba(255,237,213,0.98) 100%)',
          slideBackgroundColor: 'FFF7ED',
          titleTextColor: '#9A3412',
          bodyTextColor: '#7C2D12',
          metaTextColor: '#9A3412',
          kickerColor: '#EA580C',
          accentColor: '#F97316',
          dividerColor: 'rgba(234, 88, 12, 0.18)',
          cardBackground: 'rgba(255,255,255,0.72)',
          cardBorder: 'rgba(251,146,60,0.3)'
        },
        {
          id: 'aurora',
          label: '极光科技',
          previewGradient: 'linear-gradient(135deg, #052E16 0%, #064E3B 100%)',
          headerGradient: 'linear-gradient(135deg, rgba(5,46,22,0.96) 0%, rgba(6,78,59,0.96) 100%)',
          slideBackgroundColor: '052E16',
          titleTextColor: '#ECFDF5',
          bodyTextColor: '#D1FAE5',
          metaTextColor: '#A7F3D0',
          kickerColor: '#6EE7B7',
          accentColor: '#34D399',
          dividerColor: 'rgba(110, 231, 183, 0.24)',
          cardBackground: 'rgba(255,255,255,0.05)',
          cardBorder: 'rgba(52,211,153,0.18)'
        }
      ]
    : [
        {
          id: 'midnight',
          label: 'Midnight Boardroom',
          previewGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          headerGradient: 'linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.96) 100%)',
          slideBackgroundColor: '0F172A',
          titleTextColor: '#F8FAFC',
          bodyTextColor: '#E2E8F0',
          metaTextColor: '#CBD5E1',
          kickerColor: '#7DD3FC',
          accentColor: '#38BDF8',
          dividerColor: 'rgba(148, 163, 184, 0.28)',
          cardBackground: 'rgba(255,255,255,0.06)',
          cardBorder: 'rgba(148,163,184,0.18)'
        },
        {
          id: 'sunrise',
          label: 'Sunrise Launch',
          previewGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
          headerGradient: 'linear-gradient(135deg, rgba(255,247,237,0.98) 0%, rgba(255,237,213,0.98) 100%)',
          slideBackgroundColor: 'FFF7ED',
          titleTextColor: '#9A3412',
          bodyTextColor: '#7C2D12',
          metaTextColor: '#9A3412',
          kickerColor: '#EA580C',
          accentColor: '#F97316',
          dividerColor: 'rgba(234, 88, 12, 0.18)',
          cardBackground: 'rgba(255,255,255,0.72)',
          cardBorder: 'rgba(251,146,60,0.3)'
        },
        {
          id: 'aurora',
          label: 'Aurora Tech',
          previewGradient: 'linear-gradient(135deg, #052E16 0%, #064E3B 100%)',
          headerGradient: 'linear-gradient(135deg, rgba(5,46,22,0.96) 0%, rgba(6,78,59,0.96) 100%)',
          slideBackgroundColor: '052E16',
          titleTextColor: '#ECFDF5',
          bodyTextColor: '#D1FAE5',
          metaTextColor: '#A7F3D0',
          kickerColor: '#6EE7B7',
          accentColor: '#34D399',
          dividerColor: 'rgba(110, 231, 183, 0.24)',
          cardBackground: 'rgba(255,255,255,0.05)',
          cardBorder: 'rgba(52,211,153,0.18)'
        }
      ]
)

const selectedTheme = computed(
  () => deckThemes.value.find(item => item.id === selectedThemeId.value) ?? deckThemes.value[0]
)
const activeSlide = computed(() => slides.value[currentSlide.value])

const previewHeaderStyle = computed(() => ({
  background: selectedTheme.value.headerGradient
}))

const previewBodyStyle = computed(() => ({
  background: selectedTheme.value.previewGradient
}))

const previewBadgeStyle = computed(() => ({
  border: `1px solid ${selectedTheme.value.cardBorder}`,
  backgroundColor: selectedTheme.value.cardBackground,
  color: selectedTheme.value.metaTextColor
}))

const bulletCardStyle = computed(() => ({
  backgroundColor: selectedTheme.value.cardBackground,
  border: `1px solid ${selectedTheme.value.cardBorder}`
}))

const labels = computed(() =>
  locale.value === 'zh-CN'
    ? {
        loadSample: '加载 Marp 示例',
        applyMarkdown: '按 Markdown 生成页面',
        reset: '重置页面',
        exportPptx: '导出 PPTX',
        exportingPptx: '导出中...',
        markdownEditor: 'Marp / Markdown 编辑区',
        markdownHelper: '支持 --- 分页、# 标题、- bullet、Note: 讲者备注。',
        slideCount: '页',
        templateTitle: '模板主题',
        templateHelper: '统一页面与导出文件的视觉风格。',
        previewKicker: 'Presentation Preview',
        marpHintTitle: '推荐工作流',
        marpHintBody: '让 Copilot 直接输出 Marp Markdown，再导出为 PPTX，创作链路更短。',
        emptyDeck: '暂无幻灯片',
        emptySlide: '当前页暂无内容，请先应用左侧 Markdown。',
        emptyNotes: '暂无讲者备注。',
        speakerNotes: '讲者备注',
        parseErrorPrefix: '解析失败',
        exportErrorPrefix: '导出失败'
      }
    : {
        loadSample: 'Load Marp sample',
        applyMarkdown: 'Apply Markdown deck',
        reset: 'Reset deck',
        exportPptx: 'Export PPTX',
        exportingPptx: 'Exporting...',
        markdownEditor: 'Marp / Markdown editor',
        markdownHelper: 'Supports --- slide breaks, # headings, - bullets, and Note: speaker notes.',
        slideCount: 'slides',
        templateTitle: 'Deck themes',
        templateHelper: 'Keep preview and exported file visually consistent.',
        previewKicker: 'Presentation Preview',
        marpHintTitle: 'Recommended flow',
        marpHintBody: 'Ask Copilot for Marp Markdown first, then export to PPTX for the shortest authoring loop.',
        emptyDeck: 'No slides yet',
        emptySlide: 'This slide is empty. Apply Markdown from the editor first.',
        emptyNotes: 'No speaker notes yet.',
        speakerNotes: 'Speaker notes',
        parseErrorPrefix: 'Parse failed',
        exportErrorPrefix: 'Export failed'
      }
)

function parseSlidesFromMarkdown(markdown: string): Slide[] {
  const normalized = markdown.replace(/\r\n/g, '\n')
  const segments = normalized
    .split(/\n\s*---+\s*\n/g)
    .map(section => section.trim())
    .filter(
      section =>
        section && !/^marp:\s*true/i.test(section) && !/^theme:\s*/i.test(section) && !/^paginate:\s*/i.test(section)
    )

  return segments.map((segment, index) => {
    const lines = segment
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
    const titleLine = lines.find(line => /^#+\s+/.test(line)) || ''
    const title = titleLine.replace(/^#+\s+/, '').trim() || `Slide ${index + 1}`
    const bullets = lines
      .filter(line => /^[-*]\s+/.test(line))
      .map(line => line.replace(/^[-*]\s+/, '').trim())
      .filter(Boolean)
    const speakerNotes = lines
      .find(line => /^note\s*:/i.test(line))
      ?.replace(/^note\s*:/i, '')
      .trim()
    const fallbackBullets = bullets.length
      ? bullets
      : lines.filter(line => !/^#+\s+/.test(line) && !/^note\s*:/i.test(line)).slice(0, 4)

    return {
      title,
      bullets: fallbackBullets,
      speakerNotes: speakerNotes || undefined
    }
  })
}

function applySlides(nextSlides: Slide[]) {
  if (!nextSlides.length) {
    throw new Error(locale.value === 'zh-CN' ? '至少需要 1 张幻灯片' : 'At least one slide is required')
  }

  slides.value = nextSlides
  currentSlide.value = 0
  parseError.value = ''
}

function applyMarkdownDraft() {
  try {
    applySlides(parseSlidesFromMarkdown(markdownDraft.value))
    exportError.value = ''
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    parseError.value = `${labels.value.parseErrorPrefix}: ${message}`
  }
}

function loadSampleMarkdown() {
  markdownDraft.value = sampleMarkdown
  applyMarkdownDraft()
}

function resetDeck() {
  loadSampleMarkdown()
  exportError.value = ''
}

function prevSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value -= 1
  }
}

function nextSlide() {
  if (currentSlide.value < slides.value.length - 1) {
    currentSlide.value += 1
  }
}

function addSlide() {
  const template =
    locale.value === 'zh-CN'
      ? `\n---\n\n# 新页面 ${slides.value.length + 1}\n\n- 补充一个关键要点\n- 补充第二个执行项\n\nNote: 为这一页写一句讲者备注。`
      : `\n---\n\n# New Slide ${slides.value.length + 1}\n\n- Add one key point\n- Add a second action item\n\nNote: Add one line of speaker notes.`
  markdownDraft.value = `${markdownDraft.value.trim()}${template}`
  applyMarkdownDraft()
  currentSlide.value = slides.value.length - 1
}

function deleteCurrentSlide() {
  if (slides.value.length <= 1) {
    return
  }

  const nextSlides = slides.value.filter((_, index) => index !== currentSlide.value)
  slides.value = nextSlides
  currentSlide.value = Math.min(currentSlide.value, nextSlides.length - 1)
}

function sanitizeFileName(title: string): string {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return normalized || 'copilotkit-deck'
}

async function loadPptxConstructor(): Promise<PptxConstructor> {
  const moduleName = 'pptxgenjs'
  const mod = (await import(/* @vite-ignore */ moduleName)) as unknown
  const maybeModule = mod as Record<string, unknown>
  const ctorCandidate = (maybeModule.default ?? mod) as unknown

  if (typeof ctorCandidate !== 'function') {
    throw new Error('pptxgenjs module is not available')
  }

  return ctorCandidate as PptxConstructor
}

async function exportPptx() {
  if (!slides.value.length || isExporting.value) {
    return
  }

  isExporting.value = true
  exportError.value = ''

  try {
    const PptxGen = await loadPptxConstructor()
    const pptx = new PptxGen()
    const theme = selectedTheme.value

    pptx.layout = 'LAYOUT_WIDE'
    pptx.author = 'CopilotKit Vue Examples'
    pptx.company = 'CopilotKit Vue'
    pptx.subject = 'Markdown to deck example'
    pptx.title = slides.value[0]?.title || 'CopilotKit Deck'

    slides.value.forEach((slideData, index) => {
      const slide = pptx.addSlide()
      slide.background = { color: theme.slideBackgroundColor }

      slide.addShape(PptxGen.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.333,
        h: 0.3,
        line: { color: theme.accentColor, transparency: 100 },
        fill: { color: theme.accentColor }
      })

      slide.addText(slideData.title, {
        x: 0.72,
        y: 0.56,
        w: 11.2,
        h: 0.85,
        color: theme.titleTextColor.replace('#', ''),
        bold: true,
        fontFace: 'Aptos Display',
        fontSize: 25,
        margin: 0
      })

      slide.addShape(PptxGen.ShapeType.roundRect, {
        x: 0.72,
        y: 1.75,
        w: 11.85,
        h: 3.4,
        rectRadius: 0.14,
        line: { color: theme.accentColor, transparency: 70 },
        fill: { color: theme.slideBackgroundColor, transparency: 20 }
      })

      slide.addText(
        slideData.bullets.length
          ? slideData.bullets.map(item => ({ text: item, options: { bullet: { indent: 18 } } }))
          : [
              {
                text: locale.value === 'zh-CN' ? '暂无要点' : 'No bullet points yet',
                options: { bullet: { indent: 18 } }
              }
            ],
        {
          x: 1.02,
          y: 2.08,
          w: 11.1,
          h: 2.7,
          color: theme.bodyTextColor.replace('#', ''),
          fontFace: 'Aptos',
          fontSize: 17,
          breakLine: false,
          margin: 0.08,
          paraSpaceAfterPt: 12,
          valign: 'mid'
        }
      )

      slide.addShape(PptxGen.ShapeType.line, {
        x: 0.72,
        y: 5.62,
        w: 11.85,
        h: 0,
        line: { color: theme.accentColor, transparency: 55, pt: 1 }
      })

      slide.addText(`${labels.value.speakerNotes}: ${slideData.speakerNotes || labels.value.emptyNotes}`, {
        x: 0.72,
        y: 5.78,
        w: 11.85,
        h: 0.55,
        color: theme.metaTextColor.replace('#', ''),
        fontFace: 'Aptos',
        fontSize: 10.5,
        margin: 0
      })

      slide.addText(`${index + 1} / ${slides.value.length}`, {
        x: 12.05,
        y: 6.92,
        w: 0.65,
        h: 0.2,
        align: 'right',
        color: theme.metaTextColor.replace('#', ''),
        fontFace: 'Aptos',
        fontSize: 10,
        margin: 0
      })

      if (slideData.speakerNotes) {
        slide.addNotes(slideData.speakerNotes)
      }
    })

    const timestamp = new Date().toISOString().slice(0, 10)
    await pptx.writeFile({ fileName: `${sanitizeFileName(slides.value[0]?.title || '')}-${timestamp}.pptx` })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    exportError.value = `${labels.value.exportErrorPrefix}: ${message}`
  } finally {
    isExporting.value = false
  }
}

useCopilotReadable({
  description: 'Current presentation draft in Markdown / Marp format.',
  value: markdownDraft
})

useCopilotReadable({
  description: 'Current parsed slides for the presentation preview and export.',
  value: slides
})

useCopilotReadable({
  description: 'Current selected presentation theme.',
  value: selectedTheme
})

useCopilotAction({
  name: 'replaceDeckFromMarkdown',
  description: 'Replace the current deck from a Marp-compatible markdown string.',
  parameters: [{ name: 'markdown', type: 'string', description: 'Markdown deck content', required: true }],
  handler: ({ markdown }) => {
    markdownDraft.value = markdown
    applyMarkdownDraft()
  }
})

useCopilotAction({
  name: 'setPresentationTheme',
  description: 'Set the visual theme for preview and export.',
  parameters: [{ name: 'themeId', type: 'string', description: 'midnight, sunrise, or aurora', required: true }],
  handler: ({ themeId }) => {
    if (deckThemes.value.some(item => item.id === themeId)) {
      selectedThemeId.value = themeId
    }
  }
})

useCopilotAction({
  name: 'goToSlide',
  description: 'Navigate to a specific slide.',
  parameters: [{ name: 'index', type: 'number', description: 'The slide index (0-based)', required: true }],
  handler: ({ index }) => {
    if (index >= 0 && index < slides.value.length) {
      currentSlide.value = index
    }
  }
})

const deckSuggestionInstructions = computed(() =>
  locale.value === 'zh-CN'
    ? '优先直接生成 Marp Markdown 幻灯片，每页包含标题、bullet 和 Note，然后按需要切换主题并导出 PPTX。'
    : 'Prefer generating Marp Markdown slides directly, with a title, bullets, and Note per slide, then switch themes and export to PPTX.'
)

const deckSuggestions = computed(() =>
  locale.value === 'zh-CN'
    ? [
        { title: '生成融资路演', message: '用 Markdown 生成 5 页融资路演稿，每页 3 条 bullet 并附带 Note。' },
        { title: '切换科技模板', message: '把主题切换为 aurora，并生成一套产品发布会演示稿。' },
        { title: '精简当前页', message: '将当前页面的 bullet 改成 3 条更适合高管阅读的表达。' }
      ]
    : [
        {
          title: 'Generate investor deck',
          message: 'Create a 5-slide investor deck in Markdown with 3 bullets and Note per slide.'
        },
        { title: 'Use tech theme', message: 'Switch the theme to aurora and generate a product launch presentation.' },
        { title: 'Executive rewrite', message: 'Rewrite the current slide for an executive audience.' }
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
    ? [
        '“生成一份 5 页的产品发布会 Marp Markdown，每页包含 3 个要点和讲者备注”',
        '“将主题切换为 aurora，并把整套 deck 改成更科技感的表述”',
        '“把当前页改成更适合投资人汇报的版本”'
      ]
    : [
        '"Generate a 5-slide Marp deck for a product launch with 3 bullets and speaker notes per slide"',
        '"Switch the theme to aurora and make the deck sound more technical"',
        '"Rewrite the current slide for an investor audience"'
      ]
)

loadSampleMarkdown()
</script>
