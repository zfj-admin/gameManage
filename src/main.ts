import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/index'
import {createPinia} from 'pinia'
// element plus 
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Tree from '../src/components/Tree.vue'

const app= createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('Tree', Tree)
//pinia
const pinia = createPinia()
app.use(pinia)
app.use(router)  
app.mount('#app')



