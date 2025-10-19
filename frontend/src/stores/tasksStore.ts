import { defineStore } from 'pinia'

export type TaskStatus = 'pending' | 'progress' | 'completed' | 'canceled'

export interface Task {
  id: number
  category: string
  status: TaskStatus
  price?: number | null
  title: string
  description: string
  tags?: string[]
  offline: boolean
  deadlineDays?: number
  deadlineAt?: string
  createdBy: number
  isUrgent?: boolean
}

export interface User {
  id: number
  firstName: string
  lastName: string
  avatar: string
  online: boolean
}

export interface CreateTaskPayload {
  category: string
  title: string
  description: string
  price?: number | null
  deadlineDays?: number
  deadlineAt?: string
  tags?: string[]
  offline?: boolean
  status?: TaskStatus
  author?: Partial<User> & { firstName: string; lastName: string }
  isUrgent?: boolean
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    users: [
      { id: 101, firstName: 'Ирина', lastName: 'Полякова', avatar: 'https://i.pravatar.cc/120?img=12', online: true },
      { id: 102, firstName: 'Алексей', lastName: 'Котов', avatar: 'https://i.pravatar.cc/120?img=15', online: false },
      { id: 103, firstName: 'Мария', lastName: 'Иванова', avatar: 'https://i.pravatar.cc/120?img=8', online: true },
    ] as User[],
    tasks: [
      {
        id: 1,
        category: 'Маркетинг',
        status: 'pending',
        price: 2500,
        title: 'Лендинг для кофейни "Daily Grind"',
        description: 'Нужен современный адаптивный лендинг. Яркий визуал, аккуратная структура. Подготовим тексты вместе, дизайн в духе уютной кофейни.',
        tags: ['Дизайн', 'Маркетинг'],
        offline: false,
        deadlineDays: 5,
        createdBy: 101,
        isUrgent: false,
      },
      {
        id: 2,
        category: 'Офлайн',
        status: 'progress',
        price: 1500,
        title: 'Помощь на складе',
        description: 'Разложить товар, провести ревизию, подготовить к отгрузке. Нужен аккуратный и ответственный человек.',
        tags: ['Логистика'],
        offline: true,
        deadlineAt: new Date(Date.now() + 2 * 864e5).toISOString(),
        createdBy: 102,
        isUrgent: true,
      },
      {
        id: 3,
        category: 'IT',
        status: 'completed',
        price: 8000,
        title: 'Верстка корпоративного сайта',
        description: 'Сверстать по готовому дизайну. 4–5 страниц, важна SEO-структура. Будем рады аккуратной адаптивности.',
        tags: ['Web-разработка', 'WordPress'],
        offline: false,
        createdBy: 103,
        isUrgent: false,
      },
      {
        id: 4,
        category: 'Дизайн',
        status: 'canceled',
        price: 500,
        title: 'Оформление поста для соцсетей',
        description: 'Подготовить рекламный пост с учётом брендбука. Приветствуются идеи для анимации.',
        tags: ['SMM'],
        offline: true,
        createdBy: 101,
        isUrgent: false,
      },
    ] as Task[],
  }),
  getters: {
    getById: (state) => (id: number) => state.tasks.find((task) => task.id === id),
    getUser: (state) => (id: number) => state.users.find((user) => user.id === id),
  },
  actions: {
    createTask(payload: CreateTaskPayload) {
      const nextTaskId = this.tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1

      let authorId: number
      if (payload.author) {
        const fallbackUserId = this.users.reduce((max, user) => Math.max(max, user.id), 0) + 1
        authorId = payload.author.id ?? fallbackUserId

        const existingUser = this.users.find((user) => user.id === authorId)
        if (!existingUser) {
          this.users.push({
            id: authorId,
            firstName: payload.author.firstName,
            lastName: payload.author.lastName,
            avatar: payload.author.avatar ?? `https://i.pravatar.cc/120?u=${authorId}`,
            online: payload.author.online ?? true,
          })
        }
      } else {
        authorId = this.users[0]?.id ?? 0
      }

      const newTask: Task = {
        id: nextTaskId,
        category: payload.category,
        status: payload.status ?? 'pending',
        price: payload.price == null ? null : payload.price,
        title: payload.title,
        description: payload.description,
        tags: payload.tags?.slice() ?? [],
        offline: payload.offline ?? false,
        deadlineDays: payload.deadlineDays,
        deadlineAt: payload.deadlineAt,
        createdBy: authorId,
        isUrgent: payload.isUrgent ?? false,
      }

      this.tasks.unshift(newTask)
      return newTask
    },
  },
})
