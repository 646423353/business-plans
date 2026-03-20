import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/auth'
import type { User } from '@/types'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const isPro = computed(() => user.value?.role === 'pro')

  async function login(email: string, password: string) {
    const res = await authApi.login({ email, password })
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('token', res.data.token)
    return res
  }

  async function register(data: { email: string; password: string; username: string; phone?: string }) {
    const res = await authApi.register(data)
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem('token', res.data.token)
    return res
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const res = await authApi.getMe()
      user.value = res.data
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }

  function updateQuota(used: number) {
    if (user.value) {
      user.value.quotaDailyUsed = used
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    isPro,
    login,
    register,
    fetchUser,
    logout,
    updateQuota,
  }
})
