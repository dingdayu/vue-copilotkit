import merge from 'lodash.merge'
import { computed, inject, type ComputedRef, type InjectionKey, type Ref } from 'vue'

export type CopilotKitAppearance = 'light' | 'dark'
export type CopilotKitDarkMode = boolean | 'auto'
export type CopilotKitThemeName = 'default' | 'copilotkit' | 'ant-design-x' | 'x.ant.design'

export interface CopilotKitThemeTokens {
  fontFamily: string
  backgroundColor: string
  surfaceColor: string
  surfaceElevatedColor: string
  secondaryColor: string
  secondaryContrastColor: string
  primaryColor: string
  primaryStrongColor: string
  accentColor: string
  contrastColor: string
  mutedColor: string
  separatorColor: string
  scrollbarColor: string
  shadowLg: string
  shadowMd: string
  radiusXl: string
  radiusLg: string
  radiusMd: string
  responseButtonColor: string
  responseButtonBackgroundColor: string
  toolbarBackgroundColor: string
  toolbarHoverBackgroundColor: string
  toolbarTextColor: string
  suggestionBackgroundColor: string
  suggestionHoverBackgroundColor: string
  suggestionTextColor: string
  inputHoverBackgroundColor: string
  userMessageShadow: string
}

export type CopilotKitThemeTokenOverrides = Partial<CopilotKitThemeTokens>

export interface CopilotKitThemePreset {
  name: string
  light?: CopilotKitThemeTokenOverrides
  dark?: CopilotKitThemeTokenOverrides
}

export interface CopilotKitThemeVariantOverrides {
  light?: CopilotKitThemeTokenOverrides
  dark?: CopilotKitThemeTokenOverrides
}

export type CopilotKitTheme = CopilotKitThemeName | CopilotKitThemePreset | CopilotKitThemeTokenOverrides

export interface CopilotKitThemeContextValue {
  theme: Ref<CopilotKitTheme>
  darkMode: Ref<CopilotKitDarkMode>
  resolvedAppearance: ComputedRef<CopilotKitAppearance>
  activeThemeName: ComputedRef<string>
  tokens: ComputedRef<CopilotKitThemeTokens>
  cssVariables: ComputedRef<Record<string, string>>
  setTheme: (theme: CopilotKitTheme) => void
  setDarkMode: (mode: CopilotKitDarkMode) => void
}

export const copilotKitThemeNames: CopilotKitThemeName[] = ['default', 'copilotkit', 'ant-design-x', 'x.ant.design']

export const defaultCopilotKitThemeTokens: CopilotKitThemeTokens = {
  fontFamily: "'Manrope', 'Avenir Next', 'Segoe UI', sans-serif",
  backgroundColor: '#f3f7fb',
  surfaceColor: '#ffffff',
  surfaceElevatedColor: '#ffffff',
  secondaryColor: '#e7eef5',
  secondaryContrastColor: '#162332',
  primaryColor: '#0f766e',
  primaryStrongColor: '#115e59',
  accentColor: '#0284c7',
  contrastColor: '#ffffff',
  mutedColor: '#5f7388',
  separatorColor: 'rgba(22, 35, 50, 0.12)',
  scrollbarColor: 'rgba(15, 118, 110, 0.28)',
  shadowLg: '0 18px 52px rgba(12, 34, 52, 0.2)',
  shadowMd: '0 8px 24px rgba(12, 34, 52, 0.16)',
  radiusXl: '18px',
  radiusLg: '14px',
  radiusMd: '10px',
  responseButtonColor: '#0f766e',
  responseButtonBackgroundColor: '#ffffff',
  toolbarBackgroundColor: 'rgba(15, 118, 110, 0.08)',
  toolbarHoverBackgroundColor: 'rgba(15, 118, 110, 0.14)',
  toolbarTextColor: '#0f766e',
  suggestionBackgroundColor: 'rgba(15, 118, 110, 0.1)',
  suggestionHoverBackgroundColor: 'rgba(15, 118, 110, 0.16)',
  suggestionTextColor: '#115e59',
  inputHoverBackgroundColor: 'rgba(15, 118, 110, 0.08)',
  userMessageShadow: '0 8px 22px rgba(15, 118, 110, 0.2)',
}

