<script setup>
var props = defineProps({
  logInfoList: Array
})
</script>

<template>
  <el-table :data="logInfoList" height="700px" style="width: 100%" empty-text="暂无数据">
    <el-table-column prop="createTime" label="时间" min-width="30%" />
    <el-table-column prop="logContent" label="内容" min-width="70%" />
  </el-table>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
