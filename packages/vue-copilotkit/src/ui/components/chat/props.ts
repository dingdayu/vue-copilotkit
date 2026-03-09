import { Message } from '@copilotkit/runtime-client-gql'
import { Ref } from 'vue'
export interface ButtonProps {
  open: Ref<boolean>
  setOpen: (open: boolean) => void
}

export interface MessagesProps {
  messages: Message[]
  inProgress: boolean
  maxHeight?: string | number
  children?: any
}

export interface HeaderProps {
  setOpen: (open: boolean) => void
}
export interface InputProps {
  inProgress?: boolean
  mode?: 'input' | 'transcribe' | 'processing'
  value?: string
  onChange?: (value: string) => void
  send: (text: string) => Promise<Message>
  onStop?: () => void
  positioning?: 'static' | 'absolute'
  isVisible?: boolean
}

export interface WindowProps {
  open: boolean
  setOpen: (open: boolean) => void
  clickOutsideToClose: boolean
  hitEscapeToClose: boolean
  shortcut: string
}
