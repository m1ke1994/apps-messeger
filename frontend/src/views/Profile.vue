<!-- ProfileView.vue -->
<template>
  <div
    class="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-background-light font-display text-text-light dark:bg-background-dark dark:text-text-dark"
  >
    <main class="p-4 space-y-6">
      <!-- Карточка профиля -->
      <section
        class="flex flex-col items-center gap-4 rounded-2xl bg-card-light p-6 shadow-soft ring-1 ring-border-light/60 dark:bg-card-dark dark:ring-border-dark/60"
      >
        <div class="relative">
          <div
            class="h-32 w-32 rounded-full bg-cover bg-center ring-2 ring-white/70 dark:ring-white/10"
            :style="{ backgroundImage: `url('${user.avatarUrl || defaultAvatar}')` }"
            @click="triggerAvatarSelect"
            role="button"
            tabindex="0"
            aria-label="Изменить аватар"
          />
          <input
            ref="avatarInput"
            type="file"
            class="hidden"
            accept="image/*"
            @change="onAvatarSelected"
          />
          <button
            type="button"
            class="absolute bottom-1 right-1 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-black/80 disabled:opacity-60"
            @click="triggerAvatarSelect"
            :disabled="loadingAvatar"
          >
            {{ loadingAvatar ? '...' : 'Изменить' }}
          </button>
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
          <h2 class="text-2xl font-extrabold tracking-tight">{{ user.name || 'Имя не указано' }}</h2>
          <p v-if="user.city" class="text-sm text-subtext-light dark:text-subtext-dark">{{ user.city }}</p>
          <p v-if="user.phone" class="text-sm font-semibold text-text-light dark:text-text-dark">
            {{ user.phone }}
          </p>
          <p v-if="user.email" class="text-sm text-subtext-light dark:text-subtext-dark">
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

      <!-- Детали профиля -->
      <section
        class="overflow-hidden rounded-2xl bg-card-light shadow-soft ring-1 ring-border-light/60 dark:bg-card-dark dark:ring-border-dark/60"
      >
        <div class="border-b border-border-light/80 px-4 dark:border-border-dark/80">
          <nav aria-label="Разделы профиля" role="tablist" class="-mb-px relative">
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
                :disabled="!profileComplete && tab.value !== 'about'"
                class="snap-start inline-flex items-center rounded-full border border-transparent bg-[#047857] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#059669] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]/30 disabled:cursor-not-allowed"
                :class="active === tab.value ? 'opacity-100 shadow-sm' : 'opacity-70'"
              >
                {{ tab.label }}
              </button>
            </div>
          </nav>
          <div
            v-if="!profileComplete"
            class="flex items-start gap-2 pb-4 text-sm font-semibold text-amber-700 dark:text-amber-400"
          >
            <span class="mt-0.5 h-2 w-2 rounded-full bg-amber-500"></span>
            <span>Заполните профиль (имя, почта, навыки, статус, образование, о себе), чтобы открыть остальные вкладки.</span>
          </div>
        </div>

        <div class="p-6">
          <transition name="fade-slide" mode="out-in">
            <div :key="active" class="space-y-6">
              <!-- О себе -->
              <div v-if="active === 'about'">
                <template v-if="!editing">
                  <p class="text-subtext-light dark:text-subtext-dark">
                    {{ user.about || 'Пока нет описания' }}
                  </p>

                  <div class="mt-6">
                    <h3 class="mb-3 text-lg font-bold">Навыки</h3>
                    <div v-if="user.skills.length" class="flex flex-wrap gap-2">
                      <span
                        v-for="s in user.skills"
                        :key="s"
                        class="rounded-full bg-emerald-700/10 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-700/20"
                      >
                        {{ s }}
                      </span>
                    </div>
                    <p v-else class="text-sm text-subtext-light dark:text-subtext-dark">Навыки не указаны</p>
                  </div>

                  <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div class="rounded-xl bg-white/60 p-4 ring-1 ring-border-light/60 dark:bg-white/5 dark:ring-white/10">
                      <h3 class="mb-1 text-lg font-bold">Образование</h3>
                      <p class="text-sm text-subtext-light dark:text-subtext-dark">
                        {{ user.education || 'Не указано' }}
                      </p>
                    </div>
                    <div class="rounded-xl bg-white/60 p-4 ring-1 ring-border-light/60 dark:bg-white/5 dark:ring-white/10">
                      <h3 class="mb-1 text-lg font-bold">Статус</h3>
                      <p class="text-sm text-subtext-light dark:text-subtext-dark">
                        {{ user.status || 'Не указан' }}
                      </p>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <form class="space-y-6" @submit.prevent="saveEdit">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div class="flex flex-col gap-1">
                        <p v-if="errors.name" class="text-xs font-semibold text-red-600">{{ errors.name }}</p>
                        <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          Имя и фамилия
                          <input
                            v-model="draft.name"
                            type="text"
                            class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                            required
                          />
                        </label>
                      </div>
                      <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Город
                        <input
                          v-model="draft.city"
                          type="text"
                          class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                        />
                      </label>
                      <div class="flex flex-col gap-1">
                        <p v-if="errors.email" class="text-xs font-semibold text-red-600">{{ errors.email }}</p>
                        <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          Электронная почта
                          <input
                            v-model="draft.email"
                            type="email"
                            class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                            required
                          />
                        </label>
                      </div>
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

                    <div class="flex flex-col gap-1">
                      <p v-if="errors.about" class="text-xs font-semibold text-red-600">{{ errors.about }}</p>
                      <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        О себе
                        <textarea
                          v-model="draft.about"
                          rows="4"
                          class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                        ></textarea>
                      </label>
                    </div>

                    <div class="flex flex-col gap-1">
                      <p v-if="errors.skills" class="text-xs font-semibold text-red-600">{{ errors.skills }}</p>
                      <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Навыки (через запятую)
                        <input
                          v-model="draft.skills"
                          type="text"
                          class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                          placeholder="Например: Vue, Tailwind, TypeScript"
                        />
                      </label>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div class="flex flex-col gap-1">
                        <p v-if="errors.education" class="text-xs font-semibold text-red-600">{{ errors.education }}</p>
                        <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          Образование
                          <input
                            v-model="draft.education"
                            type="text"
                            class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                          />
                        </label>
                      </div>
                      <div class="flex flex-col gap-1">
                        <p v-if="errors.status" class="text-xs font-semibold text-red-600">{{ errors.status }}</p>
                        <label class="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                          Статус
                          <input
                            v-model="draft.status"
                            type="text"
                            class="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-base text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
                          />
                        </label>
                      </div>
                    </div>

                    <div class="flex justify-end gap-3">
                      <button
                        type="button"
                        class="inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-border-light/80 transition hover:bg-slate-100 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/5"
                        @click="cancelEdit"
                      >
                        Отменить
                      </button>
                      <button
                        type="submit"
                        class="inline-flex items-center rounded-xl bg-[#047857] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#059669] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]/30 disabled:opacity-70"
                        :disabled="savingProfile"
                      >
                        {{ savingProfile ? 'Сохранение...' : 'Сохранить профиль' }}
                      </button>
                    </div>
                  </form>
                </template>
              </div>

              <!-- Задачи -->
              <div v-else-if="active === 'tasks'" class="space-y-3">
                <div
                  v-if="!user.tasks.length"
                  class="rounded-xl border border-border-light/80 bg-white/70 p-4 text-sm text-subtext-light dark:border-white/10 dark:bg-white/5 dark:text-subtext-dark"
                >
                  Задачи пока не добавлены.
                </div>
                <div
                  v-for="(task, i) in user.tasks"
                  :key="i"
                  class="rounded-xl border border-border-light/80 bg-white/70 p-4 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <h4 class="font-semibold text-gray-900 dark:text-white">{{ task.title }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ task.description }}</p>
                  <p class="mt-1 text-xs text-gray-500">Дедлайн: {{ task.deadline }}</p>
                </div>
              </div>

              <!-- Отклики -->
              <div v-else-if="active === 'responses'" class="space-y-3">
                <div
                  v-if="!user.responses.length"
                  class="rounded-xl border border-border-light/80 bg-white/70 p-4 text-sm text-subtext-light dark:border-white/10 dark:bg-white/5 dark:text-subtext-dark"
                >
                  Отклики отсутствуют.
                </div>
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
                  v-if="!user.reviews.length"
                  class="rounded-xl border border-border-light/80 bg-white/70 p-4 text-sm text-subtext-light dark:border-white/10 dark:bg-white/5 dark:text-subtext-dark"
                >
                  Отзывов пока нет.
                </div>
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
import { computed, onMounted, reactive, ref } from 'vue'
import { updateMyProfile, uploadAvatar } from '@/api/profile'
import { useUserStore } from '@/stores/userStore'

