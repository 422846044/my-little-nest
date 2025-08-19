<template >
    <el-anchor-link v-for="item in props.items" :href="item.href" :title="item.info">
        <template #sub-link>
<!-- 递归调用自身 -->
        <MyRecursiveComponent v-if="item.children && item.children.length" :items="item.children"></MyRecursiveComponent>
        </template>
            
        
    </el-anchor-link>
</template>

<script setup>

const props = defineProps({
    items: {
        type: Array,
        default: []
    }
})

</script>