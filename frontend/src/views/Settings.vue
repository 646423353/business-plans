<template>
  <div class="settings-page">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="brand-text">商业策划机</span>
        </div>
      </div>
      
      <div class="user-section">
        <div class="user-card">
          <el-avatar :size="48" :src="userStore.user?.avatar" class="user-avatar">
            {{ userStore.user?.username?.charAt(0) }}
          </el-avatar>
          <div class="user-info">
            <div class="user-name">{{ userStore.user?.username }}</div>
            <el-tag :type="userStore.isPro ? 'success' : 'info'" size="small" class="user-tag">
              {{ userStore.isPro ? '专业版' : '免费版' }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item" :class="{ active: $route.path === '/dashboard' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>我的项目</span>
        </router-link>
        <router-link to="/settings" class="nav-item" :class="{ active: $route.path === '/settings' }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>设置</span>
        </router-link>
      </nav>
      
      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>退出登录</span>
        </button>
      </div>
    </aside>
    
    <main class="main-content">
      <header class="content-header">
        <h1>设置</h1>
      </header>
      
      <div class="content-body">
        <section class="settings-section">
          <h2 class="section-title">账户信息</h2>
          <div class="profile-card">
            <div class="profile-avatar">
              <el-avatar :size="80" :src="userStore.user?.avatar" class="user-avatar">
                {{ userStore.user?.username?.charAt(0) }}
              </el-avatar>
            </div>
            <div class="profile-info">
              <h3>{{ userStore.user?.username }}</h3>
              <p>{{ userStore.user?.email }}</p>
              <el-tag :type="userStore.isPro ? 'success' : 'info'" size="large">
                {{ userStore.isPro ? '专业版' : '免费版' }}
              </el-tag>
            </div>
          </div>
        </section>
        
        <section class="settings-section">
          <h2 class="section-title">配额信息</h2>
          <div class="quota-card">
            <div class="quota-header">
              <div class="quota-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span>今日已用项目数</span>
              </div>
              <span class="quota-value">{{ userStore.user?.quotaDailyUsed || 0 }} / {{ userStore.isPro ? 10 : 1 }}</span>
            </div>
            <el-progress
              :percentage="quotaPercent"
              :stroke-width="8"
              :show-text="false"
              :color="quotaPercent >= 100 ? '#ef4444' : '#6366f1'"
            />
            <p class="quota-tip">
              {{ userStore.isPro ? '专业版每日可创建10个项目' : '免费版每日可创建1个项目，升级专业版获得更多配额' }}
            </p>
          </div>
        </section>
        
        <section v-if="!userStore.isPro" class="settings-section">
          <h2 class="section-title">升级专业版</h2>
          <div class="upgrade-card">
            <div class="upgrade-header">
              <div class="upgrade-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
              </div>
              <div class="upgrade-info">
                <h3>专业版</h3>
                <p>¥99/月</p>
              </div>
            </div>
            <ul class="benefits-list">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>每日创建10个项目</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>无限对话轮次</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>文档编辑功能</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>版本管理功能</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>优先客服支持</span>
              </li>
            </ul>
            <button class="upgrade-btn" @click="handleUpgrade">
              <span>立即升级</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </section>
        
        <section class="settings-section">
          <h2 class="section-title">账户操作</h2>
          <div class="action-card">
            <button class="danger-btn" @click="handleLogout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>退出登录</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const quotaPercent = computed(() => {
  const used = userStore.user?.quotaDailyUsed || 0
  const limit = userStore.isPro ? 10 : 1
  return Math.min((used / limit) * 100, 100)
})

onMounted(() => {
  userStore.fetchUser()
})

function handleLogout() {
  userStore.logout()
}

function handleUpgrade() {
  ElMessage.info('升级功能开发中，敬请期待')
}
</script>

<style scoped lang="scss">
.settings-page {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #0f172a;
  color: #f8fafc;
}

.sidebar {
  width: 280px;
  background: #1e293b;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 22px;
    height: 22px;
    color: white;
  }
}

.brand-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-section {
  padding: 20px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
}

.user-avatar {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.sidebar-nav {
  flex: 1;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 10px;
  margin-bottom: 4px;
  transition: all 0.2s;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  span {
    font-size: 15px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f8fafc;
  }
  
  &.active {
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
  }
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: #ef4444;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #1e293b;
  
  h1 {
    font-size: 24px;
    font-weight: 700;
  }
}

.content-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  max-width: 800px;
}

.settings-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #f8fafc;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 32px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.profile-avatar {
  .user-avatar {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
}

.profile-info {
  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    color: #94a3b8;
    margin-bottom: 12px;
  }
}

.quota-card {
  padding: 24px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.quota-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.quota-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 14px;
  
  svg {
    width: 20px;
    height: 20px;
  }
}

.quota-value {
  font-size: 18px;
  font-weight: 600;
  color: #f8fafc;
}

.quota-tip {
  margin-top: 16px;
  font-size: 13px;
  color: #64748b;
}

.upgrade-card {
  padding: 32px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 16px;
}

.upgrade-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.upgrade-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
}

.upgrade-info {
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  p {
    font-size: 16px;
    color: #a5b4fc;
  }
}

.benefits-list {
  list-style: none;
  margin-bottom: 24px;
  
  li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 15px;
    color: #cbd5e1;
    
    svg {
      width: 20px;
      height: 20px;
      color: #22c55e;
      flex-shrink: 0;
    }
  }
}

.upgrade-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  }
}

.action-card {
  padding: 24px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.danger-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #ef4444;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.5);
  }
}
</style>
