import { defineComponent } from 'vue'
import { RegenerateIcon, StopIcon } from './Icon'
import { useChatContext } from './ChatContext'

export const ResponseButton = defineComponent((_p, { attrs }) => {
  const { labels } = useChatContext()

  return () => (
    <button class="copilotKitResponseButton" onClick={attrs.hClick as () => void}>
      <span>{attrs.inProgress ? <StopIcon /> : <RegenerateIcon />}</span>
      {attrs.inProgress ? labels?.stopGenerating : labels?.regenerateResponse}
    </button>
  )
})
