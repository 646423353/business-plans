<template>
  <div class="case-page">
    <header class="case-header">
      <button class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>返回</span>
      </button>
    </header>
    
    <div class="case-container">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
      </div>
      
      <template v-else-if="caseData">
        <div class="case-hero">
          <div class="hero-content">
            <span class="industry-tag">{{ caseData.industry }}</span>
            <h1>{{ caseData.title }}</h1>
            <p class="summary">{{ caseData.summary }}</p>
            
            <div class="meta-info">
              <div class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span>{{ caseData.viewCount }} 次浏览</span>
              </div>
              <div class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>{{ formatDate(caseData.createdAt) }}</span>
              </div>
            </div>
            
            <div v-if="parsedHighlights.length > 0" class="highlights">
              <span v-for="(tag, i) in parsedHighlights" :key="i" class="highlight-tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="case-content">
          <section v-if="caseData.businessDesign" class="content-section">
            <h2>商业设计说明书</h2>
            <div class="markdown-body" v-html="renderedBusinessDesign"></div>
          </section>
          
          <section v-if="caseData.functionDesign" class="content-section">
            <h2>功能设计说明</h2>
            <div class="markdown-body" v-html="renderedFunctionDesign"></div>
          </section>
          
          <section v-if="caseData.evaluation" class="content-section">
            <h2>项目评价表</h2>
            <div class="markdown-body" v-html="renderedEvaluation"></div>
          </section>
          
          <section v-if="caseData.risk" class="content-section">
            <h2>风险提示表</h2>
            <div class="markdown-body" v-html="renderedRisk"></div>
          </section>
        </div>
      </template>
      
      <div v-else class="empty-state">
        <h3>案例不存在</h3>
        <p>您查看的案例可能已被删除</p>
        <button class="primary-btn" @click="goBack">返回</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { caseApi } from '@/services/case'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const caseData = ref<any>(null)

const parsedHighlights = computed(() => {
  const highlights = caseData.value?.highlights
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
})

const renderedBusinessDesign = computed(() => caseData.value?.businessDesign ? marked(caseData.value.businessDesign) : '')
const renderedFunctionDesign = computed(() => caseData.value?.functionDesign ? marked(caseData.value.functionDesign) : '')
const renderedEvaluation = computed(() => caseData.value?.evaluation ? marked(caseData.value.evaluation) : '')
const renderedRisk = computed(() => caseData.value?.risk ? marked(caseData.value.risk) : '')

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    userStore.fetchUser()
  }
  
  const caseId = route.params.id as string
  try {
    const res = await caseApi.getById(caseId)
    caseData.value = res.data
  } catch (error) {
    console.error('加载案例失败', error)
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped lang="scss">
.case-page {
  height: 100vh;
  width: 100%;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.case-header {
  padding: 16px 24px;
  background: #1e293b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
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
    background: rgba(255, 255, 255, 0.1);
    color: #f8fafc;
  }
}

.case-container {
  flex: 1;
  overflow-y: auto;
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

.case-hero {
  padding: 60px 24px;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.industry-tag {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 100px;
  font-size: 13px;
  color: #a5b4fc;
  margin-bottom: 20px;
}

.case-hero h1 {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.summary {
  font-size: 18px;
  line-height: 1.7;
  color: #94a3b8;
  margin-bottom: 24px;
}

.meta-info {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
  
  svg {
    width: 18px;
    height: 18px;
  }
}

.highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.highlight-tag {
  padding: 6px 14px;
  background: rgba(34, 197, 94, 0.15);
  border-radius: 6px;
  font-size: 13px;
  color: #86efac;
}

.case-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.content-section {
  margin-bottom: 48px;
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.markdown-body {
  font-size: 15px;
  line-height: 1.8;
  color: #cbd5e1;
  
  :deep(h1) {
    font-size: 28px;
    font-weight: 700;
    color: #f8fafc;
    margin: 32px 0 20px;
  }
  
  :deep(h2) {
    font-size: 22px;
    font-weight: 600;
    color: #f8fafc;
    margin: 28px 0 16px;
  }
  
  :deep(h3) {
    font-size: 18px;
    font-weight: 600;
    color: #f8fafc;
    margin: 24px 0 12px;
  }
  
  :deep(p) {
    margin: 0 0 16px;
  }
  
  :deep(ul), :deep(ol) {
    margin: 0 0 16px;
    padding-left: 24px;
    
    li {
      margin-bottom: 8px;
    }
  }
  
  :deep(blockquote) {
    margin: 16px 0;
    padding: 16px 20px;
    background: rgba(99, 102, 241, 0.1);
    border-left: 4px solid #6366f1;
    border-radius: 0 8px 8px 0;
    color: #a5b4fc;
  }
  
  :deep(code) {
    padding: 2px 6px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    color: #f472b6;
  }
  
  :deep(pre) {
    margin: 16px 0;
    padding: 20px;
    background: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow-x: auto;
    
    code {
      padding: 0;
      background: transparent;
      color: #cbd5e1;
    }
  }
  
  :deep(table) {
    width: 100%;
    margin: 16px 0;
    border-collapse: collapse;
    
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    th {
      font-weight: 600;
      color: #f8fafc;
      background: rgba(255, 255, 255, 0.03);
    }
  }
  
  :deep(strong) {
    color: #f8fafc;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  
  h3 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  p {
    color: #64748b;
    margin-bottom: 24px;
  }
}

.primary-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  }
}
</style>
