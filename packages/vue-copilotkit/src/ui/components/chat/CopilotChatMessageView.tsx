import { computed, defineComponent, PropType } from 'vue'

import { Message } from '@copilotkit/runtime-client-gql'

import { Messages } from './Messages'

export const CopilotChatMessageView = defineComponent({
  name: 'CopilotChatMessageView',
  props: {
    messages: {
      type: Array as PropType<Message[]>,
      required: true,
    },
    inProgress: {
      type: Boolean,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
    maxHeight: {
      type: [String, Number],
      default: '100%',
    },
  },
  setup(props, { slots }) {
    const empty = computed(() => (props.messages || []).length === 0)

    return () => {
      if (empty.value && slots.emptyScreen) {
        return <div class="copilotKitEmptyState">{slots.emptyScreen()}</div>
      }

      return (
        <div
          class={props.className}
          style={{
            flex: 1,
            minHeight: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Messages messages={props.messages} inProgress={props.inProgress} maxHeight={props.maxHeight}>
            {{
              userMessage: slots.userMessage,
              assistantMessage: slots.assistantMessage,
              actionMessage: slots.actionMessage,
              default: slots.default,
            }}
          </Messages>
        </div>
      )
    }
  },
})
