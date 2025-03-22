import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: {
      title: '登录',
      public: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/account/register/index.vue'),
    meta: { public: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/account/forgot/index.vue'),
    meta: { public: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/home/index.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
      showTabBar: true
    }
  },
  {
    path: '/bill',
    name: 'Bill',
    component: () => import('../views/bill/index.vue'),
    meta: {
      title: '账单',
      keepAlive: true,
      showTabBar: true
    }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/report/index.vue'),
    meta: {
      title: '报表',
      keepAlive: true,
      showTabBar: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/profile/index.vue'),
    meta: {
      title: '我的',
      keepAlive: true,
      showTabBar: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isPublicPage = to.meta.public === true
  const hasToken = !!userStore.token

  if (!isPublicPage && !hasToken) {
    // 非公开页面且未登录，跳转到登录页
    next('/login')
    return
  }

  if (isPublicPage && hasToken) {
    // 已登录时访问登录页，跳转到首页
    next('/home')
    return
  }

  document.title = (to.meta.title as string) || '记账助手'
  next()
})

export default router 