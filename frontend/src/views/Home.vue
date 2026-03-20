<template>
  <div class="dashboard-page">
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
        
        <div class="quota-card">
          <div class="quota-header">
            <span>今日配额</span>
            <span class="quota-count">{{ userStore.user?.quotaDailyUsed || 0 }} / {{ userStore.isPro ? 10 : 1 }}</span>
          </div>
          <el-progress
            :percentage="quotaPercent"
            :stroke-width="6"
            :show-text="false"
            :color="quotaPercent >= 100 ? '#ef4444' : '#6366f1'"
          />
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
        <div class="header-left">
          <h1>我的项目</h1>
        </div>
        <div class="header-right">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索项目..."
              @input="handleSearch"
            />
          </div>
          <button class="create-btn" @click="showCreateDialog = true" :disabled="quotaPercent >= 100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>新建项目</span>
          </button>
        </div>
      </header>
      
      <div class="content-body">
        <section class="projects-section">
          <div class="section-header">
            <h2>我的项目</h2>
          </div>
          
          <div v-if="projectStore.loading" class="loading-container">
            <div class="spinner"></div>
          </div>
          
          <div v-else-if="!projectStore.hasProjects" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M9 17H5a2 2 0 00-2 2 2 2 0 002 2h2a2 2 0 002-2zm12-2h-4a2 2 0 00-2 2 2 2 0 002 2h2a2 2 0 002-2zM5 3a2 2 0 00-2 2c0 1.1.9 2 2 2h2a2 2 0 012-2 2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V3z"/>
                <path d="M3 14v4a2 2 0 002 2h14a2 2 0 002-2v-4M12 7v10M7 12h10"/>
              </svg>
            </div>
            <h3>暂无项目</h3>
            <p>创建您的第一个商业策划项目</p>
            <button class="primary-btn" @click="showCreateDialog = true">创建第一个项目</button>
          </div>
          
          <div v-else class="projects-grid">
            <div
              v-for="project in projectStore.projects"
              :key="project.id"
              class="project-card"
              @click="handleProjectClick(project)"
            >
              <div class="card-header">
                <el-tag :type="project.status === 'generated' ? 'success' : 'warning'" size="small">
                  {{ PROJECT_STATUS[project.status] }}
                </el-tag>
                <button class="delete-btn" @click.stop="handleDeleteProject(project)" title="删除项目">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
              <h3 class="project-name">{{ project.name }}</h3>
              <p class="project-industry">{{ project.industry }}</p>
              <div class="card-footer">
                <span class="project-date">{{ formatDate(project.createdAt) }}</span>
              </div>
            </div>
          </div>
        </section>
        
        <section class="cases-section">
          <div class="section-header">
            <h2>看看别人的商业策划</h2>
            <button class="text-btn" @click="loadMoreCases">查看更多</button>
          </div>
          
          <div class="cases-grid">
            <div
              v-for="caseItem in cases"
              :key="caseItem.id"
              class="case-card"
              @click="handleCaseClick(caseItem)"
            >
              <div class="case-header">
                <span class="case-industry">{{ caseItem.industry }}</span>
              </div>
              <h3 class="case-title">{{ caseItem.title }}</h3>
              <p class="case-summary">{{ caseItem.summary }}</p>
              <div class="case-footer">
                <span class="case-views">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  {{ caseItem.viewCount }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    
    <el-dialog
      v-model="showCreateDialog"
      width="480px"
      :close-on-click-modal="false"
      class="create-dialog"
      :show-close="false"
    >
      <template #header="{ close }">
        <div class="dialog-header">
          <div class="dialog-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <div class="dialog-title-group">
            <h3 class="dialog-title">创建新项目</h3>
            <p class="dialog-subtitle">开始您的商业策划之旅</p>
          </div>
          <button class="dialog-close" @click="close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </template>
      
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-position="top">
        <el-form-item label="项目名称" prop="name">
          <el-input 
            v-model="createForm.name" 
            placeholder="例如：智能外卖配送平台" 
            size="large"
          />
        </el-form-item>
        <el-form-item label="行业类型" prop="industry">
          <el-select v-model="createForm.industry" placeholder="请选择行业类型" size="large">
            <el-option
              v-for="item in INDUSTRIES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="showCreateDialog = false">取消</el-button>
          <el-button size="large" type="primary" :loading="createLoading" @click="handleCreateProject">
            <svg v-if="!createLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            创建项目
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/user'
import { useProjectStore } from '@/store/project'
import { caseApi } from '@/services/case'
import { INDUSTRIES, PROJECT_STATUS } from '@/types'
import type { Project, Case } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const projectStore = useProjectStore()

const activeMenu = ref('/')
const searchKeyword = ref('')
const showCreateDialog = ref(false)
const createLoading = ref(false)
const createFormRef = ref<FormInstance>()
const cases = ref<Case[]>([])

const createForm = reactive({
  name: '',
  industry: '',
})

const createRules: FormRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '项目名称长度2-50位', trigger: 'blur' },
  ],
  industry: [
    { required: true, message: '请选择行业类型', trigger: 'change' },
  ],
}

