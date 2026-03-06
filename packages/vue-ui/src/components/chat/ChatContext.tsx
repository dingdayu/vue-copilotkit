import { defineComponent, provide, PropType, inject, renderSlot } from 'vue'

/**
 * Labels for CopilotChat component.
 */
export interface CopilotChatLabels {
  /**
   * The initial message(s) to display in the chat window.
   */
  initial?: string | string[]

  /**
   * The title to display in the header.
   * @default "CopilotKit"
   */
  title?: string

  /**
   * The placeholder to display in the input.
   * @default "Type a message..."
   */
  placeholder?: string

  /**
   * The message to display when an error occurs.
   * @default "❌ An error occurred. Please try again."
   */
  error?: string

  /**
   * The label to display on the stop button.
   * @default "Stop generating"
   */
  stopGenerating?: string

  /**
   * The label to display on the regenerate button.
   * @default "Regenerate response"
   */
  regenerateResponse?: string
}

const defaultLabels: Required<CopilotChatLabels> = {
  initial: '',
  title: 'CopilotKit',
  placeholder: 'Type a message...',
  error: '❌ An error occurred. Please try again.',
  stopGenerating: 'Stop generating',
  regenerateResponse: 'Regenerate response'
}

const defaultChatContext = {
  labels: defaultLabels,
  open: true,
  setOpen: () => {}
}

export const ChatContextProvider = defineComponent({
  props: {
    labels: {
      type: Object as PropType<CopilotChatLabels>,
      default: () => ({})
    },
    open: {
      type: Boolean,
      default: false
    },
    setOpen: {
      type: Function as PropType<(open: boolean) => void>,
      default: () => {}
    }
  },
  setup(props, { slots }) {
    const context = {
      get labels() {
        return {
          ...defaultLabels,
          ...props.labels
        }
      },
      get open() {
        return props.open
      },
      setOpen: (open: boolean) => props.setOpen(open)
    }
    provide('chatContext', context)

    return () => renderSlot(slots, 'default')
  }
})

interface ChatContext {
  labels: Required<CopilotChatLabels>
  open: boolean
  setOpen: (open: boolean) => void
}

export function useOptionalChatContext(): ChatContext | null {
  return inject<ChatContext | null>('chatContext', null)
}

export function useChatContext(): ChatContext {
  const context = inject<ChatContext | null>('chatContext', null)
  if (context === null || context === undefined) {
    return defaultChatContext
  }
  return context
}
