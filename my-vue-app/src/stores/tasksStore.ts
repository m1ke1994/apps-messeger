import { defineStore } from 'pinia'

export type TaskStatus = 'pending' | 'progress' | 'completed' | 'canceled'

export interface Task {
  id: number
  category: 'Маркетинг' | 'IT' | 'Дизайн' | 'Офлайн'
  status: TaskStatus
  price?: number | null
  title: string
  description: string
  tags?: string[]
  offline: boolean
  deadlineDays?: number
  deadlineAt?: string
  createdBy: number // userId
}

export interface User {
  id: number
  firstName: string
  lastName: string
  avatar: string
  online: boolean
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    users: [
      { id: 101, firstName: 'Ирина', lastName: 'Полякова', avatar: 'https://i.pravatar.cc/120?img=12', online: true },
      { id: 102, firstName: 'Алексей', lastName: 'Котов',   avatar: 'https://i.pravatar.cc/120?img=15', online: false },
      { id: 103, firstName: 'Мария',  lastName: 'Иванова', avatar: 'https://i.pravatar.cc/120?img=8',  online: true },
    ] as User[],
    tasks: [
      { id: 1, category: 'Маркетинг', status: 'pending',  price: 2500, title: 'Лендинг для кофейни "Daily Grind"', description: 'Нужен современный адаптивный лендинг. Яркий визуал, аккуратная структура.', tags: ['Дизайн', 'Маркетинг'], offline: false, deadlineDays: 5, createdBy: 101 },
      { id: 2, category: 'Офлайн',    status: 'progress',  price: 1500, title: 'Помощь на складе', description: 'Разложить товар, провести ревизию, подготовить к отгрузке.', tags: ['Логистика'], offline: true, deadlineAt: new Date(Date.now()+2*864e5).toISOString(), createdBy: 102 },
      { id: 3, category: 'IT',        status: 'completed', price: 8000, title: 'Верстка корпоративного сайта', description: 'Сверстать по готовому дизайну. 4–5 страниц, важна SEO-структура.', tags: ['Web-разработка', 'WordPress'], offline: false, createdBy: 103 },
      { id: 4, category: 'Дизайн',    status: 'canceled',  price: 500,  title: 'Оформление поста для соцсетей', description: 'Подготовить рекламный пост с учётом брендбука.', tags: ['SMM'], offline: true, createdBy: 101 },
    ] as Task[],
  }),
  getters: {
    getById: (state) => (id: number) => state.tasks.find(t => t.id === id),
    getUser: (state) => (id: number) => state.users.find(u => u.id === id),
  },
})
