import { createRouter, createWebHistory } from 'vue-router'  
const Home = () => import('../components/Home.vue')
const About = () =>  import('../components/About.vue')
const Djc = () =>  import('../components/Djc.vue')
const Text = () =>  import('../components/Text.vue')
const CopyVideo = () =>  import('../components/CopyVideo.vue')
const UploadNginxFile = () =>  import('../components/UploadNginxFile.vue')
const NotFound = () =>  import('../components/NotFound.vue')
  
const routes = [  
  { path: '/home', component: Home },
  { path: '/', redirect:'/home' },
  { path: '/about', component: About },
  { path: '/tools/djc', component: Djc },
  { path: '/text', component: Text },
  { path: '/tools/copyVideo', component: CopyVideo },
  { path: '/tools/uploadNginxFile', component: UploadNginxFile },
  {
    path: '/NotFound',
    component: NotFound,
    meta: {
      needLogin: false
    }
  }
]  
  
const router = createRouter({
  history: createWebHistory(),  
  routes
})
  
export default router