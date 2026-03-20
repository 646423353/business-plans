import { request } from './request'
import type { User, LoginRequest, RegisterRequest, ApiResponse } from '@/types'

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterResponse {
  user: User
  token: string
}

export const authApi = {
  login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return request.post('/auth/login', data)
  },

  register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return request.post('/auth/register', data)
  },

  getMe(): Promise<ApiResponse<User>> {
    return request.get('/users/me')
  },

  updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return request.put('/users/me', data)
  },
}
