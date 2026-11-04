<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import Upload from '../components/Upload.vue'
import Gallery from '../components/Gallery.vue'
import Config from '../components/Config.vue'

import { reactive, ref, computed } from 'vue'

let areaFlag = ref(0)
const receiveAreaFlag = (data: any) => {
  areaFlag.value = data
}

</script>

<template>
  <main class="main-wrap">
    <NavBar @changeAreaFlag="receiveAreaFlag"></NavBar>
    <Upload v-if="areaFlag == 0"></Upload>
    <Gallery v-else-if="areaFlag == 1"></Gallery>
    <Config v-else-if="areaFlag == 2"></Config>
  </main>
</template>

<style lang="less" scoped>
.main-wrap {
  display: flex;
  align-items: stretch;
}

@media screen and (max-width:800px) {
  .main-wrap {
    flex-flow: column nowrap;
  }
}
</style>