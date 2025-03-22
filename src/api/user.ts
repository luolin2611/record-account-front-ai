import request from '@/utils/request'
import type { 
  RegisterParams, 
  RegisterResponse, 
  SendVerifyCodeResponse,
  LoginParams,
  LoginResponse
} from './types'

// 发送注册邮箱验证码
export function sendVerifyCode(email: string) {
  return request<SendVerifyCodeResponse>({
    url: '/user/send-code',
    method: 'get',
    params: { email }
  })
}

// 注册
export function register(data: RegisterParams) {
  return request<RegisterResponse>({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 登录
export function login(data: LoginParams) {
  return request<LoginResponse>({
    url: '/user/login',
    method: 'post',
    data
  })
} 