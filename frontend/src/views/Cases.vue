<template>
  <div class="cases-page">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="brand-text">商业策划机</span>
        </div>
        <div class="nav-actions">
          <button class="btn-ghost" @click="goToHome">返回首页</button>
          <button class="btn-primary" @click="goToDashboard">开始策划</button>
        </div>
      </div>
    </nav>

    <main class="cases-main">
      <div class="page-header">
        <h1>看看别人的商业策划</h1>
        <p>浏览优秀案例，获取灵感启发</p>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
      </div>

      <div v-else class="cases-grid">
        <div
          v-for="item in cases"
          :key="item.id"
          class="case-card"
          @click="viewCase(item.id)"
        >
          <div class="card-header">
            <span class="industry-badge">{{ item.industry }}</span>
          </div>
          <div class="card-body">
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
          </div>
          <div class="card-footer">
            <div class="tags">
              <span v-for="(tag, i) in parseHighlights(item.highlights)" :key="i" class="tag">
                {{ tag }}
              </span>
            </div>
            <div class="meta">
              <span>{{ item.viewCount }} 次浏览</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && cases.length === 0" class="empty-state">
        <h3>暂无案例</h3>
        <p>敬请期待更多精彩案例</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { caseApi } from '@/services/case'

const router = useRouter()

const loading = ref(true)
const cases = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await caseApi.getList()
    cases.value = res.data.list
  } catch (error) {
    console.error('加载案例失败', error)
  } finally {
    loading.value = false
  }
})

function parseHighlights(highlights: any): string[] {
  if (!highlights) return []
  if (Array.isArray(highlights)) return highlights
  if (typeof highlights === 'string') {
    try {
      const parsed = JSON.parse(highlights)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function viewCase(id: string) {
  router.push(`/case/${id}`)
}

function goToHome() {
  router.push('/')
}

function goToDashboard() {
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
.cases-page {
  min-height: 100vh;
  background: #0f172a;
  color: #f8fafc;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
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
    width: 24px;
    height: 24px;
    color: white;
  }
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-actions {
  display: flex;
  gap: 12px;
}

.btn-ghost {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f8fafc;
  }
}

.btn-primary {
  padding: 10px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  }
}

.cases-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
  
  h1 {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    font-size: 16px;
    color: #64748b;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 102, 241, 0.3);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.case-card {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
}

.card-header {
  padding: 16px 20px;
  background: rgba(99, 102, 241, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.industry-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 100px;
  font-size: 12px;
  color: #a5b4fc;
}

.card-body {
  padding: 20px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #f8fafc;
  }
  
  p {
    font-size: 14px;
    line-height: 1.6;
    color: #94a3b8;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.card-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 10px;
  background: rgba(34, 197, 94, 0.15);
  border-radius: 6px;
  font-size: 12px;
  color: #86efac;
}

.meta {
  font-size: 12px;
  color: #64748b;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
  
  h3 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  p {
    color: #64748b;
  }
}
</style>
