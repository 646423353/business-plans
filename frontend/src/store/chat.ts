import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chatApi } from '@/services/chat'
import type { Message } from '@/types'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const sending = ref(false)
  const currentTurn = ref(0)
  const maxTurns = 100

  const turnPercent = computed(() => {
    const turn = currentTurn.value || 0
    return Math.min((turn / maxTurns) * 100, 100)
  })
  const isNearLimit = computed(() => currentTurn.value >= 80)
  const isCritical = computed(() => currentTurn.value >= 95)
  const turnColor = computed(() => {
    if (isCritical.value) return '#F56C6C'
    if (isNearLimit.value) return '#E6A23C'
    return '#6366f1'
  })

  async function fetchMessages(projectId: string, params?: { page?: number; size?: number }) {
    loading.value = true
    try {
      const res = await chatApi.getHistory(projectId, params)
      messages.value = res.data.list
      return res
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(projectId: string, content: string) {
    sending.value = true
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      projectId,
      turn: currentTurn.value + 1,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    messages.value.push(tempUserMessage)
    
    try {
      const res = await chatApi.sendMessage({ projectId, content })
      messages.value = messages.value.filter(m => m.id !== tempUserMessage.id)
      messages.value.push(res.data.userMessage)
      messages.value.push(res.data.aiMessage)
      currentTurn.value = res.data.aiMessage.turn || 0
      return res
    } catch (error) {
      messages.value = messages.value.filter(m => m.id !== tempUserMessage.id)
      throw error
    } finally {
      sending.value = false
    }
  }

  function addAIMessage(message: Message) {
    messages.value.push(message)
  }

  function setCurrentTurn(turn: number) {
    currentTurn.value = turn || 0
  }

  function clearMessages() {
    messages.value = []
    currentTurn.value = 0
  }

  return {
    messages,
    loading,
    sending,
    currentTurn,
    maxTurns,
    turnPercent,
    isNearLimit,
    isCritical,
    turnColor,
    fetchMessages,
    sendMessage,
    addAIMessage,
    setCurrentTurn,
    clearMessages,
  }
})
