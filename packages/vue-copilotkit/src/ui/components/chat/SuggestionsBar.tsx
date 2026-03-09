import { defineComponent, PropType } from 'vue'

import type { CopilotChatSuggestion, CopilotChatSuggestionSection } from '../../types/suggestions'
import type { CopilotSuggestionsLayout } from '../../../core/types/chat-suggestion-configuration'

export type SuggestionsVariant = 'chips' | 'cards'

export const SuggestionsBar = defineComponent({
  name: 'SuggestionsBar',
  props: {
    section: {
      type: Object as PropType<CopilotChatSuggestionSection>,
      required: true,
    },
    items: {
      type: Array as PropType<CopilotChatSuggestion[]>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fallbackTitle: {
      type: String,
      default: 'Suggestions',
    },
    variant: {
      type: String as PropType<SuggestionsVariant>,
      default: 'chips',
    },
    layout: {
      type: String as PropType<CopilotSuggestionsLayout>,
      default: 'wrap',
    },
    scrollable: {
      type: Boolean,
      default: false,
    },
    onItemClick: {
      type: Function as PropType<(suggestion: CopilotChatSuggestion, index: number) => void | Promise<void>>,
      required: true,
    },
  },
  setup(props) {
    const renderSuggestionItem = (suggestion: CopilotChatSuggestion, index: number) => (
      <button
        class={['copilotKitSuggestionItem', suggestion.className || '', suggestion.description ? 'is-detailed' : '']}
        disabled={props.disabled}
        onClick={() => props.onItemClick(suggestion, index)}
      >
        {suggestion.icon ? <span class="copilotKitSuggestionIcon">{suggestion.icon}</span> : null}
        <span class="copilotKitSuggestionContent">
          <span class="copilotKitSuggestionLabel">{suggestion.label || suggestion.title}</span>
          {suggestion.description ? (
            <span class="copilotKitSuggestionDescription">{suggestion.description}</span>
          ) : null}
        </span>
      </button>
    )

    return () => (
      <div
        class={[
          'copilotKitSuggestionsBar',
          `copilotKitSuggestionsBar-${props.variant}`,
          `copilotKitSuggestionsLayout-${props.layout}`,
          props.scrollable ? 'is-scrollable' : '',
          props.section.className || '',
        ]}
      >
        <div class="suggestions">
          <h6>{props.section.title || props.fallbackTitle}</h6>
          <div class="suggestionsList">{props.items.map(renderSuggestionItem)}</div>
        </div>
      </div>
    )
  },
})
