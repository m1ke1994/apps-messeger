<template>
  <div class="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-background-light font-display dark:bg-background-dark">
    <!-- Поиск + кнопка фильтров -->
    <div class="flex items-center gap-3 p-4">
      <div class="relative flex-1">
        <!-- иконка поиска слева -->
        <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
          <path d="M229.66,218.34l-50.07-50.07a88.11,88.11,0,1,0-11.31,11.31l50.07,50.07a8,8,0,0,0,11.31-11.31ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
        </svg>
        <input
          v-model.trim="searchQuery"
          @keyup.enter="applyFilters()"
          type="text"
          placeholder="Поиск заданий"
          class="h-11 w-full rounded-xl border border-black/10 bg-white/80 pl-9 pr-3 text-sm text-text-light placeholder:text-slate-400 outline-none backdrop-blur transition focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-white/5 dark:text-text-dark"
        />
      </div>

      <!-- кнопка фильтров -->
      <button
        type="button"
        @click="openFilterPanel()"
        class="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white/80 text-slate-600 transition hover:bg-white/90 active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        aria-label="Фильтры"
      >
       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 256 256" aria-hidden="true"
     stroke="currentColor" stroke-width="16" stroke-linejoin="round" stroke-linecap="round">
  <!-- контур той же формы -->
  <path d="M24 56h208l-80 88v46l-32 16v-62L24 56z"/>
</svg>

      </button>
    </div>

    <!-- Карточки заданий -->
    <main class="flex-grow">
      <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="t in filteredTasks"
          :key="t.id"
          class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-surface-light/95 shadow-[0_10px_30px_rgba(15,23,42,.08)] transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(15,23,42,.14)] dark:border-gray-700 dark:bg-surface-dark/90"
        >
          <!-- Статус + сумма -->
          <div class="flex items-start justify-between gap-3 px-4 pt-4">
            <span
              class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              :class="statusChip[t.status] || 'bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-200'"
            >
              <span class="block h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: statusColors[t.status] || '#6b7280' }"></span>
              {{ statusLabels[t.status] || t.status }}
            </span>
            <span v-if="t.price != null" class="rounded-full bg-primary/15 px-3 py-1 text-sm font-extrabold text-primary backdrop-blur">
              {{ t.price.toLocaleString('ru-RU') }} ₽
            </span>
          </div>

          <!-- Заголовок + описание -->
         <div class="px-4 pb-4 pt-3">
  <h3 class="mb-2 text-base font-extrabold leading-snug text-text-light transition group-hover:text-primary dark:text-text-dark">
    {{ t.title }}
  </h3>
  <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
    {{ t.description }}
  </p>

  <!-- Теги -->
  <div v-if="t.tags?.length" class="mt-3 flex flex-wrap gap-2">
    <span
      v-for="tag in t.tags"
      :key="tag"
      class="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary border border-black"
    >
      {{ tag }}
    </span>
  </div>

  <!-- Срок -->
  <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
    <!-- Вариант 1: срок в днях -->
    <span v-if="t.deadlineDays"
          class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/10">
      Срок: {{ t.deadlineDays }} {{ dayWord(t.deadlineDays) }}
    </span>

    <!-- Вариант 2: ISO-дата дедлайна -->
    <span v-else-if="t.deadlineAt"
          class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/10">
      Срок: {{ formatDeadline(t.deadlineAt) }}
    </span>

    <!-- Бейдж срочности -->
    <span v-if="deadlineBadge(t) === 'urgent'"
          class="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300">
      Срочно
    </span>
  </div>

  <!-- Разделитель -->
  <div class="my-4 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10"></div>

  <!-- Управление -->
  <div class="flex items-center justify-between gap-2">
    <button class="btn h-9 px-4 text-sm font-extrabold">
      Откликнуться
    </button>

    <button class="btn h-9 px-4 text-sm font-semibold">
      Подробнее
    </button>
  </div>
</div>


          <!-- Подсветка -->
          <div class="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" aria-hidden="true">
            <div class="absolute -inset-px rounded-[1.05rem] bg-[radial-gradient(120px_120px_at_var(--mx,50%)_-10%,rgba(19,236,164,.25),transparent)]"></div>
          </div>
        </article>

        <p v-if="!filteredTasks.length" class="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white/60 p-6 text-center text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          Задания по выбранным параметрам не найдены.
        </p>
      </div>
    </main>

    <!-- Панель фильтров (выезжающая справа) -->
    <transition name="fade">
      <div
        v-if="showFilter"
        class="fixed inset-0 z-40"
        @click.self="closeFilterPanel()"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
 <aside
  class="absolute right-0 top-0 z-50 h-full w-[85%] max-w-sm translate-x-0
         bg-white dark:bg-slate-900
         border-l border-black/10 dark:border-white/10
         p-4 shadow-xl"
  role="dialog"
  aria-modal="true"
  aria-labelledby="filters-title"