type TabValue = 'about' | 'tasks' | 'responses' | 'reviews'

const defaultAvatar = '/no_avatar.jpg'

const userStore = useUserStore()
const avatarInput = ref<HTMLInputElement | null>(null)
const loadingAvatar = ref(false)
const savingProfile = ref(false)
const errors = reactive<Record<string, string>>({})

const user = ref({
  name: 'Имя не указано',
  avatarUrl: defaultAvatar,
  online: true,
  city: '',
  phone: '',
  email: '',
  about: '',
  skills: [] as string[],
  education: '',
  status: '',
  tasks: [] as { title: string; description: string; deadline: string }[],
  responses: [] as { task: string; message: string; status: string }[],
  reviews: [] as { author: string; comment: string; rating: number }[],
})

const tabs: { value: TabValue; label: string }[] = [
  { value: 'about', label: 'О себе' },
  { value: 'tasks', label: 'Задачи' },
  { value: 'responses', label: 'Отклики' },
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

const primaryActionLabel = computed(() => (editing.value ? 'Сохранить профиль' : 'Редактировать профиль'))
const profileComplete = computed(() => userStore.isProfileComplete())

function resetErrors() {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function parseSkills(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function validateDraft(skillsList: string[]): boolean {
  const nextErrors: Record<string, string> = {}
  if (!draft.name.trim()) nextErrors.name = 'Заполните имя'
  if (!draft.email.trim()) nextErrors.email = 'Укажите почту'
  if (!draft.about.trim()) nextErrors.about = 'Добавьте информацию о себе'
  if (!draft.education.trim()) nextErrors.education = 'Укажите образование'
  if (!draft.status.trim()) nextErrors.status = 'Укажите статус'
  if (skillsList.length === 0) nextErrors.skills = 'Добавьте хотя бы один навык'

  resetErrors()
  Object.entries(nextErrors).forEach(([key, message]) => {
    errors[key] = message
  })
  return Object.keys(nextErrors).length === 0
}

function populateDraft() {
  const value = user.value
  draft.name = value.name
  draft.city = value.city
  draft.email = value.email ?? ''
  draft.about = value.about ?? ''
  draft.skills = Array.isArray(value.skills) ? value.skills.join(', ') : ''
  draft.education = value.education ?? ''
  draft.status = value.status ?? ''
  resetErrors()
}

function mergeStoreProfile() {
  const profile = userStore.profile
  if (!profile) return

  const value = user.value
  value.name = profile.name
  value.avatarUrl = profile.avatarUrl || defaultAvatar
  value.phone = profile.phone || ''
  value.email = profile.email || ''
  value.about = profile.about || ''
  value.skills = Array.isArray(profile.skills) ? profile.skills : []
  value.education = profile.education || ''
  value.status = profile.status || ''
}

async function handlePrimaryAction() {
  if (editing.value) {
    await saveEdit()
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
  resetErrors()
}

async function saveEdit() {
  if (savingProfile.value) return
  const skillsList = parseSkills(draft.skills)
  if (!validateDraft(skillsList)) {
    return
  }

  savingProfile.value = true

  try {
    const payload = {
      displayName: draft.name.trim(),
      about: draft.about.trim(),
      email: draft.email.trim(),
      education: draft.education.trim(),
      status: draft.status.trim(),
      skills: skillsList,
    }
    const updated = await updateMyProfile(payload)
    userStore.setProfile(updated)

    const value = user.value
    value.city = draft.city.trim()

    mergeStoreProfile()
    editing.value = false
  } catch (error) {
    console.error('Failed to update profile', error)
  } finally {
    savingProfile.value = false
  }
}

function selectTab(val: TabValue) {
  if (!profileComplete.value && val !== 'about') {
    startEdit()
    active.value = 'about'
    return
  }
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

function triggerAvatarSelect() {
  avatarInput.value?.click()
}

async function onAvatarSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  loadingAvatar.value = true
  try {
    const updated = await uploadAvatar(file)
    userStore.setProfile(updated)
    mergeStoreProfile()
  } catch (error: any) {
    console.error('Avatar upload failed', error)
    alert(String(error?.message || 'Не удалось загрузить аватар'))
  } finally {
    loadingAvatar.value = false
    input.value = ''
  }
}

onMounted(async () => {
  try {
    const ok = await userStore.ensureProfile()
    if (ok) {
      mergeStoreProfile()
      if (!profileComplete.value) {
        startEdit()
      }
    }
  } catch (error) {
    console.error('Failed to load profile', error)
  }
})
</script>

<style>
.tabs-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.tabs-scroll::-webkit-scrollbar {
  display: none;
}

/* Плавное появление/исчезновение при смене вкладок */
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
