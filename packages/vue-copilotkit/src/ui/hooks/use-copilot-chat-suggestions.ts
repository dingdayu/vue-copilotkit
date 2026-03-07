import { type MaybeRefOrGetter } from 'vue'
import { useConfigureSuggestions } from '../../core'
import { CopilotSuggestionItem } from '../../core'

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

  /**
   * Explicit suggestions for the current page scenario.
   */
  suggestions?: MaybeRefOrGetter<CopilotSuggestionItem[] | undefined>

  /**
   * The class name to apply to the suggestions.
   */
  className?: MaybeRefOrGetter<string | undefined>
}

export function useCopilotChatSuggestions(
  { instructions, minSuggestions = 1, maxSuggestions = 3, suggestions, className }: UseCopilotChatSuggestionsProps,
  dependencies: MaybeRefOrGetter<unknown>[] = []
) {
  useConfigureSuggestions({ instructions, minSuggestions, maxSuggestions, suggestions, className }, dependencies)
}
