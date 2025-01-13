<script setup>
import Top from './components/Top.vue'
import Foot from './components/Foot.vue'
import CatTop from './components/CatTop.vue'
import GoToTop from './components/GoToTop.vue';

</script>

<template>
  <el-container>
    <el-header>
      <Top></Top>
    </el-header>
    <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
    <el-footer>
      <Foot></Foot>
    </el-footer>
    <CatTop></CatTop>
    <GoToTop></GoToTop>

  </el-container>
</template>

<style scoped>
.el-header {
  padding-left: 0px !important;
  padding-right: 0px !important;
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>
