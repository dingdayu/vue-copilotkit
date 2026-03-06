import MarkdownRender from 'markstream-vue'

type MarkdownProps = {
  content: string
  reasoningOpen?: boolean
}
export const Markdown = ({ content, reasoningOpen = false }: MarkdownProps) => {
  const { displayContent, reasoningBlocks } = splitReasoning(content)

  return (
    <div class="copilotKitMarkdown">
      {reasoningBlocks.map((block, index) => (
        <details
          class="copilotKitReasoningBlock"
          open={reasoningOpen || undefined}
          key={`${index}-${block.slice(0, 16)}-${reasoningOpen ? 'live' : 'done'}`}
        >
          <summary>Model reasoning</summary>
          <pre>{block}</pre>
        </details>
      ))}
      <MarkdownRender custom-id="copilotkit-chat" content={displayContent} />
    </div>
  )
}

function splitReasoning(content: string) {
  const reasoningBlocks: string[] = []
  const displayContent = (content || '')
    .replace(/<think>([\s\S]*?)<\/think>/gi, (_match, block: string) => {
      const normalized = block.trim()
      if (normalized) {
        reasoningBlocks.push(normalized)
      }
      return ''
    })
    .trim()

  return {
    displayContent: displayContent || (reasoningBlocks.length > 0 ? '_Model is thinking..._' : ''),
    reasoningBlocks
  }
}
