<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import UploadInstance from 'element-plus'
import { uploadNginx } from '../api'

const isProcessing = ref(false);
const processStatus = ref('');
const canUpload = ref(false);

const radio = ref('0');



const uploadRef = ref(UploadInstance);

const submitUpload = async () => {

  isProcessing.value = true;
  processStatus.value = '正在上传文件...';
  uploadRef.value.submit()

}


function uploadFileReq(file) {
  try {
    if (file.file.type !== 'application/x-zip-compressed') {
      processStatus.value = '文件格式有误';
      ElMessage.error('不支持当前格式的文件');
      return;
    }

    let data = new FormData()
    data.append('file', file.file)
    uploadNginx(radio.value, data).then(res => {
      if (res.data.code == 200) {
        processStatus.value = `处理完成`;
        ElMessage.success(processStatus.value);
      } else {
        processStatus.value = '处理过程中出错';
        ElMessage.error(err.message);
      }
    })

  } catch (err) {
    processStatus.value = '处理过程中出错';
  } finally {
    isProcessing.value = false;
  }

}

function onExceed() {
  ElMessage.error('只能上传一个文件');
}

function onProgress() {
  ElMessage.info('正在上传');
}

function onSuccess() {
  ElMessage.success('上传成功');
}

function onError() {
  ElMessage.error('上传失败');
}

function onChange() {
  canUpload.value = true
}

function onRemove() {
  canUpload.value = false
}
const fn=(e)=>{
  console.log(e);
}

</script>

<template>
  <div class="container" style="width: 30%;">
    <el-card class="box-card" >
      <template #header>
        <div class="card-header">
          <span>{{'原型图更新'}}</span>
        </div>
      </template>


      <div style="margin-bottom: 1em;">
        <el-radio-group v-model="radio" @change="fn">
          <el-radio label="0" border>小程序</el-radio>
          <el-radio label="1" border>后台</el-radio>
        </el-radio-group>
      </div>

      <el-upload ref="uploadRef" class="upload-demo" action="#" :limit="1" :auto-upload="false"
        :http-request="uploadFileReq" :on-exceed="onExceed" :on-progress="onProgress" :on-success="onSuccess"
        :on-error="onError" :on-change="onChange" :on-remove="onRemove">

        <template #trigger>
          <div>
            <el-button type="primary">
              选择文件
            </el-button>
          </div>
        </template>

        <el-button class="ml-3" type="success" :disabled="!canUpload || isProcessing" :loading="isProcessing"
          @click="submitUpload">
          {{ isProcessing ? '上传中...' : '上传文件' }}
        </el-button>
      </el-upload>

      <div v-if="processStatus" :class="['status', { 'processing': isProcessing }]">
        {{ processStatus }}
      </div>

      <div v-if="processStatus == '处理完成'" :class="['status', { 'processing': isProcessing }]">
        <el-link type="primary" :href="radio == '0' ? 'http://zhongyingjie.top/axure' : 'http://zhongyingjie.top/hyht'" target="_blank">前往查看</el-link>
      </div>

    </el-card>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.label {
  min-width: 80px;
}

.path-display {
  flex: 1;
  padding: 8px 12px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 4px;
  min-height: 20px;
}

.action-group {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.status {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  background-color: var(--el-fill-color-lighter);
}

.ml-3 {
  margin-left: .75rem;
}

.processing {
  color: var(--el-color-primary);
}
</style>
