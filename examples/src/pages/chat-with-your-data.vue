<template>
  <main class="demo-page bg-gradient-to-b from-indigo-50 to-slate-50">
    <div class="demo-page-shell demo-page-shell--sidebar">
      <section class="mt-3 grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
        <header>
          <h1 class="text-2xl font-bold text-slate-900">{{ t('pages.data.title') }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ t('pages.data.subtitle') }}</p>
        </header>

        <div class="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-slate-700">
          <strong>{{ t('common.howToTry') }}</strong>
          <ul class="mt-2 list-disc space-y-1 pl-5">
            <li v-for="item in quickPrompts" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <article class="rounded-xl border border-slate-200 bg-white p-3">
            <p class="text-xs text-slate-500">{{ t('pages.data.revenue') }}</p>
            <h3 class="mt-1 text-xl font-semibold text-slate-900">${{ totalRevenue.toLocaleString() }}</h3>
          </article>
          <article class="rounded-xl border border-slate-200 bg-white p-3">
            <p class="text-xs text-slate-500">{{ t('pages.data.profit') }}</p>
            <h3 class="mt-1 text-xl font-semibold text-slate-900">${{ totalProfit.toLocaleString() }}</h3>
          </article>
          <article class="rounded-xl border border-slate-200 bg-white p-3">
            <p class="text-xs text-slate-500">{{ t('pages.data.customers') }}</p>
            <h3 class="mt-1 text-xl font-semibold text-slate-900">{{ totalCustomers.toLocaleString() }}</h3>
          </article>
          <article class="rounded-xl border border-slate-200 bg-white p-3">
            <p class="text-xs text-slate-500">{{ t('pages.data.margin') }}</p>
            <h3 class="mt-1 text-xl font-semibold text-slate-900">{{ profitMargin }}%</h3>
          </article>
        </div>

        <div class="grid gap-3 lg:grid-cols-2">
          <article class="rounded-xl border border-slate-200 bg-white p-3">
            <h3 class="font-semibold text-slate-900">Monthly Data</h3>
            <div class="mt-2 overflow-hidden rounded-lg border border-slate-200">
              <table class="w-full border-collapse text-sm">
                <thead class="bg-slate-100 text-left text-slate-700">
                  <tr>
                    <th class="px-2 py-1">Month</th>
                    <th class="px-2 py-1">Sales</th>
                    <th class="px-2 py-1">Profit</th>
                    <th class="px-2 py-1">Expenses</th>
                    <th class="px-2 py-1">Customers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in salesSeries" :key="row.month" class="border-t border-slate-200">
                    <td class="px-2 py-1">{{ row.month }}</td>
                    <td class="px-2 py-1">{{ row.sales }}</td>
                    <td class="px-2 py-1">{{ row.profit }}</td>
                    <td class="px-2 py-1">{{ row.expenses }}</td>
                    <td class="px-2 py-1">{{ row.customers }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article class="rounded-xl border border-slate-200 bg-white p-3">
            <h3 class="font-semibold text-slate-900">{{ t('pages.data.notes') }}</h3>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li v-for="(note, index) in insightNotes" :key="`${note}-${index}`">{{ note }}</li>
            </ul>
          </article>

          <article class="rounded-xl border border-slate-200 bg-white p-3">
            <h3 class="font-semibold text-slate-900">Regional Sales</h3>
            <div class="mt-2 overflow-hidden rounded-lg border border-slate-200">
              <table class="w-full border-collapse text-sm">
                <thead class="bg-slate-100 text-left text-slate-700">
                  <tr>
                    <th class="px-2 py-1">Region</th>
                    <th class="px-2 py-1">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in regionData" :key="row.name" class="border-t border-slate-200">
                    <td class="px-2 py-1">{{ row.name }}</td>
                    <td class="px-2 py-1">{{ row.sales }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
    </div>

    <CopilotSidebar
      :defaultOpen="true"
      :labels="{
        title: locale.value === 'zh-CN' ? '数据助手' : 'Data Assistant',
        initial:
          locale.value === 'zh-CN'
            ? '我可以基于看板数据回答问题，并给出可执行建议。'
            : 'I can answer with concrete dashboard numbers and suggest actions.',
        placeholder: locale.value === 'zh-CN' ? '例如：对比 3 月和 6 月变化' : 'Try: compare Mar and Jun changes'
      }"
      instructions="You are a data analyst assistant. Always reference concrete numbers before recommendations."
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCopilotAction, useCopilotReadable } from '@dingdayu/vue-copilotkit'
import { CopilotSidebar, useCopilotChatSuggestions } from '@dingdayu/vue-copilotkit'

type SalesPoint = {
  month: string
  sales: number
  profit: number
  expenses: number
  customers: number
}

type RegionPoint = {
  name: string
  sales: number
}

const { t, locale } = useI18n()

