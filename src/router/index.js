import { createRouter, createWebHistory } from 'vue-router'  
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Djc from '../components/Djc.vue'
import Text from '../components/Text.vue'
import Test from '../components/Test.vue'
  
const routes = [  
  { path: '/home', component: Home },
  { path: '/', redirect:'/home' },
  { path: '/about', component: About },
  { path: '/tools/djc', component: Djc },
  { path: '/text', component: Text },
  { path: '/test', component: Test }
]  
  
const router = createRouter({
  history: createWebHistory(),  
  routes
})
  
export default router