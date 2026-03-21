<template>
  <div class="guest-page">
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
        <div class="nav-links">
          <a href="#features" class="nav-link">功能特性</a>
          <a href="#cases" class="nav-link">成功案例</a>
          <a href="#pricing" class="nav-link">定价方案</a>
        </div>
        <div class="nav-actions">
          <button class="btn-ghost" @click="goToLogin">登录</button>
          <button class="btn-primary" @click="goToRegister">免费开始</button>
        </div>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-bg">
        <div class="hero-gradient"></div>
        <div class="hero-pattern"></div>
      </div>
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">✨</span>
            <span>AI 驱动的智能策划</span>
          </div>
          <h1 class="hero-title">
            让 AI 成为您的
            <span class="gradient-text">商业策划顾问</span>
          </h1>
          <p class="hero-subtitle">
            通过智能对话，快速生成专业的商业设计说明书、功能设计文档、项目评估报告。
            无需专业知识，AI 帮您完成从创意到落地的全过程。
          </p>
          <div class="hero-actions">
            <button class="btn-primary btn-lg" @click="goToRegister">
              <span>立即体验</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button class="btn-outline btn-lg" @click="scrollToCases">
              <span>查看案例</span>
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-value">10,000+</span>
              <span class="stat-label">商业策划已生成</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">98%</span>
              <span class="stat-label">用户满意度</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">5分钟</span>
              <span class="stat-label">平均生成时间</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-card">
            <div class="card-header">
              <div class="card-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="card-title">AI 对话生成中...</span>
            </div>
            <div class="card-content">
              <div class="chat-bubble user">
                <p>我想开一家社区咖啡店，帮我做一个商业策划</p>
              </div>
              <div class="chat-bubble ai">
                <div class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div class="ai-response">
                <div class="response-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  <span>市场分析已完成</span>
                </div>
                <div class="response-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  <span>竞争分析已完成</span>
                </div>
                <div class="response-item active">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <span>盈利模式设计中...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="features">
      <div class="section-container">
        <div class="section-header">
          <span class="section-badge">核心功能</span>
          <h2 class="section-title">一站式商业策划解决方案</h2>
          <p class="section-subtitle">从创意到落地，AI 全程陪伴</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <h3>智能对话</h3>
            <p>通过自然语言对话，AI 深入理解您的商业想法，引导您完善商业计划</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3>专业文档</h3>
            <p>自动生成商业设计说明书、功能设计文档、项目评估报告等专业文档</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3>风险评估</h3>
            <p>智能识别潜在风险，提供风险提示表和应对建议，帮助您规避创业陷阱</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3>案例参考</h3>
            <p>浏览成功案例，获取灵感启发，了解不同行业的商业策划思路</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
            <h3>版本管理</h3>
            <p>支持文档编辑和版本历史，随时回溯修改，保持策划方案的迭代演进</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3>数据安全</h3>
            <p>您的商业想法和策划文档安全存储，严格保护您的商业隐私</p>
          </div>
        </div>
      </div>
    </section>

    <section id="cases" class="cases">
      <div class="section-container">
        <div class="section-header">
          <span class="section-badge">成功案例</span>
          <h2 class="section-title">看看别人的商业策划</h2>
          <p class="section-subtitle">真实案例，获取创业灵感</p>
        </div>
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
        </div>
        <div v-else class="cases-grid">
          <div
            v-for="caseItem in cases"
            :key="caseItem.id"
            class="case-card"
            @click="viewCase(caseItem)"
          >
            <div class="case-header">
              <span class="case-industry">{{ caseItem.industry }}</span>
              <span class="case-views">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                {{ caseItem.viewCount }}
              </span>
            </div>
            <h3 class="case-title">{{ caseItem.title }}</h3>
            <p class="case-summary">{{ caseItem.summary }}</p>
            <div class="case-tags">
              <span v-for="(tag, i) in getParsedHighlights(caseItem.highlights)" :key="i" class="case-tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="cases.length === 0 && !loading" class="empty-state">
          <p>暂无案例</p>
        </div>
      </div>
    </section>

    <section id="pricing" class="pricing">
      <div class="section-container">
        <div class="section-header">
          <span class="section-badge">定价方案</span>
          <h2 class="section-title">选择适合您的方案</h2>
          <p class="section-subtitle">灵活的定价，满足不同需求</p>
        </div>
        <div class="pricing-grid">
          <div class="pricing-card">
            <div class="pricing-header">
              <h3>免费版</h3>
              <div class="pricing-price">
                <span class="price">¥0</span>
                <span class="period">/月</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>每日 1 个项目</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>100 轮对话</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>基础文档生成</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>案例浏览</span>
              </li>
            </ul>
            <button class="btn-outline btn-block" @click="goToRegister">免费开始</button>
          </div>
          <div class="pricing-card featured">
            <div class="pricing-badge">推荐</div>
            <div class="pricing-header">
              <h3>专业版</h3>
              <div class="pricing-price">
                <span class="price">¥99</span>
                <span class="period">/月</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>每日 10 个项目</span>
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
                <span>高级文档模板</span>
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
                <span>版本管理</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                <span>优先客服支持</span>
              </li>
            </ul>
            <button class="btn-primary btn-block" @click="goToRegister">立即升级</button>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="cta-container">
        <h2>准备好开始您的商业策划之旅了吗？</h2>
        <p>立即注册，免费体验 AI 驱动的智能商业策划</p>
        <button class="btn-primary btn-lg" @click="goToRegister">
          <span>免费开始</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span>商业策划机</span>
        </div>
        <p class="footer-copyright">© {{ new Date().getFullYear() }} 商业策划机. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { caseApi } from '@/services/case'
