import { defineComponent, PropType } from 'vue'
import { Message } from '@copilotkit/runtime-client-gql'

import { Messages } from './Messages'

export const CopilotChatView = defineComponent({
  name: 'CopilotChatView',
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
      default: '100%'
    }
  },
  setup(props, { slots }) {
    const normalizeHeight = () => {
      if (typeof props.maxHeight === 'number') {
        return `${props.maxHeight}px`
      }
      return props.maxHeight
    }

    return () => (
      <div
        class="copilotKitChatView"
        style={{
          maxHeight: normalizeHeight(),
          minHeight: 0,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Messages messages={props.messages} inProgress={props.inProgress} maxHeight="100%">
          {slots.default?.()}
        </Messages>
      </div>
    )
  }
})
