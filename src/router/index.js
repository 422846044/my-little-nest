import { createRouter, createWebHistory } from 'vue-router'  
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Djc from '../components/Djc.vue'
import Text from '../components/Text.vue'
  
const routes = [  
  { path: '/home', component: Home },
  { path: '/', redirect:'/home' },
  { path: '/about', component: About },
  { path: '/tools/djc', component: Djc },
  { path: '/text', component: Text }
]  
  
const router = createRouter({
  history: createWebHistory(),  
  routes
})
  
export default router