const salesSeries = ref<SalesPoint[]>([
  { month: 'Jan', sales: 2900, profit: 2300, expenses: 650, customers: 160 },
  { month: 'Feb', sales: 2100, profit: 1600, expenses: 620, customers: 145 },
  { month: 'Mar', sales: 3900, profit: 3000, expenses: 940, customers: 196 },
  { month: 'Apr', sales: 3000, profit: 2400, expenses: 700, customers: 178 },
  { month: 'May', sales: 5000, profit: 3300, expenses: 1700, customers: 232 },
  { month: 'Jun', sales: 3950, profit: 2950, expenses: 1080, customers: 201 }
])

const regionData = ref<RegionPoint[]>([
  { name: 'North America', sales: 31100 },
  { name: 'Asia Pacific', sales: 26700 },
  { name: 'Europe', sales: 22100 },
  { name: 'Latin America', sales: 9600 }
])

const insightNotes = ref<string[]>([
  'North America and Asia Pacific contribute the largest share.',
  'Profit trend is stable while expenses slightly increase in late months.'
])

const totalRevenue = computed(() => salesSeries.value.reduce((sum, item) => sum + item.sales, 0))
const totalProfit = computed(() => salesSeries.value.reduce((sum, item) => sum + item.profit, 0))
const totalCustomers = computed(() => salesSeries.value.reduce((sum, item) => sum + item.customers, 0))
const profitMargin = computed(() => ((totalProfit.value / totalRevenue.value) * 100).toFixed(1))

const dashboardReadable = computed(() => ({
  salesSeries: salesSeries.value,
  regionData: regionData.value,
  notes: insightNotes.value,
  kpis: {
    totalRevenue: totalRevenue.value,
    totalProfit: totalProfit.value,
    totalCustomers: totalCustomers.value,
    profitMargin: profitMargin.value
  }
}))

useCopilotReadable({
  description: 'Dashboard analytics data including monthly trend, regional sales, and notes.',
  value: dashboardReadable
})

useCopilotAction({
  name: 'queryDashboardData',
  description: 'Query dashboard records by month, region, or metric and return concise summary with numbers.',
  parameters: [
    { name: 'query', type: 'string', description: 'The analytics question to answer.', required: true },
    { name: 'region', type: 'string', description: 'Optional region filter.', required: false },
    { name: 'metric', type: 'string', description: 'Optional metric focus.', required: false }
  ],
  handler: ({ query, region }) => {
    const regionQuery = (region || '').toLowerCase().trim()
    const filteredRegions = regionData.value.filter(
      item => !regionQuery || item.name.toLowerCase().includes(regionQuery)
    )
    const bestMonth = [...salesSeries.value].sort((a, b) => b.sales - a.sales)[0]

    return {
      query,
      bestMonth,
      totals: {
        revenue: totalRevenue.value,
        profit: totalProfit.value,
        customers: totalCustomers.value
      },
      regions: filteredRegions
    }
  }
})

useCopilotAction({
  name: 'appendInsightNote',
  description: 'Append a concise analyst note to notes panel.',
  parameters: [{ name: 'note', type: 'string', description: 'Note content to append.', required: true }],
  handler: ({ note }) => {
    const content = (note || '').trim()
    if (!content) return
    insightNotes.value.push(content)
  }
})

const dashboardSuggestionInstructions = computed(() =>
  locale.value === 'zh-CN'
    ? '基于当前仪表盘数据生成后续分析问题，聚焦趋势、异常、区域对比和下一步动作建议。'
    : 'Generate follow-up analytics prompts based on this dashboard, focused on trends, anomalies, regional comparison, and KPI actions.'
)

const dashboardSuggestions = computed(() =>
  locale.value === 'zh-CN'
    ? [
        { title: '区域贡献分析', message: '比较各区域销售额，给出 Top 区域占比和结论。' },
        { title: '月度趋势总结', message: '总结上半年每月营收与利润趋势，并指出异常月份。' },
        { title: '利润率改进建议', message: '基于当前利润率，给出 3 条可执行优化动作。' },
        { title: '追加分析结论', message: '新增一条分析结论：建议增加亚太市场预算投放。' }
      ]
    : [
        {
          title: 'Regional contribution',
          message: 'Compare regional sales and report top region share with concise conclusions.'
        },
        {
          title: 'Monthly trend summary',
          message: 'Summarize first-half monthly revenue/profit trends and flag anomalies.'
        },
        {
          title: 'Margin improvement',
          message: 'Give 3 actionable recommendations to improve profit margin from current KPIs.'
        },
        {
          title: 'Append insight note',
          message: 'Append an insight note recommending increased budget allocation for APAC.'
        }
      ]
)

useCopilotChatSuggestions(
  {
    instructions: dashboardSuggestionInstructions,
    minSuggestions: 2,
    maxSuggestions: 4,
    suggestions: dashboardSuggestions
  },
  [locale, dashboardSuggestions]
)

const quickPrompts = computed(() =>
  locale.value === 'zh-CN'
    ? ['“哪个地区营收最高？给出数字和占比”', '“总结上半年的主要趋势和风险”', '“新增一条分析结论：亚太市场值得增加投放”']
    : [
        '"Which region has the highest sales? Include number and share."',
        '"Summarize first-half trends and key risks."',
        '"Append an insight note: increase budget for APAC market."'
      ]
)
</script>