const quotaPercent = computed(() => {
  const used = userStore.user?.quotaDailyUsed || 0
  const limit = userStore.isPro ? 10 : 1
  return Math.min((used / limit) * 100, 100)
})

onMounted(async () => {
  await Promise.all([
    userStore.fetchUser(),
    projectStore.fetchProjects(),
    loadCases(),
  ])
})

async function loadCases() {
  try {
    const res = await caseApi.getList({ size: 4 })
    cases.value = res.data.list
  } catch (error) {
    console.error('加载案例失败', error)
  }
}

function loadMoreCases() {
  router.push('/cases')
}

let searchTimer: ReturnType<typeof setTimeout>
function handleSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    projectStore.fetchProjects({ keyword: searchKeyword.value })
  }, 300)
}

async function handleCreateProject() {
  const valid = await createFormRef.value?.validate().catch(() => false)
  if (!valid) return

  createLoading.value = true
  try {
    const res = await projectStore.createProject(createForm)
    userStore.updateQuota((userStore.user?.quotaDailyUsed || 0) + 1)
    showCreateDialog.value = false
    createForm.name = ''
    createForm.industry = ''
    ElMessage.success('项目创建成功')
    router.push(`/project/${res.data.id}`)
  } catch (error: any) {
    ElMessage.error(error.message || '创建失败')
  } finally {
    createLoading.value = false
  }
}

function handleProjectClick(project: Project) {
  router.push(`/project/${project.id}`)
}

function handleProjectAction(cmd: string, project: Project) {
  if (cmd === 'delete') {
    handleDeleteProject(project)
  }
}

async function handleDeleteProject(project: Project) {
  try {
    await ElMessageBox.confirm('确定要删除该项目吗？删除后无法恢复。', '删除确认', {
      type: 'warning',
    })
    await projectStore.deleteProject(project.id)
    ElMessage.success('项目已删除')
  } catch {
    // 用户取消
  }
}

function handleCaseClick(caseItem: Case) {
  router.push(`/case/${caseItem.id}`)
}