export const copilotKitThemes: Record<CopilotKitThemeName, CopilotKitThemePreset> = {
  default: {
    name: 'default',
    light: {},
    dark: {
      backgroundColor: '#0f172a',
      surfaceColor: '#111c34',
      surfaceElevatedColor: '#16213d',
      secondaryColor: '#1d2a45',
      secondaryContrastColor: '#e2e8f0',
      primaryColor: '#22c55e',
      primaryStrongColor: '#16a34a',
      accentColor: '#38bdf8',
      contrastColor: '#08111f',
      mutedColor: '#94a3b8',
      separatorColor: 'rgba(148, 163, 184, 0.22)',
      scrollbarColor: 'rgba(56, 189, 248, 0.3)',
      shadowLg: '0 24px 56px rgba(2, 8, 23, 0.5)',
      shadowMd: '0 10px 30px rgba(2, 8, 23, 0.35)',
      responseButtonColor: '#38bdf8',
      responseButtonBackgroundColor: '#16213d',
      toolbarBackgroundColor: 'rgba(56, 189, 248, 0.12)',
      toolbarHoverBackgroundColor: 'rgba(56, 189, 248, 0.18)',
      toolbarTextColor: '#7dd3fc',
      suggestionBackgroundColor: 'rgba(34, 197, 94, 0.16)',
      suggestionHoverBackgroundColor: 'rgba(34, 197, 94, 0.24)',
      suggestionTextColor: '#bbf7d0',
      inputHoverBackgroundColor: 'rgba(56, 189, 248, 0.12)',
      userMessageShadow: '0 10px 24px rgba(34, 197, 94, 0.24)',
    },
  },
  copilotkit: {
    name: 'copilotkit',
    light: {
      backgroundColor: '#f5f3ff',
      surfaceColor: '#ffffff',
      surfaceElevatedColor: '#fcfbff',
      secondaryColor: '#ede9fe',
      secondaryContrastColor: '#2e1065',
      primaryColor: '#7c3aed',
      primaryStrongColor: '#6d28d9',
      accentColor: '#06b6d4',
      contrastColor: '#ffffff',
      mutedColor: '#6b5d95',
      separatorColor: 'rgba(76, 29, 149, 0.14)',
      scrollbarColor: 'rgba(124, 58, 237, 0.3)',
      responseButtonColor: '#6d28d9',
      toolbarBackgroundColor: 'rgba(124, 58, 237, 0.08)',
      toolbarHoverBackgroundColor: 'rgba(124, 58, 237, 0.14)',
      toolbarTextColor: '#6d28d9',
      suggestionBackgroundColor: 'rgba(124, 58, 237, 0.1)',
      suggestionHoverBackgroundColor: 'rgba(124, 58, 237, 0.16)',
      suggestionTextColor: '#5b21b6',
      inputHoverBackgroundColor: 'rgba(124, 58, 237, 0.08)',
      userMessageShadow: '0 10px 26px rgba(124, 58, 237, 0.22)',
    },
    dark: {
      backgroundColor: '#0b1020',
      surfaceColor: '#11162a',
      surfaceElevatedColor: '#161d34',
      secondaryColor: '#1f2845',
      secondaryContrastColor: '#f5f3ff',
      primaryColor: '#8b5cf6',
      primaryStrongColor: '#7c3aed',
      accentColor: '#22d3ee',
      contrastColor: '#ffffff',
      mutedColor: '#b4b1d8',
      separatorColor: 'rgba(167, 139, 250, 0.2)',
      scrollbarColor: 'rgba(139, 92, 246, 0.34)',
      shadowLg: '0 24px 56px rgba(3, 7, 18, 0.55)',
      shadowMd: '0 10px 30px rgba(3, 7, 18, 0.4)',
      responseButtonColor: '#c4b5fd',
      responseButtonBackgroundColor: '#161d34',
      toolbarBackgroundColor: 'rgba(139, 92, 246, 0.12)',
      toolbarHoverBackgroundColor: 'rgba(139, 92, 246, 0.2)',
      toolbarTextColor: '#ddd6fe',
      suggestionBackgroundColor: 'rgba(34, 211, 238, 0.14)',
      suggestionHoverBackgroundColor: 'rgba(34, 211, 238, 0.22)',
      suggestionTextColor: '#cffafe',
      inputHoverBackgroundColor: 'rgba(139, 92, 246, 0.12)',
      userMessageShadow: '0 12px 28px rgba(139, 92, 246, 0.28)',
    },
  },
  'ant-design-x': {
    name: 'ant-design-x',
    light: {
      backgroundColor: '#f5f7fa',
      surfaceColor: '#ffffff',
      surfaceElevatedColor: '#ffffff',
      secondaryColor: '#eff3f8',
      secondaryContrastColor: '#1f2937',
      primaryColor: '#1677ff',
      primaryStrongColor: '#0958d9',
      accentColor: '#13c2c2',
      contrastColor: '#ffffff',
      mutedColor: '#6b7280',
      separatorColor: 'rgba(15, 23, 42, 0.1)',
      scrollbarColor: 'rgba(22, 119, 255, 0.28)',
      shadowLg: '0 20px 50px rgba(15, 23, 42, 0.16)',
      shadowMd: '0 10px 26px rgba(15, 23, 42, 0.12)',
      responseButtonColor: '#1677ff',
      toolbarBackgroundColor: 'rgba(22, 119, 255, 0.08)',
      toolbarHoverBackgroundColor: 'rgba(22, 119, 255, 0.14)',
      toolbarTextColor: '#0958d9',
      suggestionBackgroundColor: 'rgba(22, 119, 255, 0.08)',
      suggestionHoverBackgroundColor: 'rgba(22, 119, 255, 0.14)',
      suggestionTextColor: '#0958d9',
      inputHoverBackgroundColor: 'rgba(22, 119, 255, 0.08)',
      userMessageShadow: '0 10px 24px rgba(22, 119, 255, 0.18)',
    },
    dark: {
      backgroundColor: '#0f1115',
      surfaceColor: '#171a21',
      surfaceElevatedColor: '#1d2230',
      secondaryColor: '#232938',
      secondaryContrastColor: '#f3f4f6',
      primaryColor: '#4096ff',
      primaryStrongColor: '#1677ff',
      accentColor: '#36cfc9',
      contrastColor: '#ffffff',
      mutedColor: '#a1a1aa',
      separatorColor: 'rgba(255, 255, 255, 0.12)',
      scrollbarColor: 'rgba(64, 150, 255, 0.3)',
      shadowLg: '0 24px 60px rgba(0, 0, 0, 0.45)',
      shadowMd: '0 12px 28px rgba(0, 0, 0, 0.3)',
      responseButtonColor: '#69b1ff',
      responseButtonBackgroundColor: '#1d2230',
      toolbarBackgroundColor: 'rgba(64, 150, 255, 0.12)',
      toolbarHoverBackgroundColor: 'rgba(64, 150, 255, 0.2)',
      toolbarTextColor: '#91caff',
      suggestionBackgroundColor: 'rgba(64, 150, 255, 0.14)',
      suggestionHoverBackgroundColor: 'rgba(64, 150, 255, 0.22)',
      suggestionTextColor: '#bae0ff',
      inputHoverBackgroundColor: 'rgba(64, 150, 255, 0.12)',
      userMessageShadow: '0 10px 24px rgba(64, 150, 255, 0.22)',
    },
  },
  'x.ant.design': {
    name: 'x.ant.design',
    light: {
      backgroundColor: '#f5f7fa',
      surfaceColor: '#ffffff',
      surfaceElevatedColor: '#ffffff',
      secondaryColor: '#eff3f8',
      secondaryContrastColor: '#1f2937',
      primaryColor: '#1677ff',
      primaryStrongColor: '#0958d9',
      accentColor: '#13c2c2',
      contrastColor: '#ffffff',
      mutedColor: '#6b7280',
      separatorColor: 'rgba(15, 23, 42, 0.1)',
      scrollbarColor: 'rgba(22, 119, 255, 0.28)',
      shadowLg: '0 20px 50px rgba(15, 23, 42, 0.16)',
      shadowMd: '0 10px 26px rgba(15, 23, 42, 0.12)',
      responseButtonColor: '#1677ff',
      toolbarBackgroundColor: 'rgba(22, 119, 255, 0.08)',
      toolbarHoverBackgroundColor: 'rgba(22, 119, 255, 0.14)',
      toolbarTextColor: '#0958d9',
      suggestionBackgroundColor: 'rgba(22, 119, 255, 0.08)',
      suggestionHoverBackgroundColor: 'rgba(22, 119, 255, 0.14)',
      suggestionTextColor: '#0958d9',
      inputHoverBackgroundColor: 'rgba(22, 119, 255, 0.08)',
      userMessageShadow: '0 10px 24px rgba(22, 119, 255, 0.18)',
    },
    dark: {
      backgroundColor: '#0f1115',
      surfaceColor: '#171a21',
      surfaceElevatedColor: '#1d2230',
      secondaryColor: '#232938',
      secondaryContrastColor: '#f3f4f6',
      primaryColor: '#4096ff',
      primaryStrongColor: '#1677ff',
      accentColor: '#36cfc9',
      contrastColor: '#ffffff',
      mutedColor: '#a1a1aa',
      separatorColor: 'rgba(255, 255, 255, 0.12)',
      scrollbarColor: 'rgba(64, 150, 255, 0.3)',
      shadowLg: '0 24px 60px rgba(0, 0, 0, 0.45)',
      shadowMd: '0 12px 28px rgba(0, 0, 0, 0.3)',
      responseButtonColor: '#69b1ff',
      responseButtonBackgroundColor: '#1d2230',
      toolbarBackgroundColor: 'rgba(64, 150, 255, 0.12)',
      toolbarHoverBackgroundColor: 'rgba(64, 150, 255, 0.2)',
      toolbarTextColor: '#91caff',
      suggestionBackgroundColor: 'rgba(64, 150, 255, 0.14)',
      suggestionHoverBackgroundColor: 'rgba(64, 150, 255, 0.22)',
      suggestionTextColor: '#bae0ff',
      inputHoverBackgroundColor: 'rgba(64, 150, 255, 0.12)',
      userMessageShadow: '0 10px 24px rgba(64, 150, 255, 0.22)',
    },
  },
}

