<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const sourceDirectory = ref(null);
const outputDirectory = ref(null);
const isProcessing = ref(false);
const processStatus = ref('');

// 处理目录选择
const handleSourceSelect = async () => {
  try {
    const dirHandle = await window.showDirectoryPicker();
    sourceDirectory.value = dirHandle;
    processStatus.value = '';
  } catch (err) {
    if (err.name !== 'AbortError') {
      ElMessage.error('选择源目录失败');
    }
  }
};

const handleOutputSelect = async () => {
  try {
    const dirHandle = await window.showDirectoryPicker();
    outputDirectory.value = dirHandle;
    processStatus.value = '';
  } catch (err) {
    if (err.name !== 'AbortError') {
      ElMessage.error('选择输出目录失败');
    }
  }
};

// 递归处理目录
async function* getFilesRecursively(dirHandle) {
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'directory') {
      yield* getFilesRecursively(entry);
    } else if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.mp4')) {
      yield { file: entry, path: entry.name };
    }
  }
}

// 执行处理
const executeProcess = async () => {
  if (!sourceDirectory.value || !outputDirectory.value) {
    ElMessage.warning('请先选择源目录和输出目录');
    return;
  }

  isProcessing.value = true;
  processStatus.value = '正在处理文件...';
  let processedCount = 0;

  try {
    for await (const { file, path } of getFilesRecursively(sourceDirectory.value)) {
      // 创建与文件同名的目录
      const dirName = path.slice(0, -4); // 移除.mp4后缀
      let newDirHandle;
      try {
        newDirHandle = await outputDirectory.value.getDirectoryHandle(dirName, { create: true });
      } catch (err) {
        ElMessage.error(`创建目录 ${dirName} 失败`);
        continue;
      }

      // 复制文件
      try {
        const fileData = await file.getFile();
        const newFileHandle = await newDirHandle.getFileHandle(file.name, { create: true });
        const writable = await newFileHandle.createWritable();
        await writable.write(fileData);
        await writable.close();
        processedCount++;
      } catch (err) {
        ElMessage.error(`处理文件 ${file.name} 失败`);
      }
    }

    processStatus.value = `处理完成！共处理 ${processedCount} 个文件`;
    ElMessage.success(processStatus.value);
  } catch (err) {
    processStatus.value = '处理过程中出错';
    ElMessage.error(err.message);
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>MP4文件处理工具（将目录下的所有视频文件复制到指定目录）</span>
        </div>
      </template>
      
      <div class="input-group">
        <span class="label">源目录：</span>
        <div class="path-display">
          {{ sourceDirectory ? '已选择目录' : '未选择目录' }}
        </div>
        <el-button type="primary" @click="handleSourceSelect">
          选择目录
        </el-button>
      </div>

      <div class="input-group">
        <span class="label">输出目录：</span>
        <div class="path-display">
          {{ outputDirectory ? '已选择目录' : '未选择目录' }}
        </div>
        <el-button type="primary" @click="handleOutputSelect">
          选择目录
        </el-button>
      </div>

      <div class="action-group">
        <el-button 
          type="success" 
          :disabled="!sourceDirectory || !outputDirectory || isProcessing"
          :loading="isProcessing"
          @click="executeProcess"
        >
          {{ isProcessing ? '处理中...' : '执行处理' }}
        </el-button>
      </div>

      <div v-if="processStatus" :class="['status', { 'processing': isProcessing }]">
        {{ processStatus }}
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

.processing {
  color: var(--el-color-primary);
}
</style>
