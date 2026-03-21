<template>
  <div class="project-page">
    <header class="mobile-header">
      <button class="mobile-back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>返回</span>
      </button>
      <h1 class="mobile-title">{{ projectStore.currentProject?.name || '对话' }}</h1>
      <div class="mobile-spacer"></div>
    </header>
    
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
        <span class="project-status" :class="projectStore.currentProject?.status">
          {{ projectStore.currentProject ? PROJECT_STATUS[projectStore.currentProject.status] : '' }}
        </span>
      </div>
      
      <div class="turn-indicator">
        <div class="turn-header">
          <span>对话进度</span>
          <span class="turn-count">{{ chatStore.currentTurn }} / {{ chatStore.maxTurns }}</span>
        </div>
        <el-progress
          :percentage="chatStore.turnPercent"
          :color="chatStore.turnColor"
          :stroke-width="6"
          :show-text="false"
        />
        <div v-if="chatStore.isNearLimit" class="turn-warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span>{{ chatStore.isCritical ? '即将达到上限，请准备生成文档' : '对话轮次即将用完' }}</span>
        </div>
      </div>
      
      <div v-if="projectStore.currentProject?.status === 'generated'" class="document-links">
        <h4>生成的文档</h4>
        <div class="doc-list">
          <button
            v-for="doc in documents"
            :key="doc.id"
            class="doc-link"
            @click="viewDocument(doc)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>{{ doc.title }}</span>
          </button>
        </div>
      </div>
    </aside>
    
    <main class="chat-main">
      <div ref="messageListRef" class="message-list">
        <div v-if="chatStore.loading" class="loading-container">
          <div class="spinner"></div>
        </div>
        
        <template v-else>
          <MessageBubble
            v-for="msg in chatStore.messages"
            :key="msg.id"
            :message="msg"
          />
          
          <div v-if="chatStore.sending" class="typing-indicator">
            <div class="ai-avatar">AI</div>
            <div class="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </template>
      </div>
      
      <div class="input-area">
        <div class="input-wrapper">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="输入您的想法..."
            :disabled="projectStore.currentProject?.status === 'generated' || chatStore.sending"
            @keydown.enter.exact="handleEnterKey"
          />
          <div class="input-hint">
            <span>按 Enter 发送，Ctrl+Enter 换行</span>
          </div>
        </div>
        
        <div class="input-actions">
          <div class="quick-actions">
            <button
              v-for="action in quickActions"
              :key="action"
              class="quick-btn"
              @click="inputMessage = action"
            >
              {{ action }}
            </button>
          </div>
          
          <div class="main-actions">
            <span class="char-count">{{ inputMessage.length }} / 2000</span>
            <button
              v-if="projectStore.currentProject?.status === 'generated'"
              class="primary-btn"
              @click="generateDocuments"
            >
              <span>重新生成文档</span>
            </button>
            <button
              v-else-if="chatStore.currentTurn >= 80"
              class="success-btn"
              @click="generateDocuments"
            >
              <span>生成文档</span>
            </button>
            <button
              v-else
              class="primary-btn"
              :disabled="!inputMessage.trim() || chatStore.sending"
              @click="sendMessage"
            >
              <span v-if="chatStore.sending" class="btn-spinner"></span>
              <span v-else>发送</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '@/store/project'
import { useChatStore } from '@/store/chat'
import { documentApi } from '@/services/document'
import { PROJECT_STATUS } from '@/types'
import type { Document } from '@/types'
import MessageBubble from '@/components/MessageBubble.vue'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const chatStore = useChatStore()

const showMobileMenu = ref(false)
const messageListRef = ref<HTMLElement>()
const inputMessage = ref('')
const documents = ref<Document[]>([])

const quickActions = [
  '分析竞争对手',
  '设计盈利模式',
  '规划发展阶段',
  '评估市场风险',
]

const projectId = route.params.id as string

onMounted(async () => {
  await projectStore.fetchProject(projectId)
  await chatStore.fetchMessages(projectId)
  chatStore.setCurrentTurn(projectStore.currentProject?.currentTurn || 0)
  
  if (projectStore.currentProject?.status === 'generated') {
    await loadDocuments()
  }
  
  scrollToBottom()
})

