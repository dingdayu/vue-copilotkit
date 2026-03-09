import { defineComponent, ref, watch } from 'vue'
import { InputProps } from './props'
import { SendIcon, StopIcon, PushToTalkIcon } from './Icon'
import { AutoResizingTextarea } from './Textarea'
import { Message } from '@copilotkit/runtime-client-gql'
import { useChatContext } from './ChatContext'

export const Input = defineComponent({
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
      type: Function,
      default: undefined,
    },
    send: {
      type: Function,
      default: async (_text: string) => ({}) as Message,
    },
    onStop: {
      type: Function,
      default: undefined,
    },
    positioning: {
      type: String as () => InputProps['positioning'],
      default: 'static',
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  setup: _p => {
    const { labels } = useChatContext()
    const textareaRef = ref<any | null>(null)

    const handleDivClick = (event: MouseEvent) => {
      // Check if the clicked element is not the textarea itself
      if (event.target !== event.currentTarget) return
      textareaRef.value?.$el?.focus()
    }
    const text = ref(_p.value ?? '')

    watch(
      () => _p.value,
      value => {
        if (typeof value === 'string' && value !== text.value) {
          text.value = value
        }
      }
    )

    const updateText = (value: string) => {
      text.value = value
      _p.onChange?.(value)
    }

    const hsend = async () => {
      if (_p.inProgress) return
      const content = text.value.trim()
      if (!content) return
      await _p.send(content)
      updateText('')
      textareaRef.value?.$el?.focus()
    }
    watch(
      () => _p.isVisible,
      () => {
        textareaRef.value?.$el?.focus()
      }
    )

    const sendIcon = SendIcon
    const showPushToTalk = false
    const isProcessing = _p.mode === 'processing' || _p.inProgress
    const isTranscribeMode = _p.mode === 'transcribe'
    const sendDisabled = isProcessing || isTranscribeMode

    return () => (
      <div
        class={['copilotKitInput', _p.positioning === 'absolute' ? 'copilotKitInputAbsolute' : '']}
        onClick={handleDivClick}
      >
        <AutoResizingTextarea
          ref={e => (textareaRef.value = e)}
          placeholder={labels?.placeholder || 'Type a message...'}
          autoFocus={true}
          maxRows={5}
          value={text.value}
          disabled={isTranscribeMode}
          onChange={e => updateText(e.target.value)}
          onKeyDown={e => {
            if (e.isComposing) return
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              hsend()
            }
          }}
        />
        <div class="copilotKitInputControls">
          {showPushToTalk && (
            <button onClick={() => {}} class="copilotKitPushToTalkRecording">
              <PushToTalkIcon />
            </button>
          )}
          {_p.inProgress && _p.onStop ? (
            <button onClick={() => _p.onStop?.()} type="button">
              <StopIcon />
            </button>
          ) : (
            <button disabled={sendDisabled} onClick={hsend} type="button">
              <sendIcon />
            </button>
          )}
        </div>
      </div>
    )
  },
})
