import { createRouter, createWebHistory } from 'vue-router'  
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Djc from '../components/Djc.vue'
import Text from '../components/Text.vue'
import CopyVideo from '../components/CopyVideo.vue'
import UploadNginxFile from '../components/UploadNginxFile.vue'
  
const routes = [  
  { path: '/home', component: Home },
  { path: '/', redirect:'/home' },
  { path: '/about', component: About },
  { path: '/tools/djc', component: Djc },
  { path: '/text', component: Text },
  { path: '/tools/copyVideo', component: CopyVideo },
  { path: '/tools/uploadNginxFile', component: UploadNginxFile }
]  
  
const router = createRouter({
  history: createWebHistory(),  
  routes
})
  
export default router