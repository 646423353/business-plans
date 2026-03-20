import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectApi } from '@/services/project'
import type { Project } from '@/types'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const total = ref(0)

  const hasProjects = computed(() => projects.value.length > 0)

  async function fetchProjects(params?: { page?: number; size?: number; keyword?: string }) {
    loading.value = true
    try {
      const res = await projectApi.getList(params)
      projects.value = res.data.list
      total.value = res.data.total
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id: string) {
    loading.value = true
    try {
      const res = await projectApi.getById(id)
      currentProject.value = res.data
      return res
    } finally {
      loading.value = false
    }
  }

  async function createProject(data: { name: string; industry: string }) {
    const res = await projectApi.create(data)
    projects.value.unshift(res.data)
    return res
  }

  async function deleteProject(id: string) {
    await projectApi.delete(id)
    projects.value = projects.value.filter((p) => p.id !== id)
    if (currentProject.value?.id === id) {
      currentProject.value = null
    }
  }

  function clearCurrentProject() {
    currentProject.value = null
  }

  return {
    projects,
    currentProject,
    loading,
    total,
    hasProjects,
    fetchProjects,
    fetchProject,
    createProject,
    deleteProject,
    clearCurrentProject,
  }
})
