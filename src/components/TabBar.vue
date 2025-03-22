<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item replace to="/home" icon="home-o">
      首页
    </van-tabbar-item>
    <van-tabbar-item replace to="/bill" icon="orders-o">
      账单
    </van-tabbar-item>
    <van-tabbar-item replace to="/report" icon="chart-trending-o">
      报表
    </van-tabbar-item>
    <van-tabbar-item replace to="/profile" icon="user-o">
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(0)

// 根据当前路由设置激活的标签
const routeMap: Record<string, number> = {
  '/home': 0,
  '/bill': 1,
  '/report': 2,
  '/profile': 3
}

active.value = routeMap[route.path] || 0
</script>

<style scoped>
.van-tabbar {
  border-top: 1px solid #f5f5f5;
}
</style>

<script lang="ts">
export default {
  name: 'TabBar'
}
</script> 