import { onUnmounted, ref, unref, watch, type MaybeRef } from 'vue'

import type { JsonSerializable } from '../types'
import { useCopilotContext } from '../context'

export interface UseAgentContextOptions {
  description: MaybeRef<string>
  value: MaybeRef<JsonSerializable>
}

export function useAgentContext({ description, value }: UseAgentContextOptions) {
  const { addContext, removeContext } = useCopilotContext()
  const idRef = ref<string>()

  watch(
    () => [unref(description), unref(value)],
    (_next, _prev, onInvalidate) => {
      if (idRef.value) {
        removeContext(idRef.value)
      }

      const nextDescription = unref(description)
      const nextValue = unref(value)
      const serializedValue = typeof nextValue === 'string' ? nextValue : JSON.stringify(nextValue)
      idRef.value = addContext(`${nextDescription}: ${serializedValue}`)

      onInvalidate(() => {
        if (idRef.value) {
          removeContext(idRef.value)
        }
      })
    },
    {
      deep: true,
      immediate: true,
    }
  )

  onUnmounted(() => {
    if (idRef.value) {
      removeContext(idRef.value)
    }
  })
}