export const CopilotKitThemeContext: InjectionKey<CopilotKitThemeContextValue> = Symbol('CopilotKitThemeContext')

function isCopilotKitThemeVariantOverrides(
  overrides: CopilotKitThemeTokenOverrides | CopilotKitThemeVariantOverrides
): overrides is CopilotKitThemeVariantOverrides {
  return 'light' in overrides || 'dark' in overrides
}

export function isCopilotKitThemeName(value: CopilotKitTheme): value is CopilotKitThemeName {
  return typeof value === 'string' && copilotKitThemeNames.includes(value as CopilotKitThemeName)
}

export function normalizeCopilotKitTheme(theme: CopilotKitTheme): CopilotKitThemePreset {
  if (isCopilotKitThemeName(theme)) {
    return copilotKitThemes[theme]
  }

  if (theme && typeof theme === 'object') {
    if ('light' in theme || 'dark' in theme || 'name' in theme) {
      return {
        name: theme.name || 'custom',
        light: theme.light,
        dark: theme.dark,
      }
    }

    return {
      name: 'custom',
      light: theme,
      dark: theme,
    }
  }

  return copilotKitThemes.default
}

export function normalizeCopilotKitThemeOverrides(
  overrides?: CopilotKitThemeTokenOverrides | CopilotKitThemeVariantOverrides
): CopilotKitThemeVariantOverrides {
  if (!overrides) {
    return {}
  }

  if (isCopilotKitThemeVariantOverrides(overrides)) {
    return overrides
  }

  return {
    light: { ...overrides },
    dark: { ...overrides },
  }
}

