<template>
  <div class="oauth-callback-page">
    <div class="loading-container">
      <div class="spinner"></div>
      <p>正在登录...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { oauthApi } from '@/services/oauth'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string
  const error = route.query.error as string

  if (error) {
    ElMessage.error('授权失败: ' + (route.query.error_description || error))
    router.push('/login')
    return
  }

  if (!code) {
    ElMessage.error('缺少授权码')
    router.push('/login')
    return
  }

  try {
    const res = await oauthApi.callback(code, state)
    
    userStore.token = res.data.token
    userStore.user = res.data.user
    localStorage.setItem('token', res.data.token)
    
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (err: any) {
    ElMessage.error(err.message || '登录失败')
    router.push('/login')
  }
})
</script>

<style scoped lang="scss">
.oauth-callback-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  
  p {
    color: #94a3b8;
    font-size: 16px;
  }
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
