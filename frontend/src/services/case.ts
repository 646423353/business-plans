import { request } from './request'
import type { Case, ApiResponse, PaginatedResponse } from '@/types'

export interface CaseListParams {
  industry?: string
  page?: number
  size?: number
}

export const caseApi = {
  getList(params?: CaseListParams): Promise<ApiResponse<PaginatedResponse<Case>>> {
    return request.get('/cases', { params })
  },

  getById(id: string): Promise<ApiResponse<Case>> {
    return request.get(`/cases/${id}`)
  },
}
