import { defineComponent, PropType } from 'vue'

import { TextMessage } from '@copilotkit/runtime-client-gql'

import { CopyIcon } from './Icon'
import { Markdown } from './Markdown'
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard'

export const CopilotChatAssistantMessage = defineComponent({
  name: 'CopilotChatAssistantMessage',
  props: {
    message: {
      type: Object as PropType<TextMessage>,
      required: true,
    },
    inProgress: {
      type: Boolean,
      default: false,
    },
    reasoningOpen: {
      type: Boolean,
      default: false,
    },
    showCopyButton: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { isCopied, copyToClipboard } = useCopyToClipboard()

    const copyMessage = () => {
      copyToClipboard(props.message.content || '')
    }

    return () => (
      <div class="copilotKitMessageShell">
        <div class="copilotKitMessage copilotKitAssistantMessage">
          <Markdown content={props.message.content} reasoningOpen={props.reasoningOpen || props.inProgress} />
        </div>
        {props.showCopyButton && props.message.content?.trim() ? (
          <div class="copilotKitMessageToolbar">
            <button class="copilotKitMessageToolbarButton" onClick={copyMessage} type="button">
              <CopyIcon />
              <span>{isCopied.value ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ) : null}
      </div>
    )
  },
})
