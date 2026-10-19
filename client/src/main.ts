import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'katex/dist/katex.min.css'
import './styles/main.css'

import { initializeWorkspace } from '@/editor/store'
initializeWorkspace().finally(() => createApp(App).use(router).mount('#app'))
