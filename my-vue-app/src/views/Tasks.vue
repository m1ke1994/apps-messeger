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
                class="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Тип выполнения -->
            <div v-if="t.offline" class="mt-3 inline-flex items-center gap-2 rounded-lg bg-black/5 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,34.42,22.12,74.29,82.39,122.88a8,8,0,0,0,11.22,0C193.88,214.29,216,174.42,216,104A88.1,88.1,0,0,0,128,16Zm0,206.59C79.8,174,48,131.18,48,104a80,80,0,0,1,160,0C208,131.18,176.2,174,128,222.59Z"/>
              </svg>
              Офлайн-задание
            </div>

            <!-- Разделитель -->
            <div class="my-4 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10"></div>

            <!-- Управление -->
          <div class="flex items-center justify-between gap-2">
  <button
    class="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-sm font-extrabold text-background-dark shadow-sm transition-all duration-150 hover:bg-emerald-500 hover:shadow-md active:translate-y-px border border-gray-300"
  >
    Откликнуться
  </button>

  <button
    class="inline-flex h-9 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition-all duration-150 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-text-dark dark:hover:bg-white/10"
  >
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
         bg-surface-light dark:bg-surface-dark
         bg-white dark:bg-slate-900
         border-l border-black/10 dark:border-white/10
         p-4 shadow-xl"
  role="dialog"
  aria-modal="true"
  aria-labelledby="filters-title"
>
  <!-- Заголовок + закрытие -->
  <div class="mb-3 flex items-center justify-between">
    <h2 id="filters-title" class="text-base font-extrabold text-text-light dark:text-text-dark text-slate-900 dark:text-slate-100">
      Фильтры
    </h2>
    <button
      @click="closeFilterPanel()"
      class="rounded-lg p-2 text-slate-600 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:text-slate-300 dark:hover:bg-white/10"
      aria-label="Закрыть"
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,1,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
      </svg>
    </button>
  </div>

  <!-- Поля -->
  <div class="space-y-4">
    <div>
      <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        Категория
      </label>
      <select
        v-model="tempCategory"
        class="w-full rounded-xl border border-black/10 bg-white/80 p-2.5 text-sm text-slate-900
               outline-none transition
               focus:border-primary focus:ring-2 focus:ring-primary/30
               dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
      >
        <option :value="allCategoryName">Все задания</option>
        <option v-for="c in categoriesList" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div>
      <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        Статус
      </label>
      <select
        v-model="tempStatus"
        class="w-full rounded-xl border border-black/10 bg-white/80 p-2.5 text-sm text-slate-900
               outline-none transition
               focus:border-primary focus:ring-2 focus:ring-primary/30
               dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
      >
        <option value="all">Все статусы</option>
        <option value="pending">{{ statusLabels.pending }}</option>
        <option value="progress">{{ statusLabels.progress }}</option>
        <option value="completed">{{ statusLabels.completed }}</option>
        <option value="canceled">{{ statusLabels.canceled }}</option>
      </select>
    </div>
  </div>

  <!-- Кнопки -->
  <div class="mt-6 flex items-center gap-2">
    <button
      @click="resetFilters()"
      type="button"
      class="h-10 flex-1 rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-slate-700
             backdrop-blur transition-all duration-150
             hover:border-gray-400 hover:bg-gray-50 hover:text-slate-900
             active:translate-y-px
             dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10 border border-gray-300"
    >
      Сбросить
    </button>

    <button
      @click="applyFilters()"
      type="button"
      class="h-10 flex-1 rounded-xl bg-primary px-4 text-sm font-extrabold text-background-dark
             shadow-sm transition-all duration-150
             hover:bg-emerald-500 hover:shadow-md
             active:translate-y-px border border-gray-300"
    >
      Применить
    </button>
  </div>
</aside>

      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

/* --- цвета и подписи статусов --- */
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

/* --- данные --- */
const categoriesList = ['Маркетинг', 'IT', 'Дизайн', 'Офлайн']
const allCategoryName = 'Все задания'

const tasks = reactive([
  {
    id: 1,
    category: 'Маркетинг',
    status: 'pending',
    price: 2500,
    title: 'Лендинг для кофейни "Daily Grind"',
    description: 'Нужен современный адаптивный лендинг. Яркий визуал, аккуратная структура.',
    tags: ['Дизайн', 'Маркетинг'],
    offline: false,
  },
  {
    id: 2,
    category: 'Офлайн',
    status: 'progress',
    price: 1500,
    title: 'Помощь на складе',
    description: 'Разложить товар, провести ревизию, подготовить к отгрузке.',
    tags: ['Логистика'],
    offline: true,
  },
  {
    id: 3,
    category: 'IT',
    status: 'completed',
    price: 8000,
    title: 'Верстка корпоративного сайта',
    description: 'Сверстать по готовому дизайну. 4–5 страниц, важна SEO-структура.',
    tags: ['Web-разработка', 'WordPress'],
    offline: false,
  },
  {
    id: 4,
    category: 'Дизайн',
    status: 'canceled',
    price: 500,
    title: 'Оформление поста для соцсетей',
    description: 'Подготовить рекламный пост с учётом брендбука.',
    tags: ['SMM'],
    offline: true,
  },
])

/* --- состояние фильтров --- */
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedCategory = ref(allCategoryName)

const showFilter = ref(false)
const tempStatus = ref('all')
const tempCategory = ref(allCategoryName)

function openFilterPanel() {
  tempStatus.value = selectedStatus.value
  tempCategory.value = selectedCategory.value
  showFilter.value = true
}
function closeFilterPanel() {
  showFilter.value = false
}
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

/* --- вычисляемый список --- */
const filteredTasks = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return tasks.filter((t) => {
    const byCategory = selectedCategory.value === allCategoryName || t.category === selectedCategory.value
    const byStatus = selectedStatus.value === 'all' || t.status === selectedStatus.value
    const inText =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
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
