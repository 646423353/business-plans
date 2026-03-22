import { request } from './request'

// DashHub 主系统 OAuth 授权地址
const DASHHUB_AUTH_URL = 'https://dashhub.insfair.cn/oauth/authorize'

// OAuth 配置
const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || 'business-planner'
const REDIRECT_URI = import.meta.env.VITE_OAUTH_REDIRECT_URI || 'https://cehua.insfair.cn/auth/callback'

export const oauthApi = {
  authorize() {
    // 生成随机 state 防止 CSRF
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('oauth_state', state)

    // 构建授权 URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      state: state,
      scope: 'openid profile email',
    })

    window.location.href = `${DASHHUB_AUTH_URL}?${params.toString()}`
  },

  async callback(code: string, state: string) {
    return request.get(`/oauth/callback?code=${code}&state=${state}`)
  },
}
