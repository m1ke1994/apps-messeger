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
          <p
            v-if="user.phone"
            class="text-sm font-semibold text-text-light dark:text-text-dark"
          >
            {{ user.phone }}
          </p>
          <p
            v-if="user.email"
            class="text-sm text-subtext-light dark:text-subtext-dark"
          >
            {{ user.email }}
          </p>
        </div>

        <button
          type="button"
          @click="handlePrimaryAction"
          class="w-full rounded-xl bg-[#047857] px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-[#059669] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]/40"
        >
          {{ primaryActionLabel }}
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
                class="snap-start inline-flex items-center rounded-full border border-transparent bg-[#047857] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#059669] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]/30"
                :class="active === tab.value ? 'opacity-100 shadow-sm' : 'opacity-70'"
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
                <template v-if="!editing">
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
                </template>

                <template v-else>
                  <form class="space-y-6" @submit.prevent="saveEdit">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Полное имя
                        <input
                          v-model="draft.name"
                          type="text"
                          class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                          required
                        />
                      </label>
                      <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Город
                        <input
                          v-model="draft.city"
                          type="text"
                          class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                        />
                      </label>
                      <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Электронная почта
                        <input
                          v-model="draft.email"
                          type="email"
                          class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                          required
                        />
                      </label>
                      <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Телефон
                        <input
                          :value="user.phone"
                          type="text"
                          disabled
                          class="w-full cursor-not-allowed rounded-xl border border-dashed border-black/10 bg-white/50 px-3 py-2 text-base text-slate-500 outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                        />
                      </label>
                    </div>

                    <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      О себе
                      <textarea
                        v-model="draft.about"
                        rows="4"
                        class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                      ></textarea>
                    </label>

                    <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Навыки (через запятую)
                      <input
                        v-model="draft.skills"
                        type="text"
                        class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                      />
                    </label>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Образование
                        <input
                          v-model="draft.education"
                          type="text"
                          class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                        />
                      </label>
                      <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Статус
                        <input
                          v-model="draft.status"
                          type="text"
                          class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                        />
                      </label>
                    </div>

                    <div class="flex justify-end">
                      <button
                        type="submit"
                        class="inline-flex items-center rounded-xl bg-[#047857] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#059669] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]/30"
                      >
                        Сохранить
                      </button>
                    </div>
                  </form>
                </template>
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
import { computed, reactive, ref } from 'vue'

type TabValue = 'about' | 'tasks' | 'responses' | 'reviews'

const defaultAvatar = 'https://i.pravatar.cc/300?img=47'

const user = ref({
  name: 'Елизавета Андреева',
  avatarUrl: 'https://i.pravatar.cc/300?img=47',
  online: true,
  city: 'Москва',
  phone: '+7 999 123-45-67',
  email: 'demo@workspace.dev',
  about:
    'Фронтенд-разработчик с опытом во Vue, Quasar и Tailwind. Люблю создавать удобные интерфейсы и работать с API.',
  skills: ['Vue 3', 'Quasar', 'Tailwind', 'TypeScript', 'Pinia', 'REST API'],
  education: 'СПбГУ, факультет информатики и прикладной математики',
  status: 'Открыта для новых проектов',
  tasks: [
    {
      title: 'Запуск лендинга для курса',
      description: 'Нужно сверстать страницу и настроить сбор заявок.',
      deadline: 'до 12 ноября 2025',
    },
    {
      title: 'Редизайн личного кабинета',
      description: 'Оптимизация интерфейса заказчика и адаптация под мобильные.',
      deadline: 'до 18 ноября 2025',
    },
  ],
  responses: [
    { task: 'Разработка Telegram-бота', message: 'Добрый день! Могу подготовить MVP за 2 дня.', status: 'Отправлено' },
    { task: 'Лендинг для стартапа', message: 'Есть свежие идеи по дизайну.', status: 'Просмотрено' },
  ],
  reviews: [
    { author: 'Анна Орлова', comment: 'Очень ответственный подход, всё сделано в срок!', rating: 5 },
    { author: 'Игорь Смирнов', comment: 'Внимательная к деталям и инициативная разработчица.', rating: 5 },
  ],
})

const tabs: { value: TabValue; label: string }[] = [
  { value: 'about', label: 'О себе' },
  { value: 'tasks', label: 'Мои задачи' },
  { value: 'responses', label: 'Мои отклики' },
  { value: 'reviews', label: 'Отзывы' },
]

const active = ref<TabValue>('about')
const editing = ref(false)
const draft = reactive({
  name: '',
  city: '',
  email: '',
  about: '',
  skills: '',
  education: '',
  status: '',
})

const primaryActionLabel = computed(() => (editing.value ? 'Сохранить изменения' : 'Редактировать профиль'))

function populateDraft() {
  const value = user.value
  draft.name = value.name
  draft.city = value.city
  draft.email = value.email ?? ''
  draft.about = value.about ?? ''
  draft.skills = Array.isArray(value.skills) ? value.skills.join(', ') : ''
  draft.education = value.education ?? ''
  draft.status = value.status ?? ''
}

function handlePrimaryAction() {
  if (editing.value) {
    saveEdit()
  } else {
    startEdit()
  }
}

function startEdit() {
  populateDraft()
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

function saveEdit() {
  const value = user.value
  value.name = draft.name.trim() || value.name
  value.city = draft.city.trim()
  value.email = draft.email.trim()
  value.about = draft.about.trim()
  value.education = draft.education.trim()
  value.status = draft.status.trim()
  value.skills = draft.skills
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  editing.value = false
}

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






