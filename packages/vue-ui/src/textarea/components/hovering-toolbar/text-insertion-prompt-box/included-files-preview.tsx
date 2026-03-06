import { defineComponent, PropType } from 'vue'
import { DocumentPointer } from '@dingdayu/vue-copilotkit-core'

export interface IncludedFilesPreviewProps {
  includedFiles: DocumentPointer[]
  setIncludedFiles: (value: DocumentPointer[]) => void
}

export const IncludedFilesPreview = defineComponent({
  props: {
    includedFiles: {
      type: Array as PropType<DocumentPointer[]>,
      required: true
    },
    setIncludedFiles: {
      type: Function as PropType<(value: DocumentPointer[]) => void>,
      required: true
    }
  },
  setup(props: IncludedFilesPreviewProps) {
    const handleDelete = (filePointer: DocumentPointer) => {
      props.setIncludedFiles(props.includedFiles.filter(fp => fp !== filePointer))
    }

    return () => (
      <div class="flex flex-col gap-2 mt-2">
        <Label class="font-medium">Included context:</Label>
        <div class="flex flex-wrap gap-2">
          {props.includedFiles.map(filePointer => (
            <FileChipPreview
              key={`file-${filePointer.sourceApplication}.${filePointer.name}`}
              filePointer={filePointer}
              onDelete={() => handleDelete(filePointer)}
            />
          ))}
        </div>
      </div>
    )
  }
})

export interface FileChipPreviewProps {
  filePointer: DocumentPointer
  onDelete: () => void
}

export const FileChipPreview = defineComponent({
  props: {
    filePointer: {
      type: Object as PropType<DocumentPointer>,
      required: true
    },
    onDelete: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup(props: FileChipPreviewProps) {
    return () => (
      <span class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-sm">
        <div class="flex items-center gap-1">
          <img
            src={props.filePointer.iconImageUri}
            alt={props.filePointer.sourceApplication}
            class="mr-1 h-4 w-4 rounded-full bg-transparent"
          />
          {props.filePointer.name}
        </div>
        <button class="text-slate-500 hover:text-slate-800" onClick={props.onDelete}>
          ×
        </button>
      </span>
    )
  }
})

const Label = defineComponent({
  setup(_, { slots }) {
    return () => <label>{slots.default ? slots.default() : null}</label>
  }
})
