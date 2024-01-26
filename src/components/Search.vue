<script setup>
import { inject, watchEffect,ref } from 'vue';
import { Search } from '@element-plus/icons-vue'
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
  <el-row :gutter="10" justify="center">
    <el-input
      v-model="qqNum"
      placeholder="请输入查询的QQ号"
      :prefix-icon="Search"
      style="width: 10%;"
      />
      <el-button class="button" id="search" @click="query">查询</el-button>
      <el-button class="button" id="retry" @click="retry" >补签</el-button>
      <el-button class="button" id="update" @click="updateToken">更新token</el-button>
      <el-button class="button" id="clear" @click="clearCooike">清除账号cookie记录</el-button>
  </el-row>
</template>

<style scoped>
 .button{
  margin-left: 6px;
 }
</style>
