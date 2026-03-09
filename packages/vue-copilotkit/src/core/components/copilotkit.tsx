import { computed, defineComponent, onBeforeUnmount, onMounted, provide, ref, renderSlot, watch } from 'vue'
import { COPILOT_CLOUD_CHAT_URL, CopilotCloudConfig, FunctionCallHandler } from '@copilotkit/shared'
import { Message } from '@copilotkit/runtime-client-gql'

import { CopilotChatSuggestionConfiguration, DocumentPointer } from '../types'
import { FrontendAction } from '../types/frontend-action'
import { CopilotKitProps } from './copilotkit-props'

import useTree from '../hooks/use-tree'
import useFlatCategoryStore from '../hooks/use-flat-category-store'
import { ConsoleTrigger } from './dev-console'
import { ToastProvider } from './toast'
import { CopilotErrorBoundary } from './error-boundary'
import { UsageBanner } from './usage-banner'
import { CopilotKitError } from '@copilotkit/shared'
// vue context symbol
import { CopilotKitContext, CopilotContextParams, InChatRenderFunction } from '../context'
import {
  CopilotKitThemeContext,
  isCopilotKitThemeName,
  resolveCopilotKitThemeTokens,
  toCopilotKitCssVariables,
  type CopilotKitAppearance,
  type CopilotKitDarkMode,
  type CopilotKitTheme,
} from '../theme'

/**
 * Interface for the configuration of the Copilot API.
 */
export interface CopilotApiConfig {
  /**
   * The public API key for Copilot Cloud.
   */
  publicApiKey?: string

  /**
   * The configuration for Copilot Cloud.
   */
  cloud?: CopilotCloudConfig

  /**
   * The endpoint for the chat API.
   */
  chatApiEndpoint: string

  /**
   * The endpoint for the Copilot transcribe audio service.
   */
  transcribeAudioUrl?: string

  /**
   * The endpoint for the Copilot text to speech service.
   */
  textToSpeechUrl?: string

  /**
   * additional headers to be sent with the request
   * @default {}
   * @example
   * ```
   * {
   *   'Authorization': 'Bearer your_token_here'
   * }
   * ```
   */
  headers: Record<string, string>

  /**
   * Custom properties to be sent with the request
   * @default {}
   * @example
   * ```
   * {
   *   'user_id': 'user_id'
   * }
   * ```
   */
  properties?: Record<string, any>

  /**
   * Indicates whether the user agent should send or receive cookies from the other domain
   * in the case of cross-origin requests.
   */
  credentials?: RequestCredentials
}

