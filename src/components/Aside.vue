<script setup>

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
    console.log(key)
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
    <el-space direction="vertical">
        <el-card class="box-card frosted-glass1" style="width: 250px;">
            <template #header>
                <div class="card-header">
                    <span>分类</span>
                </div>
            </template>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5em;">
                <el-link :type="getRandomElement(typeArr)" :underline="false" v-for="(value, key) in category"
                    @click="categoryCheck(key)">
                    {{ value }}
                </el-link>
            </div>
        </el-card>


        <el-card class="box-card" style="width: 250px">
            <template #header>
                <div class="card-header">
                    <span>标签</span>
                </div>
            </template>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5em;">
                <el-link :type="getRandomElement(typeArr)" :underline="false" v-for="(value, key) in tags"
                    @click="tagsCheck(key)">
                    {{ value }}
                </el-link>
            </div>
        </el-card>

        <el-card class="box-card" style="width: 250px">
            <template #header>
                <div class="card-header">
                    <span>历史归档</span>
                </div>
            </template>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5em;">
                <el-timeline>
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

<style>
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

.el-timeline {
    padding-left: 0;
}
</style>