<!-- ProfileView.vue -->
<template>
  <div class="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-background-light font-display text-text-light dark:bg-background-dark dark:text-text-dark">
    <!-- Шапка -->


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

         
        </div>

        <button class="btn w-full px-4 py-3 text-base font-bold" @click="$emit('edit-profile')">
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
              {{ user.about || 'Информация отсутствует' }}
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
                  {{ user.education || '—' }}
                </p>
              </div>
              <div>
                <h3 class="mb-1 text-lg font-bold">Статус</h3>
                <p class="text-sm text-subtext-light dark:text-subtext-dark">
                  {{ user.status || '—' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Мои задания -->
          <div v-else-if="active === 'tasks'" class="space-y-3">
            <slot name="tasks">
              <p class="text-sm text-subtext-light dark:text-subtext-dark">
                У вас {{ stats.tasks }} заданий.
              </p>
            </slot>
          </div>

          <!-- Мои отклики -->
          <div v-else-if="active === 'responses'" class="space-y-3">
            <slot name="responses">
              <p class="text-sm text-subtext-light dark:text-subtext-dark">
                Откликов: {{ stats.responses }}.
              </p>
            </slot>
          </div>

          <!-- Отзывы -->
          <div v-else class="space-y-3">
            <slot name="reviews">
              <p class="text-sm text-subtext-light dark:text-subtext-dark">
                Отзывов: {{ stats.reviews }}.
              </p>
            </slot>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

type TabValue = 'about' | 'tasks' | 'responses' | 'reviews'
type User = {
  name: string
  avatarUrl?: string
  online?: boolean
  trust?: number
  about?: string
  skills?: string[]
  education?: string
  status?: string
}

const defaultAvatar = 'https://placehold.co/256x256/png'

const props = withDefaults(defineProps<{
  user?: User
  stats?: { tasks: number; responses: number; reviews: number }
}>(), {
  user: () => ({
    name: 'Без имени',
    avatarUrl: '',
    online: false,
    trust: 0,
    about: '',
    skills: [],
    education: '',
    status: ''
  }),
  stats: () => ({ tasks: 0, responses: 0, reviews: 0 })
})

const tabs: { value: TabValue; label: string }[] = [
  { value: 'about', label: 'О себе' },
  { value: 'tasks', label: 'Мои задания' },
  { value: 'responses', label: 'Мои отклики' },
  { value: 'reviews', label: 'Отзывы' }
]

const active = ref<TabValue>('about')
const router = useRouter()

function goBack() {
  if (history.length > 1) router.back()
  else router.push({ name: 'chats' })
}

const trustPercent = computed(() => Math.max(0, Math.min(props.user.trust ?? 0, 100)))
const stats = computed(() => props.stats ?? { tasks: 0, responses: 0, reviews: 0 })
const user = computed(() => props.user)

function selectTab(val: TabValue) {
  active.value = val
  // центрируем активную вкладку при клике
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
.trust-progress {
  stroke-dasharray: 283;
  stroke-dashoffset: calc(283 - (283 * var(--value)) / 100);
}

/* горизонтальный скролл вкладок */
.tabs-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.tabs-scroll::-webkit-scrollbar { display: none; }

/* кнопки и иконки */
.btn-icon {
  height: 2.5rem;
  width: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 0.75rem;
  background: transparent;
  color: #6b7280;
  transition: background-color 0.15s, color 0.15s, transform 0.15s;
}
.dark .btn-icon { color: #9ca3af; }
.btn-icon:hover { background-color: #55E792; color: #000; }
.btn-icon:active { transform: translateY(1px); }
</style>
