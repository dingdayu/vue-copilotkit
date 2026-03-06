import { createI18n } from 'vue-i18n'

import { messages } from './messages'

const initialLocale = localStorage.getItem('demo-locale') || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en-US',
  messages
})

export default i18n
