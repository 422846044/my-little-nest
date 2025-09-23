<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articleInfoQuery, simpleUserInfoQuery, dictMapQuery } from '../api'
import { ArrowLeft, Menu } from '@element-plus/icons-vue'
import MyRecursiveComponent from './MyRecursiveComponent.vue'
import { fa } from 'element-plus/es/locales.mjs'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 可以选择其他主题
import { ElMessage } from 'element-plus'

const router = useRouter()
const goBack = () => {
  //检查是否有历史记录可以返回
  if (window.history.length > 1) {
    router.go((-1 - hashCount))
  } else {
    // 如果没有历史记录，则返回首页
    router.push('/home')
  }
}

let oldHash = ''
let hashCount = 0

function getNum() {
  setTimeout(() => {
    let hash = route.hash
    if (hash != '' && hash != oldHash) {
      oldHash = hash
      hashCount++
    }
  }, 100)
}

// 移动端目录显示状态
const showMobileMenu = ref(false)

// 检测是否为移动端
const isMobile = ref(false)

// 更新移动端状态
const updateMobileStatus = () => {
  const width = window.innerWidth
  isMobile.value = width <= 768
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
  articleInfoQuery(id)
    .then(res => {
      if (res.data.success == true) {
        simpleUserInfoQuery(res.data.data.author == null ? 1 : res.data.data.author)
          .then(res => {
            info.userInfo = res.data.data
            if (info.userInfo.avatar == null || info.userInfo.avatar == '') {
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
          if (value == 1) {
            nodeTree.push(node)
            lastLevel = 1
            isFirst = false
          } else {
            // 对比当前值，若等于为同一级别，小于需要返回上一级，大于返回上一级
            if (isFirst) {
              baseLevel = 2
              isFirst = false
              lastValue = value
            }

            let sub = value - lastValue
            if (sub == 0) {

            } else if (sub < 0) {
              lastLevel--
            } else {
              lastLevel++
            }

            if (lastLevel == (baseLevel - 1)) {
              nodeTree.push(node)
            } else if (lastLevel == (baseLevel)) {
              nodeTree[nodeTree.length - 1].children.push(node)
            } else if (lastLevel == (baseLevel + 1)) {
              nodeTree[nodeTree.length - 1].children[nodeTree[nodeTree.length - 1].children.length - 1].children.push(node)
            } else if (lastLevel == (baseLevel + 2)) {
              let children = nodeTree[nodeTree.length - 1].children
              let children1 = children[children.length - 1]
              let children2 = children1.children[children1.children.length - 1]
              children2.children.push(node)
            } else if (lastLevel == (baseLevel + 3)) {
              let children = nodeTree[nodeTree.length - 1].children
              let children1 = children[children.length - 1]
              let children2 = children1.children[children1.children.length - 1]
              let children3 = children2.children[children2.children.length - 1]
              children3.children.push(node)
            } else if (lastLevel == (baseLevel + 4)) {
              let children = nodeTree[nodeTree.length - 1].children
              let children1 = children[children.length - 1]
              let children2 = children1.children[children1.children.length - 1]
              let children3 = children2.children[children2.children.length - 1]
              let children4 = children3.children[children3.children.length - 1]
              children4.children.push(node)
            }
          }
          //document.getElementById('dirNav').appendChild(divEl)
          dirId++
          lastValue = value
        }
        res.data.data.content = text
        info.articleInfo = res.data.data
        
        // 初始化代码高亮
        initCodeHighlight()
      }
    })
  //获取作者信息


})

const containerRef = ref(null)

// 初始化代码高亮
const initCodeHighlight = () => {
  nextTick(() => {
    
    // 处理代码块高亮和复制按钮
    const codeBlocks = document.querySelectorAll('#articleText pre code')
    
    codeBlocks.forEach((block, index) => {
      // 应用语法高亮
      hljs.highlightElement(block)
      
      // 为代码块添加复制按钮
      const pre = block.parentElement
      if (pre && !pre.querySelector('.code-copy-btn')) {
        // 确保 pre 有 position: relative
        pre.style.position = 'relative'
        pre.style.overflow = 'visible' // 确保按钮可见
        
        const copyBtn = document.createElement('button')
        copyBtn.className = 'code-copy-btn'
        copyBtn.style.cssText = `
          position: absolute;
          top: -16px;
          right: -8px;
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0.7;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        `
        
        copyBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `
        copyBtn.title = '复制代码'
        
        // 添加悬停效果
        copyBtn.addEventListener('mouseenter', () => {
          copyBtn.style.background = 'rgba(255, 255, 255, 1)'
          copyBtn.style.opacity = '1'
          copyBtn.style.transform = 'scale(1.1) translateY(-1px)'
          copyBtn.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)'
        })
        
        copyBtn.addEventListener('mouseleave', () => {
          if (!copyBtn.classList.contains('copied')) {
            copyBtn.style.background = 'rgba(255, 255, 255, 0.95)'
            copyBtn.style.opacity = '0.7'
            copyBtn.style.transform = 'scale(1)'
            copyBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
          }
        })
        
        copyBtn.addEventListener('click', async (e) => {
          e.preventDefault()
          e.stopPropagation()
          
          try {
            const text = block.textContent || block.innerText
            await navigator.clipboard.writeText(text)
            
            // 显示成功状态
            copyBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            `
            copyBtn.style.background = '#10b981'
            copyBtn.style.color = 'white'
            copyBtn.classList.add('copied')
            ElMessage.success('复制成功')
            
            // 2秒后恢复原状
            setTimeout(() => {
              copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              `
              copyBtn.style.background = 'rgba(255, 255, 255, 0.95)'
              copyBtn.style.color = '#64748b'
              copyBtn.classList.remove('copied')
            }, 2000)
          } catch (err) {
            console.error('复制失败:', err)
            ElMessage.error('复制失败')
          }
        })
        
        pre.appendChild(copyBtn)
      }
    })
    
    // 处理行内代码（如果有的话）
    const inlineCodes = document.querySelectorAll('#articleText code:not(pre code)')
  
  })
}

// 组件卸载时清理事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', updateMobileStatus)
})

</script>

<template>
  <el-page-header id="text-page-header" :icon="ArrowLeft" title="上一页" @back="goBack"
    style="padding-left: 5%; padding-right: 5%;">
    <template #content>
      <el-avatar :size="32" class="mr-3" :src="info.userInfo.avatar" style="vertical-align:text-bottom" />

      <el-text class="title">
        {{ info.articleInfo.title }}
      </el-text>
    </template>
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
        <el-anchor :container="containerRef" direction="vertical" type="underline" :offset="60" @click="getNum()">
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
        <el-anchor :container="containerRef" direction="vertical" type="underline" :offset="60" @click="getNum()">
          <MyRecursiveComponent v-if="nodeTree && nodeTree.length" :items="nodeTree"></MyRecursiveComponent>
        </el-anchor>
      </el-card>
    </div>

    <el-main class="main-content">
      <!-- 文章信息 -->
      <!-- <div class="article-info">
        <div class="info-item">
          <span class="info-label">作者：</span>
          <span class="info-value">{{ info.userInfo.nickName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">分类：</span>
          <span class="info-value">{{ dict.category[info.articleInfo.category] }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">标签：</span>
          <span class="info-value">
            <template v-for="tagCode in info.articleInfo.tags">
              <el-tag size="small">{{ dict.tags[tagCode] }}</el-tag>
              <span>{{ ' ' }}</span>
            </template>
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">时间：</span>
          <span class="info-value">{{ info.articleInfo.createTime }}</span>
        </div>
      </div> -->
      <el-descriptions column="4">
        <el-descriptions-item label="作者：">{{ info.userInfo.nickName }}</el-descriptions-item>
        <el-descriptions-item label="分类：">{{ dict.category[info.articleInfo.category] }}</el-descriptions-item>
        <el-descriptions-item label="标签：">
          <template v-for="tagCode in info.articleInfo.tags">
            <el-tag size="small">{{ dict.tags[tagCode] }}</el-tag>
            <span>{{ ' ' }}</span>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="时间：">
          {{ info.articleInfo.createTime }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider  style="margin:0 0 24px 0;" />

      <el-text :ref="containerRef" id="articleText" size="large" v-html="info.articleInfo.content">
      </el-text>
    </el-main>

    <!-- 右侧空白区域 -->
    <div class="right-sidebar"></div>
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

/* 移动端适配样式 */
.text-container {
  position: relative;
  display: flex;
  width: 90%;
  margin: 0 auto;
}

.desktop-menu {
  flex: 1;
  position: sticky;
  top: 40px;
  height: fit-content;
  padding: 20px 10px 20px 0;
}

.main-content {
  flex: 3;
  padding: 20px;
}

.right-sidebar {
  flex: 1;
  padding: 20px 0 20px 10px;
}

/* 移动端隐藏桌面端目录和右侧栏 */
@media (max-width: 768px) {

  .desktop-menu,
  .right-sidebar {
    display: none;
  }

  .text-container {
    flex-direction: column;
  }

  .main-content {
    flex: 1;
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

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

/* 文章信息样式 */
.article-info {
  background-color: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  border-left: 4px solid var(--el-color-primary);
  border: 1px solid var(--el-border-color-light);
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: var(--el-text-color-regular);
  min-width: 60px;
  margin-right: 8px;
}

.info-value {
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

/* 移动端响应式样式 */
@media (max-width: 768px) {
  .title {
    font-size: 1.2em;
    margin-left: 0.5em;
  }

  .main-content {
    padding: 10px;
  }

  .article-info {
    padding: 12px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .info-label {
    margin-bottom: 4px;
    min-width: auto;
  }

  #articleText {
    font-size: 14px;
    line-height: 1.6;
  }
}

/* 代码块样式 */
#articleText pre {
  position: relative;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

#articleText pre code {
  background: transparent !important;
  padding: 0 !important;
  border-radius: 0 !important;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  display: block;
}

/* 代码块复制按钮 */
.code-copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: scale(0.9);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7);
  z-index: 10;
}

/* 悬停时显示按钮 */
#articleText pre:hover .code-copy-btn {
  opacity: 1;
  transform: scale(1);
}

.code-copy-btn:hover {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-color: rgba(99, 102, 241, 0.4);
  transform: scale(1.05) translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 
              0 2px 8px rgba(99, 102, 241, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.code-copy-btn:active {
  transform: scale(0.95) translateY(0);
  transition: transform 0.1s ease;
}

.code-copy-btn.copied {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #059669;
  color: white;
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.code-copy-btn svg {
  width: 16px;
  height: 16px;
  color: #64748b;
  transition: all 0.2s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.code-copy-btn:hover svg {
  color: #4f46e5;
  transform: scale(1.1);
}

.code-copy-btn.copied svg {
  color: white;
  transform: scale(1.1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* 代码块样式微调 */
/* 代码块样式 */
#articleText pre {
  position: relative;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px; /* 恢复正常内边距 */
  margin: 20px 0;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 
              inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

/* 黑暗模式适配 */
@media (prefers-color-scheme: dark) {
  .code-copy-btn {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
    border-color: rgba(71, 85, 105, 0.4);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .code-copy-btn:hover {
    background: linear-gradient(135deg, #1e293b, #0f172a);
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 
                0 2px 8px rgba(99, 102, 241, 0.2);
  }
  
  .code-copy-btn svg {
    color: #94a3b8;
  }
  
  .code-copy-btn:hover svg {
    color: #818cf8;
  }
  
  #articleText pre {
    background: linear-gradient(135deg, #1e293b, #0f172a);
    border-color: #334155;
    color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
}

/* 行内代码样式 */
#articleText code:not(pre code) {
  background-color: #f1f3f4;
  color: #d73a49;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
  border: 1px solid #e1e4e8;
}

/* 行内代码容器 */
.inline-code-wrapper {
  position: relative;
  display: inline-block;
  margin: 0 2px;
}

.inline-code-wrapper:hover .inline-code-copy-btn {
  opacity: 1;
  visibility: visible;
}

/* 行内代码复制按钮 */
.inline-code-copy-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #d0d7de;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.inline-code-copy-btn:hover {
  background: #f6f8fa;
  transform: scale(1.1);
}

.inline-code-copy-btn svg {
  color: #656d76;
}

/* 图片样式 - 限制宽度适应容器 */
#articleText img {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
  display: block;
  margin: 16px auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  object-fit: contain;
}

/* 确保所有图片都受到限制 */
.main-content img,
el-text img {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
}

#articleText img:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 图片容器样式（如果有的话）*/
#articleText figure {
  margin: 20px 0;
  text-align: center;
}

#articleText figure img {
  margin: 0 auto 8px auto;
}

#articleText figcaption {
  font-size: 14px;
  color: #666;
  font-style: italic;
  margin-top: 8px;
}

/* 黑暗模式适配 */
@media (prefers-color-scheme: dark) {
  #articleText pre {
    background-color: #1e1e1e;
    border-color: #3e3e3e;
    color: #d4d4d4;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

/* 移动端代码块优化 */
@media (max-width: 768px) {
  #articleText pre {
    padding: 16px;
    margin: 16px -10px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
}
</style>

<style>
/* 全局样式 - 仅针对v-html渲染的TinyMCE内容 */
#articleText img,
#articleText p img,
#articleText div img {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
  display: block !important;
  margin: 16px auto !important;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  object-fit: contain;
}

/* 针对TinyMCE生成的各种容器 */
[id="articleText"] img {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
}

/* 仅针对文章内容区域的图片 */
.main-content img[src] {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
}
</style>
