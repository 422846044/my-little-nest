<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import UploadInstance from 'element-plus'
import { uploadNginx } from '../api'
import { Upload, UploadFilled, Shop, Setting, Loading, CircleCheck, CircleClose, View } from '@element-plus/icons-vue'

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
}

</script>

<template>
  <div class="page-container">
    <div class="upload-wrapper">
      <el-card class="upload-card">
        <template #header>
          <div class="card-header">
            <h3 class="card-title">
              <el-icon class="title-icon"><Upload /></el-icon>
              原型图更新
            </h3>
          </div>
        </template>

        <!-- 选择类型 -->
        <div class="radio-section">
          <h4 class="section-title">选择类型</h4>
          <el-radio-group v-model="radio" @change="fn" class="radio-group">
            <el-radio label="0" border class="radio-item">
              <el-icon><Shop /></el-icon>
              小程序
            </el-radio>
            <el-radio label="1" border class="radio-item">
              <el-icon><Setting /></el-icon>
              后台
            </el-radio>
          </el-radio-group>
        </div>

        <!-- 上传区域 -->
        <div class="upload-section">
          <h4 class="section-title">上传文件</h4>
          <el-upload 
            ref="uploadRef" 
            class="upload-area" 
            action="#" 
            :limit="1" 
            :auto-upload="false"
            :http-request="uploadFileReq" 
            :on-exceed="onExceed" 
            :on-progress="onProgress" 
            :on-success="onSuccess"
            :on-error="onError" 
            :on-change="onChange" 
            :on-remove="onRemove"
            drag
          >
            <template #trigger>
              <div class="upload-trigger">
                <el-icon class="upload-icon"><UploadFilled /></el-icon>
                <div class="upload-text">
                  <p class="upload-title">点击选择文件</p>
                  <p class="upload-hint">或将文件拖拽到此处</p>
                  <p class="upload-format">支持 .zip 格式文件</p>
                </div>
              </div>
            </template>

            <div class="upload-actions">
              <el-button 
                type="success" 
                size="large"
                :disabled="!canUpload || isProcessing" 
                :loading="isProcessing"
                @click="submitUpload"
                class="upload-btn"
              >
                <el-icon><Upload /></el-icon>
                {{ isProcessing ? '上传中...' : '开始上传' }}
              </el-button>
            </div>
          </el-upload>
        </div>

        <!-- 状态显示 -->
        <div v-if="processStatus" class="status-section">
          <div :class="['status-message', { 'processing': isProcessing }]">
            <el-icon v-if="isProcessing" class="loading-icon"><Loading /></el-icon>
            <el-icon v-else-if="processStatus === '处理完成'" class="success-icon"><CircleCheck /></el-icon>
            <el-icon v-else class="error-icon"><CircleClose /></el-icon>
            {{ processStatus }}
          </div>

          <div v-if="processStatus === '处理完成'" class="result-section">
            <el-button 
              type="primary" 
              size="large"
              @click="window.open(radio === '0' ? 'http://zhongyingjie.top/axure' : 'http://zhongyingjie.top/hyht', '_blank')"
              class="view-btn"
            >
              <el-icon><View /></el-icon>
              前往查看
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: calc(100vh - 120px);
  padding: 20px;
  background: var(--el-bg-color-page);
}

.upload-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.upload-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--el-border-color-lighter);
}

.card-header {
  text-align: center;
  padding: 0;
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.title-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.radio-section,
.upload-section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-regular);
}

.radio-group {
  display: flex;
  gap: 12px;
  width: 100%;
}

.radio-item {
  flex: 1;
  margin: 0 !important;
  text-align: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.radio-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.upload-area {
  width: 100%;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  border: 2px dashed var(--el-border-color);
  border-radius: 12px;
  background: var(--el-fill-color-lighter);
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-trigger:hover {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.upload-icon {
  font-size: 48px;
  color: var(--el-color-primary);
  margin-bottom: 16px;
}

.upload-text {
  text-align: center;
}

.upload-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin: 0 0 4px 0;
}

.upload-hint {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin: 0 0 8px 0;
}

.upload-format {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.upload-actions {
  margin-top: 16px;
  text-align: center;
}

.upload-btn {
  min-width: 120px;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 500;
}

.status-section {
  margin-top: 24px;
  text-align: center;
}

.status-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.processing {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border: 1px solid var(--el-color-primary-light-7);
}

.loading-icon {
  animation: rotate 1s linear infinite;
}

.success-icon {
  color: var(--el-color-success);
}

.error-icon {
  color: var(--el-color-danger);
}

.result-section {
  margin-top: 16px;
}

.view-btn {
  min-width: 140px;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 500;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-container {
    padding: 15px;
  }
  
  .upload-card {
    border-radius: 12px;
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .title-icon {
    font-size: 20px;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .radio-item {
    padding: 12px;
  }
  
  .upload-trigger {
    padding: 30px 15px;
  }
  
  .upload-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }
  
  .upload-title {
    font-size: 15px;
  }
  
  .upload-hint {
    font-size: 13px;
  }
  
  .upload-format {
    font-size: 11px;
  }
  
  .upload-btn,
  .view-btn {
    width: 100%;
    max-width: 280px;
  }
  
  .status-message {
    font-size: 14px;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 10px;
  }
  
  .card-title {
    font-size: 16px;
    flex-direction: column;
    gap: 4px;
  }
  
  .section-title {
    font-size: 14px;
  }
  
  .radio-item {
    padding: 10px;
    font-size: 14px;
  }
  
  .upload-trigger {
    padding: 25px 10px;
  }
  
  .upload-icon {
    font-size: 36px;
  }
  
  .upload-title {
    font-size: 14px;
  }
  
  .upload-btn,
  .view-btn {
    height: 40px;
    font-size: 14px;
  }
}
</style>
