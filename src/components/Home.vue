<script setup>
import { onMounted, reactive } from 'vue'
import { articleListQuery } from '../api'
import Aside from './Aside.vue'
import ArticleList from './ArticleList.vue'
import HomeSearch from './HomeSearch.vue'
import { dictMapQuery, getHistory } from '../api'


const info = reactive({
  articleList: [],
  total: 0,
  category: {},
  tags: {},
  pageInfo: {
    pageSize: 10,
    pageNum: 1,
    order: 'create_time',
    sort: 'desc',
    keyword: '',
    tag: '',
    category: null,
    year: null,
    month: null
  }
});

async function getDict(code) {
  let dictData = {};
  await dictMapQuery({ dictCode: code })
    .then(res => {
      if (res.data.success == true) {
        dictData = res.data.data
      }
    });
  return dictData;
}

async function getHistoryInfo() {
  let arr = [];
  await getHistory().then(res => {
    if (res.data.success) {
      arr = res.data.data
    }
  })
  return arr
}

onMounted(async () => {
  //获取字典信息  
  info.category = await getDict('wzfl')
  info.tags = await getDict('wzbq')
  info.history = await getHistoryInfo()
  getArticleList()
})

const getArticleList = () => {
  articleListQuery(info.pageInfo)
    .then(res => {
      if (res.data.success == true) {
        info.articleList = res.data.data.list
        info.total = res.data.data.total;
      }
    })
}

function handleCurrentChange() {
  getArticleList()

}

function handleSizeChange() {
  getArticleList()
}

function inputChange(value) {
  info.pageInfo.keyword = value
  getArticleList()
}

function categoryCheck(value) {
  info.pageInfo.keyword = ''
  info.pageInfo.tag = ''
  info.pageInfo.category = value
  info.year = null
  info.month = null
  getArticleList()
  info.pageInfo.category = null
}

function tagsCheck(value) {
  info.pageInfo.keyword = ''
  info.pageInfo.category = null
  info.pageInfo.tag = value
  info.pageInfo.year = null
  info.pageInfo.month = null
  getArticleList()
  info.pageInfo.tag = ''
}

function historyCheck(year, month) {
  info.pageInfo.keyword = ''
  info.pageInfo.category = null
  info.pageInfo.tag = ''
  info.pageInfo.year = year
  info.pageInfo.month = month
  getArticleList()
  info.pageInfo.year = null
  info.pageInfo.month = null
}

</script>
                 
<template>
  <el-container>
    <el-aside width="auto" style="overflow: visible;" class="aside">
      <Aside :category="info.category" :tags="info.tags" :history="info.history" @categoryCheck="categoryCheck"
        @tagsCheck="tagsCheck" @historyCheck="historyCheck"></Aside>
    </el-aside>
    <el-container>
      <el-header>
        <HomeSearch placeholder="请输入关键词" @inputChange="inputChange"></HomeSearch>
      </el-header>
      <el-main style="overflow: visible;">
        <template v-if="info.articleList.length == 0">
          <el-empty :image-size="200" />
        </template>
        <template v-if="info.articleList.length != 0">
          <ArticleList :articleList="info.articleList" :category="info.category" :tags="info.tags"></ArticleList>
          <div style="margin-top: 1em;">
            <el-pagination v-model:current-page="info.pageInfo.pageNum" v-model:page-size="info.pageInfo.pageSize"
              :page-sizes="[1, 10, 20, 30, 50, 100]" size="default" :disabled="false" :background="true"
              layout="total,sizes, prev, pager, next, jumper" :total="info.total" @size-change= "handleSizeChange()"
              @current-change="handleCurrentChange()" />
          </div>
        </template>
      </el-main>
    </el-container>
  </el-container>
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

.aside {
  padding: 20px 0 20px 20px;
}

.card-title {
  display: block;
  font-size: 1.5em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}

.card-category,
.card-tags {
  display: block;
  margin-top: 1em;
}

.el-header {
  text-align: center;
  justify-content: center;
  height: auto;
}
</style>
