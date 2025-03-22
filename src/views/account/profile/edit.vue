<template>
  <div class="profile-edit">
    <van-nav-bar
      title="编辑个人信息"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 基本信息编辑 -->
    <van-cell-group inset title="基本信息">
      <!-- 头像 -->
      <van-cell title="头像" center>
        <template #right-icon>
          <van-uploader
            v-model="formData.avatar"
            :max-count="1"
            :after-read="afterAvatarRead"
          >
            <van-image
              round
              width="50px"
              height="50px"
              :src="formData.avatarUrl"
            />
          </van-uploader>
        </template>
      </van-cell>

      <!-- 用户名 -->
      <van-field
        v-model="formData.username"
        label="用户名"
        placeholder="请输入用户名"
      />

      <!-- 个性签名 -->
      <van-field
        v-model="formData.signature"
        label="个性签名"
        type="textarea"
        placeholder="请输入个性签名"
        autosize
      />
    </van-cell-group>

    <!-- 密码修改 -->
    <van-cell-group inset title="密码修改" class="password-group">
      <van-field
        v-model="formData.newPassword"
        label="新密码"
        type="password"
        placeholder="请输入新密码"
      />

      <van-field
        v-model="formData.confirmPassword"
        label="确认密码"
        type="password"
        placeholder="请再次输入新密码"
      />

      <van-field
        v-model="formData.email"
        label="邮箱"
        placeholder="请输入邮箱"
      >
        <template #button>
          <van-button 
            size="small" 
            type="primary"
            :disabled="!!countdown"
            @click="sendVerifyCode"
          >
            {{ countdown ? `${countdown}s` : '获取验证码' }}
          </van-button>
        </template>
      </van-field>

      <van-field
        v-model="formData.verifyCode"
        label="验证码"
        placeholder="请输入验证码"
      />
    </van-cell-group>

    <!-- 保存按钮 -->
    <div class="submit-button">
      <van-button block type="primary" @click="handleSubmit">
        保存
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import type { UploaderFileListItem } from 'vant'

const router = useRouter()
const countdown = ref(0)

const formData = reactive({
  avatar: [] as UploaderFileListItem[],
  avatarUrl: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  username: 'rollin',
  signature: '这个人很懒，什么都没留下',
  email: '18946025623@163.com',
  verifyCode: '',
  newPassword: '',
  confirmPassword: ''
})

const afterAvatarRead = (file: UploaderFileListItem) => {
  // 这里应该实现头像上传逻辑
  if (file.content) {
    formData.avatarUrl = file.content as string
  }
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const sendVerifyCode = async () => {
  if (!formData.email) {
    showToast('请输入邮箱')
    return
  }
  // 这里应该实现发送验证码的逻辑
  showToast('验证码已发送')
  startCountdown()
}

const handleSubmit = async () => {
  // 验证表单
  if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
    showToast('两次输入的密码不一致')
    return
  }

  // 这里应该实现保存逻辑
  showToast('保存成功')
  router.back()
}

const onClickLeft = () => {
  router.back()
}
</script>

<style lang="less" scoped>
.profile-edit {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 24px;

  :deep(.van-cell-group__title) {
    padding: 16px 16px 8px;
    color: #969799;
    font-size: 14px;
  }

  .password-group {
    margin-top: 12px;
  }

  :deep(.van-cell) {
    align-items: center;
    padding: 16px;
  }

  .submit-button {
    margin: 24px 16px;
  }
}
</style> 