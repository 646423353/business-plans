<template>
  <div class="documents-page">
    <aside class="sidebar">
      <div class="sidebar-header">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>返回</span>
        </button>
      </div>
      
      <div class="project-info">
        <h3>{{ projectStore.currentProject?.name }}</h3>
        <span class="project-industry">{{ projectStore.currentProject?.industry }}</span>
      </div>
      
      <div class="doc-list">
        <h4>文档列表</h4>
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="doc-item"
          :class="{ active: currentDoc?.id === doc.id }"
          @click="selectDoc(doc)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <div class="doc-info">
            <span class="doc-title">{{ doc.title }}</span>
            <span class="doc-date">{{ formatDate(doc.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </aside>
    
    <main class="doc-main">
      <div v-if="!currentDoc" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h3>选择文档</h3>
        <p>从左侧列表选择要查看的文档</p>
      </div>
      
      <template v-else>
        <header class="doc-header">
          <div class="header-left">
            <h1>{{ currentDoc.title }}</h1>
            <span class="doc-meta">最后更新: {{ formatDate(currentDoc.updatedAt, true) }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click="copyContent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <span>复制</span>
            </button>
            <button class="action-btn primary" @click="downloadDoc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span>下载</span>
            </button>
          </div>
        </header>
        
        <div class="doc-content">
          <div class="markdown-body" v-html="renderedContent"></div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '@/store/project'
import { documentApi } from '@/services/document'
import type { Document } from '@/types'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const documents = ref<Document[]>([])
const currentDoc = ref<Document | null>(null)

const projectId = route.params.id as string

const renderedContent = computed(() => {
  if (!currentDoc.value?.content) return ''
  return marked(currentDoc.value.content)
})

onMounted(async () => {
  await projectStore.fetchProject(projectId)
  await loadDocuments()
  
  const docId = route.query.docId as string
  if (docId) {
    const doc = documents.value.find(d => d.id === docId)
    if (doc) selectDoc(doc)
  } else if (documents.value.length > 0) {
    selectDoc(documents.value[0])
  }
})

async function loadDocuments() {
  try {
    const res = await documentApi.getList(projectId)
    documents.value = res.data
  } catch (error) {
    console.error('加载文档失败', error)
  }
}

function selectDoc(doc: Document) {
  currentDoc.value = doc
}

function copyContent() {
  if (!currentDoc.value?.content) return
  navigator.clipboard.writeText(currentDoc.value.content)
  ElMessage.success('已复制到剪贴板')
}

function downloadDoc() {
  if (!currentDoc.value) return
  const blob = new Blob([currentDoc.value.content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${currentDoc.value.title}.md`
  a.click()
  URL.revokeObjectURL(url)
}

function goBack() {
  router.push(`/project/${projectId}`)
}

function formatDate(date: string | Date, full = false) {
  const d = new Date(date)
  if (full) {
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<style scoped lang="scss">
.documents-page {
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
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  display: flex;
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

.project-info {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
}

.project-industry {
  font-size: 13px;
  color: #94a3b8;
}

.doc-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  
  h4 {
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.doc-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    width: 20px;
    height: 20px;
    color: #6366f1;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.2);
  }
  
  &.active {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
  }
}

.doc-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.doc-title {
  font-size: 14px;
  font-weight: 500;
  color: #f8fafc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-date {
  font-size: 12px;
  color: #64748b;
}

.doc-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    
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
  }
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: #1e293b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }
}

.doc-meta {
  font-size: 13px;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
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
  
  &.primary {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border: none;
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
    }
  }
}

.doc-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.markdown-body {
  max-width: 800px;
  margin: 0 auto;
  font-size: 15px;
  line-height: 1.8;
  color: #cbd5e1;
  
  :deep(h1) {
    font-size: 32px;
    font-weight: 700;
    color: #f8fafc;
    margin: 0 0 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  :deep(h2) {
    font-size: 24px;
    font-weight: 600;
    color: #f8fafc;
    margin: 32px 0 16px;
  }
  
  :deep(h3) {
    font-size: 20px;
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
  
  :deep(hr) {
    margin: 32px 0;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
