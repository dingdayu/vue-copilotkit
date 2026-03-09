import { type MaybeRefOrGetter, onUnmounted, toValue, watch } from 'vue'
import { randomId } from '@copilotkit/shared'

import { useCopilotContext } from '../context'
import {
  CopilotSuggestionClickInfo,
  CopilotSuggestionItem,
  type CopilotSuggestionsLayout,
  type CopilotSuggestionsVariant,
} from '../types/chat-suggestion-configuration'

export interface UseConfigureSuggestionsOptions {
  instructions: MaybeRefOrGetter<string>
  minSuggestions?: MaybeRefOrGetter<number>
  maxSuggestions?: MaybeRefOrGetter<number>
  title?: MaybeRefOrGetter<string | undefined>
  variant?: MaybeRefOrGetter<CopilotSuggestionsVariant | undefined>
  layout?: MaybeRefOrGetter<CopilotSuggestionsLayout | undefined>
  scrollable?: MaybeRefOrGetter<boolean | undefined>
  suggestions?: MaybeRefOrGetter<CopilotSuggestionItem[] | undefined>
  className?: MaybeRefOrGetter<string | undefined>
  onItemClick?: MaybeRefOrGetter<((info: CopilotSuggestionClickInfo) => void | Promise<void>) | undefined>
}

export function useConfigureSuggestions(
  {
    instructions,
    minSuggestions = 1,
    maxSuggestions = 3,
    title,
    variant,
    layout,
    scrollable,
    suggestions,
    className,
    onItemClick,
  }: UseConfigureSuggestionsOptions,
  dependencies: MaybeRefOrGetter<unknown>[] = []
) {
  const { addChatSuggestionConfiguration, removeChatSuggestionConfiguration } = useCopilotContext()
  const id = randomId()

  watch(
    () => [
      toValue(instructions),
      toValue(minSuggestions),
      toValue(maxSuggestions),
      toValue(title),
      toValue(variant),
      toValue(layout),
      toValue(scrollable),
      toValue(suggestions),
      toValue(className),
      toValue(onItemClick),
      ...dependencies.map(dep => toValue(dep)),
    ],
    values => {
      const rawSuggestions = values[7] as CopilotSuggestionItem[] | undefined
      const normalizedSuggestions = (rawSuggestions || [])
        .filter(item => {
          const title = typeof item?.title === 'string' ? item.title.trim() : ''
          const label = typeof item?.label === 'string' ? item.label.trim() : ''
          const message = typeof item?.message === 'string' ? item.message.trim() : ''
          return (title.length > 0 || label.length > 0) && message.length > 0
        })
        .map(item => ({
          ...item,
          title: typeof item.title === 'string' && item.title.trim() ? item.title.trim() : undefined,
          label: typeof item.label === 'string' && item.label.trim() ? item.label.trim() : undefined,
          message: item.message.trim(),
          description:
            typeof item.description === 'string' && item.description.trim() ? item.description.trim() : undefined,
        }))

      addChatSuggestionConfiguration(id, {
        instructions: String(values[0] || ''),
        minSuggestions: Number(values[1] || 1),
        maxSuggestions: Number(values[2] || 3),
        title: (values[3] as string | undefined) || undefined,
        variant: (values[4] as CopilotSuggestionsVariant | undefined) || undefined,
        layout: (values[5] as CopilotSuggestionsLayout | undefined) || undefined,
        scrollable: (values[6] as boolean | undefined) ?? undefined,
        suggestions: normalizedSuggestions.length > 0 ? normalizedSuggestions : undefined,
        className: (values[8] as string | undefined) || undefined,
        onItemClick:
          (values[9] as ((info: CopilotSuggestionClickInfo) => void | Promise<void>) | undefined) || undefined,
      })
    },
    { immediate: true }
  )

  onUnmounted(() => {
    removeChatSuggestionConfiguration(id)
  })
}
