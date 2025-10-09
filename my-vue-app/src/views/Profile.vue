<!-- ProfileView.vue -->
<template>
  <div class="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-background-light font-display text-text-light dark:bg-background-dark dark:text-text-dark">
    <main class="p-4 space-y-6">
      <!-- Блок профиля -->
      <section class="flex flex-col items-center space-y-4 rounded-xl bg-card-light p-6 shadow-soft dark:bg-card-dark">
        <div class="relative">
          <div
            class="h-32 w-32 rounded-full bg-cover bg-center"
            :style="{ backgroundImage: `url('${user.avatarUrl || defaultAvatar}')` }"
          />
          <div
            v-if="user.online"
            class="absolute -bottom-1 -right-1 flex items-center space-x-1 rounded-full border-2 border-card-light bg-[#55E792] px-2 py-1 text-xs font-bold text-white dark:border-card-dark"
          >
            <span class="relative flex h-2 w-2">
              <span class="absolute h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span class="relative h-2 w-2 rounded-full bg-white"></span>
            </span>
            <span>Онлайн</span>
          </div>
        </div>

        <div class="text-center space-y-1">
          <h2 class="text-2xl font-bold">{{ user.name }}</h2>
          <p class="text-sm text-subtext-light dark:text-subtext-dark">{{ user.city }}</p>
        </div>

        <button class="w-full rounded-lg bg-[#55E792] px-4 py-3 text-base font-bold text-white transition hover:bg-[#44d184]">
          Редактировать профиль
        </button>
      </section>

      <!-- Информация -->
      <section class="overflow-hidden rounded-xl bg-card-light shadow-soft dark:bg-card-dark">
        <!-- Вкладки -->
        <div class="border-b border-border-light px-4 dark:border-border-dark">
          <nav aria-label="Вкладки" role="tablist" class="-mb-px relative">
            <div class="tabs-scroll flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth snap-x snap-mandatory pr-2">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                type="button"
                role="tab"
                :aria-selected="active === tab.value"
                :tabindex="active === tab.value ? 0 : -1"
                @click="selectTab(tab.value)"
                class="snap-start inline-flex items-center rounded-full border px-3 py-2 text-sm transition"
                :class="active === tab.value
                  ? 'border-[#55E792] text-[#55E792] bg-[#55E792]/10 font-semibold'
                  : 'border border-black text-subtext-light hover:text-gray-700 hover:bg-background-light/60 dark:border-white/20 dark:text-subtext-dark dark:hover:bg-card-dark/60'"
              >
                {{ tab.label }}
              </button>
            </div>
          </nav>
        </div>

        <div class="p-6 space-y-6">
          <!-- О себе -->
          <div v-if="active === 'about'">
            <p class="text-subtext-light dark:text-subtext-dark">
              {{ user.about }}
            </p>

            <div class="mt-6">
              <h3 class="mb-3 text-lg font-bold">Навыки</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="s in user.skills"
                  :key="s"
                  class="rounded-full bg-[#55E792]/10 px-3 py-1 text-sm font-medium text-[#55E792]"
                >
                  {{ s }}
                </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 class="mb-1 text-lg font-bold">Образование</h3>
                <p class="text-sm text-subtext-light dark:text-subtext-dark">
                  {{ user.education }}
                </p>
              </div>
              <div>
                <h3 class="mb-1 text-lg font-bold">Статус</h3>
                <p class="text-sm text-subtext-light dark:text-subtext-dark">
                  {{ user.status }}
                </p>
              </div>
            </div>
          </div>

          <!-- Мои задания -->
          <div v-else-if="active === 'tasks'" class="space-y-3">
            <div v-for="(task, i) in user.tasks" :key="i" class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h4 class="font-semibold text-gray-900 dark:text-white">{{ task.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ task.description }}</p>
              <p class="mt-1 text-xs text-gray-500">Срок: {{ task.deadline }}</p>
            </div>
          </div>

          <!-- Мои отклики -->
          <div v-else-if="active === 'responses'" class="space-y-3">
            <div v-for="(r, i) in user.responses" :key="i" class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p class="font-medium text-gray-900 dark:text-white">
                {{ r.task }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ r.message }}</p>
              <span class="mt-1 inline-block text-xs text-[#55E792]">Статус: {{ r.status }}</span>
            </div>
          </div>

          <!-- Отзывы -->
          <div v-else class="space-y-3">
            <div v-for="(rev, i) in user.reviews" :key="i" class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p class="font-medium text-gray-900 dark:text-white">{{ rev.author }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ rev.comment }}</p>
              <span class="mt-1 inline-block text-xs text-[#55E792]">Оценка: {{ rev.rating }}/5</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type TabValue = 'about' | 'tasks' | 'responses' | 'reviews'

const defaultAvatar = 'https://i.pravatar.cc/300?img=47'

const user = ref({
  name: 'Анастасия Самгородецкая',
  avatarUrl: 'https://i.pravatar.cc/300?img=47',
  online: true,
  city: 'Москва',
  about: 'Фронтенд-разработчик с опытом в Vue, Quasar и Tailwind. Люблю создавать удобные интерфейсы и работать с API.',
  skills: ['Vue 3', 'Quasar', 'Tailwind', 'TypeScript', 'Pinia', 'REST API'],
  education: 'МГТУ им. Баумана — Информационные системы и технологии',
  status: 'Доступен для новых проектов',
  tasks: [
    { title: 'Разработка лендинга для стартапа', description: 'Создать адаптивный сайт с анимацией и формой обратной связи.', deadline: 'до 12 октября 2025' },
    { title: 'Интерфейс биржи заданий', description: 'Реализовать карточки проектов и фильтры по категориям.', deadline: 'до 18 октября 2025' }
  ],
  responses: [
    { task: 'Создание Telegram-бота', message: 'Здравствуйте! Готов выполнить за 2 дня.', status: 'Ожидание ответа' },
    { task: 'Верстка промо-страницы', message: 'Могу сделать сегодня вечером.', status: 'Принят' }
  ],
  reviews: [
    { author: 'Иван Петров', comment: 'Отличная работа, всё вовремя и качественно!', rating: 5 },
    { author: 'Мария Смирнова', comment: 'Очень внимательный и ответственный специалист.', rating: 5 }
  ]
})

const tabs: { value: TabValue; label: string }[] = [
  { value: 'about', label: 'О себе' },
  { value: 'tasks', label: 'Мои задания' },
  { value: 'responses', label: 'Мои отклики' },
  { value: 'reviews', label: 'Отзывы' }
]

const active = ref<TabValue>('about')

function selectTab(val: TabValue) {
  active.value = val
  requestAnimationFrame(() => {
    const container = document.querySelector('.tabs-scroll') as HTMLElement | null
    const activeBtn = container?.querySelector('[aria-selected="true"]') as HTMLElement | null
    if (container && activeBtn) {
      const left = activeBtn.offsetLeft - (container.clientWidth - activeBtn.clientWidth) / 2
      container.scrollTo({ left, behavior: 'smooth' })
    }
  })
}
</script>

<style>
.tabs-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.tabs-scroll::-webkit-scrollbar { display: none; }
</style>
