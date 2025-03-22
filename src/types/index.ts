export interface Password {
  id: number
  userId: number
  platformName: string
  platformIcon: string
  description: string
  password: string
  createdTime: string
  updatedTime: string
  isTop: boolean
}

export interface PasswordRecord {
  id: number
  userId: number
  platformName: string
  platformIcon: string
  description: string
  password: string
  createdTime: string
  updatedTime: string
}

export interface PasswordPageResponse {
  records: PasswordRecord[]
  total: number
  size: number
  current: number
  pages: number
}

export interface ApiResponse<T> {
  code: string
  message: string
  timestamp: number
  body: T
} 