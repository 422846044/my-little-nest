<template>  
    <div class="not-found">  
      <h1>404 - 页面未找到</h1>  
      <p>很抱歉，您访问的页面不存在。</p>  
      <button @click="goBack">返回首页</button>  
    </div>  
  </template>  
    
  <script>  
  export default {  
    name: 'NotFound',  
    methods: {  
      goBack() {  
        this.$router.push('/');  
      }  
    }  
  }  
  </script>  
    
  <style scoped>  
  .not-found {  
    text-align: center;  
    margin-top: 50px;  
  }  
    
  .not-found h1 {  
    color: #ff5733;  
    font-size: 2.5em;  
    margin-bottom: 20px;  
  }  
    
  .not-found p {  
    font-size: 1.2em;  
    color: #333;  
  }  
    
  .not-found button {  
    background-color: #007bff;  
    color: white;  
    border: none;  
    padding: 10px 20px;  
    font-size: 1em;  
    cursor: pointer;  
    border-radius: 5px;  
    margin-top: 20px;  
    transition: background-color 0.3s;  
  }  
    
  .not-found button:hover {  
    background-color: #0056b3;  
  }  
  </style>