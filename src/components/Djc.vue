<script setup>
import Search from '../components/Search.vue'
import Result from '../components/Result.vue'
import {reactive } from 'vue';

var info = reactive({
  logInfoList:[]
});

const changeLogInfoList = (infoList)=>{
  info.logInfoList=infoList
}

</script>

<template>
    <Search @changeLogInfoList="changeLogInfoList"></Search>
    <h2></h2>
    <Result :logInfoList="info.logInfoList"></Result>
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
