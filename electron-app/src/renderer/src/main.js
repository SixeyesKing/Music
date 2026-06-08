import './assets/main.css'
//引入 UnoCSS  
import 'virtual:uno.css'

//UI框架 Element Plus
import ElementPlus from 'element-plus'
//引入 Element Plus 暗色模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'

//引入 Element Plus 图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './locales'

import { useTheme } from './composables/useTheme'

import res from './utils/resource_utils'

const app = createApp(App)
app.use(router);

app.use(i18n);//使用 i18n 插件

//全局注册 Element Plus Icon组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
//全局注册 iconify 图标组件（离线模式，不依赖网络）
import { Icon, addCollection } from '@iconify/vue/offline';
import flowbite from '@iconify-json/flowbite/icons.json'
import fluent from '@iconify-json/fluent/icons.json'
import ion from '@iconify-json/ion/icons.json'
import letsIcons from '@iconify-json/lets-icons/icons.json'
import lucide from '@iconify-json/lucide/icons.json'
import materialSymbols from '@iconify-json/material-symbols/icons.json'
import mingcute from '@iconify-json/mingcute/icons.json'
import mynaui from '@iconify-json/mynaui/icons.json'
import mdi from '@iconify-json/mdi/icons.json'
import majesticons from '@iconify-json/majesticons/icons.json'
import tabler from '@iconify-json/tabler/icons.json'
import weui from '@iconify-json/weui/icons.json'

const iconCollections = [flowbite, fluent, ion, letsIcons, lucide, materialSymbols, mingcute, mynaui, mdi, majesticons, tabler, weui]
for (const collection of iconCollections) {
  addCollection(collection)
}

app.component('Icon', Icon);




app.config.globalProperties.res = res

// 应用挂载后，初始化主题
const { initTheme } = useTheme()
initTheme()
app.mount('#app')

