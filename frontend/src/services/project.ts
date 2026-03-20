import { request } from './request'
import type { Project, ApiResponse, PaginatedResponse } from '@/types'

export interface CreateProjectRequest {
  name: string
  industry: string
}

export interface ProjectListParams {
  page?: number
  size?: number
  keyword?: string
}

export const projectApi = {
  create(data: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return request.post('/projects', data)
  },

  getList(params?: ProjectListParams): Promise<ApiResponse<PaginatedResponse<Project>>> {
    return request.get('/projects', { params })
  },

  getById(id: string): Promise<ApiResponse<Project>> {
    return request.get(`/projects/${id}`)
  },

  delete(id: string): Promise<ApiResponse<void>> {
    return request.delete(`/projects/${id}`)
  },
}
