import { computed, defineComponent, PropType, unref } from 'vue'
import { useCopilotContext } from '../../context/copilot-context'

function toDebugValue(value: unknown, depth: number, seen: WeakSet<object>): unknown {
  const maxDepth = 6
  if (depth > maxDepth) return '[MaxDepth]'

  const unwrapped = unref(value as any)
  if (unwrapped === null) return null
  const t = typeof unwrapped
  if (t === 'string' || t === 'number' || t === 'boolean') return unwrapped
  if (t === 'undefined') return undefined
  if (t === 'bigint') return `${String(unwrapped)}n`
  if (t === 'symbol') return String(unwrapped)
  if (t === 'function') return `[Function ${(unwrapped as Function).name || 'anonymous'}]`

  if (unwrapped instanceof Date) return unwrapped.toISOString()
  if (unwrapped instanceof RegExp) return String(unwrapped)
  if (unwrapped instanceof Error) {
    return {
      name: unwrapped.name,
      message: unwrapped.message,
      stack: unwrapped.stack
    }
  }

  if (unwrapped instanceof Map) {
    return {
      '[Map]': Array.from(unwrapped.entries()).map(([k, v]) => [
        toDebugValue(k, depth + 1, seen),
        toDebugValue(v, depth + 1, seen)
      ])
    }
  }

  if (unwrapped instanceof Set) {
    return { '[Set]': Array.from(unwrapped.values()).map(v => toDebugValue(v, depth + 1, seen)) }
  }

  if (Array.isArray(unwrapped)) {
    return unwrapped.map(v => toDebugValue(v, depth + 1, seen))
  }

  if (t === 'object') {
    const obj = unwrapped as Record<string, unknown>
    if (seen.has(obj as any)) return '[Circular]'
    seen.add(obj as any)

    const out: Record<string, unknown> = {}
    for (const key of Object.keys(obj)) {
      // Skip common Vue internal fields to reduce noise and avoid reactive internals.
      if (key.startsWith('__v_')) continue
      if (key === 'effect' || key === 'deps' || key === 'sub' || key === 'dep') continue
      try {
        out[key] = toDebugValue(obj[key], depth + 1, seen)
      } catch (e) {
        out[key] = `[Unserializable: ${(e as Error)?.message || 'unknown'}]`
      }
    }
    return out
  }

  return String(unwrapped)
}

function safeStringify(value: unknown): string {
  try {
    const normalized = toDebugValue(value, 0, new WeakSet())
    return JSON.stringify(normalized, null, 2)
  } catch (e) {
    return `"[Failed to serialize: ${(e as Error)?.message || 'unknown'}]"`
  }
}

export const DeveloperConsoleModal = defineComponent({
  name: 'DeveloperConsoleModal',
  props: {
    onClose: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup(props) {
    const context = useCopilotContext()
    const contextText = computed(() => safeStringify(context))

    return () => (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          backgroundColor: 'white',
          zIndex: 10000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>CopilotKit Dev Console</h2>
          <button onClick={props.onClose}>Close</button>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <h3>Context</h3>
          <pre>{contextText.value}</pre>
          {/* Add more debug info here */}
        </div>
      </div>
    )
  }
})
