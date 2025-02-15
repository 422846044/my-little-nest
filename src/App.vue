<script setup>
import Top from './components/Top.vue'
import Foot from './components/Foot.vue'

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
    <el-backtop :bottom="100">
      
      <div
      style="
      height: 100%;
        width: 100%;
        background-color: var(--el-bg-color-overlay);
        box-shadow: var(--el-box-shadow-lighter);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      "
    >
    UP
    </div></el-backtop>
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
