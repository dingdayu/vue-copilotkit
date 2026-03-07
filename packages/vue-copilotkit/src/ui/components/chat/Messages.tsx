import { computed, defineComponent, PropType, ref, watch } from 'vue'

import { Markdown } from './Markdown'
import { RenderFunctionStatus, useCopilotContext } from '../../../core'
import { SpinnerIcon } from './Icon'

import {
  ActionExecutionMessage,
  Message,
  MessageStatusCode,
  ResultMessage,
  TextMessage
} from '@copilotkit/runtime-client-gql'

export const Messages = defineComponent({
  props: {
    messages: {
      type: Array as PropType<Message[]>,
      required: true
    },
    inProgress: {
      type: Boolean,
      required: true
    },
    maxHeight: {
      type: [String, Number],
      default: undefined
    },
    children: {
      type: Object
    }
  },
  setup(props, { slots }) {
    const { chatComponentsCache, defaultToolRender } = useCopilotContext()

    const messages = computed(() => props.messages || [])
    const isAssistantToolPlaceholder = (message: TextMessage, index: number) => {
      const hasText = Boolean(message.content?.trim())
      if (hasText) return false
      const nextMessage = messages.value[index + 1]
      return nextMessage instanceof ActionExecutionMessage
    }

    const isAssistantTextCandidate = (message: TextMessage, index: number) => {
      const hasText = Boolean(message.content?.trim())
      if (hasText) return true
      if (isAssistantToolPlaceholder(message, index)) return false
      return props.inProgress
    }

    const lastRenderableMessageIndex = computed(() => {
      for (let index = messages.value.length - 1; index >= 0; index -= 1) {
        const message = messages.value[index]
        if (message instanceof TextMessage && message.role === 'user') {
          return index
        }
        if (message instanceof ActionExecutionMessage) {
          return index
        }
        if (
          message instanceof TextMessage &&
          message.role === 'assistant' &&
          isAssistantTextCandidate(message, index)
        ) {
          return index
        }
      }
      return -1
    })

    const lastUserMessageIndex = computed(() => {
      for (let index = messages.value.length - 1; index >= 0; index -= 1) {
        const message = messages.value[index]
        if (message instanceof TextMessage && message.role === 'user') {
          return index
        }
      }
      return -1
    })
    const shouldShowThinkingHint = computed(() => {
      if (!props.inProgress || messages.value.length === 0) {
        return false
      }

      const userIndex = lastUserMessageIndex.value
      if (userIndex === -1) {
        return false
      }

      const hasAssistantUpdate = messages.value.slice(userIndex + 1).some((message, offset) => {
        const actualIndex = userIndex + 1 + offset
        if (message instanceof ActionExecutionMessage) {
          return true
        }
        if (message instanceof TextMessage && message.role === 'assistant') {
          if (message.content?.trim()) {
            return true
          }
          return isAssistantTextCandidate(message, actualIndex) && actualIndex === lastRenderableMessageIndex.value
        }
        return false
      })

      return !hasAssistantUpdate
    })

    const functionResults = computed(() => {
      const entries = new Map<string, unknown>()
      for (const message of messages.value) {
        if (message instanceof ResultMessage) {
          entries.set(message.actionExecutionId, ResultMessage.decodeResult(message.result || ''))
        }
      }
      return entries
    })

    const messagesEndRef = ref<HTMLDivElement | null>(null)
    const messagesStyle = computed(() => {
      if (props.maxHeight === undefined || props.maxHeight === null || props.maxHeight === '') {
        return undefined
      }

      return {
        maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
      }
    })

    const scrollToBottom = () => {
      messagesEndRef.value?.scrollIntoView({ behavior: 'auto' })
    }

    watch(() => messages.value.length, scrollToBottom, { flush: 'post' })

    const getActionStatus = (message: ActionExecutionMessage): RenderFunctionStatus => {
      if (functionResults.value.has(message.id) || message.status.code === MessageStatusCode.Success) {
        return 'complete'
      }
      if (message.status.code !== MessageStatusCode.Pending) {
        return 'executing'
      }
      return 'inProgress'
    }

    const safeStringify = (value: unknown) => {
      if (value === undefined) return ''
      if (typeof value === 'string') return value
      try {
        return JSON.stringify(value, null, 2)
      } catch (_error) {
        return String(value)
      }
    }

    const renderDefaultToolMessage = (message: ActionExecutionMessage, status: RenderFunctionStatus) => {
      const result = functionResults.value.get(message.id)
      const argsString = safeStringify(message.arguments)
      const resultString = safeStringify(result)
      const statusLabel = status === 'complete' ? 'completed' : status === 'executing' ? 'executing' : 'running'
      const isExpanded = props.inProgress && status !== 'complete'

      return (
        <div class="copilotKitMessage copilotKitAssistantMessage copilotKitToolMessage">
          {isExpanded ? <SpinnerIcon /> : null}
          <div class="copilotKitToolContent">
            <div class="copilotKitToolHeader">
              <span class="copilotKitToolName">{message.name}</span>
              <span class="copilotKitToolStatus">{statusLabel}</span>
            </div>
            {argsString ? (
              <details
                class="copilotKitToolBlock"
                key={`${message.id}-params-${isExpanded ? 'live' : 'done'}`}
                open={isExpanded || undefined}
              >
                <summary>
                  <span class="copilotKitToolLabel">params</span>
                </summary>
                <pre>{argsString}</pre>
              </details>
            ) : null}
            {status === 'complete' && resultString ? (
              <details class="copilotKitToolBlock" key={`${message.id}-result`}>
                <summary>
                  <span class="copilotKitToolLabel">result</span>
                </summary>
                <pre>{resultString}</pre>
              </details>
            ) : null}
          </div>
        </div>
      )
    }

    const renderActionMessage = (message: ActionExecutionMessage, isCurrentMessage: boolean) => {
      const status = getActionStatus(message)
      const result = functionResults.value.get(message.id)
      const renderer = chatComponentsCache.value?.[message.name]

      if (typeof renderer === 'string') {
        return (
          <div class="copilotKitMessage copilotKitAssistantMessage copilotKitToolMessage">
            {isCurrentMessage && props.inProgress ? <SpinnerIcon /> : null}
            <span class="inProgressLabel">{renderer}</span>
          </div>
        )
      }

      if (typeof renderer === 'function') {
        const dynamicRenderer = renderer as (payload: {
          status: RenderFunctionStatus
          args: Record<string, unknown>
          result: unknown
        }) => unknown

        const content = dynamicRenderer({
          status,
          args: message.arguments,
          result
        })

        if (typeof content === 'string') {
          return (
            <div class="copilotKitMessage copilotKitAssistantMessage copilotKitToolMessage">
              {isCurrentMessage && props.inProgress ? <SpinnerIcon /> : null}
              <span class="inProgressLabel">{content}</span>
            </div>
          )
        }

        return <div class="copilotKitCustomAssistantMessage">{content}</div>
      }

      if (defaultToolRender.value) {
        const content = defaultToolRender.value({
          name: message.name,
          status,
          parameters: message.arguments,
          result
        })

        if (content) {
          return <div class="copilotKitCustomAssistantMessage">{content}</div>
        }
      }

      return renderDefaultToolMessage(message, status)
    }

    return () => (
      <div class="copilotKitMessages" style={messagesStyle.value}>
        {messages.value.map((message, index) => {
          const isCurrentMessage = index === lastRenderableMessageIndex.value

          if (message instanceof TextMessage && message.role === 'user') {
            return (
              <div key={message.id || index} class="copilotKitMessage copilotKitUserMessage">
                {message.content}
              </div>
            )
          }

          if (message instanceof TextMessage && message.role === 'assistant') {
            const hasText = Boolean(message.content?.trim())
            const isToolPlaceholder = isAssistantToolPlaceholder(message, index)

            if (isToolPlaceholder || (!hasText && !isCurrentMessage)) {
              return null
            }

            return (
              <div key={message.id || index} class="copilotKitMessage copilotKitAssistantMessage">
                {isCurrentMessage && props.inProgress && !hasText ? (
                  <SpinnerIcon />
                ) : (
                  <Markdown content={message.content} reasoningOpen={isCurrentMessage && props.inProgress} />
                )}
              </div>
            )
          }

          if (message instanceof ActionExecutionMessage) {
            return <div key={message.id || index}>{renderActionMessage(message, isCurrentMessage)}</div>
          }

          return null
        })}
        {shouldShowThinkingHint.value ? (
          <div class="copilotKitMessage copilotKitAssistantMessage copilotKitPendingMessage">
            <SpinnerIcon />
            <span class="inProgressLabel">Thinking and preparing tool calls...</span>
          </div>
        ) : null}
        <footer ref={messagesEndRef}>{slots.default?.()}</footer>
      </div>
    )
  }
})
