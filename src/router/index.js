import { createRouter, createWebHistory } from 'vue-router';
import EditorPage from '../packages/editor.jsx';
import HomePage1 from '../views/page1.jsx';
import HomePage2 from '../views/page2.jsx';

const routes = [
  { path: '/', redirect: '/editor' },
  { path: '/editor', name: 'editor', component: EditorPage },
  { path: '/page1', name: 'page1', component: HomePage1 },
  { path: '/page2', name: 'page2', component: HomePage2 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;