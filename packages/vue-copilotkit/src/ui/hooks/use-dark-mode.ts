import { onMounted, onScopeDispose, ref, watchEffect } from 'vue'

import { useOptionalCopilotTheme } from '../../core/theme'

export function useDarkMode() {
  const isDarkMode = ref(false)
  const theme = useOptionalCopilotTheme()

  const checkDarkMode = () => {
    if (typeof window === 'undefined') return false
    return (
      document.documentElement.classList.contains('dark') ||
      document.body.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      document.body.getAttribute('data-theme') === 'dark'
    )
  }

  watchEffect(() => {
    if (theme) {
      isDarkMode.value = theme.resolvedAppearance.value === 'dark'
    }
  })

  onMounted(() => {
    if (theme) {
      isDarkMode.value = theme.resolvedAppearance.value === 'dark'
      return
    }

    isDarkMode.value = checkDarkMode()

    const observer = new MutationObserver(() => {
      isDarkMode.value = checkDarkMode()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    })
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    })

    onScopeDispose(() => {
      observer.disconnect()
    })
  })

  return isDarkMode
}
