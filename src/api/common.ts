import request from '@/utils/request'
import type { ApiResponse } from '@/types'
import type { GetClassifyListResponse } from './types'

interface UploadResponse {
  url: string
  fileName: string
}

// 上传文件
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request<ApiResponse<UploadResponse>>({
    url: '/common/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取分类列表
export function getClassifyList(type?: string) {
  return request<GetClassifyListResponse>({
    url: '/classify/list',
    method: 'get',
    params: { type }
  })
} 