watch(
  () => chatStore.messages.length,
  () => {
    nextTick(scrollToBottom)
  }
)

async function loadDocuments() {
  try {
    const res = await documentApi.getList(projectId)
    documents.value = res.data
  } catch (error) {
    console.error('加载文档失败', error)
  }
}

function scrollToBottom() {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

function handleEnterKey(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey) {
    const textarea = event.target as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    inputMessage.value = inputMessage.value.substring(0, start) + '\n' + inputMessage.value.substring(end)
    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1
    })
    event.preventDefault()
  } else {
    event.preventDefault()
    sendMessage()
  }
}

async function sendMessage() {
  if (!inputMessage.value.trim()) return
  
  const content = inputMessage.value.trim()
  inputMessage.value = ''
  
  try {
    await chatStore.sendMessage(projectId, content)
    nextTick(scrollToBottom)
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
  }
}

async function generateDocuments() {
  try {
    ElMessage.success('文档生成中，请稍候...')
    await documentApi.generate({ projectId })
    ElMessage.success('文档生成成功')
    await projectStore.fetchProject(projectId)
    await loadDocuments()
  } catch (error: any) {
    ElMessage.error(error.message || '生成失败')
  }
}

function viewDocument(doc: Document) {
  router.push(`/project/${projectId}/docs?docId=${doc.id}`)
}

function goBack() {
  router.push('/dashboard')
}
</script>

<style scoped lang="scss">
.project-page {
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
    margin-bottom: 12px;
  }
}

.project-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
  
  &.generating {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
  }
  
  &.generated {
    background: rgba(34, 197, 94, 0.15);
    color: #4ade80;
  }
}

.turn-indicator {
  padding: 20px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.turn-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 12px;
}

.turn-count {
  font-weight: 600;
  color: #f8fafc;
}

.turn-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 8px;
  font-size: 12px;
  color: #fbbf24;
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
}

.document-links {
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

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: #cbd5e1;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  
  svg {
    width: 18px;
    height: 18px;
    color: #6366f1;
    flex-shrink: 0;
  }
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.2);
    color: #f8fafc;
  }
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.typing-dots {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  
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

.input-area {
  padding: 20px 24px;
  background: #1e293b;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.input-wrapper {
  :deep(.el-textarea__inner) {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: none !important;
    border-radius: 12px;
    color: #f8fafc !important;
    font-size: 15px;
    padding: 16px;
    resize: none;
    
    &::placeholder {
      color: #64748b;
    }
    
    &:hover {
      border-color: rgba(99, 102, 241, 0.3) !important;
    }
    
    &:focus {
      border-color: #6366f1 !important;
    }
  }
}

.input-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
  text-align: right;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.quick-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.2);
    color: #a5b4fc;
  }
}

.main-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.char-count {
  font-size: 13px;
  color: #64748b;
}

.primary-btn, .success-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.primary-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.success-btn {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
  }
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 100;
  width: 44px;
  height: 44px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  svg {
    width: 24px;
    height: 24px;
    color: #f8fafc;
  }
}

.mobile-close-btn {
  display: none;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  svg {
    width: 20px;
    height: 20px;
    color: #94a3b8;
  }
}

@media (max-width: 768px) {
  .mobile-header {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #1e293b;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    z-index: 100;
  }
  
  .mobile-back-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #f8fafc;
    font-size: 14px;
    cursor: pointer;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
  
  .mobile-title {
    font-size: 16px;
    font-weight: 600;
    color: #f8fafc;
    margin: 0;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    flex: 1;
  }
  
  .mobile-spacer {
    width: 80px;
  }
  
  .sidebar {
    display: none;
  }
  
  .chat-main {
    width: 100%;
    padding-top: 56px;
  }
  
  .message-list {
    padding: 16px;
  }
  
  .input-area {
    padding: 12px 16px;
  }
  
  .input-hint {
    display: none;
  }
  
  .input-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .quick-actions {
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  .quick-btn {
    flex-shrink: 0;
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .main-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .primary-btn, .success-btn {
    padding: 10px 20px;
    min-width: 80px;
  }
}

@media (min-width: 769px) {
  .mobile-header {
    display: none;
  }
  
  .mobile-overlay {
    display: none;
  }
}
</style>
