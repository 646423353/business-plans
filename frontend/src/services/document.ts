import { request } from './request'
import type { Document, ApiResponse, PaginatedResponse } from '@/types'

export interface GenerateDocumentRequest {
  projectId: string
}

export interface UpdateDocumentRequest {
  content: string
  customLabel?: string
}

export const documentApi = {
  generate(data: GenerateDocumentRequest): Promise<ApiResponse<{ taskId: string }>> {
    return request.post('/documents/generate', data)
  },

  getList(projectId: string): Promise<ApiResponse<Document[]>> {
    return request.get(`/documents/${projectId}`)
  },

  getById(id: string): Promise<ApiResponse<Document>> {
    return request.get(`/documents/detail/${id}`)
  },

  update(id: string, data: UpdateDocumentRequest): Promise<ApiResponse<Document>> {
    return request.put(`/documents/${id}`, data)
  },
}
