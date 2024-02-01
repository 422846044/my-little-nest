<script setup>
import{ArrowLeft} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'
const router = useRouter()
const goBack = ()=>{
  router.go(-1)
}
</script>

<template>
  <el-page-header :icon="ArrowLeft" title="上一页"  @back="goBack">
    <template #content>
      <div class="flex items-center">
        <span class="text-large font-600 mr-3"> Title </span>
        <el-tag>Default</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button>Print</el-button>
        <el-button type="primary" class="ml-2">Edit</el-button>
      </div>
    </template>
  </el-page-header>
    <div style="text-align: left;">
      <h1>redis的持久化机制</h1>
    </div>
      <el-text>redis中持久化就是将内存中的数据保存到磁盘中，防止服务宕机导致内存数据丢失。
redis支持两种方式的持久化，一种是rdb(redis database)方式，一种是aof(append only file追加到文件)方式。前者会根据指定的规则定时把内存中的数据保存到磁盘，后者是每次执行完命令后会将命令记录下来。一般两者结合使用。
rdb：
rdb是redis默认的持久化方案，rdb持久化会把内存中的数据写入到磁盘中，在一个指定目录下生成一个dump.rdb文件。redis重启会加载dump.rdb文件来恢复数据。bgsave是主流的触发rdb持久化的方式
执行bgsave命令，redis父进程判断是否有在执行的子进程，存在则返回，不存在会执行fork操作创建子进程，fork操作过程会导致父进程阻塞。执行fork之后，父进程继续接收并处理客户端请求，而子进程开始将内存的数据写入磁盘的临时文件，所有数据写完之后，会用临时文件替换原来的rdb文件。
触发rdb持久化的方式：
手动触发：save或bgsave，save会阻塞所有客户端请求，bgsave后台异步进行快照操作。
被动触发：根据配置规则进行自动快照，如save 100 10，100秒内至少有10个键修改则进行快照。如果从节点执行全量复制操作，主节点会自动执行bgsave生成rdb文件并发送给节点。默认情况下，执行shutdown命令，在没有开启aof持久化功能则自动执行bgsave
优点：
redis加载rdb恢复数据方式远远快于aof
使用单独子进程进行持久化，主进程不会进行任何io操作，保证了redis的性能
缺点：
rdb方式无法实时持久化
aof方式
aof持久化是以独立日志的方式记录每次写命令，redis重启时会重新执行aof文件中的命令来达到恢复数据的目的。解决了持久化的实时性。默认情况redis不开启aof。通过appendonly yes启用，开启之后每次执行一条写命令都会将该命令写进aof_buf缓冲区，aof缓冲区根据对应的策略向硬盘做同步操作。
默认情况下系统每30秒执行一次同步操作。为了防止缓冲区数据丢失，可以在redis写入aof文件后主动要求系统将缓冲区数据同步到磁盘。通过appendfsync参数设置：
appendfsync always //每次写入aof文件都会执行同步，最安全最慢，不建议
appendfsync everysec //保证性能保证安全
appendfsync no//由系统确定
随着aof文件越来越大，需要定期对aof文件进行重写，达到压缩文件体积的目的。aof文件重写时把redis进程内数据转化为写命令同步到aof文件的过程。
优点：
aof可以更好的保护数据不丢失。
aof以append-only的模式写入，没有磁盘寻址的开销，写入性能高
缺点：
aof文件比rdb文件大
数据恢复慢
</el-text>
</template>


<style scoped>
.read-the-docs {
  color: #888;
}
</style>
