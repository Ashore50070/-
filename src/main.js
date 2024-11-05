import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import './style.scss'


const app = createApp(App);
// 全局导入plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')//整个app是通过这个createApp（）创建的引用

// import ElementPlus from element-plus


// app.use(ElementPlus)