export const CopilotKit = defineComponent({
  props: {
    publicApiKey: String,
    runtimeUrl: String,
    cloudRestrictToTopic: Object,
    headers: Object,
    properties: Object,
    transcribeAudioUrl: String,
    textToSpeechUrl: String,
    credentials: String,
    showDevConsole: [Boolean, String] as any,
    theme: {
      type: [String, Object] as any,
      default: 'default',
    },
    themeOverrides: {
      type: Object,
      default: undefined,
    },
    darkMode: {
      type: [Boolean, String] as any,
      default: 'auto',
    },
  },
  setup(props: CopilotKitProps, { slots }) {
    if (!props.runtimeUrl && !props.publicApiKey) {
      throw new Error('Please provide either a runtimeUrl or a publicApiKey to the CopilotKit component.')
    }

    const chatApiEndpoint = props.runtimeUrl || COPILOT_CLOUD_CHAT_URL

    const { addElement, removeElement, printTree } = useTree()
    const {
      addElement: addDocument,
      removeElement: removeDocument,
      allElements: allDocuments,
    } = useFlatCategoryStore<DocumentPointer>()

    const chatComponentsCache = ref<Record<string, InChatRenderFunction | string>>({})
    const defaultToolRender = ref<CopilotContextParams['defaultToolRender']['value']>(null)

    const actions = ref<Record<string, FrontendAction<any>>>({})
    const agentSession = ref<CopilotContextParams['agentSession']['value']>(null)
    const messages = ref<Message[]>([])
    const isLoading = ref(false)
    const chatInstructions = ref('')
    const chatSuggestionConfiguration = ref<Record<string, CopilotChatSuggestionConfiguration>>({})
    const humanInTheLoopEvent = ref<CopilotContextParams['humanInTheLoopEvent']['value']>(null)
    const theme = ref<CopilotKitTheme>(props.theme || 'default')
    const darkMode = ref<CopilotKitDarkMode>(props.darkMode ?? 'auto')
    const systemPrefersDark = ref(false)

    const setMessages = (value: Message[]) => {
      messages.value = value
    }
    const setIsLoading = (value: boolean) => {
      isLoading.value = value
    }
    const setChatInstructions = (value: string) => {
      chatInstructions.value = value
    }
    const setHumanInTheLoopEvent = (value: CopilotContextParams['humanInTheLoopEvent']['value']) => {
      humanInTheLoopEvent.value = value
    }

    const usageError = ref<CopilotKitError | null>(null)
    const setUsageError = (error: CopilotKitError | null) => {
      usageError.value = error
    }

    const setAction = (id: string, action: FrontendAction<any>) => {
      actions.value = {
        ...actions.value,
        [id]: action,
      }
    }
    const removeAction = (id: string) => {
      delete actions.value[id]
    }

    const setDefaultToolRender = (renderer: CopilotContextParams['defaultToolRender']['value']) => {
      defaultToolRender.value = renderer
    }

    const setAgentSession = (session: CopilotContextParams['agentSession']['value']) => {
      agentSession.value = session
    }

    const setTheme = (nextTheme: CopilotKitTheme) => {
      theme.value = nextTheme
    }

    const setDarkMode = (mode: CopilotKitDarkMode) => {
      darkMode.value = mode
    }

    const resolvedAppearance = computed<CopilotKitAppearance>(() => {
      if (darkMode.value === 'auto') {
        return systemPrefersDark.value ? 'dark' : 'light'
      }

      return darkMode.value ? 'dark' : 'light'
    })

    const activeThemeName = computed(() => {
      if (isCopilotKitThemeName(theme.value)) {
        return theme.value
      }

      if (theme.value && typeof theme.value === 'object' && 'name' in theme.value && theme.value.name) {
        return theme.value.name
      }

      return 'custom'
    })

    const activeThemeTokens = computed(() =>
      resolveCopilotKitThemeTokens(theme.value, resolvedAppearance.value, props.themeOverrides)
    )

    const activeThemeCssVariables = computed(() => toCopilotKitCssVariables(activeThemeTokens.value))

    let mediaQuery: MediaQueryList | null = null
    let mediaQueryListener: ((event: MediaQueryListEvent) => void) | null = null

    const syncSystemTheme = () => {
      systemPrefersDark.value =
        typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    onMounted(() => {
      if (typeof window === 'undefined') {
        return
      }

      syncSystemTheme()
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQueryListener = event => {
        systemPrefersDark.value = event.matches
      }
      mediaQuery.addEventListener('change', mediaQueryListener)
    })

    onBeforeUnmount(() => {
      if (mediaQuery && mediaQueryListener) {
        mediaQuery.removeEventListener('change', mediaQueryListener)
      }
    })

    watch(
      () => props.theme,
      value => {
        if (value !== undefined) {
          theme.value = value
        }
      }
    )

    watch(
      () => props.darkMode,
      value => {
        darkMode.value = value ?? 'auto'
      }
    )

    const getContextString = (documents: DocumentPointer[], categories: string[]) => {
      const documentsString = documents
        .map(document => {
          return `${document.name} (${document.sourceApplication}):\n${document.getContents()}`
        })
        .join('\n\n')

      const nonDocumentStrings = printTree(categories)

      return `${documentsString}\n\n${nonDocumentStrings}`
    }
    const addContext = (context: string, parentId?: string, categories: string[] = defaultCopilotContextCategories) => {
      return addElement(context, categories, parentId)
    }
    const removeContext = (id: string) => {
      removeElement(id)
    }

    const getFunctionCallHandler = (customEntryPoints?: Record<string, FrontendAction<any>>) => {
      return entryPointsToFunctionCallHandler(Object.values(customEntryPoints || actions.value))
    }

    const getDocumentsContext = (categories: string[]) => allDocuments(categories)
    const addDocumentContext = (
      documentPointer: DocumentPointer,
      categories: string[] = defaultCopilotContextCategories
    ) => addDocument(documentPointer, categories)
    const removeDocumentContext = (documentId: string) => {
      removeDocument(documentId)
    }

    const addChatSuggestionConfiguration = (id: string, suggestion: CopilotChatSuggestionConfiguration) => {
      chatSuggestionConfiguration.value = {
        ...chatSuggestionConfiguration.value,
        [id]: suggestion,
      }
    }
    const removeChatSuggestionConfiguration = (id: string) => {
      const { [id]: _removed, ...rest } = chatSuggestionConfiguration.value
      chatSuggestionConfiguration.value = rest
    }

    if (!props.publicApiKey) {
      if (props.cloudRestrictToTopic) {
        throw new Error(
          'To use the cloudRestrictToTopic feature, please sign up at https://copilotkit.ai and provide a publicApiKey.'
        )
      }
    }

    let cloud: CopilotCloudConfig | undefined = undefined
    if (props.publicApiKey) {
      cloud = {
        guardrails: {
          input: {
            restrictToTopic: {
              enabled: props.cloudRestrictToTopic ? true : false,
              validTopics: props.cloudRestrictToTopic?.validTopics || [],
              invalidTopics: props.cloudRestrictToTopic?.invalidTopics || [],
            },
          },
        },
      }
    }

    // get the appropriate CopilotApiConfig from the props
    const copilotApiConfig: CopilotApiConfig = {
      publicApiKey: props.publicApiKey,
      ...(cloud ? { cloud } : {}),
      chatApiEndpoint: chatApiEndpoint,
      headers: props.headers || {},
      properties: props.properties || {},
      transcribeAudioUrl: props.transcribeAudioUrl,
      textToSpeechUrl: props.textToSpeechUrl,
      credentials: props.credentials,
    }

    provide<CopilotContextParams>(CopilotKitContext, {
      chatComponentsCache,
      defaultToolRender,
      setDefaultToolRender,
      actions,
      getFunctionCallHandler,
      setAction,
      removeAction,
      agentSession,
      setAgentSession,
      getContextString,
      addContext,
      removeContext,
      getDocumentsContext,
      addDocumentContext,
      removeDocumentContext,
      copilotApiConfig,
      messages,
      setMessages,
      isLoading,
      setIsLoading,
      chatSuggestionConfiguration,
      addChatSuggestionConfiguration,
      removeChatSuggestionConfiguration,
      chatInstructions,
      setChatInstructions,
      humanInTheLoopEvent,
      setHumanInTheLoopEvent,
      showDevConsole: props.showDevConsole || 'auto',
      usageError,
      setUsageError,
    })

    provide(CopilotKitThemeContext, {
      theme,
      darkMode,
      resolvedAppearance,
      activeThemeName,
      tokens: activeThemeTokens,
      cssVariables: activeThemeCssVariables,
      setTheme,
      setDarkMode,
    })

    return () => {
      const themeName = activeThemeName.value.replace(/[^a-zA-Z0-9_-]+/g, '-')
      return (
        <div
          class={['copilotKitRoot', `copilotKitTheme-${themeName}`, `copilotKitAppearance-${resolvedAppearance.value}`]}
          data-copilotkit-theme={activeThemeName.value}
          data-copilotkit-appearance={resolvedAppearance.value}
          style={activeThemeCssVariables.value}
        >
          <ToastProvider>
            <CopilotErrorBoundary>
              {renderSlot(slots, 'default')}
              <ConsoleTrigger />
              {usageError.value && <UsageBanner error={usageError.value} onClose={() => (usageError.value = null)} />}
            </CopilotErrorBoundary>
          </ToastProvider>
        </div>
      )
    }
  },
})

export const defaultCopilotContextCategories = ['global']

function entryPointsToFunctionCallHandler(actions: FrontendAction<any>[]): FunctionCallHandler {
  return async ({ messages, name, args }) => {
    let actionsByFunctionName: Record<string, FrontendAction<any>> = {}
    for (let action of actions) {
      actionsByFunctionName[action.name] = action
    }

    const action = actionsByFunctionName[name]
    let result: any = undefined
    if (action) {
      await new Promise<void>(async (resolve, reject) => {
        try {
          result = await action.handler?.(args)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
      await new Promise(resolve => setTimeout(resolve, 20))
    }
    return result
  }
}

function returnAndThrowInDebug<T>(value: T): T {
  // throw new Error('Remember to wrap your app in a `<CopilotKit> {...} </CopilotKit>` !!!')
  return value
}