>
  ...
  <div class="mt-6 flex items-center gap-2">
    <button
      @click="resetFilters()"
      type="button"
      class="h-10 flex-1 rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-700
             backdrop-blur transition-all duration-150
             hover:bg-[#D1FAE5] hover:text-slate-900 active:translate-y-px
             dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
    >
      Сбросить
    </button>
    <button
      @click="applyFilters()"
      type="button"
      class="h-10 flex-1 rounded-xl bg-primary px-4 text-sm font-extrabold text-background-dark
             shadow-sm transition-all duration-150
             hover:bg-[#D1FAE5] hover:shadow-md active:translate-y-px border border-gray-300"
    >
      Применить
    </button>
  </div>
</aside>


      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

/* сроки */
// склонение "день/дня/дней"
function dayWord(n: number) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'день'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня'
  return 'дней'
}

function formatDeadline(iso: string) {
  const d = new Date(iso)
  if (isNaN(+d)) return iso
  const date = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return (hh === '00' && mm === '00') ? date : `${date}, ${hh}:${mm}`
}

function daysBetweenNow(iso?: string): number | null {
  if (!iso) return null
  const target = new Date(iso).getTime()
  if (isNaN(target)) return null
  const diffMs = target - Date.now()
  return Math.ceil(diffMs / 86_400_000)
}

function deadlineBadge(t: any): 'urgent' | 'soon' | null {
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
const categoriesList = ['Маркетинг', 'IT', 'Дизайн', 'Офлайн']
const allCategoryName = 'Все задания'

const tasks = reactive([
  { id: 1, category: 'Маркетинг', status: 'pending',  price: 2500, title: 'Лендинг для кофейни "Daily Grind"', description: 'Нужен современный адаптивный лендинг. Яркий визуал, аккуратная структура.', tags: ['Дизайн', 'Маркетинг'], offline: false, deadlineDays: 5 },
  { id: 2, category: 'Офлайн',    status: 'progress',  price: 1500, title: 'Помощь на складе', description: 'Разложить товар, провести ревизию, подготовить к отгрузке.', tags: ['Логистика'], offline: true, deadlineAt: new Date(Date.now()+2*864e5).toISOString() },
  { id: 3, category: 'IT',        status: 'completed', price: 8000, title: 'Верстка корпоративного сайта', description: 'Сверстать по готовому дизайну. 4–5 страниц, важна SEO-структура.', tags: ['Web-разработка', 'WordPress'], offline: false },
  { id: 4, category: 'Дизайн',    status: 'canceled',  price: 500,  title: 'Оформление поста для соцсетей', description: 'Подготовить рекламный пост с учётом брендбука.', tags: ['SMM'], offline: true },
])

/* фильтры */
const searchQuery = ref('')
const selectedStatus = ref<'all'|'pending'|'progress'|'completed'|'canceled'>('all')
const selectedCategory = ref(allCategoryName)

const showFilter = ref(false)
const tempStatus = ref<typeof selectedStatus.value>('all')
const tempCategory = ref(allCategoryName)

function openFilterPanel() {
  tempStatus.value = selectedStatus.value
  tempCategory.value = selectedCategory.value
  showFilter.value = true
}
function closeFilterPanel() { showFilter.value = false }
function resetFilters() {
  tempStatus.value = 'all'
  tempCategory.value = allCategoryName
  searchQuery.value = ''
}
function applyFilters() {
  selectedStatus.value = tempStatus.value
  selectedCategory.value = tempCategory.value
  closeFilterPanel()
}

/* список */
const filteredTasks = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return tasks.filter((t) => {
    const byCategory = selectedCategory.value === allCategoryName || t.category === selectedCategory.value
    const byStatus = selectedStatus.value === 'all' || t.status === selectedStatus.value
    const inText = !q
      || t.title.toLowerCase().includes(q)
      || t.description.toLowerCase().includes(q)
      || (t.tags && t.tags.some((tag: string) => tag.toLowerCase().includes(q)))
    return byCategory && byStatus && inText
  })
})
</script>


<style>
:root { --mobile-h: 884px; }
body { min-height: max(var(--mobile-h), 100dvh); }

/* скрываем горизонтальный скролл */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* простой fade для оверлея */
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
