<script setup>
import { onMounted, reactive } from 'vue'
import { articleListQuery } from '../api';

let pageInfo = reactive({
  lastId: -1,
  pageSize: 10,
  isNext:true
})

let info = reactive({
  articleList:[],
  total:100
});

let dict = reactive({
  category:[],
  tags:[]
})

onMounted(() => {
  getArticleList()
  dict.category = JSON.parse(localStorage.getItem('dictCategory'))
  dict.tags = JSON.parse(localStorage.getItem('dictTags'))
})

const getArticleList = () => {
  articleListQuery(pageInfo)
    .then(res => {
      if (res.data.success == true) {
        info.articleList = res.data.data.articleList;
        pageInfo.lastId = res.data.data.lastId;
        info.total=res.data.data.total;
      }
    })
}


</script>

<template>
  <el-space fill wrap direction="vertical" :fill-ratio=100 style="width: 100%">
    <div v-for="info in info.articleList" :key="info.id">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <router-link :to="{path:'/text',query:{id:info.id}}">
              <div class="card-title">{{ info.title }}</div>
            </router-link>
            <el-tag>{{dict.tags[info.category]}}</el-tag>
          </div>
        </template>
        <router-link :to="{path:'/text',query:{id:info.id}}">
          <el-container>
        <div v-show="info.cover" style="margin-right: 20px;">
          <img :src="info.cover" 
          style="border-radius: 4px;"/>
      </div>
            
        <div class="text item">{{ info.summary }}</div>
          </el-container>
          
        </router-link>
        <div style="padding-top:1%;font-size: x-small;color:grey;"><el-icon>
            <Calendar />
          </el-icon> {{ info.createTime }}</div>
      </el-card>
    </div>
  </el-space>
  <el-pagination layout="prev, pager, next" :total="info.total" :page-size="pageInfo.pageSize"
   @prev-click="pageInfo.isNext=false" @next-click="pageInfo.isNext=true"/>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

a {
  text-decoration: none;
}

a:link,
a:visited {
  color: black;
}

.router-link-active {
  text-decoration: none;
}

.card-title{
  display: block;
    font-size: 1.5em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}

</style>
