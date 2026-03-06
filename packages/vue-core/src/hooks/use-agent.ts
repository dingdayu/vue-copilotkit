import { computed, onUnmounted, ref, type ComputedRef } from 'vue'

import { useCopilotContext } from '../context'
import { CopilotAgentSession } from '../context/copilot-context'

export enum UseAgentUpdate {
  OnMessagesChanged = 'OnMessagesChanged',
  OnStateChanged = 'OnStateChanged',
  OnRunStatusChanged = 'OnRunStatusChanged'
}

export interface UseAgentOptions {
  agentId?: string
  updates?: UseAgentUpdate[]
  nodeName?: string
  threadId?: string
  autoActivate?: boolean
}

export interface VueAgentBridge {
  id: string
  session: ComputedRef<CopilotAgentSession | null>
  isActive: ComputedRef<boolean>
  activate: () => void
  deactivate: () => void
}

export function useAgent({ agentId = 'default', nodeName, threadId, autoActivate = true }: UseAgentOptions = {}) {
  const { agentSession, setAgentSession } = useCopilotContext()
  const isActive = ref(false)

  const nextSession = (): CopilotAgentSession => ({
    agentName: agentId,
    nodeName,
    threadId
  })

  const activate = () => {
    isActive.value = true
    setAgentSession(nextSession())
  }

  const deactivate = () => {
    if (!isActive.value) {
      return
    }

    const session = agentSession.value
    if (session?.agentName === agentId) {
      setAgentSession(null)
    }

    isActive.value = false
  }

  if (autoActivate) {
    activate()
  }

  onUnmounted(() => {
    deactivate()
  })

  const sessionRef = computed(() => agentSession.value)
  const activeRef = computed(() => isActive.value)

  const agent: VueAgentBridge = {
    id: agentId,
    session: sessionRef,
    isActive: activeRef,
    activate,
    deactivate
  }

  return {
    agent
  }
}
