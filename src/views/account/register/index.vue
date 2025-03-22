<template>
  <div class="register">
    <van-nav-bar title="注册账号" left-text="返回" left-arrow @click-left="onClickLeft" />

    <van-form @submit="onSubmit">
      <!-- 邮箱验证组 -->
      <van-cell-group inset title="账号信息" class="email-group">
        <van-field v-model="formData.username" name="username" label="用户名" placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]" />
        <van-field v-model="formData.email" name="email" label="邮箱" placeholder="请输入邮箱" :rules="[
          { required: true, message: '请填写邮箱' },
          { pattern: /.+@.+\..+/, message: '请输入正确的邮箱格式' }
        ]">
          <template #button>
            <van-button size="small" type="primary" :disabled="!!countdown" @click="handleSendVerifyCode">
              {{ countdown ? `${countdown}s` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>

        <van-field v-model="formData.verifyCode" name="verifyCode" label="验证码" placeholder="请输入验证码"
          :rules="[{ required: true, message: '请填写验证码' }]" />
      </van-cell-group>

      <!-- 密码设置组 -->
      <van-cell-group inset title="密码设置" class="password-group">
        <van-field v-model="formData.password" type="password" name="password" label="密码" placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]" />

        <van-field v-model="formData.confirmPassword" type="password" name="confirmPassword" label="确认密码"
          placeholder="请再次输入密码" :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
          ]" />
      </van-cell-group>

      <div class="submit-button">
        <van-button block type="primary" native-type="submit">
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { sendVerifyCode, register } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const countdown = ref(0)
const userStore = useUserStore()

const formData = reactive({
  username: '',
  email: '',
  verifyCode: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = () => {
  return formData.password === formData.confirmPassword
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

const handleSendVerifyCode = async () => {
  if (!formData.email) {
    showToast('请输入邮箱')
    return
  }
  try {
    await sendVerifyCode(formData.email)
    showToast('验证码已发送')
    startCountdown()
  } catch (error) {
    // 错误已在请求拦截器中处理
  }
}

const onSubmit = async () => {
  await register(formData)
  showToast('注册成功，即将进入登录页')
  setTimeout(() => router.replace('/login'), 1500);
}

const onClickLeft = () => {
  router.back()
}
</script>

<style lang="less" scoped>
.register {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 24px;

  :deep(.van-cell-group__title) {
    padding: 16px 16px 8px;
    color: #969799;
    font-size: 14px;
  }

  .email-group,
  .password-group {
    margin-bottom: 10px 0 30px 0;
  }

  .submit-button {
    margin: 24px 16px;
  }
}
</style>