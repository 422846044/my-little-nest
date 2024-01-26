<script setup>
import { inject, watchEffect,ref } from 'vue';
var props = defineProps({
  qqNum: Number,
})
var emit = defineEmits(['updateQQNum'])
var qqNum = ref(props.qqNum);

watchEffect(()=>{
  emit('updateQQNum',qqNum.value);
});
var axios = inject('$axios');
const query = inject('queryLog');
function updateToken(){
  let token = prompt('请输入token');
  if(token!=null){
    if(token.trim!=''){
      axios.get(process.env.VUE_APP_BASE_API+'/updateToken',{params:{qqNum:qqNum.value,token:token}}).then(function(res){
        confirm(res.data.msg);
      }).catch(function(err){
        alert(err.data.msg);
      })
  }else{
    alert('不能为空');
  }
  }
}

function retry(){
  if(props.qqNum.trim!=''){
      axios.get(process.env.VUE_APP_BASE_API+'/retryTask',{params:{qqNum:qqNum.value}}).then(function(res){
        confirm(res.data.msg);
      }).catch(function(err){
        alert(err.data.msg);
    })
  }
}

function clearCooike(){
  document.cookie="qqNum='';expires="+(new Date(1));
  location.reload();
}


</script>

<template>
    <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <el-menu-item index="0" style="padding: 0 0 0 0;">
      <img
        style="width: 50px;border-radius:50%;margin: 5px;"
        src="/src/assets/logo.jpg"
        alt="logo"
      /> 
    </el-menu-item>
    <el-menu-item index="1">
      <router-link to="/">主页</router-link>
    </el-menu-item>
    <div class="flex-grow"/>
    <el-sub-menu index="2">
      <template #title>工具</template>
      <router-link to="/tools/djc"><el-menu-item index="2-1" >道聚城自动任务</el-menu-item></router-link>
    </el-sub-menu>
    <el-menu-item index="3">
      <router-link to="/about">个人</router-link>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
a{
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}
</style>
