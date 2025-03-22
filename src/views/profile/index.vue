<template>
  <div class="profile">
    <div class="user-info">
      <van-image
        round
        width="64"
        height="64"
        :src="userInfo.avatar"
        class="avatar"
      />
      <div class="info">
        <div class="name">{{ userInfo.name }}</div>
        <div class="id">ID: {{ userInfo.id }}</div>
      </div>
    </div>

    <div class="menu-list">
      <van-cell-group>
        <van-cell title="预算设置" is-link />
        <van-cell title="账单导出" is-link />
        <van-cell title="消息通知" is-link />
      </van-cell-group>

      <van-cell-group class="mt-10">
        <van-cell title="帮助中心" is-link />
        <van-cell title="关于我们" is-link />
      </van-cell-group>

      <van-cell-group class="mt-10">
        <van-cell title="退出登录" is-link class="logout" @click="handleLogout" />
      </van-cell-group>
    </div>

    <van-dialog
      v-model:show="showLogoutConfirm"
      title="退出登录"
      show-cancel-button
      @confirm="confirmLogout"
    >
      <div class="logout-confirm">确定要退出登录吗？</div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const showLogoutConfirm = ref(false)

const userInfo = ref({
  name: '张三',
  id: '10086',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
})

const handleLogout = () => {
  showLogoutConfirm.value = true
}

const confirmLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="less">
.profile {
  min-height: 100vh;
  background: #f7f8fa;

  .user-info {
    display: flex;
    align-items: center;
    padding: 20px;
    background: white;
    margin-bottom: 10px;

    .avatar {
      margin-right: 15px;
    }

    .info {
      .name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .id {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .menu-list {
    .mt-10 {
      margin-top: 10px;
    }

    .logout {
      color: #ff4d4f;
    }
  }

  .logout-confirm {
    padding: 20px;
    text-align: center;
    color: #666;
  }
}
</style> 