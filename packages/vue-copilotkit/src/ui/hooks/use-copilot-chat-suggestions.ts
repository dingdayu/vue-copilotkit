import { type MaybeRefOrGetter } from 'vue'
import { useConfigureSuggestions } from '../../core'
import { CopilotSuggestionItem } from '../../core'
import type { CopilotSuggestionsLayout, CopilotSuggestionsVariant } from '../../core'

export interface UseCopilotChatSuggestionsProps {
  /**
   * The instructions to be used for generating suggestions.
   */
  instructions: MaybeRefOrGetter<string>

  /**
   * The minimum number of suggestions to generate.
   * @default 1
   */
  minSuggestions?: MaybeRefOrGetter<number>

  /**
   * The maximum number of suggestions to generate.
   * @default 3
   */
  maxSuggestions?: MaybeRefOrGetter<number>

  title?: MaybeRefOrGetter<string | undefined>
  variant?: MaybeRefOrGetter<CopilotSuggestionsVariant | undefined>
  layout?: MaybeRefOrGetter<CopilotSuggestionsLayout | undefined>
  scrollable?: MaybeRefOrGetter<boolean | undefined>

  /**
   * Explicit suggestions for the current page scenario.
   */
  suggestions?: MaybeRefOrGetter<CopilotSuggestionItem[] | undefined>

  /**
   * The class name to apply to the suggestions.
   */
  className?: MaybeRefOrGetter<string | undefined>

  onItemClick?: MaybeRefOrGetter<
    ((info: { data: CopilotSuggestionItem; index: number }) => void | Promise<void>) | undefined
  >
}

export function useCopilotChatSuggestions(
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
  }: UseCopilotChatSuggestionsProps,
  dependencies: MaybeRefOrGetter<unknown>[] = []
) {
  useConfigureSuggestions(
    {
      instructions,
      minSuggestions,
      maxSuggestions,
      title,
      variant,
      layout,
      scrollable,
      suggestions,
      className,
      onItemClick,
    },
    dependencies
  )
}
