import { createRouter, createWebHistory } from 'vue-router'
import { useNavigationDirectionStore } from '../stores/navigationDirection'
import { useUserStore } from '../stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/auth' },

    {
      path: '/chats',
      name: 'chats',
      component: () => import('../views/Chats.vue'),
      meta: { title: 'Чаты' }
    },
    // ✅ Детальная страница чата
    {
      path: '/chats/:id', // ⬅ без (\d+)
      name: 'chat-detail',
      component: () => import('../views/ChatsDetail.vue'),
      props: true,
      meta: { title: 'Диалог', showBack: true }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/Tasks.vue'),
      meta: { title: 'Задачи', showBack: true }
    },
    {
      path: '/tasks/:id(\\d+)',
      name: 'task-detail',
      component: () => import('../views/TaskDetail.vue'),
      props: true,
      meta: { title: 'Задача', showBack: true }
    },
    {
      path: '/responses',
      name: 'responses',
      component: () => import('../views/Responce.vue'), // проверь точное имя файла
      meta: { title: 'Отклики', showBack: true }
    },
    {
      path: '/create-task',
      name: 'create-task',
      component: () => import('../views/CreateTasks.vue'),
      meta: { title: 'Создать задачу', showBack: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { title: 'Профиль', showBack: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
      meta: { title: 'Настройки', showBack: true }
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthPage.vue'),
      meta: { layout: 'auth', title: 'Авторизация' }
    },
    { path: '/:pathMatch(.*)*', redirect: '/auth' }
  ]
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = Boolean(userStore.profile)

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
