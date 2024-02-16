<script setup>
import Top from './components/Top.vue'
import Foot from './components/Foot.vue'
import { provide,inject, reactive,ref } from 'vue'

</script>

<template>
  <el-container>
    <el-header>
      <Top></Top>
    </el-header>
    <el-main>
      <!-- 路由匹配到的组件将渲染在这里 -->
      <router-view></router-view>
    </el-main>
  <el-footer>
    <Foot></Foot>
  </el-footer>
  
  </el-container>
  
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