import type { Case } from '@/types'

const router = useRouter()
const cases = ref<Case[]>([])
const loading = ref(true)

onMounted(async () => {
  await loadCases()
})

async function loadCases() {
  try {
    const res = await caseApi.getList({ size: 6 })
    cases.value = res.data.list
  } catch (error) {
    console.error('加载案例失败', error)
  } finally {
    loading.value = false
  }
}

function getParsedHighlights(highlights: string | string[] | undefined): string[] {
  if (!highlights) return []
  if (Array.isArray(highlights)) return highlights.slice(0, 3)
  if (typeof highlights === 'string') {
    try {
      const parsed = JSON.parse(highlights)
      return Array.isArray(parsed) ? parsed.slice(0, 3) : []
    } catch {
      return []
    }
  }
  return []
}

function viewCase(caseItem: Case) {
  router.push(`/case/${caseItem.id}`)
}

function scrollToCases() {
  document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })
}

function goToLogin() {
  router.push('/login')
}

function goToRegister() {
  router.push('/register')
}
</script>

<style scoped lang="scss">
.guest-page {
  min-height: 100%;
  width: 100%;
  background: #0f172a;
  color: #f8fafc;
  overflow-x: hidden;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 16px 24px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #94a3b8;
  font-size: 15px;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #f8fafc;
  }
}

.nav-actions {
  display: flex;
  gap: 12px;
}

.btn-ghost {
  padding: 10px 20px;
  background: transparent;
  border: none;
  color: #f8fafc;
  font-size: 15px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.btn-primary {
  padding: 10px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
}

.btn-outline {
  padding: 10px 24px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f8fafc;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.btn-lg {
  padding: 14px 32px;
  font-size: 16px;
}

.btn-block {
  width: 100%;
  justify-content: center;
}

.hero {
  position: relative;
  padding: 140px 24px 80px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.3), transparent);
}

.hero-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 32px 32px;
}

.hero-container {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-content {
  max-width: 600px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 100px;
  font-size: 14px;
  color: #a5b4fc;
  margin-bottom: 24px;
}

.badge-icon {
  font-size: 16px;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #f8fafc;
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.7;
  color: #94a3b8;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #f8fafc;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

.hero-visual {
  display: flex;
  justify-content: center;
}

.visual-card {
  width: 100%;
  max-width: 480px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-dots {
  display: flex;
  gap: 8px;
  
  span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    
    &:nth-child(1) { background: #ef4444; }
    &:nth-child(2) { background: #f59e0b; }
    &:nth-child(3) { background: #22c55e; }
  }
}

.card-title {
  font-size: 14px;
  color: #94a3b8;
}

.card-content {
  padding: 20px;
}

.chat-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  
  &.user {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #c7d2fe;
  }
  
  &.ai {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
  
  span {
    width: 8px;
    height: 8px;
    background: #6366f1;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.ai-response {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.response-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #94a3b8;
  
  svg {
    width: 16px;
    height: 16px;
    color: #22c55e;
  }
  
  &.active {
    color: #f8fafc;
    
    svg {
      color: #6366f1;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 100px 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 100px;
  font-size: 13px;
  color: #a5b4fc;
  margin-bottom: 16px;
}

.section-title {
  font-size: 40px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 18px;
  color: #64748b;
}

.features {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  padding: 32px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(30, 41, 59, 0.8);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-4px);
  }
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  
  svg {
    width: 24px;
    height: 24px;
    color: #818cf8;
  }
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 15px;
  line-height: 1.6;
  color: #94a3b8;
}

.cases {
  background: #1e293b;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.case-card {
  padding: 24px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(15, 23, 42, 0.8);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-4px);
  }
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.case-industry {
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 100px;
  font-size: 12px;
  color: #a5b4fc;
}

.case-views {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
  
  svg {
    width: 16px;
    height: 16px;
  }
}

.case-title {
  font-size: 18px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 8px;
}

.case-summary {
  font-size: 14px;
  line-height: 1.6;
  color: #94a3b8;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.case-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.case-tag {
  padding: 4px 10px;
  background: rgba(34, 197, 94, 0.15);
  border-radius: 6px;
  font-size: 12px;
  color: #86efac;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 60px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 102, 241, 0.3);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #64748b;
}

.pricing {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.pricing-card {
  position: relative;
  padding: 32px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  
  &.featured {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.3);
  }
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.pricing-header {
  text-align: center;
  margin-bottom: 24px;
  
  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #f8fafc;
    margin-bottom: 8px;
  }
}

.pricing-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  
  .price {
    font-size: 48px;
    font-weight: 700;
    color: #f8fafc;
  }
  
  .period {
    font-size: 16px;
    color: #64748b;
  }
}

.pricing-features {
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

.cta {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  h2 {
    font-size: 32px;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 18px;
    color: #94a3b8;
    margin-bottom: 32px;
  }
}

.footer {
  background: #0a0f1a;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .brand-icon {
    width: 32px;
    height: 32px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
  
  span {
    font-size: 16px;
    font-weight: 600;
    color: #f8fafc;
  }
}

.footer-copyright {
  font-size: 14px;
  color: #64748b;
}

@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  .hero-visual {
    order: -1;
  }
  
  .features-grid,
  .cases-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-stats {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .stat-divider {
    display: none;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .features-grid,
  .cases-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-container {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>
