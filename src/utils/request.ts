import axios from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // 使用相对路径，会被代理到实际的服务器
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 显示加载框
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })

    // 添加 token 到请求头
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = userStore.token
    }

    return config
  },
  error => {
    // 关闭加载框
    closeToast()
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 关闭加载框
    closeToast()
    
    const { code, message, body } = response.data
    
    // 使用新的成功状态码
    if (code === 'SUC0000') {
      return body
    } else {
      showToast({
        message: message || '请求失败',
        type: 'fail'
      })
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  error => {
    // 关闭加载框
    closeToast()
    
    // 处理错误信息
    let message = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = '网络错误'
      }
    } else {
      message = '网络连接失败'
    }
    
    showToast({
      message,
      type: 'fail'
    })
    return Promise.reject(error)
  }
)

export default request 