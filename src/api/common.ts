import request from '@/utils/request'
import type { ApiResponse } from '@/types'

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