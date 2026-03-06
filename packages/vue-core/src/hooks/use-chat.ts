import { ref, type Ref } from 'vue'

import {
  FunctionCallHandler,
  COPILOT_CLOUD_PUBLIC_API_KEY_HEADER,
  Action,
  actionParametersToJsonSchema
} from '@copilotkit/shared'

import {
  Message,
  TextMessage,
  ActionExecutionMessage,
  ResultMessage,
  CopilotRuntimeClient,
  convertMessagesToGqlInput,
  convertGqlOutputToMessages,
  MessageStatusCode,
  MessageRole,
  Role,
  CopilotRequestType
} from '@copilotkit/runtime-client-gql'

import { CopilotApiConfig } from '../context'

export type UseChatOptions = {
  initialMessages?: Message[]
  onFunctionCall?: FunctionCallHandler
  actions: Action[]
  copilotConfig: CopilotApiConfig
  messages: Ref<Message[]>
  setMessages: any
  makeSystemMessageCallback: () => TextMessage
  isLoading: Ref<boolean>
  setIsLoading: any
}

function buildCopilotRequest(
  actions: Action[],
  copilotConfig: CopilotApiConfig,
  threadId: string | null,
  runId: string | null,
  messagesWithContext: Message[]
) {
  return {
    frontend: {
      actions: actions?.map(action => ({
        name: action.name,
        description: action.description || '',
        jsonSchema: JSON.stringify(actionParametersToJsonSchema(action.parameters || []))
      }))
    },
    threadId,
    runId,
    messages: convertMessagesToGqlInput(messagesWithContext),
    ...(copilotConfig.cloud
      ? {
          cloud: {
            ...(copilotConfig.cloud.guardrails?.input?.restrictToTopic?.enabled
              ? {
                  guardrails: {
                    inputValidationRules: {
                      allowList: copilotConfig.cloud.guardrails.input.restrictToTopic.validTopics,
                      denyList: copilotConfig.cloud.guardrails.input.restrictToTopic.invalidTopics
                    }
                  }
                }
              : {})
          }
        }
      : {}),
    metadata: { requestType: CopilotRequestType.Chat }
  }
}

async function handleActionExecution(
  message: ActionExecutionMessage,
  results: { [id: string]: string },
  previousMessages: Message[],
  onFunctionCall: FunctionCallHandler,
  guardrailsEnabled: boolean,
  responseStatus: any
): Promise<Message[]> {
  const newMessages: Message[] = []
  const messageScope = 'scope' in message ? (message as { scope?: string | null }).scope : null
  if (
    message.status.code !== MessageStatusCode.Pending &&
    (messageScope === 'client' || messageScope === null) &&
    onFunctionCall
  ) {
    if (!(message.id in results)) {
      if (guardrailsEnabled && responseStatus === undefined) return newMessages
      const result = await onFunctionCall({
        messages: previousMessages,
        name: message.name,
        args: message.arguments
      })
      results[message.id] = result
    }
    newMessages.push(
      new ResultMessage({
        result: ResultMessage.encodeResult(results[message.id]),
        actionExecutionId: message.id,
        actionName: message.name
      })
    )
  }
  return newMessages
}

