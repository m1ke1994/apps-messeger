import { createRouter, createWebHistory } from 'vue-router'
import { useNavigationDirectionStore } from '../stores/navigationDirection'

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
    // ✅ Детальная страница чата
    {
  path: '/chats/:id',            // ⬅ без (\d+)
  name: 'chat-detail',
  component: () => import('../views/ChatsDetail.vue'),
  props: true,
  meta: { title: 'Диалог', showBack: true },
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
      component: () => import('../views/TaskDetail.vue'),
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
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { layout: 'auth', title: 'Вход' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/chats' },
  ],
})

router.beforeEach((_to, _from, next) => {
  const navigationStore = useNavigationDirectionStore()
  const manualDirection = navigationStore.consumePreparedDirection()
  navigationStore.setDirection(manualDirection ?? 'forward')
  next()
})

export default router
