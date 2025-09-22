<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articleListQuery } from '../api'
import Aside from './Aside.vue'
import ArticleList from './ArticleList.vue'
import HomeSearch from './HomeSearch.vue'
import { dictMapQuery, getHistory } from '../api'
import { Menu } from '@element-plus/icons-vue'
import { ElMessageBox,ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const info = reactive({
  articleList: [],
  total: 0,
  category: {},
  tags: {},
  pageInfo: {
    pageSize: parseInt(route.query.pageSize) || 10,
    pageNum: parseInt(route.query.pageNum) || 1,
    order: route.query.order || 'create_time',
    sort: route.query.sort || 'desc',
    keyword: route.query.keyword || '',
    tag: route.query.tag || '',
    category: route.query.category ? parseInt(route.query.category) : null,
    year: route.query.year ? parseInt(route.query.year) : null,
    month: route.query.month ? parseInt(route.query.month) : null
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
  await dictMapQuery(code)
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
  //校验关键字长度
  if(info.pageInfo.keyword&&info.pageInfo.keyword.length > 20){
    ElMessage.error('搜索关键词长度最大为20')
    return
  }
  
  // 更新 URL 查询参数
  const query = {}
  if (info.pageInfo.pageNum !== 1) query.pageNum = info.pageInfo.pageNum
  if (info.pageInfo.pageSize !== 10) query.pageSize = info.pageInfo.pageSize
  if (info.pageInfo.keyword) query.keyword = info.pageInfo.keyword
  if (info.pageInfo.tag) query.tag = info.pageInfo.tag
  if (info.pageInfo.category) query.category = info.pageInfo.category
  if (info.pageInfo.year) query.year = info.pageInfo.year
  if (info.pageInfo.month) query.month = info.pageInfo.month
  if (info.pageInfo.order !== 'create_time') query.order = info.pageInfo.order
  if (info.pageInfo.sort !== 'desc') query.sort = info.pageInfo.sort
  
  router.replace({ query })
  
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
  // 分页后滚动到顶部
  scrollToTop()
}

function handleSizeChange() {
  getArticleList()
  // 分页后滚动到顶部
  scrollToTop()
}

// 滚动到顶部的函数
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function inputChange(value) {
  info.pageInfo.keyword = value
  info.pageInfo.pageNum = 1 // 搜索时重置到第一页
  getArticleList()
}

function resetFilters() {
  // 清除所有筛选条件
  info.pageInfo.keyword = ''
  info.pageInfo.category = null
  info.pageInfo.tag = ''
  info.pageInfo.year = null
  info.pageInfo.month = null
  info.pageInfo.pageNum = 1
  getArticleList()
}

function categoryCheck(value) {
  info.pageInfo.keyword = ''
  info.pageInfo.tag = ''
  info.pageInfo.category = value
  info.pageInfo.year = null
  info.pageInfo.month = null
  info.pageInfo.pageNum = 1 // 筛选时重置到第一页
  getArticleList()
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
  info.pageInfo.pageNum = 1 // 筛选时重置到第一页
  getArticleList()
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
  info.pageInfo.pageNum = 1 // 筛选时重置到第一页
  getArticleList()
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
          <el-button type="info" plain @click="resetFilters" class="reset-button">重置</el-button>
        </div>
      </div>
      
      <!-- 桌面端搜索栏 -->
      <el-header v-if="!isMobile" class="search-header">
        <div class="search-container">
          <HomeSearch placeholder="请输入关键词" @inputChange="inputChange"></HomeSearch>
          <el-button type="info" plain @click="resetFilters" class="reset-button">重置</el-button>
        </div>
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

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 12px;
}

.search-container :deep(.input-div) {
  flex: 1;
}

.mobile-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-search :deep(.input-div) {
  flex: 1;
}

.reset-button {
  flex-shrink: 0;
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
