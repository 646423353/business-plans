import { request } from './request'
import type { Message, ApiResponse, PaginatedResponse } from '@/types'

export interface SendMessageRequest {
  projectId: string
  content: string
}

export interface SendMessageResponse {
  userMessage: Message
  aiMessage: Message
  directionConfirmed: boolean
}

export const chatApi = {
  sendMessage(data: SendMessageRequest): Promise<ApiResponse<SendMessageResponse>> {
    return request.post('/messages', data)
  },

  getHistory(projectId: string, params?: { page?: number; size?: number }): Promise<ApiResponse<PaginatedResponse<Message>>> {
    return request.get(`/messages/${projectId}`, { params })
  },
}
