<template>
  <div class="project-card" @click="$emit('click')">
    <div class="card-header">
      <span class="industry-tag">{{ project.industry }}</span>
      <el-tag
        :type="project.status === 'generated' ? 'success' : 'warning'"
        size="small"
      >
        {{ PROJECT_STATUS[project.status] }}
      </el-tag>
    </div>
    
    <h4 class="project-name">{{ project.name }}</h4>
    
    <div class="project-info">
      <span v-if="project.status === 'analyzing'">
        <el-icon><ChatDotRound /></el-icon>
        第 {{ project.currentTurn }} 轮对话
      </span>
      <span v-else>
        <el-icon><Document /></el-icon>
        已生成文档
      </span>
    </div>
    
    <div class="card-footer">
      <span class="update-time">
        {{ formatTime(project.updatedAt) }}
      </span>
      <el-button
        text
        type="danger"
        size="small"
        @click.stop="$emit('delete')"
      >
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { Project } from '@/types'
import { PROJECT_STATUS } from '@/types'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

defineProps<{
  project: Project
}>()

defineEmits<{
  click: []
  delete: []
}>()

function formatTime(time: string) {
  return dayjs(time).fromNow()
}
</script>

<style scoped lang="scss">
.project-card {
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
  color: #909399;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
}

.project-name {
  font-size: 16px;
  color: #303133;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-info {
  font-size: 13px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f5f7fa;
}

.update-time {
  font-size: 12px;
  color: #c0c4cc;
}
</style>
