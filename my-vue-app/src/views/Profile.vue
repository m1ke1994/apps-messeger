<!-- ProfileView.vue -->
<template>
  <div
    class="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-background-light font-display text-text-light dark:bg-background-dark dark:text-text-dark"
  >
    <main class="p-4 space-y-6">
      <!-- Блок профиля -->
      <section
        class="flex flex-col items-center gap-4 rounded-2xl bg-card-light p-6 shadow-soft ring-1 ring-border-light/60 dark:bg-card-dark dark:ring-border-dark/60"
      >
        <div class="relative">
          <div
            class="h-32 w-32 rounded-full bg-cover bg-center ring-2 ring-white/70 dark:ring-white/10"
            :style="{ backgroundImage: `url('${user.avatarUrl || defaultAvatar}')` }"
          />
          <div
            v-if="user.online"
            class="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full border-2 border-card-light bg-emerald-700 px-2 py-1 text-xs font-bold text-white shadow-sm dark:border-card-dark"
          >
            <span class="relative flex h-2.5 w-2.5">
              <span class="absolute h-full w-full animate-ping rounded-full bg-white/90 opacity-70"></span>
              <span class="relative h-2.5 w-2.5 rounded-full bg-white"></span>
            </span>
            <span>Онлайн</span>
          </div>
        </div>

        <div class="text-center space-y-1">
          <h2 class="text-2xl font-extrabold tracking-tight">{{ user.name }}</h2>
          <p class="text-sm text-subtext-light dark:text-subtext-dark">{{ user.city }}</p>
        </div>

        <button
          type="button"
          class="w-full rounded-xl bg-emerald-700 px-5 py-3 text-base font-bold text-white shadow-sm transition active:translate-y-px hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/40"
        >
          Редактировать профиль
        </button>
      </section>

      <!-- Информация -->
      <section
        class="overflow-hidden rounded-2xl bg-card-light shadow-soft ring-1 ring-border-light/60 dark:bg-card-dark dark:ring-border-dark/60"
      >
        <!-- Вкладки -->
        <div class="border-b border-border-light/80 px-4 dark:border-border-dark/80">
          <nav aria-label="Вкладки" role="tablist" class="-mb-px relative">
            <div
              class="tabs-scroll flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth snap-x snap-mandatory pr-2 py-3"
            >
              <button
                v-for="tab in tabs"
                :key="tab.value"
                type="button"
                role="tab"
                :aria-selected="active === tab.value"
                :tabindex="active === tab.value ? 0 : -1"
                @click="selectTab(tab.value)"
                class="snap-start inline-flex items-center rounded-full border px-3.5 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30"
                :class="active === tab.value
                  ? 'border-emerald-700 text-emerald-700 bg-emerald-700/10 font-semibold'
                  : 'border-border-light text-subtext-light hover:bg-white/60 dark:border-white/20 dark:text-subtext-dark dark:hover:bg-card-dark/60'"
              >
                {{ tab.label }}
              </button>
            </div>
          </nav>
        </div>

        <!-- Контент вкладок -->
        <div class="p-6">
          <transition name="fade-slide" mode="out-in">
            <div :key="active" class="space-y-6">
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
                      class="rounded-full bg-emerald-700/10 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-700/20"
                    >
                      {{ s }}
                    </span>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div class="rounded-xl bg-white/60 p-4 ring-1 ring-border-light/60 dark:bg-white/5 dark:ring-white/10">
                    <h3 class="mb-1 text-lg font-bold">Образование</h3>
                    <p class="text-sm text-subtext-light dark:text-subtext-dark">
                      {{ user.education }}
                    </p>
                  </div>
                  <div class="rounded-xl bg-white/60 p-4 ring-1 ring-border-light/60 dark:bg-white/5 dark:ring-white/10">
                    <h3 class="mb-1 text-lg font-bold">Статус</h3>
                    <p class="text-sm text-subtext-light dark:text-subtext-dark">
                      {{ user.status }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Мои задания -->
              <div v-else-if="active === 'tasks'" class="space-y-3">
                <div
                  v-for="(task, i) in user.tasks"
                  :key="i"
                  class="rounded-xl border border-border-light/80 bg-white/70 p-4 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <h4 class="font-semibold text-gray-900 dark:text-white">{{ task.title }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ task.description }}</p>
                  <p class="mt-1 text-xs text-gray-500">Срок: {{ task.deadline }}</p>
                </div>
              </div>

              <!-- Мои отклики -->
              <div v-else-if="active === 'responses'" class="space-y-3">
                <div
                  v-for="(r, i) in user.responses"
                  :key="i"
                  class="rounded-xl border border-border-light/80 bg-white/70 p-4 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ r.task }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ r.message }}</p>
                  <span class="mt-1 inline-block text-xs font-semibold text-emerald-700">Статус: {{ r.status }}</span>
                </div>
              </div>

              <!-- Отзывы -->
              <div v-else class="space-y-3">
                <div
                  v-for="(rev, i) in user.reviews"
                  :key="i"
                  class="rounded-xl border border-border-light/80 bg-white/70 p-4 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <p class="font-medium text-gray-900 dark:text-white">{{ rev.author }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ rev.comment }}</p>
                  <span class="mt-1 inline-block text-xs font-semibold text-emerald-700">Оценка: {{ rev.rating }}/5</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type TabValue = 'about' | 'tasks' | 'responses' | 'reviews'

const defaultAvatar = 'https://i.pravatar.cc/300?img=47'

const user = ref({
  name: 'Анастасия Самгородецкая',
  avatarUrl: 'https://i.pravatar.cc/300?img=47',
  online: true,
  city: 'Москва',
  about:
    'Фронтенд-разработчик с опытом в Vue, Quasar и Tailwind. Люблю создавать удобные интерфейсы и работать с API.',
  skills: ['Vue 3', 'Quasar', 'Tailwind', 'TypeScript', 'Pinia', 'REST API'],
  education: 'МГТУ им. Баумана — Информационные системы и технологии',
  status: 'Доступен для новых проектов',
  tasks: [
    {
      title: 'Разработка лендинга для стартапа',
      description: 'Создать адаптивный сайт с анимацией и формой обратной связи.',
      deadline: 'до 12 октября 2025',
    },
    {
      title: 'Интерфейс биржи заданий',
      description: 'Реализовать карточки проектов и фильтры по категориям.',
      deadline: 'до 18 октября 2025',
    },
  ],
  responses: [
    { task: 'Создание Telegram-бота', message: 'Здравствуйте! Готов выполнить за 2 дня.', status: 'Ожидание ответа' },
    { task: 'Верстка промо-страницы', message: 'Могу сделать сегодня вечером.', status: 'Принят' },
  ],
  reviews: [
    { author: 'Иван Петров', comment: 'Отличная работа, всё вовремя и качественно!', rating: 5 },
    { author: 'Мария Смирнова', comment: 'Очень внимательный и ответственный специалист.', rating: 5 },
  ],
})

const tabs: { value: TabValue; label: string }[] = [
  { value: 'about', label: 'О себе' },
  { value: 'tasks', label: 'Мои задания' },
  { value: 'responses', label: 'Мои отклики' },
  { value: 'reviews', label: 'Отзывы' },
]

const active = ref<TabValue>('about')

function selectTab(val: TabValue) {
  active.value = val
  // плавная прокрутка к активной кнопке
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
.tabs-scroll::-webkit-scrollbar {
  display: none;
}

/* Анимация смены вкладок: лёгкий fade + небольшой сдвиг */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 180ms ease, transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: opacity, transform;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
