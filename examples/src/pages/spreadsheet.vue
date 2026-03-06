<template>
  <main class="demo-page bg-gradient-to-b from-blue-50 to-slate-50">
    <div class="demo-page-shell">
      <RouterLink class="font-semibold text-blue-700" to="/">{{ t('common.backHome') }}</RouterLink>

      <section class="mt-3 grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
        <header>
          <h1 class="text-2xl font-bold text-slate-900">{{ t('pages.spreadsheet.title') }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ t('pages.spreadsheet.subtitle') }}</p>
        </header>

        <div class="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-slate-700">
          <strong>{{ t('common.howToTry') }}</strong>
          <ul class="mt-2 list-disc space-y-1 pl-5">
            <li v-for="item in quickPrompts" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="overflow-hidden rounded-xl border border-slate-200">
          <div
            v-for="(row, rowIndex) in grid"
            :key="rowIndex"
            class="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))]"
          >
            <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="border-b border-r border-slate-200">
              <input
                v-model="cell.value"
                :class="[
                  'w-full border-none px-2 py-2 text-sm outline-none',
                  rowIndex === 0 || cellIndex === 0 ? 'bg-slate-100 font-semibold' : 'bg-white'
                ]"
                @change="handleCellChange(rowIndex, cellIndex)"
              />
            </div>
          </div>
        </div>

        <div class="inline-flex flex-wrap gap-2">
          <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="addRow">
            {{ t('pages.spreadsheet.addRow') }}
          </button>
          <button class="rounded-lg border border-slate-300 px-3 py-2 text-sm" @click="addColumn">
            {{ t('pages.spreadsheet.addColumn') }}
          </button>
          <button class="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm" @click="clearGrid">
            {{ t('pages.spreadsheet.clear') }}
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

type Cell = { value: string }
type Grid = Cell[][]

const { t, locale } = useI18n()

const defaultGrid = (): Grid => [
  [{ value: '' }, { value: 'Q1' }, { value: 'Q2' }, { value: 'Q3' }, { value: 'Q4' }],
  [{ value: 'Revenue' }, { value: '10000' }, { value: '15000' }, { value: '12000' }, { value: '20000' }],
  [{ value: 'Expenses' }, { value: '5000' }, { value: '7000' }, { value: '6000' }, { value: '8000' }]
]

const grid = ref<Grid>(defaultGrid())

const addRow = () => {
  const row = [{ value: `Row ${grid.value.length}` }]
  const columns = grid.value[0]?.length || 5
  for (let i = 1; i < columns; i += 1) {
    row.push({ value: '' })
  }
  grid.value.push(row)
}

const addColumn = () => {
  grid.value.forEach(row => row.push({ value: '' }))
}

const clearGrid = () => {
  grid.value.splice(0, grid.value.length, ...defaultGrid())
}

const handleCellChange = (rowIndex: number, cellIndex: number) => {
  console.log(`updated ${rowIndex}-${cellIndex}:`, grid.value[rowIndex][cellIndex].value)
}

useCopilotReadable({
  description: 'The current spreadsheet grid data. Each cell contains a value string.',
  value: grid
})

useCopilotAction({
  name: 'setCellValue',
  description: 'Set the value of a specific cell in the spreadsheet',
  parameters: [
    { name: 'row', type: 'number', description: 'The row index (0-based)', required: true },
    { name: 'column', type: 'number', description: 'The column index (0-based)', required: true },
    { name: 'value', type: 'string', description: 'The value to set in the cell', required: true }
  ],
  handler: ({ row, column, value }) => {
    if (!grid.value[row]?.[column]) return
    grid.value[row][column].value = value
  }
})

useCopilotAction({
  name: 'addSpreadsheetRow',
  description: 'Add a new row to the spreadsheet',
  parameters: [{ name: 'rowName', type: 'string', description: 'The name for the first cell of the new row' }],
  handler: ({ rowName }) => {
    const newRow = [{ value: rowName || `Row ${grid.value.length}` }]
    const columns = grid.value[0]?.length || 5
    for (let i = 1; i < columns; i += 1) {
      newRow.push({ value: '' })
    }
    grid.value.push(newRow)
  }
})

useCopilotAction({
  name: 'clearAllCells',
  description: 'Clear all values in the spreadsheet',
  parameters: [],
  handler: clearGrid
})

const sheetSuggestionInstructions = computed(() =>
  locale.value === 'zh-CN'
    ? '生成电子表格可执行建议，包括填充单元格、新增行列、清空数据和构造样例报表。'
    : 'Generate actionable spreadsheet suggestions, including setting cell values, adding rows/columns, clearing data, and building sample reports.'
)

const sheetSuggestions = computed(() =>
  locale.value === 'zh-CN'
    ? [
        { title: '改 Q1 营收', message: '把 Revenue 行 Q1 的值改成 18000。' },
        { title: '新增 Marketing 行', message: '新增一行 Marketing，并填入四个季度预算数字。' },
        { title: '补零空单元格', message: '将所有空单元格填充为 0，保持表格完整。' },
        { title: '重置全表', message: '清空当前编辑结果并恢复默认示例数据。' }
      ]
    : [
        { title: 'Update Q1 revenue', message: 'Set the Revenue row value for Q1 to 18000.' },
        { title: 'Add Marketing row', message: 'Add a Marketing row and fill all four quarter budget numbers.' },
        { title: 'Fill empty cells', message: 'Fill every empty spreadsheet cell with 0.' },
        { title: 'Reset sheet', message: 'Clear current edits and restore the default sample sheet.' }
      ]
)

useCopilotChatSuggestions(
  {
    instructions: sheetSuggestionInstructions,
    minSuggestions: 2,
    maxSuggestions: 4,
    suggestions: sheetSuggestions
  },
  [locale, sheetSuggestions]
)

const quickPrompts = computed(() =>
  locale.value === 'zh-CN'
    ? ['“将 Q1 营收改成 18000”', '“新增一行 Marketing，填入四个季度预算”', '“把所有空单元格补零”']
    : [
        '"Set Q1 revenue to 18000"',
        '"Add a Marketing row and fill all four quarter budgets"',
        '"Fill empty cells with 0"'
      ]
)
</script>
