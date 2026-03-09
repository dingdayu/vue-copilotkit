import { defineComponent, PropType } from 'vue'

import { TextMessage } from '@copilotkit/runtime-client-gql'

export const CopilotChatUserMessage = defineComponent({
  name: 'CopilotChatUserMessage',
  props: {
    message: {
      type: Object as PropType<TextMessage>,
      required: true,
    },
    branchIndex: {
      type: Number,
      default: 0,
    },
    numberOfBranches: {
      type: Number,
      default: 1,
    },
    onEditMessage: {
      type: Function as PropType<(payload: { message: TextMessage }) => void>,
      default: undefined,
    },
    onSwitchToBranch: {
      type: Function as PropType<
        (payload: { message: TextMessage; branchIndex: number; numberOfBranches: number }) => void
      >,
      default: undefined,
    },
  },
  setup(props) {
    const switchBranch = (nextIndex: number) => {
      props.onSwitchToBranch?.({
        message: props.message,
        branchIndex: nextIndex,
        numberOfBranches: props.numberOfBranches,
      })
    }

    const editMessage = () => {
      props.onEditMessage?.({ message: props.message })
    }

    return () => (
      <div class="copilotKitMessageShell">
        <div class="copilotKitMessage copilotKitUserMessage">{props.message.content}</div>
        {props.onEditMessage || (props.numberOfBranches > 1 && props.onSwitchToBranch) ? (
          <div class="copilotKitMessageToolbar">
            {props.onEditMessage ? (
              <button class="copilotKitMessageToolbarButton" onClick={editMessage} type="button">
                Edit
              </button>
            ) : null}
            {props.numberOfBranches > 1 && props.onSwitchToBranch ? (
              <div class="copilotKitBranchNav">
                <button
                  class="copilotKitBranchButton"
                  disabled={props.branchIndex <= 0}
                  onClick={() => switchBranch(props.branchIndex - 1)}
                  type="button"
                >
                  Prev
                </button>
                <span class="copilotKitBranchStatus">
                  {props.branchIndex + 1}/{props.numberOfBranches}
                </span>
                <button
                  class="copilotKitBranchButton"
                  disabled={props.branchIndex >= props.numberOfBranches - 1}
                  onClick={() => switchBranch(props.branchIndex + 1)}
                  type="button"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  },
})
