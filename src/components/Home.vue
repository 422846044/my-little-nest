<script setup>
import { toRefs } from 'vue';


var props = defineProps({
  logInfoList: Array
})

var infoList = [
  {
    id:1,
    title:'redis的持久化机制',
    content:"jfdsredis中持久化就是将内存中的数据保存到磁盘中，防止lkafjlkfkld...",
    time:"2023-10-01"
  },
  {
    id:2,
    title:'tcp和udp',
    content:"tcp全称是transmission control protocal传输控制协议，它被称为一种面向连接的协议，发送数据前需要进行握手。udp全称是user datagram protocol用户数据报协议",
    time:"2023-10-01"
  },
  {
    id:3,
    title:'SpringBean',
    content:"生命周期：bean的生命周期从实例化开始，到依赖注入，此时若实现beanNameWare接口则会执行setBeanName方法，若实现BeanFactoryWare则会执行setBeanFactory方法，此时执行后置处理器预初始化，若实现InitializingBean接口则会执行afterPropertiesSet方法，再进行初始化方法，再执行后置处理器后初始化方法，若实现disposableBean接口，执行destroy方法，最后执行销毁方法。",
    time:"2023-10-01"
  },
  {
    id:4,
    title:'最左前缀原则',
    content:"ql语句中使用到了组合索引最左边的索引，那么可以利用这个组合索引去匹配。当遇到范围查询（>、<、like、between）就会停止匹配，后面的字段不会使用索引。对（a，b，c）建立索引，那么条件a/ab/abc会使用索引，b/bc/c/cb不会使用索引",
    time:"2023-10-01"
  },
  {
    id:5,
    title:'线程池参数',
    content:"线程池参数主要为，corePoolSize核心线程数，maxNumPoolSize最大线程数，keepLive最大存活时间，阻塞队列，线程工厂，拒绝策略。",
    time:"2023-10-01"
  }];
</script>

<template>
  <el-space fill wrap direction="vertical" :fill-ratio=100 style="width: 100%">
    <div v-for="info in infoList" :key="info.id">
    <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{info.title}}</span>
        <router-link to="/Text"><el-button type="primary" style="margin-left: 1%;"><el-icon><View /></el-icon>查看</el-button></router-link>
      </div>
    </template>
    <router-link to="/Text"><div class="text item" style="padding-top: 10px;">{{ info.content }}</div></router-link>
    <div style="padding-top:1%;font-size: x-small;color:grey;"><el-icon><Calendar /></el-icon> {{info.time}}</div>
  </el-card>
  </div>
  </el-space>
  
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
a{
  text-decoration: none;
}
a:link,a:visited{
  color: black;
}
.router-link-active {
  text-decoration: none;
}
</style>
