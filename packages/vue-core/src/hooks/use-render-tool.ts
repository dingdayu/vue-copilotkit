import { onUnmounted } from 'vue'
import { Parameter, randomId } from '@copilotkit/shared'

import { ActionRenderProps, FrontendAction } from '../types/frontend-action'
import { DefaultToolRenderFunction, InChatRenderFunction, useCopilotContext } from '../context'

export interface RenderToolProps {
  name: string
  parameters: Record<string, unknown>
  status: 'inProgress' | 'executing' | 'complete'
  result: unknown
}

export interface UseRenderToolOptions<T extends Parameter[] | [] = []> {
  name: string
  render: ((props: RenderToolProps) => any) | string
  description?: string
  parameters?: T
  handler?: FrontendAction<T>['handler']
}

export function useRenderTool<T extends Parameter[] | [] = []>(options: UseRenderToolOptions<T>) {
  const { chatComponentsCache, setAction, removeAction } = useCopilotContext()
  const actionId = randomId()
  const renderTool = options.render
  const bridgedRender: InChatRenderFunction | string =
    typeof renderTool === 'string' ? renderTool : props => renderTool(toRenderToolProps(options.name, props))

  chatComponentsCache.value[options.name] = bridgedRender

  if (options.handler || options.parameters || options.description) {
    const action: FrontendAction<T> = {
      name: options.name,
      description: options.description || '',
      parameters: options.parameters || ([] as unknown as T),
      handler: options.handler,
      render: bridgedRender
    }
    setAction(actionId, action)
  }

  onUnmounted(() => {
    removeAction(actionId)
    if (chatComponentsCache.value[options.name] === bridgedRender) {
      delete chatComponentsCache.value[options.name]
    }
  })
}

export function useDefaultRenderTool(render: DefaultToolRenderFunction | null) {
  const { defaultToolRender, setDefaultToolRender } = useCopilotContext()

  setDefaultToolRender(render)

  onUnmounted(() => {
    if (defaultToolRender.value === render) {
      setDefaultToolRender(null)
    }
  })
}

function toRenderToolProps(name: string, props: ActionRenderProps<any>): RenderToolProps {
  const argsContainer = props as unknown as { args?: unknown }
  const parameters =
    typeof argsContainer.args === 'object' && argsContainer.args !== null
      ? (argsContainer.args as Record<string, unknown>)
      : {}

  return {
    name,
    parameters,
    status: props.status,
    result: props.result
  }
}
