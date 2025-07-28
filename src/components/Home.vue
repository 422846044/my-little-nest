<script setup>
import { onMounted, reactive, ref } from 'vue'
import { articleListQuery } from '../api'
import Aside from './Aside.vue'
import ArticleList from './ArticleList.vue'
import HomeSearch from './HomeSearch.vue'
import { dictMapQuery, getHistory } from '../api'
import { Menu } from '@element-plus/icons-vue'

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

const isMobile = ref(false);
const drawerVisible = ref(false);

// 检测屏幕尺寸
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768;
}

// 监听窗口大小变化
window.addEventListener('resize', checkScreenSize);
checkScreenSize();

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
  // 移动端选择后关闭抽屉
  if (isMobile.value) {
    drawerVisible.value = false;
  }
}

function tagsCheck(value) {
  info.pageInfo.keyword = ''
  info.pageInfo.category = null
  info.pageInfo.tag = value
  info.pageInfo.year = null
  info.pageInfo.month = null
  getArticleList()
  info.pageInfo.tag = ''
  // 移动端选择后关闭抽屉
  if (isMobile.value) {
    drawerVisible.value = false;
  }
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
  // 移动端选择后关闭抽屉
  if (isMobile.value) {
    drawerVisible.value = false;
  }
}

</script>
                 
<template>
  <el-container class="home-container">
    <!-- 桌面端侧边栏 -->
    <el-aside v-if="!isMobile" width="auto" style="overflow: visible;" class="aside">
      <Aside :category="info.category" :tags="info.tags" :history="info.history" @categoryCheck="categoryCheck"
        @tagsCheck="tagsCheck" @historyCheck="historyCheck"></Aside>
    </el-aside>
    
    <el-container class="main-container">
      <!-- 移动端顶部操作栏 -->
      <div v-if="isMobile" class="mobile-header">
        <el-button 
          type="primary" 
          :icon="Menu" 
          circle 
          size="default"
          @click="drawerVisible = true"
          class="filter-button"
        />
        <div class="mobile-search">
          <HomeSearch placeholder="请输入关键词" @inputChange="inputChange"></HomeSearch>
        </div>
      </div>
      
      <!-- 桌面端搜索栏 -->
      <el-header v-if="!isMobile" class="search-header">
        <HomeSearch placeholder="请输入关键词" @inputChange="inputChange"></HomeSearch>
      </el-header>
      
      <el-main style="overflow: visible;" class="content-main">
        <template v-if="info.articleList.length == 0">
          <el-empty :image-size="200" />
        </template>
        <template v-if="info.articleList.length != 0">
          <ArticleList :articleList="info.articleList" :category="info.category" :tags="info.tags"></ArticleList>
          <div style="margin-top: 1em;" class="pagination-wrapper">
            <el-pagination v-model:current-page="info.pageInfo.pageNum" v-model:page-size="info.pageInfo.pageSize"
              :page-sizes="[1, 10, 20, 30, 50, 100]" size="default" :disabled="false" :background="true"
              layout="total,sizes, prev, pager, next, jumper" :total="info.total" @size-change= "handleSizeChange()"
              @current-change="handleCurrentChange()" />
          </div>
        </template>
      </el-main>
    </el-container>

    <!-- 移动端抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="筛选条件"
      direction="ltr"
      size="85%"
      :with-header="true"
    >
      <template #header>
        <h3 style="margin: 0; color: var(--el-text-color-primary);">
          <el-icon style="margin-right: 8px; color: var(--el-color-primary);"><Menu /></el-icon>
          筛选条件
        </h3>
      </template>
      <div class="drawer-content">
        <Aside :category="info.category" :tags="info.tags" :history="info.history" @categoryCheck="categoryCheck"
          @tagsCheck="tagsCheck" @historyCheck="historyCheck" class="drawer-aside"></Aside>
      </div>
    </el-drawer>
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

.home-container {
}

.aside {
  padding: 20px 0 20px 20px;
}

.main-container {
  flex: 1;
}

.search-header {
  text-align: center;
  justify-content: center;
  height: auto;
  padding: 20px;
}

.content-main {
  padding: 0 20px 20px 20px;
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

.pagination-wrapper {
  display: flex;
  justify-content: center;
}

/* 移动端样式 */
.mobile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  position: sticky;
  top: 60px;
  z-index: 99;
}

.filter-button {
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.mobile-search {
  flex: 1;
}

.drawer-content {
  padding: 0 10px;
}

/* 抽屉内侧边栏样式 */
.drawer-aside :deep(.aside-space) {
  flex-direction: column !important;
  gap: 15px !important;
}

.drawer-aside :deep(.box-card) {
  width: 100% !important;
  min-width: unset !important;
}

.drawer-aside :deep(.aside-space) {
  flex-wrap: nowrap !important;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
    max-width: none;
  }
  
  .main-container {
    order: 1;
  }
  
  .content-main {
    padding: 10px;
  }
  
  .pagination-wrapper {
    margin-top: 15px;
  }
  
  .pagination-wrapper .el-pagination {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .mobile-header {
    padding: 10px 15px;
    gap: 8px;
  }
  
  .content-main {
    padding: 5px;
  }
  
  .pagination-wrapper .el-pagination {
    font-size: 12px;
  }
}
</style>
