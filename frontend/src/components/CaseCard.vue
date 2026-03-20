<template>
  <div class="case-card" @click="$emit('click')">
    <div class="card-header">
      <span class="industry-tag">{{ caseData.industry }}</span>
      <span class="view-count">
        <el-icon><View /></el-icon>
        {{ caseData.viewCount }}
      </span>
    </div>
    
    <h4 class="case-title">{{ caseData.title }}</h4>
    
    <p class="case-summary">{{ caseData.summary }}</p>
    
    <div class="highlights">
      <el-tag
        v-for="(highlight, index) in parsedHighlights"
        :key="index"
        size="small"
        type="info"
      >
        {{ highlight }}
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Case } from '@/types'

const props = defineProps<{
  caseData: Case
}>()

defineEmits<{
  click: []
}>()

const parsedHighlights = computed(() => {
  const highlights = props.caseData.highlights
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
})
</script>

<style scoped lang="scss">
.case-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e4e7ed;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.industry-tag {
  font-size: 12px;
  color: #409eff;
  background: rgba(64, 158, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.view-count {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.case-title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-summary {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
