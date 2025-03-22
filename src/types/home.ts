// 账单记录
export interface Record {
  id: number
  classifyId: number
  classifyName: string
  amount: number
  classifyType: string
  iconName: string
  remark: string
}

// 日期分组记录
export interface DayGroup {
  date: string
  records: Record[]
}

// 首页统计数据
export interface HomeStatistics {
  monthExpense: number
  monthIncome: number
  monthBudget: number
  budgetOverspend: number
  recentRecords: DayGroup[]
}

// API响应格式
export interface ApiResponse<T> {
  code: string
  message: string
  timestamp: number
  body: T
} 