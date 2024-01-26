<script setup>
import Search from '../components/Search.vue'
import Result from '../components/Result.vue'
import { provide,inject, reactive,ref,getCurrentInstance } from 'vue';
const {proxy} = getCurrentInstance()
var qqNum = ref();


var cookie = document.cookie;
var cookieList = cookie.split("; ");

for (let lengthKey in cookieList) {
  var keyValue = cookieList[lengthKey].split("=");
  var key=keyValue[0];
  var value=keyValue[1];
  if(value!='undefinde'&&value!=''){
    qqNum.value = value;
  }
}


var logInfoList = reactive([]);
var axios = inject('$axios');

var queryLog = function query(){
  if(isNaN(Number(qqNum.value))){
    proxy.$alert("请输入正确的号码","提示",{lockScroll:false})
    return
  }
  axios.get(process.env.VUE_APP_BASE_API+'/query',{params:{'qqNum':qqNum.value}})
  .then(function(res){
    logInfoList.splice(0);
    let arr = res.data.data;
    for(let index in arr){
      logInfoList.push(arr[index]);
    }
    document.cookie="qqNum="+qqNum.value;
  })
  .catch(function(error){
    alert(error.msg);
  });
}
provide('queryLog',queryLog);
const updateQQNum = (num)=>{
  qqNum.value = num;
}
if(qqNum.value !== undefined&&qqNum.value.length>0){
  queryLog();
}
</script>

<template>
  
    <Search :qqNum="qqNum" @updateQQNum="updateQQNum"></Search>
    <h2></h2>
      <Result :logInfoList="logInfoList"></Result>
  
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
