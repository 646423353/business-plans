<template>
  <div class="message-bubble" :class="[message.role]">
    <div class="avatar">
      <el-avatar v-if="message.role === 'user'" :size="36" class="user-avatar">
        {{ userStore.user?.username?.charAt(0) }}
      </el-avatar>
      <el-avatar v-else :size="36" class="ai-avatar">
        AI
      </el-avatar>
    </div>
    
    <div class="message-content">
      <div v-if="message.role === 'assistant'" class="markdown-body" v-html="renderedContent" />
      <div v-else class="user-message">{{ message.content }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import { useUserStore } from '@/store/user'
import type { Message } from '@/types'

const props = defineProps<{
  message: Message
}>()

const userStore = useUserStore()

const renderedContent = computed(() => {
  if (props.message.role !== 'assistant') return ''
  return marked(props.message.content) as string
})
</script>

<style scoped lang="scss">
.message-bubble {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  &.user {
    flex-direction: row-reverse;

    .message-content {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #fff;
      border-radius: 16px 16px 4px 16px;
    }
  }

  &.assistant {
    .message-content {
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px 16px 16px 4px;
      color: #f8fafc;
    }
  }
}

.avatar {
  flex-shrink: 0;
}

.user-avatar {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.ai-avatar {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.message-content {
  max-width: 70%;
  padding: 14px 18px;
  font-size: 15px;
  line-height: 1.7;
}

.user-message {
  white-space: pre-wrap;
  word-break: break-word;
}

.markdown-body {
  color: #f8fafc;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin-top: 20px;
    margin-bottom: 12px;
    color: #f8fafc;
    font-weight: 600;
  }

  :deep(h1) {
    font-size: 22px;
  }

  :deep(h2) {
    font-size: 18px;
  }

  :deep(h3) {
    font-size: 16px;
  }

  :deep(p) {
    margin-bottom: 12px;
    color: #e2e8f0;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 24px;
    margin-bottom: 12px;
    color: #e2e8f0;
    
    li {
      margin-bottom: 6px;
    }
  }

  :deep(blockquote) {
    margin: 12px 0;
    padding: 12px 16px;
    background: rgba(99, 102, 241, 0.15);
    border-left: 3px solid #6366f1;
    border-radius: 0 8px 8px 0;
    color: #a5b4fc;
  }

  :deep(code) {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 14px;
    color: #f472b6;
  }

  :deep(pre) {
    background: #0f172a;
    padding: 16px;
    border-radius: 10px;
    overflow-x: auto;
    margin-bottom: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);

    code {
      background: none;
      padding: 0;
      color: #e2e8f0;
    }
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;

    th,
    td {
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 10px 14px;
      text-align: left;
    }

    th {
      background: rgba(255, 255, 255, 0.05);
      color: #f8fafc;
      font-weight: 600;
    }
    
    td {
      color: #e2e8f0;
    }
  }

  :deep(strong) {
    color: #f8fafc;
    font-weight: 600;
  }

  :deep(a) {
    color: #818cf8;
    
    &:hover {
      color: #a5b4fc;
    }
  }
}
</style>
