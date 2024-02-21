import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/index' // 引入路由配置文件
import ElementPlus from 'element-plus';  
import 'element-plus/dist/index.css'




let app = createApp(App);
app.provide('$axios',axios);
app.use(router);
app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.mount('#app')
