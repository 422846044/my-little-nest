<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articleInfoQuery,simpleUserInfoQuery,dictMapQuery } from '../api'
import { ArrowLeft } from '@element-plus/icons-vue'
const router = useRouter()
const goBack = () => {
  router.push('/home')
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
    nickName:'',
    avatar:''
  }
})


let dict = reactive({
  category: {},
  tags: {}
})

const route = useRoute()
let id = route.query.id

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

var nodeTree = reactive([])
onMounted(async () => {
  //获取字典信息
  dict.category = await getDict('wzfl')
  dict.tags =  await getDict('wzbq')
  articleInfoQuery({ id: id })
    .then(res => {
      if (res.data.success == true) {
          simpleUserInfoQuery({userId:res.data.data.author == null ? 0: res.data.data.author})
        .then(res=>{
          info.userInfo=res.data.data
          if(info.userInfo.avatar===null || info.userInfo.avatar === ''){
            info.userInfo.avatar='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
          }
        })
        
        let text = res.data.data.content
        const regex = /<h[1-6]>(.*?)<\/h[1-6]>/g;
        let dirId = 1
        var match
        
        while ((match = regex.exec(text)) !== null) {
          let matchText = match[0]
          let node = {}
          let divEl = document.createElement('div')
          let aEl = document.createElement('a')
          aEl.innerText=match[1]
          node.info=match[1]
          let style = ''
          let id = 'articleDir'+dirId
          let href='#'+id
          //匹配成功则添加   
          if (matchText.startsWith('<h1>')) {
            text = text.replace(matchText, matchText.replace('<h1', '<h1 id="' + id + '"'))
          }
          else if (matchText.startsWith('<h2>')) {
            text = text.replace(matchText, matchText.replace('<h2', '<h2 id="' + id + '"'))
            style += 'margin-left:10px;'
          }
          else if (matchText.startsWith('<h3>')) {
            text = text.replace(matchText, matchText.replace('<h3', '<h3 id="' + id + '"'))
            style = 'margin-left:20px;'
          }
          else if (matchText.startsWith('<h4>')) {
            text = text.replace(matchText, matchText.replace('<h4', '<h4 id="' + id + '"'))
            style = 'margin-left:30px;'
          }
          else if (matchText.startsWith('<h5>')) {
            text = text.replace(matchText, matchText.replace('<h5', '<h5 id="' + id + '"'))
            style = 'margin-left:40px;'
          }
          else if (matchText.startsWith('<h6>')) {
            text = text.replace(matchText, matchText.replace('<h6', '<h6 id="' + id + '"'))
            style = 'margin-left:50px;'
          }
          aEl.style = style
          aEl.href=href
          node.href=href
          node.style=style
          divEl.appendChild(aEl)
          nodeTree.push(node)
          //document.getElementById('dirNav').appendChild(divEl)
          dirId++
        }
        res.data.data.content = text
        info.articleInfo = res.data.data
        
      }
    })
  //获取作者信息


})

</script>

<template>
  <el-page-header id="text-page-header" :icon="ArrowLeft" title="上一页" @back="goBack">
    <template #content>
        <el-avatar
          :size="32"
          class="mr-3"
          :src="info.userInfo.avatar"
          style="vertical-align:text-bottom"
        />

      <el-text class="title">
        {{ info.articleInfo.title }}
      </el-text>
    </template>
    <el-descriptions :column="4" size="small" class="mt-4">
      <el-descriptions-item label="作者">{{info.userInfo.nickName}}</el-descriptions-item>
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
  <el-container>
    <el-affix :offset="60" style="max-width: 20%;">
      <el-card v-if="nodeTree.length!=0">
        <template #header >
          <div class="card-header">
            <span>文章目录</span>
          </div>
        </template>
        <nav id="dirNav" v-for="node in nodeTree">
          <div >
            <a :href="node.href" :style="node.style">{{ node.info }}</a>
          </div>
        </nav>
      </el-card>
    </el-affix>




    <el-main>
      <el-text id="articleText" size="large" v-html="info.articleInfo.content">
      </el-text>
    </el-main>
  </el-container>
</template>


<style scoped>
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

a:hover{
  font-size: large;
  color:black;
}

.el-page-header{
  margin-top: 1em;
}

</style>
