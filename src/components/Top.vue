<script setup>
import { useRoute } from 'vue-router';
import { useDark,useToggle } from "@vueuse/core";
import { Sunny,Moon } from '@element-plus/icons-vue';

const route = useRoute();
const isDark = useDark();

const handleSelect = () => {}

const toggleDark  = () => {console.log(111);useToggle(isDark)}

</script>

<template>
  <el-menu :default-active="route.path" class="el-menu-demo" mode="horizontal" :ellipsis="false"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect" router >
    <el-menu-item index="" style="padding: 0 0 0 0;">
      <img style="width: 50px;border-radius:50%;margin: 5px;" src="/src/assets/logo.jpg" alt="logo" />
    </el-menu-item>
    <el-menu-item index="/home">主页</el-menu-item>
    <div class="flex-grow" />
    <el-sub-menu index="2">
      <template #title>工具</template>
      <el-menu-item index="/tools/djc">道聚城自动任务</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/about">个人</el-menu-item>
    <el-menu-item index="">
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
</style>
