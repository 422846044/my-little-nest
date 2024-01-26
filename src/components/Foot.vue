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
  <div style="text-align: center;">
    <span>© 2024 淡风无痕. All rights reserved.</span>  
    <span class="links">  
      <a href="https://#" target="_blank">ICP</a>
    </span> 
  </div>
    
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
