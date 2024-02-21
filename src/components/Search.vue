<script setup>
import { ref,inject, reactive, getCurrentInstance,onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue'
import { djcTaskQuery,djcUpdateToken,djcTaskRetry } from '../api'
const ruleFormRef = ref()

var cookie = document.cookie;
var cookieList = cookie.split("; ");

let emits = defineEmits(['changeInfoList'])

let form = reactive({qqNum:''});

for (let lengthKey in cookieList) {
  var keyValue = cookieList[lengthKey].split("=");
  var key=keyValue[0];
  var value=keyValue[1];
  if(value!='undefinde'&&value!=''){
    form.qqNum = value;
  }
}
const { proxy } = getCurrentInstance()


const queryLog = () =>{
  djcTaskQuery({qqNum:form.qqNum})
  .then(res=>{
    if(res.data.success){
      emits('changeInfoList',res.data.data)
      document.cookie="qqNum="+form.qqNum;
    }
  });
}

const query = async (formEl)=>{
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
        queryLog()
    }
})
}

onMounted(()=>{
  if(form.qqNum){
    queryLog()
  }
})


var axios = inject('$axios');

function updateToken() {
  proxy.$prompt('请输入新的token', '更新token', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    if (value != null && value.trim != '') {
      djcUpdateToken({ qqNum: form.qqNum, token: token })
      .then(function (res) {
        proxy.$message({
          type: 'success',
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
    djcTaskRetry({ qqNum: form.qqNum })
    .then(function (res) {
      proxy.$message({
        type:'success',
        message:`${res.data.msg}`
      })
    })
  }
}

function clearCooike() {
  document.cookie = "qqNum='';expires=" + (new Date(1));
  location.reload();
}


const rules = reactive({
  qqNum: [
    { required: true, message: '请输入QQ号' },
    { type: 'number', message: 'QQ号必须为数字' }
  ]
})


</script>

<template>
  <div style="text-align: center;">
    <el-form label-position="left" :model="form" :rules="rules" ref="ruleFormRef" :inline="true">
    <el-form-item label="QQ号" prop="qqNum">
      <el-input  type="text" v-model.number="form.qqNum" autocomplete="off" placeholder="请输入查询的QQ号" :prefix-icon="Search" />
    </el-form-item>
    <el-form-item>
      <el-button class="button" id="search" @click="query(ruleFormRef)">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button class="button" id="retry" @click="retry">补签</el-button>
    </el-form-item>
    <el-form-item>
      <el-button class="button" id="update" @click="updateToken">更新token</el-button>
    </el-form-item>
    <el-form-item>
      <el-button class="button" id="clear" @click="clearCooike">清除账号cookie记录</el-button>
    </el-form-item>
  </el-form>
  </div>
  
    
</template>

<style scoped>
</style>
