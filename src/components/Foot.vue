<script setup>

</script>

<template>
  <div class="footer-content">
    <span class="copyright">© 2024 Zhong Yingjie. All rights reserved.</span>  
    <span class="links">  
      <a href="https://beian.miit.gov.cn/" target="_blank">赣ICP备2024022512号-2</a>
    </span> 
  </div>
    
</template>

<style scoped>
.footer-content {
  text-align: center;
  padding: 10px;
}

.copyright,
.links {
  display: inline-block;
  margin: 0 5px;
}

.links a {
  color: inherit;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}

.read-the-docs {
  color: #888;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .footer-content {
    padding: 8px;
    font-size: 12px;
  }
  
  .copyright,
  .links {
    display: block;
    margin: 2px 0;
  }
}

@media (max-width: 480px) {
  .footer-content {
    font-size: 10px;
    padding: 5px;
  }
}
</style>
