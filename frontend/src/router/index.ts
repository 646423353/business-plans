import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Guest.vue'),
    meta: { title: '首页', public: true },
  },
  {
    path: '/auth/callback',
    name: 'OAuthCallback',
    component: () => import('@/views/OAuthCallback.vue'),
    meta: { title: '登录中...', public: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Home.vue'),
    meta: { title: '我的项目' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', public: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册', public: true },
  },
  {
    path: '/project/:id',
    name: 'Project',
    component: () => import('@/views/Project.vue'),
    meta: { title: '项目详情' },
  },
  {
    path: '/project/:id/docs',
    name: 'Documents',
    component: () => import('@/views/Documents.vue'),
    meta: { title: '文档' },
  },
  {
    path: '/case/:id',
    name: 'Case',
    component: () => import('@/views/Case.vue'),
    meta: { title: '案例详情', public: true },
  },
  {
    path: '/cases',
    name: 'Cases',
    component: () => import('@/views/Cases.vue'),
    meta: { title: '案例列表', public: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { title: '设置' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面不存在', public: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  document.title = `${to.meta.title || '商业策划机'} - 商业策划机`

  const userStore = useUserStore()
  const isPublic = to.meta.public

  if (userStore.isLoggedIn && to.name === 'Home') {
    return { name: 'Dashboard' }
  }

  if (!isPublic && !userStore.isLoggedIn) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
})

export default router
