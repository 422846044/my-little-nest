<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articleInfoQuery, simpleUserInfoQuery, dictMapQuery } from '../api'
import { ArrowLeft, Menu } from '@element-plus/icons-vue'
import MyRecursiveComponent from './MyRecursiveComponent.vue'
import { fa } from 'element-plus/es/locales.mjs'

const router = useRouter()
const goBack = () => {
  router.push('/home')
}

// 移动端目录显示状态
const showMobileMenu = ref(false)

// 检测是否为移动端
const isMobile = ref(false)

// 更新移动端状态
const descriptionsColumn = ref(4)
const descriptionsDirection = ref('horizontal')
const updateMobileStatus = () => {
  const width = window.innerWidth
  isMobile.value = width <= 768
  if (width <= 768) {
    descriptionsColumn.value = 1
    descriptionsDirection.value = 'vertical'
  } else if (width <= 1200) {
    descriptionsColumn.value = 2
    descriptionsDirection.value = 'horizontal'
  } else {
    descriptionsColumn.value = 4
    descriptionsDirection.value = 'horizontal'
  }
}

// 切换移动端目录显示
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// 关闭移动端目录
const closeMobileMenu = () => {
  showMobileMenu.value = false
}


let info = reactive({
  articleInfo: {
    id: '',
    title: '',
    directory: '',
    content: '',
    category: '',
    tags: [],
    author: '',
    createTime: ''
  },
  userInfo: {
    nickName: '',
    avatar: ''
  }
})


let dict = reactive({
  category: {},
  tags: {}
})

// tagsText removed

const route = useRoute()
let id = route.query.id

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

var nodeTree = reactive([])
onMounted(async () => {
  // 初始化移动端状态
  updateMobileStatus()
  
  // 添加窗口大小变化监听器
  window.addEventListener('resize', updateMobileStatus)
  
  //获取字典信息
  dict.category = await getDict('wzfl')
  dict.tags = await getDict('wzbq')
  articleInfoQuery({ id: id })
    .then(res => {
      if (res.data.success == true) {
        simpleUserInfoQuery(res.data.data.author == null ? 0 : res.data.data.author)
          .then(res => {
            info.userInfo = res.data.data
            if (info.userInfo.avatar === null || info.userInfo.avatar === '') {
              info.userInfo.avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            }
          })

        let text = res.data.data.content
        const regex = /<h[1-6]>(.*?)<\/h[1-6]>/g;
        let dirId = 1
        var match
        let lastIndex = 0
        let lastLevel = 1
        let lastValue = 1
        let baseLevel = 2
        let isFirst = true
        while ((match = regex.exec(text)) !== null) {
          let matchText = match[0]
          let node = {}
          let divEl = document.createElement('div')
          let aEl = document.createElement('a')
          aEl.innerText = match[1]
          node.info = match[1]
          let style = ''
          let id = 'articleDir' + dirId
          let href = '#' + id
          let value = 1
          //匹配成功则添加   
          if (matchText.startsWith('<h1>')) {
            text = text.replace(matchText, matchText.replace('<h1', '<h1 id="' + id + '"'))
          }
          else if (matchText.startsWith('<h2>')) {
            text = text.replace(matchText, matchText.replace('<h2', '<h2 id="' + id + '"'))
            style += 'margin-left:10px;'
            value = 2
          }
          else if (matchText.startsWith('<h3>')) {
            text = text.replace(matchText, matchText.replace('<h3', '<h3 id="' + id + '"'))
            style = 'margin-left:20px;'
            value = 3
          }
          else if (matchText.startsWith('<h4>')) {
            text = text.replace(matchText, matchText.replace('<h4', '<h4 id="' + id + '"'))
            style = 'margin-left:30px;'
            value = 4
          }
          else if (matchText.startsWith('<h5>')) {
            text = text.replace(matchText, matchText.replace('<h5', '<h5 id="' + id + '"'))
            style = 'margin-left:40px;'
            value = 5
          }
          else if (matchText.startsWith('<h6>')) {
            text = text.replace(matchText, matchText.replace('<h6', '<h6 id="' + id + '"'))
            style = 'margin-left:50px;'
            value = 6
          }
          aEl.style = style
          aEl.href = href
          node.href = href
          node.style = style
          divEl.appendChild(aEl)

          node.children = []
          if(value == 1){
            nodeTree.push(node)
            lastLevel = 1
            isFirst = false
          }else{
            // 对比当前值，若等于为同一级别，小于需要返回上一级，大于返回上一级
            if(isFirst){
              baseLevel = value
              isFirst = false
              lastValue = value
            }

            let sub = value - lastValue
            if(sub==0){

            }else if(sub<0){
              lastLevel--
            }else{
              lastLevel++
            }

            if(lastLevel==(baseLevel-1)){
              nodeTree.push(node)
            }else if(lastLevel==(baseLevel)){
              nodeTree[nodeTree.length-1].children.push(node)
            }else if(lastLevel == (baseLevel+1)){
              nodeTree[nodeTree.length-1].children[nodeTree[nodeTree.length-1].children.length-1].children.push(node)
            }else if(lastLevel == (baseLevel+2)){
              let children = nodeTree[nodeTree.length-1].children
              let children1 = children[children.length-1]
              let children2 = children1.children[children1.children.length-1]
              children2.children.push(node)
            }else if(lastLevel == (baseLevel+3)){
              let children = nodeTree[nodeTree.length-1].children
              let children1 = children[children.length-1]
              let children2 = children1.children[children1.children.length-1]
              let children3 = children2.children[children2.children.length-1]
              children3.children.push(node)
            }else if(lastLevel == (baseLevel+4)){
              let children = nodeTree[nodeTree.length-1].children
              let children1 = children[children.length-1]
              let children2 = children1.children[children1.children.length-1]
              let children3 = children2.children[children2.children.length-1]
              let children4 = children3.children[children3.children.length-1]
              children4.children.push(node)
            }
            
          }
          //document.getElementById('dirNav').appendChild(divEl)
          dirId++
          lastValue = value
        }
        res.data.data.content = text
        info.articleInfo = res.data.data

      }
    })
  //获取作者信息


})

