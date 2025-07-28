<script setup>
import { reactive, onMounted } from 'vue'
import { Folder, Clock } from '@element-plus/icons-vue'

const props = defineProps({
    articleList: {
        type: Array,
        default: []
    },
    category:{
        type: Object,
        default:{}
    },
    tags:{
        type: Object,
        default:{}
    }
})

</script>

<template>
    <el-space fill wrap direction="vertical" :fill-ratio=100 style="width: 100%">
        <div v-for="(info,index) in articleList" :key="index">
            <el-card class="box-card article-card">
                <template #header>
                    <div class="card-header">
                        <router-link :to="{ path: '/text', query: { id: info.id } }">
                            <el-text class="card-title">{{ info.title }}</el-text>
                        </router-link>
                        <div class="article-meta">
                            <div class="meta-left">
                                <el-tag effect="dark" round size="small" class="category-tag">
                                    <el-icon><Folder /></el-icon>
                                    {{ category[info.category] }}
                                </el-tag>
                                <span class="article-time">
                                    <el-icon><Clock /></el-icon>
                                    {{ info.createTime }}
                                </span>
                            </div>
                            <div class="meta-right" v-if="info.tags.length > 0">
                                <el-space wrap size="small">
                                    <el-tag 
                                        v-for="(item,index) in info.tags" 
                                        :key="index" 
                                        size="small"
                                        effect="plain"
                                        class="tag-item"
                                    >
                                        {{ tags[item] }}
                                    </el-tag>
                                </el-space>
                            </div>
                        </div>
                    </div>
                </template>
                <router-link :to="{ path: '/text', query: { id: info.id } }">
                    <el-container class="article-content">
                        <div v-show="info.cover" class="article-cover">
                            <img :src="info.cover" alt="文章封面" />
                        </div>
                        <div class="article-summary">
                            <el-text>{{ info.summary }}</el-text>
                        </div>
                    </el-container>
                </router-link>
                <div class="article-time">
                    <el-icon><Calendar /></el-icon> {{ info.createTime }}
                </div>
            </el-card>
        </div>
    </el-space>
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

.article-card {
    margin-bottom: 15px;
}

.card-title {
    display: block;
    font-size: 1.5em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    line-height: 1.4;
}

.card-category,
.card-tags {
    display: block;
    margin-top: 0.5em;
}

.article-content {
    margin-bottom: 10px;
}

.article-cover {
    margin-right: 20px;
    flex-shrink: 0;
}

.article-cover img {
    border-radius: 4px;
    width: 200px;
    height: auto;
}

.article-summary {
    align-self: baseline;
    flex: 1;
}

.article-time {
    padding-top: 1%;
    font-size: x-small;
    color: grey;
    display: flex;
    align-items: center;
    gap: 4px;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .article-card {
        margin-bottom: 10px;
    }
    
    .card-title {
        font-size: 1.2em;
        line-height: 1.3;
    }
    
    .card-category {
        margin-top: 8px;
    }
    
    .card-tags {
        margin-top: 6px;
    }
    
    .article-content {
        flex-direction: column;
        margin-bottom: 8px;
    }
    
    .article-cover {
        margin-right: 0;
        margin-bottom: 10px;
        width: 100%;
    }
    
    .article-cover img {
        width: 100%;
        max-width: 300px;
        height: auto;
    }
    
    .article-summary {
        align-self: stretch;
    }
    
    .article-time {
        font-size: 11px;
        padding-top: 8px;
    }
}

@media (max-width: 480px) {
    .card-title {
        font-size: 1.1em;
    }
    
    .card-category .el-tag,
    .card-tags .el-tag {
        font-size: 11px;
        height: 22px;
        line-height: 22px;
    }
    
    .article-cover img {
        max-width: 100%;
    }
    
    .article-summary .el-text {
        font-size: 13px;
        line-height: 1.4;
    }
    
    .article-time {
        font-size: 10px;
    }
}
</style>