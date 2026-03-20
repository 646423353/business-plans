export interface User {
  id: string
  email: string
  username: string
  avatar?: string
  phone?: string
  role: 'guest' | 'free' | 'pro'
  quotaDailyUsed: number
  createdAt: string
  lastLoginAt?: string
}

export interface Project {
  id: string
  name: string
  industry: string
  status: 'analyzing' | 'generated'
  currentTurn: number
  directionConfirmed: boolean
  directionConfirmTurn?: number
  riskFlag: boolean
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  projectId: string
  turn: number
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  updatedAt?: string
}

export interface Document {
  id: string
  projectId: string
  version: number
  type: 'business_design' | 'function_design' | 'evaluation' | 'risk'
  title: string
  content: string
  customLabel?: string
  createdAt: string
  updatedAt: string
}

export interface Case {
  id: string
  title: string
  industry: string
  summary: string
  highlights: string[]
  businessDesign?: string
  functionDesign?: string
  evaluation?: string
  risk?: string
  viewCount: number
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
  phone?: string
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  size: number
}

export const INDUSTRIES = [
  { value: '餐饮', label: '餐饮' },
  { value: '零售', label: '零售' },
  { value: 'SaaS', label: 'SaaS' },
  { value: '电商', label: '电商' },
  { value: '教育', label: '教育' },
  { value: '其他', label: '其他' },
] as const

export const DOCUMENT_TYPES: Record<string, string> = {
  business_design: '商业设计说明书',
  function_design: '功能设计说明',
  evaluation: '项目评价表',
  risk: '风险提示表',
}

export const PROJECT_STATUS: Record<string, string> = {
  analyzing: '对话分析中',
  generated: '已生成版本',
}
