import { createRouter, createWebHistory } from 'vue-router'
import { useNavigationDirectionStore } from '../stores/navigationDirection'
import { useUserStore } from '../stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, left: 0 }
  },
  routes: [
    { path: '/', redirect: '/auth' },

    {
      path: '/chats',
      name: 'chats',
      component: () => import('../views/Chats.vue'),
      meta: { title: 'Чаты' },
    },
    {
      path: '/chats/:id',
      name: 'chat-detail',
      component: () => import('../views/ChatsDetail.vue'),
      props: true,
      meta: { title: 'Диалог', showBack: true },
    },
    {
      path: '/chats/:id/audio',
      name: 'chat-audio-call',
      component: () => import('../views/AudioCall.vue'),
      props: true,
      meta: { title: 'Аудиозвонок', showBack: true, hideNav: true },
    },
    {
      path: '/chats/:id/video',
      name: 'chat-video-call',
      component: () => import('../views/VideoCall.vue'),
      props: true,
      meta: { title: 'Видеозвонок', showBack: true, hideNav: true },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/Tasks.vue'),
      meta: { title: 'Задания', showBack: true },
    },
    {
      path: '/tasks/:id(\\d+)',
      name: 'task-detail',
      component: () => import('../views/TaskDetail.vue'),
      props: true,
      meta: { title: 'Задание', showBack: true },
    },
    {
      path: '/responses',
      name: 'responses',
      component: () => import('../views/Responce.vue'),
      meta: { title: 'Мои отклики', showBack: true },
    },
    {
      path: '/create-task',
      name: 'create-task',
      component: () => import('../views/CreateTasks.vue'),
      meta: { title: 'Создание задания', showBack: true },
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
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthPage.vue'),
      meta: { layout: 'auth', title: 'Авторизация' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/auth' },
  ],
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const hasStored = userStore.hydrateFromStorage()
  const isAuthenticated = Boolean(userStore.profile || hasStored)

  if (to.name === 'auth' && isAuthenticated) {
    next({ name: 'chats', replace: true })
    return
  }

  if (to.name !== 'auth' && !isAuthenticated) {
    next({ name: 'auth', replace: true })
    return
  }

  const navigationStore = useNavigationDirectionStore()
  const manualDirection = navigationStore.consumePreparedDirection()
  navigationStore.setDirection(manualDirection ?? 'forward')
  next()
})

export default router
