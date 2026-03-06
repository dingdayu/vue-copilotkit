import { ref, type Ref } from 'vue'

import {
  FunctionCallHandler,
  COPILOT_CLOUD_PUBLIC_API_KEY_HEADER,
  Action,
  actionParametersToJsonSchema,
  parseJson,
  randomId
} from '@copilotkit/shared'

import { convertToLegacyEvents, runHttpRequest, transformHttpEventStream } from '@ag-ui/client'

import {
  Message,
  TextMessage,
  ActionExecutionMessage,
  ResultMessage,
  MessageStatusCode,
  MessageRole,
  Role,
  AgentStateMessage
} from '@copilotkit/runtime-client-gql'

import { CopilotApiConfig } from '../context'
import { CopilotAgentSession } from '../context/copilot-context'
import { HumanInTheLoopEvent } from '../context'

export type UseChatOptions = {
  initialMessages?: Message[]
  onFunctionCall?: FunctionCallHandler
  getActions: () => Action[]
  copilotConfig: CopilotApiConfig
  body?: Record<string, unknown>
  getAgentSession?: () => CopilotAgentSession | null
  messages: Ref<Message[]>
  setMessages: any
  makeSystemMessageCallback: () => TextMessage
  isLoading: Ref<boolean>
  setIsLoading: any
  setHumanInTheLoopEvent?: (event: HumanInTheLoopEvent | null) => void
}

