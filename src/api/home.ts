import request from '@/utils/request'
import type { ApiResponse, HomeStatistics } from '@/types/home'

// 获取首页统计数据
export function getHomeStatistics() {
  return request<ApiResponse<HomeStatistics>>({
    url: '/home/statistics',
    method: 'GET'
  })
} 