function handleLogout() {
  userStore.logout()
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped lang="scss">
.dashboard-page {
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
  margin-bottom: 16px;
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

.user-tag {
  font-size: 11px;
}

.quota-card {
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.quota-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 12px;
}

.quota-count {
  color: #f8fafc;
  font-weight: 500;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #1e293b;
  
  h1 {
    font-size: 24px;
    font-weight: 700;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  
  svg {
    width: 18px;
    height: 18px;
    color: #64748b;
  }
  
  input {
    background: transparent;
    border: none;
    outline: none;
    color: #f8fafc;
    font-size: 14px;
    width: 200px;
    
    &::placeholder {
      color: #64748b;
    }
  }
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.content-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.projects-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
  }
}

.text-btn {
  background: transparent;
  border: none;
  color: #818cf8;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    color: #a5b4fc;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 60px;
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

.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 40px;
      height: 40px;
      color: #6366f1;
    }
  }
  
  h3 {
    font-size: 20px;
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.project-card {
  padding: 24px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(30, 41, 59, 0.8);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-4px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.delete-btn {
  padding: 6px;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.project-industry {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.card-footer {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.project-date {
  font-size: 13px;
  color: #64748b;
}

.cases-section {
  .section-header {
    h2 {
      font-size: 20px;
      font-weight: 600;
    }
  }
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.case-card {
  padding: 24px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(30, 41, 59, 0.8);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-4px);
  }
}

.case-industry {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.15);
  border-radius: 100px;
  font-size: 12px;
  color: #a5b4fc;
  margin-bottom: 16px;
}

.case-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.case-summary {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.case-footer {
  display: flex;
  align-items: center;
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
</style>

<style>
.create-dialog .el-dialog {
  background: #1e293b !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
  overflow: hidden;
}

.create-dialog .el-dialog__header {
  padding: 0 !important;
  border-bottom: none !important;
  margin-right: 0 !important;
}

.create-dialog .el-dialog__body {
  padding: 24px !important;
}

.create-dialog .el-dialog__footer {
  padding: 16px 24px !important;
  border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
  background: transparent !important;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dialog-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
}

.dialog-title-group {
  flex: 1;
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #f8fafc;
  margin: 0;
}

.dialog-subtitle {
  display: none;
}

.dialog-close {
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    width: 16px;
    height: 16px;
    color: #64748b;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    
    svg {
      color: #f8fafc;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

.create-dialog .el-button--primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  border: none !important;
  box-shadow: none !important;
  
  &:hover {
    background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%) !important;
  }
  
  &:focus {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
    border: none !important;
    box-shadow: none !important;
  }
}

.create-dialog .el-button--default {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #94a3b8 !important;
  box-shadow: none !important;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    color: #f8fafc !important;
  }
  
  &:focus {
    background: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #94a3b8 !important;
    box-shadow: none !important;
  }
}
</style>

<style>
.el-select__popper.el-popper {
  background: #1e293b !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;
}

.el-select__popper.el-popper .el-popper__arrow::before {
  background: #1e293b !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.el-select-dropdown {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.el-select-dropdown__wrap {
  padding: 4px 0 !important;
  margin: 0 !important;
  max-height: 274px !important;
}

.el-select-dropdown__list {
  padding: 0 !important;
  margin: 0 !important;
  list-style: none !important;
  display: flex !important;
  flex-direction: column !important;
}

.el-select-dropdown__item {
  padding: 0 16px !important;
  height: 40px !important;
  line-height: 40px !important;
  margin: 0 !important;
  color: #94a3b8 !important;
  background: transparent !important;
  border: none !important;
  transition: all 0.15s ease !important;
  display: flex !important;
  align-items: center !important;
}

.el-select-dropdown__item:hover,
.el-select-dropdown__item.is-hovering {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #f8fafc !important;
}

.el-select-dropdown__item.selected {
  background: rgba(99, 102, 241, 0.15) !important;
  color: #a5b4fc !important;
  font-weight: 500 !important;
}

.create-dialog .el-input__wrapper {
  padding: 0 16px !important;
  height: 40px !important;
  min-height: 40px !important;
}

.create-dialog .el-input__inner {
  height: 40px !important;
  line-height: 40px !important;
}

.create-dialog .el-select .el-select__wrapper {
  height: 40px !important;
  min-height: 40px !important;
  padding: 0 16px !important;
}

.create-dialog .el-select .el-select__selection {
  display: flex !important;
  align-items: center !important;
}

.create-dialog .el-select .el-select__placeholder,
.create-dialog .el-select .el-select__selected-item {
  line-height: 40px !important;
}
</style>
