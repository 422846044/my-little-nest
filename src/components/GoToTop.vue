<template>  
    <div>  
      <!-- 其他内容 -->  
      <button @click="scrollToTop">回到顶部</button>  
    </div>  
  </template>
  <script setup>  
  function scrollToTop() {  
    // 平滑滚动到页面顶部  
    window.scrollTo({  
      top: 0,  
      behavior: 'smooth', // 平滑滚动  
    });  
  }  
  </script>