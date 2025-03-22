<template>
  <div class="forgot-password">
    <van-nav-bar
      title="忘记密码"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-form @submit="onSubmit">
      <!-- 邮箱验证组 -->
      <van-cell-group inset title="邮箱验证">
        <van-field
          v-model="formData.email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[
            { required: true, message: '请填写邮箱' },
            { pattern: /.+@.+\..+/, message: '请输入正确的邮箱格式' }
          ]"
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
          name="verifyCode"
          label="验证码"
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请填写验证码' }]"
        />
      </van-cell-group>

      <!-- 密码设置组 -->
      <van-cell-group inset title="密码设置" class="password-group">
        <van-field
          v-model="formData.newPassword"
          type="password"
          name="newPassword"
          label="新密码"
          placeholder="请输入新密码"
          :rules="[{ required: true, message: '请填写新密码' }]"
        />

        <van-field
          v-model="formData.confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入新密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
          ]"
        />
      </van-cell-group>

      <div class="submit-button">
        <van-button block type="primary" native-type="submit">
          重置密码
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const countdown = ref(0)

const formData = reactive({
  email: '',
  verifyCode: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = () => {
  return formData.newPassword === formData.confirmPassword
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

const onSubmit = () => {
  // 这里应该实现重置密码的逻辑
  showToast('密码重置成功')
  router.replace('/login')
}

const onClickLeft = () => {
  router.back()
}
</script>

<style lang="less" scoped>
.forgot-password {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 24px;

  :deep(.van-cell-group__title) {
    padding: 16px 16px 8px;
    color: #969799;
    font-size: 14px;
  }

  .password-group {
    margin-top: 20px;
  }

  .submit-button {
    margin: 24px 16px;
  }
}
</style> 