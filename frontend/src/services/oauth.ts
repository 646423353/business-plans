import { request } from './request'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const oauthApi = {
  authorize() {
    window.location.href = `${API_BASE_URL}/api/oauth/authorize`
  },

  async callback(code: string, state: string) {
    return request.get(`/oauth/callback?code=${code}&state=${state}`)
  },
}
