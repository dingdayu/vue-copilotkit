import type { VNodeChild } from 'vue'

export type CopilotSuggestionsVariant = 'chips' | 'cards'
export type CopilotSuggestionsLayout = 'wrap' | 'horizontal'

export interface CopilotSuggestionItem {
  title?: string
  label?: string
  message: string
  description?: string
  icon?: VNodeChild
  className?: string
}

export interface CopilotSuggestionClickInfo {
  data: CopilotSuggestionItem
  index: number
}

export interface CopilotChatSuggestionConfiguration {
  /**
   * A prompt or instructions for the GPT to generate suggestions.
   */
  instructions: string

  /**
   * The minimum number of suggestions to generate. Defaults to `1`.
   * @default 1
   */
  minSuggestions?: number

  /**
   * The maximum number of suggestions to generate. Defaults to `3`.
   * @default 1
   */
  maxSuggestions?: number

  title?: string
  variant?: CopilotSuggestionsVariant
  layout?: CopilotSuggestionsLayout
  scrollable?: boolean

  /**
   * Explicit suggestion items to show in chat UI.
   * When provided, these items are prioritized over generic defaults.
   */
  suggestions?: CopilotSuggestionItem[]

  /**
   * An optional class name to apply to the suggestions.
   */
  className?: string

  onItemClick?: (info: CopilotSuggestionClickInfo) => void | Promise<void>
}
