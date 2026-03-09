import type { VNodeChild } from 'vue'
import type {
  CopilotSuggestionsLayout,
  CopilotSuggestionsVariant,
} from '../../core/types/chat-suggestion-configuration'

export interface CopilotChatSuggestion {
  title: string
  label?: string
  message: string
  description?: string
  icon?: VNodeChild
  partial?: boolean
  className?: string
}

export interface CopilotChatSuggestionSection {
  title?: string
  variant?: CopilotSuggestionsVariant
  layout?: CopilotSuggestionsLayout
  scrollable?: boolean
  className?: string
  onItemClick?: ((info: { data: CopilotChatSuggestion; index: number }) => void | Promise<void>) | undefined
  items: CopilotChatSuggestion[]
}
