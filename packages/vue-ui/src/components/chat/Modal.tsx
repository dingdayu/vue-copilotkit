import { ChatContextProvider } from "./ChatContext";
import { Window as DefaultWindow } from "./Window";
import { Button as DefaultButton } from "./Button";
import { Header as DefaultHeader } from "./Header";
import { Messages as DefaultMessages } from "./Messages";
import { Input as DefaultInput } from "./Input";
import { ResponseButton as DefaultResponseButton } from "./Response";
import { CopilotChat } from "./Chat";
import { defineComponent, PropType, ref, h } from "vue";
import { SystemMessageFunction } from "@dingdayu/vue-copilotkit-core";

export interface CopilotModalProps extends Record<string, any> {
  /**
   * Whether the chat window should be open by default.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * If the chat window should close when the user clicks outside of it.
   * @default true
   */
  clickOutsideToClose?: boolean;

  /**
   * If the chat window should close when the user hits the Escape key.
   * @default true
   */
  hitEscapeToClose?: boolean;

  /**
   * The shortcut key to open the chat window.
   * Uses Command-[shortcut] on a Mac and Ctrl-[shortcut] on Windows.
   * @default '/'
   */
  shortcut?: string;

  /**
   * A callback that gets called when the chat window opens or closes.
   */
  onSetOpen?: (open: boolean) => void;
}

export const CopilotModal = defineComponent({
  props: {
    instructions: {
      type: String,
      default: ''
    },
    defaultOpen: {
      type: Boolean,
      default: false
    },
    clickOutsideToClose: {
      type: Boolean,
      default: true
    },
    hitEscapeToClose: {
      type: Boolean,
      default: true
    },
    onSetOpen: {
      type: Function as PropType<(open: boolean) => void>,  
    },
    onSubmitMessage: {
      type: Function as PropType<(messageContent: string) => void>,
    },
    shortcut: {
      type: String,
      default: '/'
    },
    icons: {
      type: Object
    },
    labels: {
      type: Object
    },
    makeSystemMessage: {
      type: Function as PropType<SystemMessageFunction>,
    },
    showResponseButton: {
      type: Boolean,
      default: true
    },
    onInProgress: {
      type: Function as PropType<(isLoading: boolean) => void>,
    },
    className: {
      type: String
    }
  },
  setup(props, { slots }) {
    const { 
      instructions,
      defaultOpen,
      clickOutsideToClose,
      hitEscapeToClose,
      onSetOpen,
      onSubmitMessage,
      shortcut = "/",
      icons,
      labels,
      makeSystemMessage,
      showResponseButton,
      onInProgress,
      className,
    } = props;
    
    const openState = ref(defaultOpen);
    
    const setOpenState = (open: boolean) => {
      openState.value = open;
      onSetOpen?.(open);
    };

    return () => (
      <ChatContextProvider labels={labels} open={openState.value} setOpen={setOpenState}>
        <div class={className}>
          {slots.children?.() || null}
          {slots.button?.() || h(DefaultButton, { open: openState, setOpen: setOpenState })}
          
          {/* Use conditional rendering with proper component usage */}
          {slots.window ? (
            slots.window({
              open: openState.value,
              setOpen: setOpenState,
              clickOutsideToClose,
              shortcut,
              hitEscapeToClose
            })
          ) : (
            h(DefaultWindow, {
              open: openState.value,
              setOpen: setOpenState,
              clickOutsideToClose: clickOutsideToClose,
              shortcut: shortcut,
              hitEscapeToClose: hitEscapeToClose
            }, {
              default: () => [
                slots.header ? 
                  slots.header({ setOpen: setOpenState }) : 
                  h(DefaultHeader, { setOpen: setOpenState }),
                
                h(CopilotChat, {
                  instructions: instructions,
                  onSubmitMessage: onSubmitMessage,
                  makeSystemMessage: makeSystemMessage,
                  showResponseButton: showResponseButton,
                  onInProgress: onInProgress
                }, {
                  messages: (props: any) => {
                    return slots.messages ? 
                      slots.messages({
                        ...props,
                        children: {
                          default: () => props.children?.default?.() || null
                        }
                      }) : 
                      h(DefaultMessages, props, {
                        default: () => props.children?.default?.() || null
                      });
                  },
                  input: (props: any) => slots.input ? 
                    slots.input(props) : 
                    h(DefaultInput, props),
                  responseButton: (props: any) => slots.responseButton ? 
                    slots.responseButton(props) : 
                    h(DefaultResponseButton, props)
                })
              ]
            })
          )}
        </div>
      </ChatContextProvider>
    );
  }
});