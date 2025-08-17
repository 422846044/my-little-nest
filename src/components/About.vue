<script setup>
import { toRefs, ref, reactive,h } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  User, Location, Calendar, Trophy, Star,
  Message, Plus, Document, View, ChatDotRound, Bell, Edit, Link
} from '@element-plus/icons-vue';

var props = defineProps({
  logInfoList: Array
})

// 个人信息数据
const userInfo = reactive({
  name: '淡风无痕',
  avatar: 'http://cdn.zhongyingjie.top/public/static/admin/logo.jpg',
  title: '全栈开发工程师',
  location: '江西·赣州',
  joinDate: '2024年加入',
  bio: '热爱技术，专注于前端开发和用户体验设计。喜欢分享技术心得，记录生活点滴。',
  email: 'zhongyingjie1019@163.com',
  website: 'http://zhongyingjie.top'
});

// 统计数据
const stats = reactive({
  articles: 128,
  views: 15420,
  likes: 2340,
  comments: 856
});

// 技能标签
const skills = [
  { name: 'Vue.js', level: 90, color: '#4FC08D' },
  { name: 'JavaScript', level: 88, color: '#F7DF1E' },
  { name: 'TypeScript', level: 85, color: '#3178C6' },
  { name: 'Node.js', level: 82, color: '#339933' },
  { name: 'React', level: 78, color: '#61DAFB' },
  { name: 'Python', level: 75, color: '#3776AB' }
];

// 最近动态
const activities = [
  { type: 'article', title: '发布了新文章《Vue 3 响应式原理深度解析》', time: '2小时前', icon: 'Edit' },
  { type: 'like', title: '点赞了文章《JavaScript 异步编程最佳实践》', time: '5小时前', icon: 'Star' },
  { type: 'comment', title: '评论了《前端性能优化指南》', time: '1天前', icon: 'ChatDotRound' },
  { type: 'follow', title: '关注了用户 @前端小白', time: '2天前', icon: 'User' }
];

// 社交链接
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/422846044', icon: 'link', color: '#333' },
  { name: '掘金', url: 'https://juejin.cn', icon: 'link', color: '#1e80ff' },
  { name: 'CSDN', url: 'https://csdn.net', icon: 'link', color: '#fc5531' },
  { name: '知乎', url: 'https://zhihu.com', icon: 'link', color: '#0084ff' }
];

function openLink(url) {
  window.open(url, '_blank');
}

function openEmail(url){
  ElMessageBox({
    title: '邮箱',
    message: h('p', null, [
      h('span', null, url)
    ]),
    showCancelButton: true,
    confirmButtonText: '复制',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        navigator.clipboard.writeText(url)
      }
      done()
    },
  }).then(() => {
    ElMessage({
      type: 'info',
      message: `复制成功`,
    })
  })
}
</script>

