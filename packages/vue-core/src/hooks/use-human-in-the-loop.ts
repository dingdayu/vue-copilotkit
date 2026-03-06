import { computed } from 'vue'

import { HumanInTheLoopEvent, useCopilotContext } from '../context'

export interface UseHumanInTheLoopOptions {
  onAccept?: (event: HumanInTheLoopEvent) => void | Promise<void>
  onReject?: (event: HumanInTheLoopEvent) => void | Promise<void>
}

export function useHumanInTheLoop(options: UseHumanInTheLoopOptions = {}) {
  const { humanInTheLoopEvent, setHumanInTheLoopEvent } = useCopilotContext()

  const pendingInterrupt = computed(() => humanInTheLoopEvent.value)
  const hasPendingInterrupt = computed(() => pendingInterrupt.value !== null)

  const accept = async () => {
    if (!pendingInterrupt.value) {
      return
    }

    await options.onAccept?.(pendingInterrupt.value)
    setHumanInTheLoopEvent(null)
  }

  const reject = async () => {
    if (!pendingInterrupt.value) {
      return
    }

    await options.onReject?.(pendingInterrupt.value)
    setHumanInTheLoopEvent(null)
  }

  const clear = () => {
    setHumanInTheLoopEvent(null)
  }

  return {
    pendingInterrupt,
    hasPendingInterrupt,
    accept,
    reject,
    clear
  }
}
