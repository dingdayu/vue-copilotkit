import { defineComponent, ref, PropType } from 'vue'
import { DocumentPointer } from '@dingdayu/vue-copilotkit-core'

export interface SourceSearchBoxProps {
  searchTerm: string
  suggestedFiles: DocumentPointer[]
  onSelectedFile: (filePointer: DocumentPointer) => void
}

export const SourceSearchBox = defineComponent({
  name: 'SourceSearchBox',
  props: {
    searchTerm: {
      type: String,
      required: true
    },
    suggestedFiles: {
      type: Array as PropType<DocumentPointer[]>,
      required: true
    },
    onSelectedFile: {
      type: Function as PropType<(filePointer: DocumentPointer) => void>,
      required: true
    }
  },
  setup(props: SourceSearchBoxProps) {
    const selectedValue = ref<string>('')

    return () => (
      <div class="w-full rounded-lg border border-slate-200 bg-white shadow-sm">
        <input
          value={props.searchTerm}
          class="hidden"
          placeholder="Search for a command..."
          onInput={event => {
            selectedValue.value = (event.target as HTMLInputElement).value
          }}
        />
        {props.suggestedFiles.length === 0 ? (
          <div class="py-6 text-center text-sm">No results found.</div>
        ) : (
          <div class="max-h-56 overflow-y-auto p-1 text-foreground">
            <p class="px-2 py-2 text-xs font-medium">Available resources</p>
            <div class="space-y-1 px-2 pb-4">
              {props.suggestedFiles.map(filePointer => (
                <button
                  key={`word-${filePointer.sourceApplication}.${filePointer.name}`}
                  onClick={() => props.onSelectedFile(filePointer)}
                  class="flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-left text-sm hover:bg-slate-100"
                  style={{ marginLeft: 0 }}
                >
                  <Logo width="20px" height="20px" class="mr-1">
                    <img src={filePointer.iconImageUri} alt={filePointer.sourceApplication} class="h-full w-full" />
                  </Logo>
                  {filePointer.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
})

export const Logo = defineComponent({
  name: 'Logo',
  props: {
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    }
  },
  setup(props, { slots }) {
    return () => (
      <div class="flex items-center justify-center" style={{ width: props.width, height: props.height }}>
        {slots.default ? slots.default() : null}
      </div>
    )
  }
})
