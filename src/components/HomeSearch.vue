<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
const searchInput = ref('')

const props = defineProps({
    placeholder:{
        type: String,
        default: ""
    }
})

const emits = defineEmits(["inputChange"])

function search(){
    emits('inputChange',searchInput.value)
}

</script>

<template>
    <div class="input-div">
        <el-input
      v-model="searchInput"
      :placeholder="props.placeholder"
      clearable
    >
    <template #append>
        <el-button :icon="Search" @click="search" />
      </template>
    </el-input>
    </div>
    
</template>


<style scoped>


.el-input {

    margin-top: 1.5em;
    width: auto;

  height: 3em;

  align-self: center;

  display: flex;

}
:deep(.el-input__wrapper) {

  margin-left: 5px;

  font-size: 15px;

  background-color: rgba(255, 255, 255, 0);/*覆盖原背景颜色，设置成透明 */

  border-radius: 4px;

  box-shadow: 2 2 2 2px;

}

:deep(.el-input__inner) {

  margin-left: 10px;

}

.icon-search:hover {

  color: #409efc; /* 改变颜色 */

  cursor: pointer; /* 将指针样式改为小手 */

}

</style>