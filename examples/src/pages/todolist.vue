<template>
  <main class="demo-page bg-gradient-to-b from-indigo-50 to-slate-50">
    <div class="demo-page-shell">
      <section class="mt-3 grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
        <header>
          <h1 class="text-2xl font-bold text-slate-900">{{ t('pages.todolist.title') }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ t('pages.todolist.subtitle') }}</p>
        </header>

        <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <strong>{{ t('common.howToTry') }}</strong>
          <ul class="mt-2 list-disc space-y-1 pl-5">
            <li v-for="item in quickPrompts" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            v-model="input"
            :placeholder="t('pages.todolist.inputPlaceholder')"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            @keyup.enter="addTodo('')"
          />
          <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white" @click="addTodo('')">
            {{ t('pages.todolist.add') }}
          </button>
        </div>

        <div class="grid gap-2">
          <TodoItem
            v-for="todo in sortedTodos"
            :key="todo.id"
            :todo="todo"
            @toggle-complete="id => toggleComplete(id, !todo.isCompleted)"
            @delete-todo="deleteTodo"
          />
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

import TodoItem from '../components/TodoItem.vue'

type Todo = {
  id: number
  text: string
  isCompleted: boolean
  sort: number
}

const { t, locale } = useI18n()
const input = ref('')
const todos = ref<Todo[]>([])

const addTodo = (text: string) => {
  const title = (text || input.value).trim()
  if (!title) return

  todos.value.push({
    id: Date.now() + Math.floor(Math.random() * 1000),
    text: title,
    isCompleted: false,
    sort: todos.value.length + 1
  })
  input.value = ''
}

const toggleComplete = (id: number, isCompleted: boolean) => {
  const target = todos.value.find(todo => todo.id === id)
  if (!target) return
  target.isCompleted = isCompleted
}

const deleteTodo = (id: number) => {
  const index = todos.value.findIndex(todo => todo.id === id)
  if (index >= 0) {
    todos.value.splice(index, 1)
  }
}

const sortedTodos = computed(() =>
  [...todos.value].sort((a, b) => {
    if (a.isCompleted && !b.isCompleted) return 1
    if (!a.isCompleted && b.isCompleted) return -1
    return a.sort - b.sort
  })
)

useCopilotReadable({
  description: "The user's todo list.",
  value: todos
})

useCopilotAction({
  name: 'addTask',
  description: 'Adds a todo to the todo list',
  parameters: [{ name: 'text', type: 'string', description: 'The text of the todo', required: true }],
  handler: ({ text }) => addTodo(text)
})

useCopilotAction({
  name: 'deleteTask',
  description: 'Deletes a todo from the todo list',
  parameters: [{ name: 'id', type: 'number', description: 'The id of the todo', required: true }],
  handler: ({ id }) => deleteTodo(id)
})

useCopilotAction({
  name: 'setTaskStatus',
  description: 'Sets the status of a todo',
  parameters: [
    { name: 'id', type: 'number', description: 'The id of the todo', required: true },
    { name: 'isCompleted', type: 'boolean', description: 'The status of the todo', required: true }
  ],
  handler: ({ id, isCompleted }) => toggleComplete(id, isCompleted)
})

const todoSuggestionInstructions = computed(() =>
  locale.value === 'zh-CN'
    ? '围绕当前待办清单生成可执行建议，包括新增任务、完成任务、删除任务、整理优先级等。'
    : 'Generate actionable follow-up suggestions for this todo list, including adding tasks, completing tasks, deleting tasks, and reprioritizing.'
)

const todoSuggestions = computed(() =>
  locale.value === 'zh-CN'
    ? [
        { title: '新增今日任务', message: '帮我新增 3 个今天必须完成的任务，并按优先级排序。' },
        { title: '完成一项任务', message: '将列表中最紧急的一项任务标记为已完成。' },
        { title: '清理已完成项', message: '删除所有已完成任务，只保留未完成项。' },
        { title: '重排优先级', message: '根据重要且紧急程度，重新整理当前待办顺序。' }
      ]
    : [
        { title: 'Add today tasks', message: 'Add 3 must-do tasks for today and sort them by priority.' },
        { title: 'Complete one task', message: 'Mark the most urgent task in the list as completed.' },
        { title: 'Clear completed', message: 'Delete all completed tasks and keep only active ones.' },
        { title: 'Reprioritize list', message: 'Reorder current todos by urgency and importance.' }
      ]
)

useCopilotChatSuggestions(
  {
    instructions: todoSuggestionInstructions,
    minSuggestions: 2,
    maxSuggestions: 4,
    suggestions: todoSuggestions
  },
  [locale, todoSuggestions]
)

const quickPrompts = computed(() =>
  locale.value === 'zh-CN'
    ? ['“帮我添加 3 个今天要完成的任务”', '“把第 2 个任务标记为完成”', '“删除所有已完成任务”']
    : ['"Add 3 tasks I should finish today"', '"Mark task #2 as completed"', '"Delete all completed tasks"']
)
</script>
