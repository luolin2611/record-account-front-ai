import request from '@/utils/request'
import type { ApiResponse, HomeStatistics } from '@/types/home'
import type { RecordBillParams, RecordBillResponse } from './types'

// 获取首页统计数据
export function getHomeStatistics() {
  return request<ApiResponse<HomeStatistics>>({
    url: '/home/statistics',
    method: 'GET'
  })
}

// 记账
export function recordBill(data: RecordBillParams) {
  return request<RecordBillResponse>({
    url: '/home/record',
    method: 'post',
    data
  })
} 