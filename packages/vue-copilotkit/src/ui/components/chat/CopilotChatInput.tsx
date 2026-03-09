import { defineComponent, PropType } from 'vue'
import { Message } from '@copilotkit/runtime-client-gql'

import { Input } from './Input'
import { InputProps } from './props'

export const CopilotChatInput = defineComponent({
  name: 'CopilotChatInput',
  props: {
    inProgress: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String as () => InputProps['mode'],
      default: 'input',
    },
    value: {
      type: String,
      default: undefined,
    },
    onChange: {
      type: Function as PropType<(value: string) => void>,
      default: undefined,
    },
    send: {
      type: Function as PropType<(text: string) => Promise<Message>>,
      required: true,
    },
    onStop: {
      type: Function as PropType<() => void>,
      default: undefined,
    },
    positioning: {
      type: String as () => InputProps['positioning'],
      default: 'static',
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    return () => (
      <Input
        inProgress={props.inProgress}
        mode={props.mode}
        value={props.value}
        onChange={props.onChange}
        send={props.send}
        onStop={props.onStop}
        positioning={props.positioning}
        isVisible={props.isVisible}
      />
    )
  },
})
