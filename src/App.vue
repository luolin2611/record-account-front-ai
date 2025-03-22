<template>
  <div class="app">
    <router-view />
    <tab-bar v-if="showTabBar" />
  </div>
</template>

<script lang="ts" setup>
import TabBar from './components/TabBar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showTabBar = computed(() => {
  // 只在指定页面显示 TabBar
  return route.meta.showTabBar === true
})
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  background: #f7f8fa;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;

  .app-container {
    min-height: 100%;
    padding-bottom: 50px;
  }
}

.app {
  min-height: 100vh;
  background: #f7f8fa;
}
</style> 