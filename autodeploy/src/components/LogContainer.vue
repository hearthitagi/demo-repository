<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const logs = ref([])

const addLog = (event) => {
  const { message, type } = event.detail
  logs.value.push({
    message: `[${new Date().toLocaleTimeString()}] ${message}`,
    type
  })
}

const clearLogs = () => {
  logs.value = []
}

onMounted(() => {
  window.addEventListener('addLog', addLog)
})

onUnmounted(() => {
  window.removeEventListener('addLog', addLog)
})
</script>

<template>
  <div class="log-container">
    <div class="log-header">
      <h3>部署日志</h3>
      <el-button size="small" @click="clearLogs">清空日志</el-button>
    </div>
    <div class="log-content">
      <div
        v-for="(log, index) in logs"
        :key="index"
        :class="['log-entry', log.type]"
      >
        {{ log.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-container {
  margin-top: 20px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  padding: 15px;
  background-color: #f8f9fa;
  display: flex;
  flex-flow: column nowrap;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.log-header h3 {
  margin: 0;
  color: var(--text-color);
}

.log-content {
  flex: 1;
  overflow-y: auto;
}

.log-entry {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  font-size: 14px;
}

.log-entry.info {
  background-color: var(--info-color);
  color: #1890ff;
}

.log-entry.error {
  background-color: var(--error-color);
  color: #ff4d4f;
}

.log-entry.success {
  background-color: var(--success-color);
  color: #52c41a;
}

/* 自定义滚动条样式 */
.log-content::-webkit-scrollbar {
  width: 8px;
}

.log-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.log-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.log-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 