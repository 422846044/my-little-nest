<script setup>
import { useRoute } from 'vue-router';
import { useDark,useToggle } from "@vueuse/core";
import { Sunny,Moon } from '@element-plus/icons-vue';
import { reactive } from 'vue';

const route = useRoute();
const isDark = useDark();

const handleSelect = () => {}

const toggleDark  = useToggle(isDark)

</script>

<template>
  <el-menu :default-active="route.path" class="el-menu-demo" mode="horizontal" :ellipsis="false" style="--el-menu-hover-bg-color:#545c64"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect" router >
    <el-menu-item index="" class="logo-item">
      <img class="logo-img" src="http://cdn.zhongyingjie.top/public/static/admin/logo.jpg" alt="logo" />
    </el-menu-item>
    <el-menu-item index="/home" class="nav-item">主页</el-menu-item>
    <div class="flex-grow" />
    <el-sub-menu index="2" class="nav-item">
      <template #title>工具</template>
      <el-menu-item index="/tools/djc">道聚城自动任务</el-menu-item>
      <el-menu-item index="/tools/copyVideo">提取视频</el-menu-item>
      <el-menu-item index="/tools/uploadNginxFile">上传nginx代理</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/about" class="nav-item">个人</el-menu-item>
    <el-menu-item index="" class="switch-item">
      <el-switch v-model="isDark" :active-icon="Moon" :inactive-icon="Sunny" inline-prompt @change="toggleDark"/>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.el-menu-item .el-icon {
  margin-right: 5px;
  font-size: 20px;
}

/* Logo样式 */
.logo-item {
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 10px;
  margin-right: 10px;
}

/* 切换按钮样式 */
.switch-item {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .el-menu-demo {
    flex-wrap: wrap;
    height: auto !important;
    min-height: 60px;
    align-items: center;
  }
  
  .logo-item {
    padding: 0 8px !important;
  }
  
  .logo-img {
    width: 40px !important;
    height: 40px !important;
  }
  
  .nav-item {
    font-size: 14px;
    padding: 0 10px !important;
    display: flex !important;
    align-items: center !important;
    height: 60px !important;
  }
  
  .switch-item {
    padding: 0 8px !important;
    height: 60px !important;
  }
  
  .el-sub-menu {
    height: 60px !important;
  }
  
  .el-sub-menu .el-sub-menu__title {
    font-size: 14px;
    padding: 0 10px !important;
    height: 60px !important;
    line-height: 60px !important;
  }
}

@media (max-width: 480px) {
  .el-menu-demo {
    min-height: 50px;
  }
  
  .logo-img {
    width: 35px !important;
    height: 35px !important;
  }
  
  .nav-item {
    font-size: 12px;
    padding: 0 6px !important;
    height: 50px !important;
  }
  
  .switch-item {
    padding: 0 6px !important;
    height: 50px !important;
  }
  
  .el-sub-menu {
    height: 50px !important;
  }
  
  .el-sub-menu .el-sub-menu__title {
    font-size: 12px;
    padding: 0 6px !important;
    height: 50px !important;
    line-height: 50px !important;
  }
}
</style>
