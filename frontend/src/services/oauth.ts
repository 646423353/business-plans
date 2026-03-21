import { request } from './request'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const oauthApi = {
  authorize() {
    window.location.href = `${API_BASE_URL}/oauth/authorize`
  },

  async callback(code: string, state: string) {
    return request.get(`/oauth/callback?code=${code}&state=${state}`)
  },
}