export function resolveCopilotKitThemeTokens(
  theme: CopilotKitTheme,
  appearance: CopilotKitAppearance,
  overrides?: CopilotKitThemeTokenOverrides | CopilotKitThemeVariantOverrides
): CopilotKitThemeTokens {
  const preset = normalizeCopilotKitTheme(theme)
  const normalizedOverrides = normalizeCopilotKitThemeOverrides(overrides)

  return merge(
    {},
    defaultCopilotKitThemeTokens,
    preset.light || {},
    appearance === 'dark' ? preset.dark || {} : {},
    normalizedOverrides.light || {},
    appearance === 'dark' ? normalizedOverrides.dark || {} : {}
  )
}

export function toCopilotKitCssVariables(tokens: CopilotKitThemeTokens): Record<string, string> {
  return {
    '--copilot-kit-font-family': tokens.fontFamily,
    '--copilot-kit-background-color': tokens.backgroundColor,
    '--copilot-kit-surface-color': tokens.surfaceColor,
    '--copilot-kit-surface-elevated-color': tokens.surfaceElevatedColor,
    '--copilot-kit-secondary-color': tokens.secondaryColor,
    '--copilot-kit-secondary-contrast-color': tokens.secondaryContrastColor,
    '--copilot-kit-primary-color': tokens.primaryColor,
    '--copilot-kit-primary-strong-color': tokens.primaryStrongColor,
    '--copilot-kit-accent-color': tokens.accentColor,
    '--copilot-kit-contrast-color': tokens.contrastColor,
    '--copilot-kit-muted-color': tokens.mutedColor,
    '--copilot-kit-separator-color': tokens.separatorColor,
    '--copilot-kit-scrollbar-color': tokens.scrollbarColor,
    '--copilot-kit-shadow-lg': tokens.shadowLg,
    '--copilot-kit-shadow-md': tokens.shadowMd,
    '--copilot-kit-radius-xl': tokens.radiusXl,
    '--copilot-kit-radius-lg': tokens.radiusLg,
    '--copilot-kit-radius-md': tokens.radiusMd,
    '--copilot-kit-response-button-color': tokens.responseButtonColor,
    '--copilot-kit-response-button-background-color': tokens.responseButtonBackgroundColor,
    '--copilot-kit-toolbar-background-color': tokens.toolbarBackgroundColor,
    '--copilot-kit-toolbar-hover-background-color': tokens.toolbarHoverBackgroundColor,
    '--copilot-kit-toolbar-text-color': tokens.toolbarTextColor,
    '--copilot-kit-suggestion-background-color': tokens.suggestionBackgroundColor,
    '--copilot-kit-suggestion-hover-background-color': tokens.suggestionHoverBackgroundColor,
    '--copilot-kit-suggestion-text-color': tokens.suggestionTextColor,
    '--copilot-kit-input-hover-background-color': tokens.inputHoverBackgroundColor,
    '--copilot-kit-user-message-shadow': tokens.userMessageShadow,
  }
}

export function useOptionalCopilotTheme(): CopilotKitThemeContextValue | null {
  return inject(CopilotKitThemeContext, null)
}

export function useCopilotTheme(): CopilotKitThemeContextValue {
  const context = useOptionalCopilotTheme()

  if (!context) {
    throw new Error('Remember to wrap your app in a `<CopilotKit> {...} </CopilotKit>` before using theme APIs.')
  }

  return context
}

export function useResolvedCopilotThemeAppearance() {
  const context = useCopilotTheme()
  return computed(() => context.resolvedAppearance.value)
}
