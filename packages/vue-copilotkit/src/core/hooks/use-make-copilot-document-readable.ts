import { onBeforeUnmount, ref, watch } from 'vue'
import { useCopilotContext } from '../context/copilot-context'
import { DocumentPointer } from '../types'

/**
 * Makes a document readable by Copilot.
 * @param document The document to make readable.
 * @param categories The categories to associate with the document.
 * @param dependencies The dependencies to use for the effect.
 * @returns The id of the document.
 */
export function useMakeCopilotDocumentReadable(
  document: DocumentPointer,
  categories: string[] = [],
  dependencies: unknown[] = []
): string | undefined {
  const { addDocumentContext, removeDocumentContext } = useCopilotContext()
  const idRef = ref<string | undefined>(undefined)

  const addDocument = () => {
    const id = addDocumentContext(document, categories)
    idRef.value = id
  }

  onBeforeUnmount(() => {
    if (idRef.value) {
      removeDocumentContext(idRef.value)
    }
  })

  watch(
    () => dependencies,
    (_next, _prev, onInvalidate) => {
      if (idRef.value) {
        removeDocumentContext(idRef.value)
      }

      addDocument()

      onInvalidate(() => {
        if (idRef.value) {
          removeDocumentContext(idRef.value)
        }
      })
    },
    {
      immediate: true,
      deep: true
    }
  )

  watch(
    () => [document, categories],
    (_next, _prev, onInvalidate) => {
      if (idRef.value) {
        removeDocumentContext(idRef.value)
      }

      addDocument()

      onInvalidate(() => {
        if (idRef.value) {
          removeDocumentContext(idRef.value)
        }
      })
    },
    {
      deep: true
    }
  )

  return idRef.value
}
