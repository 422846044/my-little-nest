import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    // 'process.env': {
    //     //VUE_APP_BASE_API:'http://47.103.48.242:8090/djc/task',
    //     //VUE_APP_BASE_API:'http://www.dfwx.fun:8090',
    //     VUE_APP_ADMIN_API:'http://www.dfwx.fun:8090',
    //     VUE_APP_BASE_API: import.meta.env.VITE_BASE_URL
    // }
  }
})
