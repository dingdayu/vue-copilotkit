import { ref, onUnmounted } from 'vue'
import { Parameter, randomId } from '@copilotkit/shared'

import { useCopilotContext } from '../context'
import { FrontendAction } from '../types/frontend-action'

export function useCopilotAction<const T extends Parameter[] | [] = []>(action: FrontendAction<T>) {
  const { setAction, removeAction, chatComponentsCache } = useCopilotContext()
  const idRef = ref<string>(randomId())

  const registerAction = () => {
    setAction(idRef.value, action as any)
    if (typeof action.render === 'function' && chatComponentsCache.value !== null) {
      chatComponentsCache.value[action.name] = action.render
    }
  }

  registerAction()

  onUnmounted(() => {
    removeAction(idRef.value)
  })
}
