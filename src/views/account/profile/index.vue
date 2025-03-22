<template>
  <div class="profile">
    <!-- 用户信息卡片 -->
    <van-cell-group inset>
      <van-cell>
        <!-- 左侧布局：头像和用户信息 -->
        <div class="user-info">
          <van-image
            round
            width="60px"
            height="60px"
            :src="userInfo.avatar"
          />
          <div class="user-detail">
            <div class="username">{{ userInfo.username }}</div>
            <div class="signature">{{ userInfo.signature }}</div>
          </div>
        </div>
        <!-- 右侧编辑按钮 -->
        <template #right-icon>
          <van-icon 
            name="edit" 
            size="20" 
            class="edit-icon"
            @click="handleEdit"
          />
        </template>
      </van-cell>

      <van-cell title="密码记录数" :value="userInfo.passwordCount + '条'" />
      <van-cell title="创建时间" :value="userInfo.createTime" />
    </van-cell-group>

    <div class="logout-button">
      <van-button 
        type="danger" 
        block 
        @click="handleLogout"
      >
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()

const userInfo = ref({
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  username: 'rollin',
  signature: '这个人很懒，什么都没留下',
  passwordCount: 0,
  createTime: '2024-03-20'
})

const handleEdit = () => {
  router.push('/profile/edit')
}

const handleLogout = () => {
  showDialog({
    title: '提示',
    message: '确定要退出登录吗？',
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    confirmButtonColor: '#ee0a24'
  }).then((action) => {
    if (action === 'confirm') {
      // 清除登录状态
      const userStore = useUserStore()
      userStore.logout()
      showToast('退出成功')
      // 跳转到登录页
      router.replace('/login')
    }
  })
}
</script>

<style lang="less" scoped>
.profile {
  padding: 16px 0;

  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;

    .user-detail {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      .username {
        font-size: 16px;
        font-weight: bold;
        color: #323233;
        line-height: 1.2;
      }

      .signature {
        font-size: 12px;
        color: #969799;
        margin-top: 8px;
        line-height: 1.2;
      }
    }
  }

  :deep(.van-cell) {
    align-items: center;
    padding: 16px;

    .edit-icon {
      color: #969799;
      cursor: pointer;
    }
  }

  .logout-button {
    margin: 60px 10px 0 20px;
    margin-top: 50px;
  }
}
</style> 