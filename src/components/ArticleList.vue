<script setup>
import { reactive, onMounted } from 'vue'

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
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <router-link :to="{ path: '/text', query: { id: info.id } }">
                            <div class="card-title">{{ info.title }}</div>
                        </router-link>
                        <div class="card-category">
                            分类：
                            <el-tag effect="dark" round>
                                {{ category[info.category] }}
                            </el-tag>
                        </div>
                        <div class="card-tags" v-if="info.tags.length > 0">
                            <el-space wrap size="small">
                                <el-tag v-for="(item,index) in info.tags" :key="index">{{ tags[item] }}</el-tag>
                            </el-space>
                        </div>
                    </div>
                </template>
                <router-link :to="{ path: '/text', query: { id: info.id } }">
                    <el-container>
                        <div v-show="info.cover" style="margin-right: 20px;">
                            <img :src="info.cover" style="border-radius: 4px;" />
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
    margin-top: 0.5em;
}


</style>