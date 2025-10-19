<template>
  <div
    class="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-background-light font-display text-text-light dark:bg-background-dark dark:text-text-dark"
  >
  

    <main class="flex-1 px-4 py-6 sm:px-6">
      <section class="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <article
          v-for="item in respondedTasks"
          :key="item.task.id"
          class="group relative overflow-hidden rounded-2xl border border-black/10 bg-card-light/90 shadow-soft transition hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(15,23,42,.14)] dark:border-white/10 dark:bg-card-dark/90 dark:shadow-none"
        >
          <div class="flex items-start justify-between gap-3 border-b border-black/5 px-5 pb-3 pt-4 dark:border-white/5">
            <span
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold"
              :class="statusChip[item.task.status]"
            >
              <span class="block h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: statusColors[item.task.status] }" />
              {{ statusLabels[item.task.status] }}
            </span>

            <span
              v-if="item.task.price != null"
              class="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary backdrop-blur dark:bg-primary/15"
            >
              {{ item.task.price.toLocaleString('ru-RU') }} ₽
            </span>
          </div>

          <div class="space-y-4 px-5 pb-5 pt-4">
            <div class="space-y-2">
              <h2 class="text-lg font-semibold leading-snug">{{ item.task.title }}</h2>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                {{ item.task.description }}
              </p>

              <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span
                  class="rounded-full border border-black/10 bg-primary/10 px-2.5 py-1 font-semibold text-primary dark:border-white/10"
                >
                  {{ item.task.category }}
                </span>
                <span v-if="item.task.deadlineDays" class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/10">
                  Срок: {{ item.task.deadlineDays }} {{ dayWord(item.task.deadlineDays) }}
                </span>
                <span v-else-if="item.task.deadlineAt" class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/10">
                  Срок: {{ formatDeadline(item.task.deadlineAt) }}
                </span>
                <span
                  v-if="item.task.isUrgent"
                  class="rounded-full bg-rose-100 px-2.5 py-1 font-semibold text-rose-700 dark:bg-rose-400/15 dark:text-rose-300"
                >
                  Срочно
                </span>
                <template v-for="tag in item.task.tags" :key="tag">
                  <span class="rounded-full bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary/80">
                    #{{ tag }}
                  </span>
                </template>
              </div>
            </div>

            <div
              class="rounded-2xl border border-black/10 bg-white/80 p-4 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Статус отклика
                  </p>
                  <p
                    class="mt-0.5 text-sm font-semibold"
                    :class="responseStatusStyles[item.response.status]?.text ?? 'text-slate-700 dark:text-slate-200'"
                  >
                    {{ responseStatusStyles[item.response.status]?.label ?? item.response.status }}
                  </p>
                  <p class="mt-3 leading-relaxed">
                    {{ item.response.message }}
                  </p>
                </div>
                <span
                  class="inline-flex items-center rounded-full bg-slate-200/70 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-300"
                >
                  Отправлено {{ formatDateTime(item.response.sentAt) }}
                </span>
              </div>
            </div>

            <footer class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="btn h-10 flex-1 rounded-xl px-4 text-sm font-semibold"
                @click="openTask(item.task.id)"
              >
                Перейти к задаче
              </button>
              <button
                type="button"
                class="btn-icon h-10 w-10"
                :aria-label="`Чат по задаче ${item.task.title}`"
                @click="openChat(item.task.id)"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path
                    d="M5 5h14a1 1 0 0 1 1 1v12.2a1 1 0 0 1-1.58.82l-3.84-2.75a1 1 0 0 0-.58-.18H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </footer>
          </div>
        </article>

        <p
          v-if="!respondedTasks.length"
          class="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
        >
          Пока вы не откликались на задания. Как только отправите первый отклик, он появится здесь.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasksStore'

interface ResponseMeta {
  taskId: number
  status: 'waiting' | 'accepted' | 'declined'
  sentAt: string
  message: string
}

const responses: ResponseMeta[] = [
  {
    taskId: 2,
    status: 'waiting',
    sentAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    message: 'Готов приступить в течение дня. Могу отправить первые макеты уже завтра утром.',
  },
  {
    taskId: 1,
    status: 'accepted',
    sentAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    message: 'Заказчик подтвердил. Финализируем детали и стартуем спринт с завтрашнего дня.',
  },
  {
    taskId: 4,
    status: 'declined',
    sentAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    message: 'Клиент остановился на другом исполнителе. Добавил задачу в архив.',
  },
]

const tasksStore = useTasksStore()
const router = useRouter()

const respondedTasks = computed(() =>
  responses
    .map((response) => {
      const task = tasksStore.getById(response.taskId)
      if (!task) return null
      return { task, response }
    })
    .filter((item): item is { task: NonNullable<ReturnType<typeof tasksStore.getById>>; response: ResponseMeta } => item !== null),
)

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  progress: '#4f46e5',
  completed: '#10b981',
  canceled: '#ec4899',
}

const statusLabels: Record<string, string> = {
  pending: 'В ожидании',
  progress: 'В работе',
  completed: 'Завершено',
  canceled: 'Отменено',
}

const statusChip: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-300',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
  canceled: 'bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300',
}

const responseStatusStyles: Record<
  ResponseMeta['status'],
  { label: string; text: string }
> = {
  waiting: { label: 'Ожидает ответа', text: 'text-amber-600 dark:text-amber-300' },
  accepted: { label: 'Принято', text: 'text-emerald-600 dark:text-emerald-300' },
  declined: { label: 'Отклонено', text: 'text-rose-600 dark:text-rose-300' },
}

function dayWord(n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'день'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня'
  return 'дней'
}

function formatDeadline(iso: string) {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

function openTask(taskId: number) {
  router.push({ name: 'task-detail', params: { id: taskId } })
}

function openChat(taskId: number) {
  router.push({ name: 'chats', query: { taskId } })
}
</script>

