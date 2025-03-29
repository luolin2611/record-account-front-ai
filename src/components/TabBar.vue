<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item replace to="/home" icon="home-o">
      首页
    </van-tabbar-item>
    <van-tabbar-item replace to="/bill" icon="orders-o">
      账单
    </van-tabbar-item>
    <van-tabbar-item replace to="/ai" class="ai-tab">
      <template #icon>
        <div class="ai-icon">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path stroke="currentColor" stroke-width="2" fill="none"
              d="M12,2 L2,7 L12,12 L22,7 L12,2 Z M2,17 L12,22 L22,17 M2,12 L12,17 L22,12" />
          </svg>
        </div>
      </template>
      AI
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
  '/ai': 2,
  '/report': 3,
  '/profile': 4
}

active.value = routeMap[route.path] || 0
</script>

<style lang="less" scoped>
.van-tabbar {
  border-top: 1px solid #f5f5f5;
}

.ai-tab {
  .ai-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    margin-bottom: 4px;
    
    svg {
      transition: all 0.3s;
    }
  }

  &.van-tabbar-item--active {
    .ai-icon {
      color: var(--van-tabbar-item-active-color);
      
      svg {
        transform: scale(1.1);
      }
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'TabBar'
}
</script> 