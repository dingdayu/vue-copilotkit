import { defineComponent, PropType, ref, watch } from 'vue'
import { SystemMessageFunction, useCopilotChat, useCopilotContext } from '../../../core'
import { randomId } from '@copilotkit/shared'
import { Message, Role, TextMessage } from '@copilotkit/runtime-client-gql'
import type { CopilotChatSuggestion } from '../../types/suggestions'
import { reloadSuggestions } from './Suggestion'
import { SuggestionsBar } from './SuggestionsBar'
import type { SuggestionsVariant } from './SuggestionsBar'
import type { CopilotSuggestionsLayout } from '../../../core/types/chat-suggestion-configuration'
import { useChatContext, ChatContextProvider, CopilotChatLabels } from './ChatContext'

type ChatSuggestionSectionState = {
  title?: string
  variant?: SuggestionsVariant
  layout?: CopilotSuggestionsLayout
  scrollable?: boolean
  className?: string
  onItemClick?: ((info: { data: CopilotChatSuggestion; index: number }) => void | Promise<void>) | undefined
  items: CopilotChatSuggestion[]
}

type CopilotChatLogicResult = {
  visibleMessages: any
  isLoading: any
  currentSuggestions: { value: unknown }
  sendMessage: (messageContent: string) => Promise<Message>
  stopGeneration: () => void
  reloadMessages: () => void
}

function toSuggestionSection(value: unknown): ChatSuggestionSectionState | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Partial<ChatSuggestionSectionState>
  return {
    title: candidate.title,
    variant: candidate.variant,
    layout: candidate.layout,
    scrollable: candidate.scrollable,
    className: candidate.className,
    onItemClick: candidate.onItemClick,
    items: Array.isArray(candidate.items) ? candidate.items : [],
  }
}

export const CopilotChat = defineComponent({
  props: {
    instructions: {
      type: String,
      default: '',
    },
    onSubmitMessage: {
      type: Function as PropType<(messageContent: string) => void>,
      default: () => {},
    },
    makeSystemMessage: {
      type: Function as PropType<SystemMessageFunction>,
      default: null,
    },
    showResponseButton: {
      type: Boolean,
      default: true,
    },
    onInProgress: {
      type: Function as PropType<(isLoading: boolean) => void>,
      default: () => {},
    },
    className: {
      type: String,
      default: '',
    },
    labels: {
      type: Object,
      default: () => ({}),
    },
    suggestionsTitle: {
      type: String,
      default: undefined,
    },
    suggestionsPosition: {
      type: String as PropType<'top' | 'above-input'>,
      default: 'above-input',
    },
    suggestionsVariant: {
      type: String as PropType<SuggestionsVariant>,
      default: 'chips',
    },
    suggestionsLayout: {
      type: String as PropType<CopilotSuggestionsLayout>,
      default: 'wrap',
    },
    suggestionsScrollable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const context = useCopilotContext()
    const { labels } = useChatContext()
    watch(
      () => props.instructions,
      instructions => {
        // context.setMakeSystemMessage?.(instructions || "")
      },
      { immediate: true }
    )

    const { visibleMessages, isLoading, currentSuggestions, sendMessage, stopGeneration, reloadMessages } =
      useCopilotChatLogic(props.makeSystemMessage, props.onInProgress, props.onSubmitMessage)

    const chatContext = useChatContext()
    const isVisible = chatContext ? chatContext.open : true

    const handleSuggestionClick = async (suggestion: CopilotChatSuggestion, index: number) => {
      const suggestionSection = toSuggestionSection(currentSuggestions.value)

      if (suggestionSection?.onItemClick) {
        await suggestionSection.onItemClick({ data: suggestion, index })
        return
      }

      await sendMessage(suggestion.message)
    }

    const getSuggestionItems = (section: ChatSuggestionSectionState | null): CopilotChatSuggestion[] => {
      if (!section || !Array.isArray(section.items)) {
        return []
      }

      return section.items
    }

    return () => {
      const currentSuggestionSection = toSuggestionSection(currentSuggestions.value)
      const suggestionItems = getSuggestionItems(currentSuggestionSection)
      const resolvedSuggestionsTitle = props.suggestionsTitle || labels?.suggestionsTitle || 'Suggestions'

      const suggestionsNode =
        currentSuggestionSection && suggestionItems.length ? (
          <SuggestionsBar
            section={currentSuggestionSection}
            items={suggestionItems}
            disabled={isLoading.value}
            fallbackTitle={resolvedSuggestionsTitle}
            variant={currentSuggestionSection.variant || props.suggestionsVariant}
            layout={currentSuggestionSection.layout || props.suggestionsLayout}
            scrollable={currentSuggestionSection.scrollable ?? props.suggestionsScrollable}
            onItemClick={handleSuggestionClick}
          />
        ) : null

      return (
        <WrappedCopilotChat labels={props.labels} className={props.className}>
          {props.suggestionsPosition === 'top' ? suggestionsNode : null}
          {/* success */}
          {/* {slots.messages ? slots.messages({ messages: visibleMessages.value, inProgress: isLoading.value, children: {default: () => <>{props.showResponseButton && visibleMessages.value.length > 0 && <ResponseButton inProgress={isLoading.value} hClick={isLoading.value ? stopGeneration : reloadMessages} />}</>}  }) : <DefaultMessages messages={visibleMessages.value}  inProgress={isLoading.value}>
            {props.showResponseButton && visibleMessages.value.length > 0 && <ResponseButton inProgress={isLoading.value} hClick={isLoading.value ? stopGeneration : reloadMessages} />}
          </DefaultMessages>} */}
          {/* fail  props.children.default */}
          {/* {slots.messages ? slots.messages({ messages: visibleMessages.value, inProgress: isLoading.value, children: {default: () => {props.showResponseButton && visibleMessages.value.length > 0 && <ResponseButton inProgress={isLoading.value} hClick={isLoading.value ? stopGeneration : reloadMessages} />}}  }) : <DefaultMessages messages={visibleMessages.value}  inProgress={isLoading.value}>
              {props.showResponseButton && visibleMessages.value.length > 0 && <ResponseButton inProgress={isLoading.value} hClick={isLoading.value ? stopGeneration : reloadMessages} />}
            </DefaultMessages>} */}
          {/* fail */}
          {/* <Messages messages={visibleMessages.value} inProgress={isLoading.value} >
              {props.showResponseButton && visibleMessages.value.length > 0 && <ResponseButton inProgress={isLoading.value} hClick={isLoading.value ? stopGeneration : reloadMessages} />}
            </Messages> */}
          {slots.messages &&
            slots.messages({
              messages: visibleMessages.value,
              inProgress: isLoading.value,
              children: {
                default: () => (
                  <>
                    {props.showResponseButton &&
                      visibleMessages.value.length > 0 &&
                      slots.responseButton &&
                      slots.responseButton({
                        inProgress: isLoading.value,
                        hClick: isLoading.value ? stopGeneration : reloadMessages,
                      })}
                  </>
                ),
              },
            })}
          {props.suggestionsPosition === 'above-input' ? suggestionsNode : null}
          {slots.input && slots.input({ send: sendMessage, inProgress: isLoading.value, isVisible: isVisible })}
          {/* {slots.input ? slots.input({ send:sendMessage, inProgress: isLoading.value, isVisible: isVisible }) : <DefaultInput inProgress={isLoading.value} send={sendMessage} isVisible={isVisible} />} */}
        </WrappedCopilotChat>

        // <WrappedCopilotChat labels={props.labels} className={props.className}>
        //   <components is={props.input}></components>
        // </WrappedCopilotChat>
      )
    }
  },
})
export function WrappedCopilotChat(
  {
    labels,
    className,
  }: {
    labels?: CopilotChatLabels
    className?: string
  },
  { slots }: any
) {
  const chatContext = useChatContext()
  if (!chatContext) {
    return (
      <ChatContextProvider labels={labels} open={true} setOpen={() => {}}>
        <div class={`copilotKitChat ${className}`}>{slots.default?.()}</div>
      </ChatContextProvider>
    )
  }
  return <>{slots.default?.()}</>
}

