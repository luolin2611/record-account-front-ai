<template>
  <div class="ai-page">
    <!-- 标题 -->
    <div class="header">
      <div class="close-btn" @click="router.replace('/home')">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path stroke="currentColor" stroke-width="2" fill="none"
            d="M6,6 L18,18 M6,18 L18,6" />
        </svg>
      </div>
      <div class="title">AI 智能助手</div>
    </div>

    <!-- 聊天内容区域 -->
    <div class="chat-container">
      <div class="message-list" ref="messageListRef">
        <div v-for="(message, index) in messages" :key="index" 
          :class="['message', message.type === 'user' ? 'user-message' : 'ai-message']">
          <template v-if="message.type === 'user'">
            <div class="avatar user-avatar">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <circle cx="12" cy="8" r="4" fill="currentColor"/>
                <path fill="currentColor" d="M4,20 C4,16 7.5,14 12,14 C16.5,14 20,16 20,20"/>
              </svg>
            </div>
            <div class="message-content">
              <div class="text">{{ message.content }}</div>
              <div class="time">{{ message.time }}</div>
            </div>
          </template>
          <template v-else>
            <div class="avatar ai-avatar">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" 
                  d="M12,2 L2,7 L12,12 L22,7 L12,2 Z M2,17 L12,22 L22,17 M2,12 L12,17 L22,12"/>
              </svg>
            </div>
            <div class="message-content">
              <div class="text">{{ message.content }}</div>
              <div class="time">{{ message.time }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 输入框区域 -->
    <div class="input-area">
      <div class="input-wrapper">
        <input 
          type="text" 
          v-model="inputMessage" 
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        >
        <div class="send-btn" @click="sendMessage" :class="{ 'loading': isLoading }">
          <van-loading v-if="isLoading" type="spinner" size="20px" color="#fff" />
          <van-icon v-else name="arrow" size="20" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import dayjs from 'dayjs'
import { aiChat } from '@/api/ai'
import type { AxiosResponse } from 'axios'

interface Message {
  type: 'user' | 'ai'
  content: string
  time: string
}

const router = useRouter()
const messageListRef = ref<HTMLElement>()
const inputMessage = ref('')
const messages = ref<Message[]>([
  {
    type: 'ai',
    content: '您好！我是 "记账呀" 小助手，您可以问我相关的记账信息，例如：今天我发了xxx元的工资？',
    time: dayjs().format('HH:mm')
  }
])
const isLoading = ref(false)

// 处理 Markdown 格式文本
const formatMarkdown = (text: string) => {
  return text
    // 处理标题
    .replace(/###\s+(.*?)(?:\n|$)/g, '\n$1\n')
    // 处理粗体
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // 处理序号换行
    .replace(/(\d+\.\s+)/g, '\n$1')
    // 处理表情符号后换行
    .replace(/([\u{1F300}-\u{1F9FF}])/gu, '$1\n')
    // 移除多余的空行
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim()
}

// 处理流式响应
const handleStreamResponse = async (response: Response) => {
  // 创建新的 AI 消息
  messages.value.push({
    type: 'ai',
    content: '',
    time: dayjs().format('HH:mm')
  })

  try {
    const reader = response.body?.getReader()
    if (!reader) throw new Error('无法获取响应流')

    const decoder = new TextDecoder()
    const lastMessage = messages.value[messages.value.length - 1]
    let buffer = '' // 用于存储未完整的行

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        // 处理缓冲区中剩余的内容
        if (buffer && lastMessage.type === 'ai') {
          const content = buffer.replace(/^data:/, '').trim()
          if (content && content !== '[complete]') {
            lastMessage.content = formatMarkdown(lastMessage.content + content)
            await nextTick()
            scrollToBottom()
          }
        }
        break
      }

      // 解码当前块并与之前未完整的数据合并
      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      // 按行分割并处理
      const lines = buffer.split('\n')
      // 保留最后一个可能不完整的行
      buffer = lines.pop() || ''

      // 处理完整的行
      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine && trimmedLine !== 'data:[complete]') {
          const content = trimmedLine.startsWith('data:') ? trimmedLine.slice(5).trim() : trimmedLine
          
          if (content && lastMessage.type === 'ai') {
            lastMessage.content = formatMarkdown(lastMessage.content + content)
            await nextTick()
            scrollToBottom()
          }
        }
      }
    }
  } catch (error) {
    console.error('处理响应数据错误:', error)
    throw error
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  try {
    isLoading.value = true
    
    // 添加用户消息
    messages.value.push({
      type: 'user',
      content: inputMessage.value,
      time: dayjs().format('HH:mm')
    })

    // 清空输入框
    const message = inputMessage.value
    inputMessage.value = ''

    // 滚动到底部
    await nextTick()
    scrollToBottom()

    // 调用 AI 接口
    const response = await aiChat({ message })
    await handleStreamResponse(response)
  } catch (error) {
    showToast('发送消息失败，请重试')
    
    // 移除最后一条 AI 消息（如果存在）
    if (messages.value[messages.value.length - 1]?.type === 'ai') {
      messages.value.pop()
    }
  } finally {
    isLoading.value = false
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

// 监听键盘弹出
onMounted(() => {
  // 初始滚动到底部
  scrollToBottom()

  // 监听可视区域变化（键盘弹出/收起）
  window.visualViewport?.addEventListener('resize', () => {
    scrollToBottom()
    // 调整页面高度，避免键盘遮挡
    if (window.visualViewport) {
      document.documentElement.style.height = `${window.visualViewport.height}px`
    }
  })
})
</script>

<style lang="less" scoped>
.ai-page {
  height: 100vh;
  height: 100dvh; // 使用动态视口高度
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden; // 防止页面整体滚动

  .header {
    flex-shrink: 0; // 防止头部压缩
    background: linear-gradient(135deg, #373B62, #252A4A);
    padding: 16px;
    color: #fff;
    display: flex;
    align-items: center;
    position: relative;
    height: 56px;

    .close-btn {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .title {
      flex: 1;
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }
  }

  .chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    position: relative;
    -webkit-overflow-scrolling: touch; // 增加 iOS 滚动惯性

    .message-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 100%; // 确保内容足够高以支持滚动
      padding-bottom: 16px; // 底部留出空间
    }

    .message {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16px;

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .ai-avatar {
        background: linear-gradient(135deg, #373B62, #252A4A);
        color: white;
        margin-right: 8px;
      }

      .user-avatar {
        background: #4080ff;
        color: white;
        margin-left: 8px;
      }

      &.user-message {
        flex-direction: row-reverse;

        .message-content {
          background: linear-gradient(135deg, #373B62, #252A4A);
          color: #fff;
          border-radius: 12px 2px 12px 12px;
          margin-right: 8px;
        }
      }

      &.ai-message {
        .message-content {
          background: #fff;
          color: #333;
          border-radius: 2px 12px 12px 12px;
          margin-left: 8px;
        }
      }

      .message-content {
        max-width: calc(70% - 44px);
        padding: 12px 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        .text {
          font-size: 14px;
          line-height: 1.6;
          word-break: break-word;
          white-space: pre-wrap;
        }

        .time {
          font-size: 12px;
          opacity: 0.6;
          margin-top: 4px;
          text-align: right;
        }
      }
    }
  }

  .input-area {
    flex-shrink: 0; // 防止输入区域压缩
    padding: 16px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    position: sticky; // 使用 sticky 定位
    bottom: 0; // 固定在底部
    left: 0;
    right: 0;
    z-index: 10; // 确保在内容之上

    .input-wrapper {
      display: flex;
      align-items: center;
      background: #f7f8fa;
      border-radius: 24px;
      padding: 8px 16px;

      input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 14px;
        padding: 8px 0;
        outline: none;

        &::placeholder {
          color: #999;
        }

        &:disabled {
          opacity: 0.6;
        }
      }

      .send-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #373B62, #252A4A);
        border-radius: 50%;
        cursor: pointer;
        margin-left: 8px;

        &.loading {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .van-icon {
          color: #fff;
        }
      }
    }
  }
}

// 添加媒体查询，处理键盘弹出时的样式
@media (max-height: 400px) {
  .ai-page {
    .header {
      position: absolute;
      width: 100%;
      z-index: 11;
    }

    .chat-container {
      padding-top: 72px; // header 的高度 + 原有的 padding
    }
  }
}
</style> 