import { computed, defineComponent, PropType, ref, watch } from 'vue'

import { MessagesProps } from './props'
import { Markdown } from './Markdown'
import { RenderFunctionStatus, useCopilotContext } from '@dingdayu/vue-copilotkit-core'
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
    children: {
      type: Object
    }
  },
  setup(props, { slots }) {
    const { chatComponentsCache, defaultToolRender } = useCopilotContext()

    const messages = computed(() => props.messages || [])
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
    const scrollToBottom = () => {
      messagesEndRef.value?.scrollIntoView({ behavior: 'auto' })
    }

    watch(() => messages.value.length, scrollToBottom, { flush: 'post' })

    const getActionStatus = (message: ActionExecutionMessage): RenderFunctionStatus => {
      if (functionResults.value.has(message.id)) {
        return 'complete'
      }
      if (message.status.code !== MessageStatusCode.Pending) {
        return 'executing'
      }
      return 'inProgress'
    }

    const renderActionMessage = (message: ActionExecutionMessage, isCurrentMessage: boolean) => {
      const status = getActionStatus(message)
      const result = functionResults.value.get(message.id)
      const renderer = chatComponentsCache.value?.[message.name]

      if (typeof renderer === 'string') {
        if (status === 'complete') {
          return null
        }
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

        if (!content && status === 'complete') {
          return null
        }

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

        if (!content && status === 'complete') {
          return null
        }

        return <div class="copilotKitCustomAssistantMessage">{content}</div>
      }

      if (status === 'complete') {
        return null
      }

      return (
        <div class="copilotKitMessage copilotKitAssistantMessage copilotKitToolMessage">
          {isCurrentMessage && props.inProgress ? <SpinnerIcon /> : null}
          <span class="inProgressLabel">{message.name}</span>
        </div>
      )
    }

    return () => (
      <div class="copilotKitMessages">
        {messages.value.map((message, index) => {
          const isCurrentMessage = index === messages.value.length - 1

          if (message instanceof TextMessage && message.role === 'user') {
            return (
              <div key={message.id || index} class="copilotKitMessage copilotKitUserMessage">
                {message.content}
              </div>
            )
          }

          if (message instanceof TextMessage && message.role === 'assistant') {
            return (
              <div key={message.id || index} class="copilotKitMessage copilotKitAssistantMessage">
                {isCurrentMessage && props.inProgress && !message.content ? (
                  <SpinnerIcon />
                ) : (
                  <Markdown content={message.content} />
                )}
              </div>
            )
          }

          if (message instanceof ActionExecutionMessage) {
            return <div key={message.id || index}>{renderActionMessage(message, isCurrentMessage)}</div>
          }

          return null
        })}
        <footer ref={messagesEndRef}>{slots.default?.()}</footer>
      </div>
    )
  }
})
