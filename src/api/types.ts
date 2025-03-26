// 注册请求参数
export interface RegisterParams {
  username: string
  email: string
  verifyCode: string
  password: string
}

// 注册响应
export interface RegisterResponse {
  token: string
  userId: string
}

// 发送验证码响应
export interface SendVerifyCodeResponse {
  message: string
}

// 用户信息
export interface UserInfo {
  id: number
  username: string
  email: string
  signature: string
  avatarUrl: string | null
}

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  user: UserInfo
  token: string
}

export interface ClassifyItem {
  id: number
  classifyName: string
  type: string
  addType: string
  iconName: string
  createdTime: string
  updatedTime: string
}

export interface GetClassifyListResponse {
  code: string
  message: string
  timestamp: number
  body: ClassifyItem[]
}

// 记账请求参数类型
export interface RecordBillParams {
  billMoney: number
  classifyId: number
  classifyName: string
  classifyType: string
  recordTime: string
  remark: string
}

// 记账响应类型
export interface RecordBillResponse {
  code: string
  message: string
  timestamp: number
  body: any
} 