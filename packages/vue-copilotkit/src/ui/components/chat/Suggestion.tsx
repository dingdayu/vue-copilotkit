export const reloadSuggestions = (
  context: any,
  chatSuggestionConfiguration: { [key: string]: any },
  setCurrentSuggestions: (suggestions: { title: string; message: string }[]) => void,
  abortControllerRef: any
) => {
  const signal: AbortSignal | undefined = abortControllerRef?.value?.signal
  if (signal?.aborted) return

  const configs = Object.values(chatSuggestionConfiguration || {}) as Array<{
    instructions?: string
    minSuggestions?: number
    maxSuggestions?: number
    suggestions?: Array<{ title?: string; message?: string }>
  }>

  if (configs.length === 0) {
    setCurrentSuggestions([])
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
      message: `Please summarize the current progress and key status in 3 bullet points.`
    },
    {
      title: 'Next best step',
      message: `Based on ${userTopic}, what is the next best step?`
    },
    {
      title: 'Actionable checklist',
      message: `Create a short actionable checklist for ${userTopic}.`
    },
    {
      title: 'Potential risks',
      message: `List potential risks and mitigations for ${userTopic}.`
    },
    {
      title: 'Alternative approach',
      message: `Propose one alternative approach for ${userTopic} with trade-offs.`
    }
  ]

  const explicitSuggestions = configs
    .flatMap(config => config.suggestions || [])
    .filter(item => {
      const title = (item?.title || '').trim()
      const message = (item?.message || '').trim()
      return title.length > 0 && message.length > 0
    })
    .map(item => ({
      title: (item.title || '').trim(),
      message: (item.message || '').trim()
    }))

  const instructionDriven = configs
    .map(config => (config.instructions || '').trim())
    .filter(Boolean)
    .map((instruction, index) => {
      const oneLine = instruction.replace(/\s+/g, ' ').slice(0, 80)
      return {
        title: `Suggestion ${index + 1}`,
        message: `Follow this instruction: ${oneLine}`
      }
    })

  const dedupe = new Map<string, { title: string; message: string }>()
  const baseSuggestions =
    explicitSuggestions.length > 0 ? [...explicitSuggestions, ...instructionDriven] : [...instructionDriven, ...seeds]

  for (const item of baseSuggestions) {
    if (!dedupe.has(item.message)) {
      dedupe.set(item.message, item)
    }
  }

  const deduped = Array.from(dedupe.values())
  const selected = deduped.slice(0, maxSuggestions)
  const suggestions = selected.length >= minSuggestions ? selected : deduped
  if (!signal?.aborted) {
    setCurrentSuggestions(suggestions)
  }
}
