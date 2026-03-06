import { DocumentPointer, useCopilotContext } from '@dingdayu/vue-copilotkit-core'
import { COPILOT_CLOUD_PUBLIC_API_KEY_HEADER } from '@copilotkit/shared'
import { Message, Role, TextMessage } from '@copilotkit/runtime-client-gql'
import { retry } from '../../lib/retry'
import { runAgentTextStream } from '../../lib/run-agent'
import {
  EditingEditorState,
  Generator_InsertionOrEditingSuggestion
} from '../../types/base/autosuggestions-bare-function'
import { InsertionsApiConfig } from '../../types/autosuggestions-config/insertions-api-config'
import { EditingApiConfig } from '../../types/autosuggestions-config/editing-api-config'

export function useMakeStandardInsertionOrEditingFunction(
  textareaPurpose: string,
  contextCategories: string[],
  insertionApiConfig: InsertionsApiConfig,
  editingApiConfig: EditingApiConfig
): Generator_InsertionOrEditingSuggestion {
  const { getContextString, copilotApiConfig } = useCopilotContext()

  const headers = {
    ...(copilotApiConfig.publicApiKey ? { [COPILOT_CLOUD_PUBLIC_API_KEY_HEADER]: copilotApiConfig.publicApiKey } : {})
  }

  async function insertionFunction(
    editorState: EditingEditorState,
    insertionPrompt: string,
    documents: DocumentPointer[],
    abortSignal: AbortSignal
  ) {
    const res = await retry(async () => {
      const messages: Message[] = [
        new TextMessage({
          role: Role.System,
          content: insertionApiConfig.makeSystemPrompt(textareaPurpose, getContextString(documents, contextCategories))
        }),
        ...insertionApiConfig.fewShotMessages,
        new TextMessage({
          role: Role.User,
          content: `<TextAfterCursor>${editorState.textAfterCursor}</TextAfterCursor>`
        }),
        new TextMessage({
          role: Role.User,
          content: `<TextBeforeCursor>${editorState.textBeforeCursor}</TextBeforeCursor>`
        }),
        new TextMessage({
          role: Role.User,
          content: `<InsertionPrompt>${insertionPrompt}</InsertionPrompt>`
        })
      ]

      return runAgentTextStream({
        url: copilotApiConfig.chatApiEndpoint,
        headers: {
          ...(copilotApiConfig.headers || {}),
          ...headers
        },
        credentials: copilotApiConfig.credentials,
        signal: abortSignal,
        messages,
        forwardedProps: copilotApiConfig.properties || {}
      })
    })

    return res
  }

  async function editingFunction(
    editorState: EditingEditorState,
    editingPrompt: string,
    documents: DocumentPointer[],
    abortSignal: AbortSignal
  ) {
    const res = await retry(async () => {
      const messages: Message[] = [
        new TextMessage({
          role: Role.System,
          content: editingApiConfig.makeSystemPrompt(textareaPurpose, getContextString(documents, contextCategories))
        }),
        ...editingApiConfig.fewShotMessages,
        new TextMessage({
          role: Role.User,
          content: `<TextBeforeCursor>${editorState.textBeforeCursor}</TextBeforeCursor>`
        }),
        new TextMessage({
          role: Role.User,
          content: `<TextToEdit>${editorState.selectedText}</TextToEdit>`
        }),
        new TextMessage({
          role: Role.User,
          content: `<TextAfterCursor>${editorState.textAfterCursor}</TextAfterCursor>`
        }),
        new TextMessage({
          role: Role.User,
          content: `<EditingPrompt>${editingPrompt}</EditingPrompt>`
        })
      ]

      return runAgentTextStream({
        url: copilotApiConfig.chatApiEndpoint,
        headers: {
          ...(copilotApiConfig.headers || {}),
          ...headers
        },
        credentials: copilotApiConfig.credentials,
        signal: abortSignal,
        messages,
        forwardedProps: copilotApiConfig.properties || {}
      })
    })

    return res
  }

  async function insertionOrEditingFunction(
    editorState: EditingEditorState,
    insertionPrompt: string,
    documents: DocumentPointer[],
    abortSignal: AbortSignal
  ) {
    if (editorState.selectedText === '') {
      return await insertionFunction(editorState, insertionPrompt, documents, abortSignal)
    } else {
      return await editingFunction(editorState, insertionPrompt, documents, abortSignal)
    }
  }

  return insertionOrEditingFunction
}
