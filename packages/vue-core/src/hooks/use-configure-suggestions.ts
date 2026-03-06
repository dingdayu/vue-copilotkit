import { type MaybeRefOrGetter, onUnmounted, toValue, watch } from 'vue'
import { randomId } from '@copilotkit/shared'

import { useCopilotContext } from '../context'
import { CopilotSuggestionItem } from '../types/chat-suggestion-configuration'

export interface UseConfigureSuggestionsOptions {
  instructions: MaybeRefOrGetter<string>
  minSuggestions?: MaybeRefOrGetter<number>
  maxSuggestions?: MaybeRefOrGetter<number>
  suggestions?: MaybeRefOrGetter<CopilotSuggestionItem[] | undefined>
  className?: MaybeRefOrGetter<string | undefined>
}

export function useConfigureSuggestions(
  { instructions, minSuggestions = 1, maxSuggestions = 3, suggestions, className }: UseConfigureSuggestionsOptions,
  dependencies: MaybeRefOrGetter<unknown>[] = []
) {
  const { addChatSuggestionConfiguration, removeChatSuggestionConfiguration } = useCopilotContext()
  const id = randomId()

  watch(
    () => [
      toValue(instructions),
      toValue(minSuggestions),
      toValue(maxSuggestions),
      toValue(suggestions),
      toValue(className),
      ...dependencies.map(dep => toValue(dep))
    ],
    values => {
      const rawSuggestions = values[3] as CopilotSuggestionItem[] | undefined
      const normalizedSuggestions = (rawSuggestions || []).filter(item => {
        const title = typeof item?.title === 'string' ? item.title.trim() : ''
        const message = typeof item?.message === 'string' ? item.message.trim() : ''
        return title.length > 0 && message.length > 0
      })

      addChatSuggestionConfiguration(id, {
        instructions: String(values[0] || ''),
        minSuggestions: Number(values[1] || 1),
        maxSuggestions: Number(values[2] || 3),
        suggestions: normalizedSuggestions.length > 0 ? normalizedSuggestions : undefined,
        className: (values[4] as string | undefined) || undefined
      })
    },
    { immediate: true }
  )

  onUnmounted(() => {
    removeChatSuggestionConfiguration(id)
  })
}
