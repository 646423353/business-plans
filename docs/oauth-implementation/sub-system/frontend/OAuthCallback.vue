<template>
  <div class="callback-page">
    <div class="callback-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ statusText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const statusText = ref('正在处理登录...')

onMounted(async () => {
  const { code, state, error, error_description, token } = route.query

  if (error) {
    statusText.value = '登录失败'
    setTimeout(() => {
      router.push({
        path: '/login',
        query: { error: error as string, error_description: error_description as string }
      })
    }, 2000)
    return
  }

  if (token) {
    statusText.value = '登录成功，正在跳转...'
    localStorage.setItem('token', token as string)
    await userStore.fetchUser()
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
    return
  }

  if (!code || !state) {
    statusText.value = '无效的回调参数'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    return
  }

  try {
    statusText.value = '正在验证身份...'
    
    const response = await fetch(`/api/auth/oauth/callback?code=${code}&state=${state}`, {
      credentials: 'include'
    })
    
    if (response.redirected) {
      const url = new URL(response.url)
      const tokenParam = url.searchParams.get('token')
      const errorParam = url.searchParams.get('error')
      
      if (errorParam) {
        statusText.value = '登录失败'
        setTimeout(() => {
          router.push({
            path: '/login',
            query: { error: errorParam }
          })
        }, 2000)
        return
      }
      
      if (tokenParam) {
        localStorage.setItem('token', tokenParam)
        statusText.value = '登录成功，正在跳转...'
        await userStore.fetchUser()
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    }
  } catch (err: any) {
    statusText.value = '登录失败：' + (err.message || '未知错误')
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
})
</script>

<style scoped lang="scss">
.callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.callback-container {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(99, 102, 241, 0.3);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #f8fafc;
  font-size: 16px;
}
</style>
