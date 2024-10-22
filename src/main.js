import { createApp } from 'vue'
createApp(App).mount('#app')//整个app是通过这个createApp（）创建的引用
import App from './App.vue'
import './style.scss'

// import ElementPlus from element-plus
import 'element-plus/dist/index.css'
const app=createApp(App)
// app.use(ElementPlus)
