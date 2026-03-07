import { defineComponent, PropType } from 'vue'
import { Message } from '@copilotkit/runtime-client-gql'

import { Input } from './Input'

export const CopilotChatInput = defineComponent({
  name: 'CopilotChatInput',
  props: {
    inProgress: {
      type: Boolean,
      required: true
    },
    send: {
      type: Function as PropType<(text: string) => Promise<Message>>,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    return () => <Input inProgress={props.inProgress} send={props.send} isVisible={props.isVisible} />
  }
})
