<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" tab-position="left" class="main-tabs">
      <el-tab-pane name="deploy" label="docker部署">
        <Depoly :active-tab="activeTab" />
      </el-tab-pane>
      <el-tab-pane name="compose" label="组合管理">
        <Compose />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Compose from "./components/Compose.vue";
import Depoly from "./components/Depoly.vue";

const activeTab = ref('deploy');
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  background-color: var(--el-bg-color-page);
}
.main-tabs {
  height: 100%;
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
}
</style>
