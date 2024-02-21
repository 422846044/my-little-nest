<script setup>
import Top from './components/Top.vue'
import Foot from './components/Foot.vue'
import {onMounted} from 'vue'
import {dictMapQuery} from './api'


onMounted(async () => {
  //获取字典信息
  let category = await getDict('wzfl')
  let tags = await getDict('wzbq')
  localStorage.setItem('dictCategory',JSON.stringify(category))
  localStorage.setItem('dictTags',JSON.stringify(tags))
})

async function getDict(code){
  let dictData = {};
  await dictMapQuery({dictCode:code})
    .then(res => {
      if (res.data.success == true) {
        dictData=res.data.data
      }
    });
  return dictData;
}


</script>

<template>
  <el-container>
    <el-header>
      <Top></Top>
    </el-header>
    
    <el-main style="overflow: visible;">
      <!-- 路由匹配到的组件将渲染在这里 -->
      <router-view></router-view>
    </el-main>
  <el-footer>
    <Foot></Foot>
  </el-footer>
  </el-container>
    
  
  
</template>

<style scoped>

.el-header{
  padding-left: 0px !important;
  padding-right: 0px !important;
  position: sticky;
  top: 0;
  z-index: 100;
}

</style>
