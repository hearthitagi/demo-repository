<template>
  <div class="deploy-container">
    <el-card class="deploy-card">
      <template #header>
        <div class="card-header">
          <span>组合部署</span>
        </div>
      </template>
      <el-form :model="form" :label-width="100">
        <el-form-item label="组合名称" required>
          <el-select v-model="form.name" placeholder="选择部署组合名称" class="compose-select" :loading="loading"
            @change="handleComposeChange">
            <el-option v-for="item in composeOptions" :key="item.name" :label="item.name" :value="item.name">
              <div class="compose-option">
                <span>{{ item.name }}</span>
                <el-tag size="small" type="info">{{ item.description || '无描述' }}</el-tag>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据库IP" required>
          <el-input v-model="form.dbIP" placeholder="数据库IP"></el-input>
        </el-form-item>
      </el-form>

      <div class="deploy-actions">
        <el-button type="primary" :disabled="deployButtonDisabled || saveButtonDisabled" @click="deploy" :loading="deployButtonDisabled"
          class="deploy-button">
          {{ deployButtonDisabled ? "部署中..." : "开始部署" }}
        </el-button>

        <el-button type="success" :disabled="deployButtonDisabled || saveButtonDisabled" @click="downloadImages" :loading="saveButtonDisabled"
          class="save-button">
          {{ saveButtonDisabled ? "导出中..." : "下载镜像" }}
        </el-button>
      </div>

      <transition name="fade">
        <div v-if="statusMessage" :class="['status-message', statusType]">
          <el-icon :class="statusType">
            <component :is="statusType === 'success' ? 'Check' : 'Warning'" />
          </el-icon>
          <span>{{ statusMessage }}</span>
        </div>
      </transition>
    </el-card>

    <transition name="slide-fade">
      <LogContainer v-if="showLogContainer" class="log-container" />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LogContainer from "./LogContainer.vue";

const baseURL = import.meta.env.DEV ? '/api' : '';
const loading = ref(false);
const form = ref({
  name: "",
  dbIP: "192.168.10.14"
});
const showLogContainer = ref(false);
const statusMessage = ref("");
const statusType = ref("");
const deployButtonDisabled = ref(false);
const saveButtonDisabled = ref(false);

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

// 数据管理
const composeOptions = computed(() => {
  if(props.activeTab) return JSON.parse(localStorage.getItem("tableData") || "[]");
});
const tableData = ref(JSON.parse(localStorage.getItem('tableData') || '[]'));

// 计算属性
const selectedCompose = computed(() => {
  return tableData.value.find(item => item.name === form.value.name);
});

// 方法
const handleComposeChange = () => {
  statusMessage.value = "";
  statusType.value = "";
};

const downloadImages = async () => {
  if (!form.value.name) {
    statusMessage.value = "请先选择部署组合名称";
    statusType.value = "error";
    return;
  }

  try {
    const response = await fetch(`${baseURL}/select-directory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.success) {
      startDownload(data.directory);
    } else {
      statusMessage.value = data.message || '选择目录失败';
      statusType.value = 'error';
    }
  } catch (error) {
    statusMessage.value = '选择目录失败: ' + error.message;
    statusType.value = 'error';
  }
};

const startDownload = async (directory) => {
  saveButtonDisabled.value = true;
  showLogContainer.value = true;
  statusMessage.value = "";
  statusType.value = "";

  try {
    const response = await fetch(`${baseURL}/save-images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        composeName: form.value.name,
        composeData: selectedCompose.value,
        saveDirectory: directory
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let hasError = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const jsonStr = line.substring(6);
            const event = JSON.parse(jsonStr);

            if (event.status === "active") {
              window.dispatchEvent(
                new CustomEvent("addLog", {
                  detail: { message: event.message, type: "info" },
                })
              );
            } else if (event.status === "completed") {
              window.dispatchEvent(
                new CustomEvent("addLog", {
                  detail: { message: event.message, type: "success" },
                })
              );
            } else if (event.status === "failed") {
              window.dispatchEvent(
                new CustomEvent("addLog", {
                  detail: { message: event.message, type: "error" },
                })
              );
              hasError = true;
              statusMessage.value = event.message;
              statusType.value = "error";
              break;
            }
          } catch (e) {
            window.dispatchEvent(
              new CustomEvent("addLog", {
                detail: { message: `解析消息失败: ${line}`, type: "error" },
              })
            );
            hasError = true;
            statusMessage.value = "服务器返回了无效的数据格式";
            statusType.value = "error";
            break;
          }
        }
      }

      if (hasError) break;
    }

    if (!hasError) {
      statusMessage.value = "镜像导出成功";
      statusType.value = "success";
    }
  } catch (error) {
    statusMessage.value = `镜像导出失败: ${error.message}`;
    statusType.value = "error";
    window.dispatchEvent(
      new CustomEvent("addLog", {
        detail: { message: `镜像导出失败: ${error.message}`, type: "error" },
      })
    );
  } finally {
    saveButtonDisabled.value = false;
  }
};

const deploy = async () => {
  if (!form.value.name) {
    statusMessage.value = "请选择部署组合名称";
    statusType.value = "error";
    return;
  }

  if (!form.value.dbIP) {
    statusMessage.value = "请输入数据库IP";
    statusType.value = "error";
    return;
  }

  deployButtonDisabled.value = true;
  showLogContainer.value = true;
  statusMessage.value = "";
  statusType.value = "";

  try {
    const response = await fetch(`${baseURL}/deploy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        composeName: form.value.name,
        composeData: selectedCompose.value,
        dbIP: form.value.dbIP
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let hasError = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const jsonStr = line.substring(6);
            const event = JSON.parse(jsonStr);

            if (event.status === "active") {
              window.dispatchEvent(
                new CustomEvent("addLog", {
                  detail: { message: event.message, type: "info" },
                })
              );
            } else if (event.status === "completed") {
              window.dispatchEvent(
                new CustomEvent("addLog", {
                  detail: { message: event.message, type: "success" },
                })
              );
            } else if (event.status === "failed") {
              window.dispatchEvent(
                new CustomEvent("addLog", {
                  detail: { message: event.message, type: "error" },
                })
              );
              hasError = true;
              statusMessage.value = event.message;
              statusType.value = "error";
              break;
            }
          } catch (e) {
            window.dispatchEvent(
              new CustomEvent("addLog", {
                detail: { message: `解析消息失败: ${line}`, type: "error" },
              })
            );
            hasError = true;
            statusMessage.value = "服务器返回了无效的数据格式";
            statusType.value = "error";
            break;
          }
        }
      }

      if (hasError) break;
    }

    if (!hasError) {
      statusMessage.value = "部署成功";
      statusType.value = "success";
    }
  } catch (error) {
    statusMessage.value = `部署失败: ${error.message}`;
    statusType.value = "error";
    window.dispatchEvent(
      new CustomEvent("addLog", {
        detail: { message: `部署失败: ${error.message}`, type: "error" },
      })
    );
  } finally {
    deployButtonDisabled.value = false;
  }
};

</script>

<style scoped>
.deploy-container {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.deploy-card {
  flex: 0 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.compose-select {
  width: 100%;
}

.compose-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deploy-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.deploy-button,
.save-button {
  min-width: 120px;
}

.log-container {
  flex: 1;
  min-height: 0;
}

.status-message {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.status-message.success {
  background-color: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.status-message.error {
  background-color: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>