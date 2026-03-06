import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@dingdayu/vue-copilotkit-ui/style.css'

import App from './App.vue'
import i18n from './i18n'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')
