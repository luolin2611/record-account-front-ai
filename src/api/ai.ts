import { useUserStore } from '@/stores/user'
import type { AiChatRequest } from './types'

/**
 * AI 聊天接口
 * @param params 
 * @returns Response
 */
export const aiChat = async (params: AiChatRequest) => {
  const userStore = useUserStore()
  const queryString = new URLSearchParams(params as any).toString()
  const response = await fetch(`/api/ai/record?${queryString}`, {
    method: 'GET',
    headers: {
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Authorization': userStore.token || ''
    }
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response
} 