import { runHttpRequest, transformHttpEventStream } from '@ag-ui/client'
import { type BaseEvent, EventType } from '@ag-ui/core'
import { randomId } from '@copilotkit/shared'
import { Message, Role, TextMessage } from '@copilotkit/runtime-client-gql'

type RunAgentRequest = {
  url: string
  headers?: Record<string, string>
  credentials?: RequestCredentials
  signal: AbortSignal
  messages: Message[]
  forwardedProps?: Record<string, unknown>
  agentId?: string
}

function normalizeRole(role: string | undefined) {
  if (role === Role.System) return 'system'
  if (role === Role.User) return 'user'
  return 'assistant'
}

function convertMessageToAgUi(message: Message) {
  if (message instanceof TextMessage) {
    return {
      id: message.id,
      role: normalizeRole(message.role),
      content: message.content || ''
    }
  }

  return null
}

function createEvents(request: RunAgentRequest) {
  const threadId = randomId()
  const runId = randomId()
  const agentId = request.agentId || 'default'

  const requestInit: RequestInit = {
    method: 'POST',
    headers: {
      ...(request.headers || {}),
      'Content-Type': 'application/json',
      Accept: 'text/event-stream'
    },
    body: JSON.stringify({
      method: 'agent/run',
      params: { agentId },
      body: {
        threadId,
        runId,
        state: {},
        messages: request.messages.map(convertMessageToAgUi).filter(Boolean),
        tools: [],
        context: [],
        forwardedProps: request.forwardedProps || {}
      }
    }),
    signal: request.signal,
    ...(request.credentials ? { credentials: request.credentials } : {})
  }

  return transformHttpEventStream(runHttpRequest(request.url, requestInit))
}

function getTextDelta(event: BaseEvent) {
  if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
    return (event as { delta?: string }).delta || ''
  }

  if (event.type === EventType.TEXT_MESSAGE_CHUNK) {
    return (event as { delta?: string }).delta || ''
  }

  return ''
}

function getRunErrorMessage(event: BaseEvent) {
  if (event.type !== EventType.RUN_ERROR) {
    return null
  }

  return (event as { message?: string }).message || 'Runtime returned RunError'
}

export function runAgentText(request: RunAgentRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let result = ''

    const subscription = createEvents(request).subscribe({
      next: event => {
        const delta = getTextDelta(event)
        if (delta) {
          result += delta
          return
        }

        const errorMessage = getRunErrorMessage(event)
        if (errorMessage) {
          reject(new Error(errorMessage))
        }
      },
      error: error => reject(error),
      complete: () => resolve(result)
    })

    request.signal.addEventListener(
      'abort',
      () => {
        subscription.unsubscribe()
        resolve(result)
      },
      { once: true }
    )
  })
}

export function runAgentTextStream(request: RunAgentRequest): ReadableStream<string> {
  return new ReadableStream({
    start(controller) {
      const subscription = createEvents(request).subscribe({
        next: event => {
          const delta = getTextDelta(event)
          if (delta) {
            controller.enqueue(delta)
            return
          }

          const errorMessage = getRunErrorMessage(event)
          if (errorMessage) {
            controller.error(new Error(errorMessage))
          }
        },
        error: error => controller.error(error),
        complete: () => controller.close()
      })

      request.signal.addEventListener(
        'abort',
        () => {
          subscription.unsubscribe()
          controller.close()
        },
        { once: true }
      )
    }
  })
}
