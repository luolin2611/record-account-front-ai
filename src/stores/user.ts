import { defineStore } from 'pinia'
import type { UserInfo } from '@/api/types'

interface UserState {
  token: string
  userInfo: UserInfo | null
  isLoggedIn: boolean
}

interface LoginData {
  token: string
  user: UserInfo
}

// 从 sessionStorage 获取初始状态
const getInitialState = (): UserState => {
  const token = sessionStorage.getItem('token') || ''
  const userInfo = sessionStorage.getItem('userInfo')
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'

  return {
    token,
    userInfo: userInfo ? JSON.parse(userInfo) : null,
    isLoggedIn
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => getInitialState(),
  
  actions: {
    setToken(token: string) {
      this.token = token
      sessionStorage.setItem('token', token)
    },
    
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    
    setLoginStatus(status: boolean) {
      this.isLoggedIn = status
      sessionStorage.setItem('isLoggedIn', status ? 'true' : 'false')
    },
    
    login(data: LoginData) {
      this.setToken(data.token)
      this.setUserInfo(data.user)
      this.setLoginStatus(true)
    },
    
    logout() {
      this.token = ''
      this.userInfo = null
      this.isLoggedIn = false
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userInfo')
      sessionStorage.removeItem('isLoggedIn')
    }
  }
}) 