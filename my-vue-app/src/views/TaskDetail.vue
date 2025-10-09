<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
    <main v-if="task" class="mx-auto max-w-3xl p-4">
      <!-- Карточка -->
      <div class="rounded-2xl border border-black/10 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
        <!-- Заголовок + статус + цена -->
        <div class="flex items-start justify-between gap-3">
          <!-- Левая колонка: заголовок + бейджи -->
          <div class="min-w-0 flex-1 space-y-1">
            <!-- если заголовок очень длинный — обрежем до 2 строк -->
            <h2 class="text-xl font-extrabold leading-snug line-clamp-2">
              {{ task.title }}
            </h2>

            <div class="flex flex-wrap items-center gap-2 text-sm">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="statusChip[task.status] || 'bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-200'"
              >
                <span
                  class="block h-1.5 w-1.5 rounded-full"
                  :style="{ backgroundColor: statusColors[task.status] || '#6b7280' }"
                />
                {{ statusLabels[task.status] || task.status }}
              </span>

              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs dark:bg-white/10">
                Категория: {{ task.category }}
              </span>
            </div>
          </div>

          <!-- Цена: фикс переносов и сжатия -->
          <span
            v-if="task.price != null"
            class="inline-flex flex-shrink-0 whitespace-nowrap rounded-full bg-primary/15 px-3 py-1 text-sm font-extrabold leading-tight text-primary backdrop-blur"
          >
            {{ formatPrice(task.price) }}
          </span>
        </div>

        <!-- Автор -->
        <div v-if="author" class="mt-4 flex items-center gap-3">
          <div class="relative">
            <img :src="author.avatar" :alt="fullName(author)" class="h-10 w-10 rounded-full object-cover" />
            <span
              class="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-900"
              :class="author.online ? 'bg-emerald-500' : 'bg-slate-400'"
            />
          </div>
          <div class="text-sm">
            <div class="font-semibold leading-tight">{{ fullName(author) }}</div>
            <div class="text-xs text-slate-600 dark:text-slate-300">
              Статус: {{ author.online ? 'онлайн' : 'оффлайн' }}
            </div>
          </div>
        </div>

        <!-- Описание -->
        <p class="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {{ task.description }}
        </p>

        <!-- Теги -->
        <div v-if="task.tags?.length" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in task.tags"
            :key="tag"
            class="rounded-full border border-black/10 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary dark:border-white/10"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Сроки -->
        <div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
          <span v-if="task.deadlineDays" class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/10">
            Срок: {{ task.deadlineDays }} {{ dayWord(task.deadlineDays) }}
          </span>
          <span v-else-if="task.deadlineAt" class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/10">
            Срок: {{ formatDeadline(task.deadlineAt) }}
          </span>
          <span
            v-if="deadlineBadge(task) === 'urgent'"
            class="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300"
          >
            Срочно
          </span>
          <span
            v-else-if="deadlineBadge(task) === 'soon'"
            class="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300"
          >
            Ближайший срок
          </span>
        </div>

        <!-- Действия -->
        <div class="mt-6 flex items-center gap-2">
          <button class="btn h-10 flex-1 px-4 text-sm font-extrabold">Откликнуться</button>
          <button class="btn h-10 flex-1 px-4 text-sm font-semibold">Написать автору</button>
        </div>
      </div>
    </main>

    <main v-else class="p-6 text-center text-slate-600 dark:text-slate-300">Задание не найдено.</main>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTasksStore, type Task } from '@/stores/tasksStore'

/* склонение "день/дня/дней" */
function dayWord(n: number) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'день'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня'
  return 'дней'
}

/* дата дедлайна */
function formatDeadline(iso: string) {
  const d = new Date(iso)
  if (isNaN(+d)) return iso
  const date = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return hh === '00' && mm === '00' ? date : `${date}, ${hh}:${mm}`
}

/* цена с неразрывным пробелом */
function formatPrice(n?: number | null) {
  if (n == null) return ''
  return `${n.toLocaleString('ru-RU')}\u00A0₽`
}

function daysBetweenNow(iso?: string): number | null {
  if (!iso) return null
  const target = new Date(iso).getTime()
  if (isNaN(target)) return null
  const diffMs = target - Date.now()
  return Math.ceil(diffMs / 86_400_000)
}

function deadlineBadge(t: Task): 'urgent' | 'soon' | null {
  const days = typeof t.deadlineDays === 'number' ? t.deadlineDays : daysBetweenNow(t.deadlineAt)
  if (days == null) return null
  if (days <= 2) return 'urgent'
  if (days <= 7) return 'soon'
  return null
}

/* статусы */
const statusColors = {
  pending: '#f59e0b',
  progress: '#4f46e5',
  completed: '#10b981',
  canceled: '#ec4899',
}
const statusLabels = {
  pending: 'В ожидании',
  progress: 'В работе',
  completed: 'Завершено',
  canceled: 'Отменено',
}
const statusChip = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-300',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
  canceled: 'bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300',
}

/* данные */
const route = useRoute()
const store = useTasksStore()

/** поддержим смену :id внутри одного и того же компонента */
const task = computed(() => {
  const id = Number(route.params.id)
  return store.getById(id)
})
const author = computed(() => (task.value ? store.getUser(task.value.createdBy) ?? null : null))
const fullName = (u: { firstName: string; lastName: string }) => `${u.firstName} ${u.lastName}`

/* если id в маршруте меняется — Vue сам пересчитает computed; watch не обязателен, но можно для побочных эффектов */
watch(
  () => route.params.id,
  () => {
    // сюда можно добавить логирование/метрики
  }
)
</script>

<style scoped>
/* line-clamp utility (если не используешь плагин Tailwind line-clamp) */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
