<script setup>
import { Collection, PriceTag, Calendar } from '@element-plus/icons-vue'

const props = defineProps({
    category: {
        type: Object,
        default: {}
    },
    tags: {
        type: Object,
        default: {}
    },
    history: {
        type: Array,
        default: []
    }
})

const emits = defineEmits(['categoryCheck', 'tagsCheck', 'historyCheck'])

function onChange(key) {
}

const typeArr = ['primary', 'default', 'success', 'warning', 'danger', 'info']

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function categoryCheck(value) {
    emits('categoryCheck', value)
}

function tagsCheck(value) {
    emits('tagsCheck', value)
}

function historyCheck(year,month) {
    emits('historyCheck', year,month)
}

// 示例使用
const myArray = [1, 2, 3, 4, 5];
const randomElement = getRandomElement(myArray);

</script>

<template>
    <el-space direction="vertical" class="aside-space">
        <el-card class="box-card frosted-glass1 category-card">
            <template #header>
                <div class="card-header">
                    <el-icon class="card-icon"><Collection /></el-icon>
                    <span class="card-title">分类</span>
                </div>
            </template>
            <div class="card-content">
                <el-link :type="getRandomElement(typeArr)" :underline="false" v-for="(value, key) in category"
                    @click="categoryCheck(key)" class="category-link">
                    {{ value }}
                </el-link>
            </div>
        </el-card>

        <el-card class="box-card tags-card">
            <template #header>
                <div class="card-header">
                    <el-icon class="card-icon"><PriceTag /></el-icon>
                    <span class="card-title">标签</span>
                </div>
            </template>
            <div class="card-content">
                <el-link :type="getRandomElement(typeArr)" :underline="false" v-for="(value, key) in tags"
                    @click="tagsCheck(key)" class="tag-link">
                    {{ value }}
                </el-link>
            </div>
        </el-card>

        <el-card class="box-card aside-card history-card">
            <template #header>
                <div class="card-header">
                    <el-icon class="card-icon"><Calendar /></el-icon>
                    <span class="card-title">历史归档</span>
                </div>
            </template>
            <div class="card-content">
                <el-timeline class="history-timeline">
                    <el-timeline-item v-for="(value, index) in history" :key="index"
                        :timestamp="value.year + '-' + value.month">
                        <el-link type="info" :underline="false" @click="historyCheck(value.year,value.month)">
                            文章数量：{{ value.number }}
                        </el-link>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </el-card>
    </el-space>
</template>

<style scoped>
.frosted-glass {
    background: inherit;
    -webkit-filter: blur(5px);
    -moz-filter: blur(5px);
    -ms-filter: blur(5px);
    -o-filter: blur(5px);
    filter: blur(5px);
    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);
}

.frosted-glass1 {
    backdrop-filter: blur(20px);
}

.aside-space {
    width: 100%;
}

.box-card {
    width: 250px;
}

.card-content {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
}

.category-link,
.tag-link {
    margin: 2px;
}

.history-timeline {
    padding-left: 0;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: var(--el-text-color-primary);
}

.card-icon {
    font-size: 16px;
    color: #409eff;
    display: flex;
    align-items: center;
}

.card-title {
    color: var(--el-text-color-regular);
    font-size: 15px;
    line-height: 1;
    display: flex;
    align-items: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .aside-space {
        flex-direction: column;
        gap: 15px;
    }
    
    .box-card {
        width: 100%;
    }
    
    .card-header .card-title {
        font-size: 14px;
    }
    
    .card-content {
        gap: 0.3em;
    }
    
    .category-link,
    .tag-link {
        font-size: 12px;
        margin: 1px;
    }
    
    .history-timeline .el-timeline-item {
        padding-bottom: 10px;
    }
    
    .history-timeline .el-timeline-item__timestamp {
        font-size: 11px;
    }
    
    .history-timeline .el-link {
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .aside-space {
        flex-direction: column;
    }
    
    .box-card {
        width: 100%;
    }
    
    .card-header span {
        font-size: 13px;
    }
    
    .category-link,
    .tag-link {
        font-size: 11px;
    }
    
    .history-timeline .el-timeline-item__timestamp {
        font-size: 10px;
    }
    
    .history-timeline .el-link {
        font-size: 11px;
    }
}
</style>

<style>
/* 抽屉内样式 - 全局样式 */
.el-drawer .aside-space {
    flex-direction: column !important;
    gap: 15px !important;
}

.el-drawer .box-card {
    width: 100% !important;
    min-width: unset !important;
}

.el-drawer .aside-space .el-space__item {
    width: 100% !important;
}
</style>