export function useChat(options: UseChatOptions) {
  const {
    messages,
    setMessages,
    makeSystemMessageCallback,
    copilotConfig,
    setIsLoading,
    initialMessages,
    isLoading,
    actions,
    onFunctionCall
  } = options

  const abortControllerRef = ref<AbortController>()
  const threadIdRef = ref<string | null>(null)
  const runIdRef = ref<string | null>(null)
  const publicApiKey = copilotConfig.publicApiKey
  const headers = {
    ...(copilotConfig.headers || {}),
    ...(publicApiKey ? { [COPILOT_CLOUD_PUBLIC_API_KEY_HEADER]: publicApiKey } : {})
  }

  const runtimeClientRef = ref<CopilotRuntimeClient | null>(null)
  const getRuntimeClient = () => {
    if (!runtimeClientRef.value) {
      runtimeClientRef.value = new CopilotRuntimeClient({
        url: copilotConfig.chatApiEndpoint,
        publicApiKey: copilotConfig.publicApiKey,
        headers,
        credentials: copilotConfig.credentials
      })
    }
    return runtimeClientRef.value
  }
  const runChatCompletionOnce = async (previousMessages: Message[]) => {
    let newMessages: Message[] = [new TextMessage({ content: '', role: Role.Assistant })]
    const abortController = new AbortController()
    abortControllerRef.value = abortController
    setMessages([...previousMessages, ...newMessages])

    const systemMessage = makeSystemMessageCallback()
    const messagesWithContext = [systemMessage, ...(initialMessages || []), ...previousMessages]

    const requestData = buildCopilotRequest(
      actions,
      copilotConfig,
      threadIdRef.value,
      runIdRef.value,
      messagesWithContext
    )

    const runtimeClient = getRuntimeClient()
    const stream = runtimeClient.asStream(
      runtimeClient.generateCopilotResponse({
        data: requestData,
        properties: copilotConfig.properties,
        signal: abortControllerRef.value?.signal
      })
    )

    const guardrailsEnabled = copilotConfig.cloud?.guardrails?.input?.restrictToTopic.enabled || false
    const reader = stream.getReader()
    let results: { [id: string]: string } = {}

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value?.generateCopilotResponse) continue

      threadIdRef.value = value.generateCopilotResponse.threadId || null
      runIdRef.value = value.generateCopilotResponse.runId || null

      const messages = convertGqlOutputToMessages(value.generateCopilotResponse.messages)
      if (messages.length === 0) continue

      newMessages = []

      if (
        value.generateCopilotResponse.status?.__typename === 'FailedResponseStatus' &&
        value.generateCopilotResponse.status.reason === 'GUARDRAILS_VALIDATION_FAILED'
      ) {
        newMessages = [
          new TextMessage({
            role: MessageRole.Assistant,
            content: value.generateCopilotResponse.status.details?.guardrailsReason || ''
          })
        ]
      } else {
        for (const message of messages) {
          newMessages.push(message)
          if (message instanceof ActionExecutionMessage && onFunctionCall) {
            const actionResults = await handleActionExecution(
              message,
              results,
              previousMessages,
              onFunctionCall,
              guardrailsEnabled,
              value.generateCopilotResponse.status
            )
            newMessages.push(...actionResults)
          }
        }
      }

      if (newMessages.length > 0) {
        setMessages([...previousMessages, ...newMessages])
      }
    }

    const needsFollowup =
      Object.values(results).length ||
      (newMessages.length && newMessages[newMessages.length - 1] instanceof ResultMessage)

    return { newMessages: newMessages.slice(), needsFollowup }
  }

  const runChatCompletion = async (previousMessages: Message[]) => {
    setIsLoading(true)
    try {
      let currentMessages = previousMessages
      while (true) {
        const { newMessages, needsFollowup } = await runChatCompletionOnce(currentMessages)
        if (!needsFollowup) return newMessages
        await new Promise(resolve => setTimeout(resolve, 10))
        currentMessages = [...currentMessages, ...newMessages]
      }
    } finally {
      setIsLoading(false)
    }
  }

  const runChatCompletionAndHandleFunctionCall = async (messages: Message[]) => {
    await runChatCompletion(messages)
  }

  const append = (message: Message) => {
    if (isLoading.value) return
    const newMessages = [...messages.value, message]
    setMessages(newMessages)
    return runChatCompletionAndHandleFunctionCall(newMessages)
  }

  const reload = () => {
    if (isLoading.value || messages.value.length === 0) return
    let newMessages = [...messages.value]
    const lastMessage = messages[messages.value.length - 1]
    if (lastMessage instanceof TextMessage && lastMessage.role === 'assistant') {
      newMessages = newMessages.slice(0, -1)
    }
    setMessages(newMessages)
    return runChatCompletionAndHandleFunctionCall(newMessages)
  }

  const stop = () => {
    abortControllerRef.value?.abort()
  }

  return { append, reload, stop }
}
