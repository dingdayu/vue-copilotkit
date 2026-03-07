import { useCopilotContext } from '../../../../core'
import { COPILOT_CLOUD_PUBLIC_API_KEY_HEADER } from '@copilotkit/shared'
import { retry } from '../../lib/retry'
import { AutosuggestionsBareFunction } from '../../types'
import { InsertionEditorState } from '../../types/base/autosuggestions-bare-function'
import { SuggestionsApiConfig } from '../../types/autosuggestions-config/suggestions-api-config'
import { Message, Role, TextMessage } from '@copilotkit/runtime-client-gql'
import { runAgentText } from '../../lib/run-agent'

export function useMakeStandardAutosuggestionFunction(
  textareaPurpose: string,
  contextCategories: string[],
  apiConfig: SuggestionsApiConfig
): AutosuggestionsBareFunction {
  const { getContextString, copilotApiConfig } = useCopilotContext()
  const { chatApiEndpoint: url, publicApiKey, credentials, properties } = copilotApiConfig
  const headers = {
    ...copilotApiConfig.headers,
    ...(publicApiKey ? { [COPILOT_CLOUD_PUBLIC_API_KEY_HEADER]: publicApiKey } : {})
  }
  const { maxTokens, stop } = apiConfig

  async function makeAutosuggestion(editorState: InsertionEditorState, abortSignal: AbortSignal) {
    const res = await retry(async () => {
      const messages: Message[] = [
        new TextMessage({
          role: Role.System,
          content: apiConfig.makeSystemPrompt(textareaPurpose, getContextString([], contextCategories))
        }),
        ...apiConfig.fewShotMessages,
        new TextMessage({
          role: Role.User,
          content: editorState.textAfterCursor
        }),
        new TextMessage({
          role: Role.User,
          content: `<TextAfterCursor>${editorState.textAfterCursor}</TextAfterCursor>`
        }),
        new TextMessage({
          role: Role.User,
          content: `<TextBeforeCursor>${editorState.textBeforeCursor}</TextBeforeCursor>`
        })
      ]

      return runAgentText({
        url,
        headers,
        credentials,
        signal: abortSignal,
        messages,
        forwardedProps: {
          ...(properties || {}),
          ...(maxTokens ? { maxOutputTokens: maxTokens } : {}),
          ...(stop?.length ? { stopSequences: stop } : {})
        }
      })
    })

    return res
  }

  return makeAutosuggestion
}