const containerRef = ref(null)

// 组件卸载时清理事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', updateMobileStatus)
})

</script>

<template>
  <el-page-header id="text-page-header" :icon="ArrowLeft" title="上一页" @back="goBack">
    <template #content>
      <el-avatar :size="32" class="mr-3" :src="info.userInfo.avatar" style="vertical-align:text-bottom" />

      <el-text class="title">
        {{ info.articleInfo.title }}
      </el-text>
    </template>
    <el-descriptions :column="descriptionsColumn" :direction="descriptionsDirection" size="small" class="mt-4">
      <el-descriptions-item label="作者">{{ info.userInfo.nickName }}</el-descriptions-item>
      <el-descriptions-item label="分类">{{ dict.category[info.articleInfo.category] }}</el-descriptions-item>
      <el-descriptions-item label="标签">
        <template v-for="tagCode in info.articleInfo.tags">
          <el-tag size="small">{{ dict.tags[tagCode] }}</el-tag>
          <span>{{ ' ' }}</span>
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="时间">{{ info.articleInfo.createTime }}</el-descriptions-item>
    </el-descriptions>
  </el-page-header>
  
  <!-- 移动端目录按钮 -->
  <div class="mobile-menu-button" v-if="isMobile && nodeTree.length > 0">
    <el-button type="primary" @click="toggleMobileMenu" :icon="Menu" circle></el-button>
  </div>

  <!-- 移动端目录遮罩层 -->
  <div class="mobile-overlay" v-if="isMobile && showMobileMenu" @click="closeMobileMenu"></div>

  <el-container class="text-container">
    <!-- 桌面端目录 -->
    <div class="desktop-menu">
      <el-card v-if="nodeTree.length != 0">
        <template #header>
          <div class="card-header">
            <span>文章目录</span>
          </div>
        </template>
        <el-anchor :container="containerRef" direction="vertical" type="underline" :offset="60">
          <MyRecursiveComponent v-if="nodeTree && nodeTree.length" :items="nodeTree"></MyRecursiveComponent>
        </el-anchor>
      </el-card>
    </div>

    <!-- 移动端目录 -->
    <div class="mobile-menu" v-if="isMobile && showMobileMenu && nodeTree.length > 0">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>文章目录</span>
            <el-button type="text" @click="closeMobileMenu" size="small">×</el-button>
          </div>
        </template>
        <el-anchor :container="containerRef" direction="vertical" type="underline" :offset="60">
          <MyRecursiveComponent v-if="nodeTree && nodeTree.length" :items="nodeTree"></MyRecursiveComponent>
        </el-anchor>
      </el-card>
    </div>

    <el-main class="main-content">
      <el-text :ref="containerRef" id="articleText" size="large" v-html="info.articleInfo.content">
      </el-text>
    </el-main>
  </el-container>
</template>


<style scoped>
.clearTop {
  padding-top: 160px;
  margin-top: -160px;
}

.read-the-docs {
  color: #888;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  /*color: #606266;*/
  font-size: 1.5em;
  font-weight: bold;
  word-wrap: break-word;
  line-height: 1;
  margin-left: 1em;
}

a {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  color: #606266;
}

a:visited {
  background-color: transparent;
}

a:hover {
  /*font-size: large;*/
  color: black;
}

.el-page-header {
  margin-top: 1em;
}

/* 桌面端保持 Element Plus 默认换行行为 */

/* 移动端 descriptions 样式优化 */
@media (max-width: 768px) {
  :deep(.el-descriptions__body) {
    width: 100%;
  }
  :deep(.el-descriptions__cell) {
    padding: 6px 8px;
  }
  :deep(.el-descriptions__label) {
    white-space: nowrap;
  }
  :deep(.el-descriptions__content) {
    white-space: normal;
    word-break: break-word;
  }
}

/* 移动端适配样式 */
.text-container {
  position: relative;
}

.desktop-menu {
  max-width: 20%;
  position: sticky;
  top: 80px;
  height: fit-content;
}

/* 移动端隐藏桌面端目录 */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
}

.mobile-menu-button {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background-color: white;
  z-index: 1001;
  overflow-y: auto;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.main-content {
  width: 100%;
  padding: 20px;
}

/* 标签容器换行样式（桌面端单行） */
.tags-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
}
.tag-item {
  margin: 0 6px 0 0;
}
:deep(.tags-container .el-tag) {
  padding: 0 6px;
  height: 22px;
  line-height: 22px;
}

/* 桌面端标签单行省略并保持与其他项对齐 */
.tags-text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 移动端标签容器允许换行 */
@media (max-width: 768px) {
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 8px;
    white-space: normal;
    overflow: visible;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* 移动端响应式样式 */
@media (max-width: 768px) {
  .el-descriptions {
    font-size: 12px;
  }
  
  .el-descriptions-item {
    padding: 8px 4px;
  }
  
  .title {
    font-size: 1.2em;
    margin-left: 0.5em;
  }
  
  .main-content {
    padding: 10px;
  }
  
  #articleText {
    font-size: 14px;
    line-height: 1.6;
  }
}
</style>
