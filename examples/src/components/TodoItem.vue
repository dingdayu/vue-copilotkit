<template>
  <div class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
    <label class="flex cursor-pointer items-center gap-2">
      <input type="checkbox" :checked="todo.isCompleted" @change="toggleComplete(todo.id)" />
      <span class="text-xs font-bold text-slate-500">#{{ todo.sort }}</span>
      <span :class="todo.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'">{{ todo.text }}</span>
    </label>
    <button class="h-7 w-7 rounded-full bg-rose-100 text-base leading-none text-rose-700" @click="deleteTodo(todo.id)">
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  todo: {
    id: number
    text: string
    isCompleted: boolean
    sort: number
  }
}>()

const emit = defineEmits<{
  (e: 'toggle-complete', id: number): void
  (e: 'delete-todo', id: number): void
}>()

const toggleComplete = (id: number) => emit('toggle-complete', id)
const deleteTodo = (id: number) => emit('delete-todo', id)
</script>
