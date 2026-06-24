import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/index.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/register/index.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/ai-qa',
      name: 'ai-qa',
      component: () => import('@/pages/ai-qa/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('@/pages/news/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/news/detail/:id',
      name: 'news-detail',
      component: () => import('@/pages/news/detail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/training',
      name: 'training',
      component: () => import('@/pages/training/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/training/psych-test',
      name: 'psych-test',
      component: () => import('@/pages/training/psych-test.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/training/theory',
      name: 'theory',
      component: () => import('@/pages/training/theory.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/training/video',
      name: 'video',
      component: () => import('@/pages/training/video.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/training/safety-test',
      name: 'safety-test',
      component: () => import('@/pages/training/safety-test.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: () => import('@/pages/monitor/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/monitor/electrolyzer',
      name: 'electrolyzer',
      component: () => import('@/pages/monitor/electrolyzer.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/monitor/purchase',
        name: 'purchase',
        component: () => import('@/pages/monitor/purchase.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/pages/profile/index.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/profile/learning-records',
        name: 'learning-records',
        component: () => import('@/pages/profile/learning-records.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/profile/notifications',
        name: 'notifications',
        component: () => import('@/pages/profile/notifications.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/profile/salary',
        name: 'salary',
        component: () => import('@/pages/profile/salary.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/profile/settings',
        name: 'settings',
        component: () => import('@/pages/profile/settings.vue'),
        meta: { requiresAuth: true }
      }
    ]
  })

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth !== false) {
    if (!userStore.checkAuth()) {
      next('/login')
      return
    }
    
    if (to.meta.requiresAdmin && !userStore.isAdmin) {
      next('/monitor')
      return
    }
  }
  
  if (to.path === '/login' && userStore.isLoggedIn) {
    const defaultPath = userStore.isAdmin ? '/monitor' : '/ai-qa'
    next(defaultPath)
    return
  }
  
  next()
})

export default router
