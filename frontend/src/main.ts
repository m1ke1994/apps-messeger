// src/main.ts
import './assets/base.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/themeStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const themeStore = useThemeStore(pinia)
themeStore.init()

// дождёмся готовности роутера (устраняет гонки при первом рендере)
router.isReady().then(() => {
  app.mount('#app')
})
