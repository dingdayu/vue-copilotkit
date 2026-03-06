<template>
  <main class="demo-page bg-gradient-to-b from-sky-50 to-slate-50">
    <div class="demo-page-shell demo-page-shell--sidebar">
      <RouterLink class="font-semibold text-blue-700" to="/">{{ t('common.backHome') }}</RouterLink>

      <section class="mt-3 grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
        <header>
          <h1 class="text-2xl font-bold text-slate-900">{{ t('pages.table.title') }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ t('pages.table.subtitle') }}</p>
        </header>

        <div class="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-slate-700">
          <strong>{{ t('common.howToTry') }}</strong>
          <ul class="mt-2 list-disc space-y-1 pl-5">
            <li v-for="item in quickPrompts" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="overflow-hidden rounded-xl border border-slate-200">
          <table class="w-full border-collapse text-sm">
            <thead class="bg-slate-100 text-left text-slate-700">
              <tr>
                <th class="px-3 py-2">ID</th>
                <th class="px-3 py-2">Date</th>
                <th class="px-3 py-2">Name</th>
                <th class="px-3 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.id" class="border-t border-slate-200">
                <td class="px-3 py-2">{{ item.id }}</td>
                <td class="px-3 py-2">{{ item.date }}</td>
                <td class="px-3 py-2">{{ item.name }}</td>
                <td class="px-3 py-2">{{ item.address }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <CopilotSidebar :defaultOpen="true" :clickOutsideToClose="false" />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { TextMessage, Role } from '@copilotkit/runtime-client-gql'

import { useCopilotAction, useCopilotContext, useCopilotReadable } from '@dingdayu/vue-copilotkit-core'
import { CopilotSidebar, useCopilotChatSuggestions } from '@dingdayu/vue-copilotkit-ui'

type RowData = {
  id: number
  date: string
  name: string
  address: string
}

const { t, locale } = useI18n()

const tableData = ref<RowData[]>([
  { id: 1, date: '2026-03-01', name: 'Alice', address: 'Beijing Haidian' },
  { id: 2, date: '2026-03-02', name: 'Bob', address: 'Shanghai Pudong' }
])

const { setMessages } = useCopilotContext()

setMessages([
  new TextMessage({
    role: Role.Assistant,
    content:
      'Try asking me to append rows, update a row by id, or delete records. I will call appendRow/removeRow/updateRow actions.'
  })
])

useCopilotReadable({
  description: 'The current table data.',
  value: tableData
})

useCopilotAction({
  name: 'appendRow',
  description: 'Append rows to the current table',
  parameters: [
    { name: 'dataSource', type: 'object[]', description: 'Rows to append. Each row includes id, date, name, address.' }
  ],
  handler: ({ dataSource }: { dataSource: RowData[] }) => {
    tableData.value.push(...(dataSource || []))
  }
})

useCopilotAction({
  name: 'removeRow',
  description: 'Remove one row from the current table by id',
  parameters: [{ name: 'id', type: 'number', description: 'Row id to remove' }],
  handler: ({ id }: { id: number }) => {
    const index = tableData.value.findIndex(item => item.id === id)
    if (index >= 0) tableData.value.splice(index, 1)
  }
})

useCopilotAction({
  name: 'updateRow',
  description: 'Update one row from the current table',
  parameters: [{ name: 'updateData', type: 'object', description: 'Row object to replace by id' }],
  handler: ({ updateData }: { updateData: RowData }) => {
    const index = tableData.value.findIndex(item => item.id === updateData.id)
    if (index >= 0) tableData.value.splice(index, 1, updateData)
  }
})

const tableSuggestionInstructions = computed(() =>
  locale.value === 'zh-CN'
    ? '围绕当前表格生成可执行建议，包括新增行、删除行、按 id 更新记录、批量填充样例数据。'
    : 'Generate actionable suggestions for this table, including append/remove rows, update by id, and populate sample records.'
)

const tableSuggestions = computed(() =>
  locale.value === 'zh-CN'
    ? [
        { title: '新增记录', message: '新增一条 id=5 的记录，name=Alice，date=2026-03-06，address=Shenzhen Nanshan。' },
        { title: '删除指定行', message: '删除 id=2 的那一行记录。' },
        { title: '按 id 更新', message: '将 id=1 的 address 更新为 Shenzhen Nanshan。' },
        { title: '批量补样例', message: '再追加 3 条不同城市的样例数据，用于测试。' }
      ]
    : [
        {
          title: 'Append one row',
          message: 'Append a row with id=5, name=Alice, date=2026-03-06, address=Shenzhen Nanshan.'
        },
        { title: 'Delete by id', message: 'Delete the row with id=2.' },
        { title: 'Update address', message: 'Update the row with id=1 and set address to Shenzhen Nanshan.' },
        { title: 'Add sample batch', message: 'Append 3 extra sample rows for different cities to test operations.' }
      ]
)

useCopilotChatSuggestions(
  {
    instructions: tableSuggestionInstructions,
    minSuggestions: 2,
    maxSuggestions: 4,
    suggestions: tableSuggestions
  },
  [locale, tableSuggestions]
)

const quickPrompts = computed(() =>
  locale.value === 'zh-CN'
    ? [
        '“新增一条 id 为 5 的记录，name=Alice，date=2026-03-06”',
        '“删除 id 为 2 的数据”',
        '“把 id 为 1 的 address 改成 Shenzhen Nanshan”'
      ]
    : [
        '"Append a row with id=5, name=Alice, date=2026-03-06"',
        '"Delete the row with id=2"',
        '"Update id=1 address to Shenzhen Nanshan"'
      ]
)
</script>
