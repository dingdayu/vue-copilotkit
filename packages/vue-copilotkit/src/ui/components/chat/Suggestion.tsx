import type {
  CopilotSuggestionClickInfo,
  CopilotSuggestionItem,
  CopilotSuggestionsLayout,
  CopilotSuggestionsVariant,
} from '../../../core/types/chat-suggestion-configuration'
import type { CopilotChatSuggestion, CopilotChatSuggestionSection } from '../../types/suggestions'

type SuggestionConfig = {
  instructions?: string
  minSuggestions?: number
  maxSuggestions?: number
  title?: string
  variant?: CopilotSuggestionsVariant
  layout?: CopilotSuggestionsLayout
  scrollable?: boolean
  className?: string
  onItemClick?: (info: CopilotSuggestionClickInfo) => void | Promise<void>
  suggestions?: CopilotSuggestionItem[]
}

function normalizeSuggestionItem(item: CopilotSuggestionItem): CopilotChatSuggestion | null {
  const title = typeof item.title === 'string' ? item.title.trim() : ''
  const label = typeof item.label === 'string' ? item.label.trim() : ''
  const message = typeof item.message === 'string' ? item.message.trim() : ''

  if ((!title && !label) || !message) {
    return null
  }

  return {
    title: title || label,
    label: label || title,
    message,
    description: typeof item.description === 'string' && item.description.trim() ? item.description.trim() : undefined,
    icon: item.icon,
    className: item.className,
  }
}

export const reloadSuggestions = (
  context: any,
  chatSuggestionConfiguration: { [key: string]: any },
  setCurrentSuggestions: (section: CopilotChatSuggestionSection | null) => void,
  abortControllerRef: any
) => {
  const signal: AbortSignal | undefined = abortControllerRef?.value?.signal
  if (signal?.aborted) return

  const configs = Object.values(chatSuggestionConfiguration || {}) as SuggestionConfig[]

  if (configs.length === 0) {
    setCurrentSuggestions(null)
    return
  }

  const latestUserMessage = [...(context?.messages?.value || [])]
    .reverse()
    .find((m: any) => m?.type === 'TextMessage' && m?.role === 'user')

  const userText = (latestUserMessage?.content || '').trim()
  const userTopic = userText ? userText.slice(0, 60) : 'the current task'

  const maxSuggestions = Math.max(...configs.map(c => c.maxSuggestions || 3), 1)
  const minSuggestions = Math.max(...configs.map(c => c.minSuggestions || 1), 1)

  const seeds = [
    {
      title: 'Summarize progress',
      message: `Please summarize the current progress and key status in 3 bullet points.`,
      description: 'Quickly review where the conversation stands.',
    },
    {
      title: 'Next best step',
      message: `Based on ${userTopic}, what is the next best step?`,
      description: 'Ask for the most useful next action to try.',
    },
    {
      title: 'Actionable checklist',
      message: `Create a short actionable checklist for ${userTopic}.`,
      description: 'Turn the current topic into a concrete checklist.',
    },
    {
      title: 'Potential risks',
      message: `List potential risks and mitigations for ${userTopic}.`,
      description: 'Surface likely issues before taking action.',
    },
    {
      title: 'Alternative approach',
      message: `Propose one alternative approach for ${userTopic} with trade-offs.`,
      description: 'Compare a different path and its trade-offs.',
    },
  ]

  const explicitSuggestions = configs
    .flatMap(config => config.suggestions || [])
    .map(item => normalizeSuggestionItem(item))
    .filter((item): item is CopilotChatSuggestion => Boolean(item))

  const instructionDriven = configs
    .map(config => (config.instructions || '').trim())
    .filter(Boolean)
    .map((instruction, index) => {
      const oneLine = instruction.replace(/\s+/g, ' ').slice(0, 80)
      return {
        title: `Suggestion ${index + 1}`,
        label: `Suggestion ${index + 1}`,
        message: `Follow this instruction: ${oneLine}`,
        description: oneLine,
      }
    })

  const dedupe = new Map<string, CopilotChatSuggestion>()
  const baseSuggestions =
    explicitSuggestions.length > 0 ? [...explicitSuggestions, ...instructionDriven] : [...instructionDriven, ...seeds]

  for (const item of baseSuggestions) {
    if (!dedupe.has(item.message)) {
      dedupe.set(item.message, item)
    }
  }

  const deduped = Array.from(dedupe.values())
  const selected = deduped.slice(0, maxSuggestions)
  const suggestions =
    selected.length >= minSuggestions ? selected : deduped.slice(0, Math.max(minSuggestions, maxSuggestions))
  if (!signal?.aborted) {
    const configWithTitle = configs.find(config => (config.title || '').trim())
    const configWithVariant = configs.find(config => config.variant)
    const configWithLayout = configs.find(config => config.layout)
    const configWithScrollable = configs.find(config => typeof config.scrollable === 'boolean')
    const configWithClassName = configs.find(config => (config.className || '').trim())
    const configWithOnClick = configs.find(config => typeof config.onItemClick === 'function')

    setCurrentSuggestions({
      title: configWithTitle?.title,
      variant: configWithVariant?.variant,
      layout: configWithLayout?.layout,
      scrollable: configWithScrollable?.scrollable,
      className: configWithClassName?.className,
      onItemClick: configWithOnClick?.onItemClick,
      items: suggestions,
    })
  }
}