const SUGGESTIONS_DEBOUNCE_TIMEOUT = 1000

export const useCopilotChatLogic = (
  makeSystemMessage?: SystemMessageFunction,
  onInProgress?: (isLoading: boolean) => void,
  onSubmitMessage?: (messageContent: string) => void
): CopilotChatLogicResult => {
  const { visibleMessages, appendMessage, reloadMessages, stopGeneration, isLoading } = useCopilotChat({
    id: randomId(),
    makeSystemMessage,
  })
  const currentSuggestions = ref<unknown>(null)
  const setCurrentSuggestions = (value: ChatSuggestionSectionState | null) => {
    currentSuggestions.value = value
  }
  const suggestionsAbortControllerRef = ref<AbortController | null>(null)
  const debounceTimerRef = ref<any>()

  const abortSuggestions = () => {
    suggestionsAbortControllerRef.value?.abort()
    suggestionsAbortControllerRef.value = null
  }

  const context = useCopilotContext()
  watch(
    () => [isLoading.value, context.chatSuggestionConfiguration.value],
    (_value, _prevValue, onInvalidate) => {
      onInProgress?.(isLoading.value)

      abortSuggestions()

      const timeout = setTimeout(
        () => {
          if (!isLoading.value && Object.keys(context.chatSuggestionConfiguration.value).length !== 0) {
            suggestionsAbortControllerRef.value = new AbortController()
            reloadSuggestions?.(
              context,
              context.chatSuggestionConfiguration.value,
              setCurrentSuggestions,
              suggestionsAbortControllerRef
            )
          }
        },
        !toSuggestionSection(currentSuggestions.value)?.items.length ? 0 : SUGGESTIONS_DEBOUNCE_TIMEOUT
      )
      debounceTimerRef.value = timeout

      onInvalidate(() => {
        clearTimeout(timeout)
      })
    },
    {
      immediate: true,
      deep: true,
    }
  )

  const sendMessage = async (messageContent: string) => {
    abortSuggestions()
    setCurrentSuggestions(null)

    const message: Message = new TextMessage({
      content: messageContent,
      role: Role.User,
    })

    // Append the message immediately to make it visible
    appendMessage(message)

    if (onSubmitMessage) {
      try {
        await onSubmitMessage(messageContent)
      } catch (error) {
        console.error('Error in onSubmitMessage:', error)
      }
    }

    return message
  }

  const result: CopilotChatLogicResult = {
    visibleMessages,
    isLoading,
    currentSuggestions,
    sendMessage,
    stopGeneration,
    reloadMessages,
  }

  return result
}
