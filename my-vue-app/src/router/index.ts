import { createRouter, createWebHistory } from 'vue-router'
import { useNavigationDirectionStore } from '../stores/navigationDirection'
import type { NavigationDirection } from '../stores/navigationDirection'

type HistoryTraversalState = {
  back?: string | null
  current?: string | null
  forward?: string | null
  position?: number
}

let pendingDirection: NavigationDirection | null = null
let lastHistoryPosition =
  typeof window !== 'undefined' && typeof window.history.state?.position === 'number'
    ? window.history.state.position
    : 0

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/chats' },

    {
      path: '/chats',
      name: 'chats',
      component: () => import('../views/Chats.vue'),
      meta: { title: 'Чаты' },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/Tasks.vue'),
      meta: { title: 'Задачи', showBack: true },
    },
    {
      path: '/tasks/:id(\\d+)',
      name: 'task-detail',
      component: () => import('../views/TaskDetail.vue'), // ✅ lazy import вместо необъявленного TaskDetail
      props: true,
      meta: { title: 'Задача', showBack: true },
    },
    {
      path: '/responses',
      name: 'responses',
      component: () => import('../views/Responce.vue'), // проверь точное имя файла
      meta: { title: 'Отклики', showBack: true },
    },
    {
      path: '/create-task',
      name: 'create-task',
      component: () => import('../views/CreateTasks.vue'),
      meta: { title: 'Создать задачу', showBack: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { title: 'Профиль', showBack: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
      meta: { title: 'Настройки', showBack: true },
    },
    { path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { layout: 'auth', title: 'Вход' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/chats' },
  ],
})

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', (event) => {
    const state = (event.state ?? window.history.state ?? {}) as HistoryTraversalState
    const nextPosition = typeof state.position === 'number' ? state.position : undefined

    if (typeof nextPosition === 'number') {
      pendingDirection = nextPosition < lastHistoryPosition ? 'back' : 'forward'
    } else {
      pendingDirection = 'back'
    }
  })
}

router.beforeEach((_to, _from, next) => {
  const navigationStore = useNavigationDirectionStore()
  const manualDirection = navigationStore.consumePreparedDirection()
  navigationStore.setDirection(pendingDirection ?? manualDirection ?? 'forward')
  pendingDirection = null
  next()
})

router.afterEach(() => {
  const state = router.options.history.state as HistoryTraversalState | undefined
  if (typeof state?.position === 'number') {
    lastHistoryPosition = state.position
  }
})

export default router
