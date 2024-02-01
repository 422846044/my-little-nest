<script setup>
import { inject, watchEffect, ref, getCurrentInstance } from 'vue';
import { Search } from '@element-plus/icons-vue'
var props = defineProps({
  qqNum: Number,
})
var emit = defineEmits(['updateQQNum'])
var qqNum = ref(props.qqNum);

const { proxy } = getCurrentInstance()
watchEffect(() => {
  emit('updateQQNum', qqNum.value);
});
var axios = inject('$axios');
const query = inject('queryLog');

function updateToken() {
  proxy.$prompt('请输入新的token', '更新token', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    if (value != null && value.trim != '') {
      axios.get(process.env.VUE_APP_BASE_API + '/updateToken', { params: { qqNum: qqNum.value, token: token } }).then(function (res) {
        proxy.$message({
          type: 'success',
          message: `${err.data.msg}`,
        })
      }).catch(function (err) {
        proxy.$message({
          type: 'error',
          message: `${err.data.msg}`,
        })
      })
    } else {
      proxy.$message({
        type: 'warning',
        message: `输入不能为空`,
      })
    }
  }).catch(() => {
    proxy.$message({
      type: 'info',
      message: '取消输入',
    })
  });

}


function retry() {
  if (props.qqNum.trim != '') {
    axios.get(process.env.VUE_APP_BASE_API + '/retryTask', { params: { qqNum: qqNum.value } }).then(function (res) {
      confirm(res.data.msg);
    }).catch(function (err) {
      alert(err.data.msg);
    })
  }
}

function clearCooike() {
  document.cookie = "qqNum='';expires=" + (new Date(1));
  location.reload();
}


</script>

<template>
  <el-row :gutter="10" justify="center">
    <el-input v-model="qqNum" placeholder="请输入查询的QQ号" :prefix-icon="Search" style="width: 10%;" />
    <el-button class="button" id="search" @click="query">查询</el-button>
    <el-button class="button" id="retry" @click="retry">补签</el-button>
    <el-button class="button" id="update" @click="updateToken">更新token</el-button>
    <el-button class="button" id="clear" @click="clearCooike">清除账号cookie记录</el-button>
  </el-row>
</template>

<style scoped>
.button {
  margin-left: 6px;
}
</style>
