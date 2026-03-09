import { defineComponent, onUnmounted, PropType, watch } from 'vue'
import { randomId } from '@copilotkit/shared'

import { useCopilotContext } from '../../../core/context'
import type {
  CopilotSuggestionClickInfo,
  CopilotSuggestionItem,
  CopilotSuggestionsLayout,
  CopilotSuggestionsVariant,
} from '../../../core/types/chat-suggestion-configuration'

export const CopilotChatSuggestions = defineComponent({
  name: 'CopilotChatSuggestions',
  props: {
    instructions: {
      type: String,
      default: '',
    },
    minSuggestions: {
      type: Number,
      default: 1,
    },
    maxSuggestions: {
      type: Number,
      default: 3,
    },
    title: {
      type: String,
      default: undefined,
    },
    variant: {
      type: String as PropType<CopilotSuggestionsVariant | undefined>,
      default: undefined,
    },
    layout: {
      type: String as PropType<CopilotSuggestionsLayout | undefined>,
      default: undefined,
    },
    scrollable: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    suggestions: {
      type: Array as PropType<CopilotSuggestionItem[] | undefined>,
      default: undefined,
    },
    className: {
      type: String,
      default: undefined,
    },
    onItemClick: {
      type: Function as PropType<((info: CopilotSuggestionClickInfo) => void | Promise<void>) | undefined>,
      default: undefined,
    },
  },
  setup(props) {
    const { addChatSuggestionConfiguration, removeChatSuggestionConfiguration } = useCopilotContext()
    const id = randomId()

    watch(
      () => [
        props.instructions,
        props.minSuggestions,
        props.maxSuggestions,
        props.title,
        props.variant,
        props.layout,
        props.scrollable,
        props.suggestions,
        props.className,
        props.onItemClick,
      ],
      () => {
        addChatSuggestionConfiguration(id, {
          instructions: props.instructions,
          minSuggestions: props.minSuggestions,
          maxSuggestions: props.maxSuggestions,
          title: props.title,
          variant: props.variant,
          layout: props.layout,
          scrollable: props.scrollable,
          suggestions: props.suggestions,
          className: props.className,
          onItemClick: props.onItemClick,
        })
      },
      { immediate: true, deep: true }
    )

    onUnmounted(() => {
      removeChatSuggestionConfiguration(id)
    })

    return () => null
  },
})