function buildRunInput(actions: Action[], threadId: string | null, messagesWithContext: Message[]) {
  const normalizedThreadId = threadId || randomId()
  return {
    threadId: normalizedThreadId,
    runId: randomId(),
    state: {},
    messages: messagesWithContext
      .map(convertMessageToAgUi)
      .filter((message): message is Record<string, unknown> => Boolean(message)),
    tools: actions?.map(action => ({
      name: action.name,
      description: action.description || '',
      parameters: actionParametersToJsonSchema(action.parameters || [])
    })),
    context: []
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

function normalizeRole(role?: string) {
  if (role === MessageRole.User || role === MessageRole.System || role === MessageRole.Assistant) {
    return role
  }

  if (role === 'user') return MessageRole.User
  if (role === 'system') return MessageRole.System

  return MessageRole.Assistant
}

function convertMessageToAgUi(message: Message): Record<string, unknown> | null {
  if (message instanceof TextMessage) {
    return {
      id: message.id,
      role: normalizeRole(message.role),
      content: message.content || ''
    }
  }

  if (message instanceof ActionExecutionMessage) {
    return {
      id: message.id,
      role: 'assistant',
      content: '',
      toolCalls: [
        {
          id: message.id,
          type: 'function',
          function: {
            name: message.name,
            arguments: JSON.stringify(message.arguments || {})
          }
        }
      ]
    }
  }

  if (message instanceof ResultMessage) {
    return {
      id: message.id,
      role: 'tool',
      toolCallId: message.actionExecutionId,
      content: message.result || ''
    }
  }

  return null
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
    getActions,
    body,
    getAgentSession,
    onFunctionCall,
    setHumanInTheLoopEvent
  } = options

  const abortControllerRef = ref<AbortController>()
  const threadIdRef = ref<string | null>(null)
  const runIdRef = ref<string | null>(null)
  const publicApiKey = copilotConfig.publicApiKey
  const headers = {
    ...(copilotConfig.headers || {}),
    ...(publicApiKey ? { [COPILOT_CLOUD_PUBLIC_API_KEY_HEADER]: publicApiKey } : {})
  }

  const runChatCompletionOnce = async (previousMessages: Message[]) => {
    let newMessages: Message[] = []
    const abortController = new AbortController()
    abortControllerRef.value = abortController

    const systemMessage = makeSystemMessageCallback()
    const messagesWithContext = [systemMessage, ...(initialMessages || []), ...previousMessages]
    const agentId = getAgentSession?.()?.agentName || 'default'
    const runInput = buildRunInput(getActions(), threadIdRef.value, messagesWithContext)

    threadIdRef.value = runInput.threadId
    runIdRef.value = runInput.runId

    const requestInit: RequestInit = {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream'
      },
      body: JSON.stringify({
        method: 'agent/run',
        params: { agentId },
        body: {
          ...runInput,
          forwardedProps: {
            ...(copilotConfig.properties || {}),
            ...(body || {})
          }
        }
      }),
      signal: abortController.signal,
      ...(copilotConfig.credentials ? { credentials: copilotConfig.credentials } : {})
    }

    const legacyEvents = convertToLegacyEvents(
      runInput.threadId,
      runInput.runId,
      agentId
    )(transformHttpEventStream(runHttpRequest(copilotConfig.chatApiEndpoint, requestInit)))

    let results: { [id: string]: string } = {}
    const messageIndexById = new Map<string, number>()
    const actionExecutionArgsBuffers = new Map<string, string>()

    const upsertMessage = (message: Message) => {
      const index = messageIndexById.get(message.id)
      if (index === undefined) {
        messageIndexById.set(message.id, newMessages.length)
        newMessages.push(message)
      } else {
        newMessages[index] = message
      }
      setMessages([...previousMessages, ...newMessages])
    }

    await new Promise<void>((resolve, reject) => {
      const subscription = legacyEvents.subscribe({
        next: event => {
          const eventType = (event as { type?: string }).type

          if (eventType === 'RunStarted') {
            const runEvent = event as { threadId?: string; runId?: string }
            if (runEvent.threadId) threadIdRef.value = runEvent.threadId
            if (runEvent.runId) runIdRef.value = runEvent.runId
            return
          }

          if (eventType === 'RunError') {
            const errorEvent = event as { message?: string }
            reject(new Error(errorEvent.message || 'Runtime returned RunError'))
            return
          }

          if (eventType === 'MetaEvent') {
            const metaEvent = event as { name?: string; value?: unknown }
            if (
              metaEvent.name === 'LangGraphInterruptEvent' ||
              metaEvent.name === 'CopilotKitLangGraphInterruptEvent'
            ) {
              setHumanInTheLoopEvent?.({
                name: metaEvent.name,
                value: metaEvent.value
              })
            }
            return
          }

          if (eventType === 'TextMessageStart') {
            const textStartEvent = event as { messageId: string; role?: string }
            upsertMessage(
              new TextMessage({
                id: textStartEvent.messageId,
                content: '',
                role: normalizeRole(textStartEvent.role),
                status: { code: MessageStatusCode.Pending }
              })
            )
            return
          }

          if (eventType === 'TextMessageContent') {
            const textContentEvent = event as { messageId: string; content: string }
            const existing =
              newMessages[messageIndexById.get(textContentEvent.messageId) ?? -1] ||
              new TextMessage({
                id: textContentEvent.messageId,
                content: '',
                role: MessageRole.Assistant,
                status: { code: MessageStatusCode.Pending }
              })
            const nextMessage = new TextMessage({
              ...existing,
              id: textContentEvent.messageId,
              role: normalizeRole((existing as TextMessage).role),
              content: `${(existing as TextMessage).content || ''}${textContentEvent.content || ''}`,
              status: { code: MessageStatusCode.Pending }
            })
            upsertMessage(nextMessage)
            return
          }

          if (eventType === 'TextMessageEnd') {
            const textEndEvent = event as { messageId: string }
            const existing = newMessages[messageIndexById.get(textEndEvent.messageId) ?? -1]
            if (existing instanceof TextMessage) {
              upsertMessage(
                new TextMessage({
                  ...existing,
                  status: { code: MessageStatusCode.Success }
                })
              )
            }
            return
          }

          if (eventType === 'ActionExecutionStart') {
            const actionStartEvent = event as {
              actionExecutionId: string
              actionName: string
              parentMessageId?: string
            }
            actionExecutionArgsBuffers.set(actionStartEvent.actionExecutionId, '')
            upsertMessage(
              new ActionExecutionMessage({
                id: actionStartEvent.actionExecutionId,
                name: actionStartEvent.actionName,
                parentMessageId: actionStartEvent.parentMessageId,
                arguments: {},
                status: { code: MessageStatusCode.Pending }
              })
            )
            return
          }

          if (eventType === 'ActionExecutionArgs') {
            const actionArgsEvent = event as { actionExecutionId: string; args: string }
            const buffer = `${actionExecutionArgsBuffers.get(actionArgsEvent.actionExecutionId) || ''}${actionArgsEvent.args || ''}`
            actionExecutionArgsBuffers.set(actionArgsEvent.actionExecutionId, buffer)
            const existing = newMessages[messageIndexById.get(actionArgsEvent.actionExecutionId) ?? -1]
            if (existing instanceof ActionExecutionMessage) {
              upsertMessage(
                new ActionExecutionMessage({
                  ...existing,
                  arguments: parseJson(buffer, {}),
                  status: { code: MessageStatusCode.Pending }
                })
              )
            }
            return
          }

          if (eventType === 'ActionExecutionEnd') {
            const actionEndEvent = event as { actionExecutionId: string }
            const existing = newMessages[messageIndexById.get(actionEndEvent.actionExecutionId) ?? -1]
            if (existing instanceof ActionExecutionMessage) {
              upsertMessage(
                new ActionExecutionMessage({
                  ...existing,
                  arguments: parseJson(actionExecutionArgsBuffers.get(actionEndEvent.actionExecutionId) || '', {}),
                  status: { code: MessageStatusCode.Success }
                })
              )
            }
            return
          }

          if (eventType === 'ActionExecutionResult') {
            const actionResultEvent = event as {
              actionExecutionId: string
              actionName: string
              result: string
            }
            upsertMessage(
              new ResultMessage({
                id: randomId(),
                actionExecutionId: actionResultEvent.actionExecutionId,
                actionName: actionResultEvent.actionName,
                result: actionResultEvent.result,
                status: { code: MessageStatusCode.Success }
              })
            )
            return
          }

          if (eventType === 'AgentStateMessage') {
            const stateEvent = event as {
              threadId: string
              role?: string
              agentName: string
              nodeName?: string
              runId: string
              active: boolean
              running: boolean
              state: string
            }
            upsertMessage(
              new AgentStateMessage({
                id: randomId(),
                threadId: stateEvent.threadId,
                role: normalizeRole(stateEvent.role),
                agentName: stateEvent.agentName,
                nodeName: stateEvent.nodeName,
                runId: stateEvent.runId,
                active: stateEvent.active,
                running: stateEvent.running,
                state: parseJson(stateEvent.state, {})
              })
            )
          }
        },
        error: error => {
          reject(error)
        },
        complete: () => {
          resolve()
        }
      })

      abortController.signal.addEventListener(
        'abort',
        () => {
          subscription.unsubscribe()
          resolve()
        },
        { once: true }
      )
    })

    const streamMessages = [...newMessages]
    newMessages = []
    for (const message of streamMessages) {
      newMessages.push(message)
      if (message instanceof ActionExecutionMessage && onFunctionCall) {
        const actionResults = await handleActionExecution(
          message,
          results,
          previousMessages,
          onFunctionCall,
          false,
          undefined
        )
        newMessages.push(...actionResults)
      }
    }

    if (newMessages.length > 0) {
      setMessages([...previousMessages, ...newMessages])
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
