import { createApp } from 'vue';
import ElementPlus from 'element-plus'; // 引入 Element Plus 组件库
import 'element-plus/dist/index.css'; // 引入 Element Plus 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import './style.scss';
import router from './router'; // 引入路由文件

const app = createApp(App);

// 全局注册 Element Plus
app.use(ElementPlus);
app.use(router); // 注册路由

// 全局导入 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app'); // 挂载 Vue 应用