<template>
  <div class="about-container">
    <!-- 个人信息卡片 -->
    <div class="profile-section">
      <el-card class="profile-card" shadow="hover">
        <div class="profile-header">
          <div class="avatar-section">
            <el-avatar :size="120" :src="userInfo.avatar" class="profile-avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="online-status"></div>
          </div>
          <div class="info-section">
            <h1 class="user-name">{{ userInfo.name }}</h1>
            <p class="user-title">{{ userInfo.title }}</p>
            <div class="user-meta">
              <span class="meta-item">
                <el-icon><Location /></el-icon>
                {{ userInfo.location }}
              </span>
              <span class="meta-item">
                <el-icon><Calendar /></el-icon>
                {{ userInfo.joinDate }}
              </span>
            </div>
            <p class="user-bio">{{ userInfo.bio }}</p>
            <div class="contact-info">
              <el-button type="primary" size="default" class="contact-btn" @click="openEmail(userInfo.email)">
                <el-icon><Message /></el-icon>
                联系我
              </el-button>
              <el-button size="default" class="follow-btn">
                <el-icon><Plus /></el-icon>
                关注
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 统计数据 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" v-for="(value, key) in stats" :key="key">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon v-if="key === 'articles'"><Document /></el-icon>
                <el-icon v-else-if="key === 'views'"><View /></el-icon>
                <el-icon v-else-if="key === 'likes'"><Star /></el-icon>
                <el-icon v-else><ChatDotRound /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ value.toLocaleString() }}</div>
                <div class="stat-label">
                  {{ key === 'articles' ? '文章' : key === 'views' ? '浏览' : key === 'likes' ? '点赞' : '评论' }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="20">
      <!-- 技能展示 -->
      <el-col :xs="24" :lg="12">
        <el-card class="skills-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Trophy /></el-icon>
              <span>技能专长</span>
            </div>
          </template>
          <div class="skills-content">
            <div v-for="skill in skills" :key="skill.name" class="skill-item">
              <div class="skill-info">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-percent">{{ skill.level }}%</span>
              </div>
              <el-progress 
                :percentage="skill.level" 
                :color="skill.color"
                :stroke-width="8"
                :show-text="false"
                class="skill-progress"
              />
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 最近动态 -->
      <el-col :xs="24" :lg="12">
        <el-card class="activity-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Bell /></el-icon>
              <span>最近动态</span>
            </div>
          </template>
          <div class="activity-content">
            <div v-for="activity in activities" :key="activity.title" class="activity-item">
              <div class="activity-icon">
                <el-icon><Edit /></el-icon>
              </div>
              <div class="activity-info">
                <p class="activity-title">{{ activity.title }}</p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 社交链接 -->
    <div class="social-section">
      <el-card class="social-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Link /></el-icon>
            <span>社交媒体</span>
          </div>
        </template>
        <div class="social-links">
          <el-button 
            v-for="social in socialLinks" 
            :key="social.name"
            class="social-btn"
            size="large"
            @click="openLink(social.url)"
          >
            <span class="social-icon" v-if="social.name === 'GitHub'">
              <svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor"><path d="M511.6 76.3C264.6 76.3 64 277.5 64 525.2c0 198.1 128.3 366.2 306.2 425.7 22.4 4.2 30.6-9.7 30.6-21.5 0-10.6-.4-45.5-.6-82.5-124.6 27.1-151-53.2-151-53.2-20.4-52-49.8-65.8-49.8-65.8-40.7-27.8 3.1-27.2 3.1-27.2 45 3.2 68.7 46.2 68.7 46.2 40 68.6 104.9 48.8 130.5 37.3 4-29 15.6-48.8 28.4-60-99.5-11.3-204.2-49.7-204.2-221.3 0-48.9 17.5-88.9 46.2-120.2-4.6-11.3-20-56.8 4.4-118.5 0 0 37.6-12.1 123.2 45.9 35.7-9.9 74-14.9 112.1-15.1 38 .2 76.4 5.2 112.1 15.1 85.5-58 123.1-45.9 123.1-45.9 24.5 61.7 9.1 107.2 4.5 118.5 28.7 31.3 46.1 71.3 46.1 120.2 0 171.9-104.8 209.9-204.6 221 16 13.8 30.2 41.1 30.2 82.8 0 59.8-.5 108.1-.5 122.8 0 11.9 8 25.9 30.7 21.5C831.8 891.2 960 723.2 960 525.2c0-247.7-200.6-448.9-448.4-448.9z"/></svg>
            </span>
            <span class="social-icon" v-else-if="social.name === '掘金'">
              <svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820.5c-205.2 0-372.5-167.3-372.5-372.5S306.8 139.5 512 139.5 884.5 306.8 884.5 512 717.2 884.5 512 884.5zm-44.8-222.7l-144.7-144.7 144.7-144.7 44.8 44.8-99.9 99.9 99.9 99.9-44.8 44.8zm89.6 0l-44.8-44.8 99.9-99.9-99.9-99.9 44.8-44.8 144.7 144.7-144.7 144.7z"/></svg>
            </span>
            <span class="social-icon" v-else-if="social.name === 'CSDN'">
              <svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820.5c-205.2 0-372.5-167.3-372.5-372.5S306.8 139.5 512 139.5 884.5 306.8 884.5 512 717.2 884.5 512 884.5zm-44.8-222.7l-144.7-144.7 144.7-144.7 44.8 44.8-99.9 99.9 99.9 99.9-44.8 44.8zm89.6 0l-44.8-44.8 99.9-99.9-99.9-99.9 44.8-44.8 144.7 144.7-144.7 144.7z"/></svg>
            </span>
            <span class="social-icon" v-else-if="social.name === '知乎'">
              <svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820.5c-205.2 0-372.5-167.3-372.5-372.5S306.8 139.5 512 139.5 884.5 306.8 884.5 512 717.2 884.5 512 884.5zm-44.8-222.7l-144.7-144.7 144.7-144.7 44.8 44.8-99.9 99.9 99.9 99.9-44.8 44.8zm89.6 0l-44.8-44.8 99.9-99.9-99.9-99.9 44.8-44.8 144.7 144.7-144.7 144.7z"/></svg>
            </span>
            {{ social.name }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: var(--el-bg-color-page);
  min-height: calc(100vh - 120px);
}

/* 个人信息卡片 */
.profile-card {
  margin-bottom: 24px;
  border-radius: 16px;
  border: 1px solid var(--el-border-color-lighter);
}

.profile-header {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.avatar-section {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  border: 4px solid var(--el-color-primary-light-8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.online-status {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: var(--el-color-success);
  border: 4px solid white;
  border-radius: 50%;
}

.info-section {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-success));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.user-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.user-bio {
  margin: 0 0 24px 0;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  font-size: 16px;
}

.contact-info {
  display: flex;
  gap: 12px;
}

.contact-btn {
  border-radius: 20px;
  padding: 12px 24px;
}

.follow-btn {
  border-radius: 20px;
  padding: 12px 24px;
}

/* 统计数据 */
.stats-section {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--el-color-primary-light-9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-color-primary);
  font-size: 24px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

/* 卡片通用样式 */
.skills-card,
.activity-card,
.social-card {
  border-radius: 16px;
  border: 1px solid var(--el-border-color-lighter);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.header-icon {
  color: var(--el-color-primary);
  font-size: 18px;
}

/* 技能展示 */
.skills-content {
  padding: 8px 0;
}

.skill-item {
  margin-bottom: 20px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.skill-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.skill-percent {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.skill-progress {
  border-radius: 4px;
}

/* 最近动态 */
.activity-content {
  padding: 8px 0;
}

.activity-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.activity-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--el-color-primary-light-9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-color-primary);
  flex-shrink: 0;
}

.activity-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.activity-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* 社交链接 */
.social-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.social-btn {
  border-radius: 20px;
  padding: 12px 20px;
  border: 1px solid var(--el-border-color);
  background: white;
  transition: all 0.2s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .about-container {
    padding: 15px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .user-name {
    font-size: 24px;
  }
  
  .user-meta {
    justify-content: center;
    gap: 16px;
  }
  
  .contact-info {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .profile-avatar {
    width: 80px !important;
    height: 80px !important;
  }
  
  .user-name {
    font-size: 20px;
  }
  
  .user-title {
    font-size: 16px;
  }
  
  .contact-btn,
  .follow-btn {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .social-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
