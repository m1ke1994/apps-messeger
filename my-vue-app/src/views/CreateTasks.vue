<!-- CreateTask.vue -->
<template>
  <div class="flex min-h-screen flex-col justify-between bg-background-light font-display dark:bg-background-dark">
    <!-- Header -->
    <header class="p-4">
      <div class="relative flex items-center justify-center">
        <button
          type="button"
          class="absolute left-0 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          @click="handleClose"
          aria-label="Закрыть"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>
        <h1 class="text-lg font-bold text-gray-900 dark:text-white">Создать задание</h1>
      </div>
    </header>

    <!-- Progress -->
    <div class="space-y-2 px-4">
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
        Шаг {{ step }} из {{ totalSteps }}
      </p>
      <div class="h-1.5 w-full rounded-full bg-primary/20">
        <div class="h-1.5 rounded-full bg-primary" :style="{ width: progressWidth }"></div>
      </div>
    </div>

    <!-- Steps -->
    <main class="relative flex-grow overflow-hidden">
      <Transition name="slide-left" mode="out-in">
        <!-- Шаг 1 -->
        <section v-if="step === 1" key="step-1" class="p-4 space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Категория</label>
            <select
              v-model="form.category"
              class="form-select h-14 w-full rounded-lg border-0 bg-gray-200 px-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
              required
            >
              <option disabled value="">Выберите категорию</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
            <p v-if="errors.category" class="mt-1 text-xs text-rose-600">{{ errors.category }}</p>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Заголовок</label>
            <input
              v-model.trim="form.title"
              type="text"
              placeholder="Например: Сверстать лендинг кофейни"
              class="h-14 w-full rounded-lg border-0 bg-gray-200 px-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
              required
            />
            <p v-if="errors.title" class="mt-1 text-xs text-rose-600">{{ errors.title }}</p>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
            <textarea
              v-model.trim="form.description"
              placeholder="Коротко опишите задачу, сроки и ожидания по результату…"
              class="min-h-36 w-full rounded-lg border-0 bg-gray-200 p-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
              required
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-xs text-rose-600">{{ errors.description }}</p>
          </div>
        </section>

        <!-- Шаг 2 -->
        <section v-else-if="step === 2" key="step-2" class="p-4 space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Бюджет</label>
            <div class="relative">
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="100"
                placeholder="Например: 8000"
                class="h-14 w-full rounded-lg border-0 bg-gray-200 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                required
              />
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 dark:text-gray-400">₽</span>
            </div>
            <p v-if="errors.price" class="mt-1 text-xs text-rose-600">{{ errors.price }}</p>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Срок выполнения</label>

            <div class="flex flex-col gap-2">
              <input
                v-model.number="form.deadlineDays"
                type="range"
                min="1"
                max="100"
                class="w-full accent-primary"
                aria-label="Срок выполнения в днях"
              />
              <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>1 день</span>
                <span class="font-semibold">
                  {{ form.deadlineDays }} {{ dayWord(form.deadlineDays) }}
                </span>
                <span>100 дней</span>
              </div>
            </div>

            <p v-if="errors.deadline" class="mt-1 text-xs text-rose-600">{{ errors.deadline }}</p>
          </div>
        </section>

        <!-- Шаг 3 (превью) -->
        <section v-else key="step-3" class="p-4 space-y-4">
          <h2 class="text-base font-bold text-gray-900 dark:text-white">Предпросмотр</h2>

          <article class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,.08)] dark:border-gray-700 dark:bg-surface-dark">
            <div class="flex items-start justify-between gap-3 px-4 pt-4">
              <span class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
                В ожидании
              </span>
              <span v-if="priceIsValid" class="rounded-full bg-primary/15 px-3 py-1 text-sm font-extrabold text-primary">
                {{ Number(form.price).toLocaleString('ru-RU') }} ₽
              </span>
            </div>
            <div class="px-4 pb-4 pt-3">
              <h3 class="mb-2 text-base font-extrabold leading-snug text-gray-900 dark:text-white">
                {{ form.title || 'Без названия' }}
              </h3>
              <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {{ form.description || 'Описание будет здесь…' }}
              </p>

              <div class="my-4 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10"></div>

              <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span class="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{{ form.category || 'Категория' }}</span>
                <span v-if="form.deadlineDays" class="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-white/10">
                  Срок: {{ form.deadlineDays }} {{ dayWord(form.deadlineDays) }}
                </span>
              </div>
            </div>
          </article>

          <p class="text-xs text-slate-500 dark:text-slate-400">
            Проверьте данные. Нажимая «Опубликовать», вы отправляете задание на сервер.
          </p>
        </section>
      </Transition>
    </main>

    <!-- Footer -->
    <footer class="p-4">
      <div v-if="step < 3" class="flex items-center gap-2">
        <button
          v-if="step > 1"
          type="button"
          @click="prev"
          class="h-12 flex-1 rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          Назад
        </button>
        <button
          type="button"
          :disabled="!canProceed"
          @click="next"
          class="h-12 flex-1 rounded-xl bg-primary px-4 text-base font-bold text-background-dark shadow-sm transition-all hover:brightness-95 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          Далее
        </button>
      </div>

      <div v-else class="flex items-center gap-2">
        <button
          type="button"
          @click="prev"
          class="h-12 flex-1 rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:translate-y-px dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          Назад
        </button>
        <button
          type="button"
          :disabled="publishing"
          @click="publish"
          class="h-12 flex-1 rounded-xl bg-primary px-4 text-base font-bold text-background-dark shadow-sm transition-all hover:brightness-95 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="!publishing">Опубликовать</span>
          <span v-else class="inline-flex items-center gap-2">
            <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a 8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"></path>
            </svg>
            Публикация…
          </span>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

/* ---- конфиг ---- */
const totalSteps = 3
const categories = ['Дизайн', 'Разработка', 'Копирайтинг']

/* ---- состояние ---- */
const step = ref(1)
const publishing = ref(false)
const form = reactive({
  category: '',
  title: '',
  description: '',
  price: null,        // число или null
  deadlineDays: 7,    // 1..100
})

const errors = reactive({
  category: '',
  title: '',
  description: '',
  price: '',
  deadline: '',
})

/* ---- вычисления ---- */
const progressWidth = computed(() => `${Math.round((step.value / totalSteps) * 100)}%`)
const priceIsValid = computed(() => Number.isFinite(Number(form.price)) && Number(form.price) >= 0)

const canProceed = computed(() => {
  if (step.value === 1) {
    return Boolean(form.category)
      && form.title.trim().length >= 4
      && form.description.trim().length >= 10
  }
  if (step.value === 2) {
    return priceIsValid.value && form.deadlineDays >= 1
  }
  return true
})

/* ---- валидаторы ---- */
function validateStep1() {
  errors.category = form.category ? '' : 'Выберите категорию.'
  errors.title = form.title.trim().length >= 4 ? '' : 'Минимум 4 символа для заголовка.'
  errors.description = form.description.trim().length >= 10 ? '' : 'Минимум 10 символов для описания.'
  return !(errors.category || errors.title || errors.description)
}

function validateStep2() {
  errors.price = priceIsValid.value ? '' : 'Укажите бюджет (число ≥ 0).'
  errors.deadline = form.deadlineDays >= 1 ? '' : 'Укажите срок выполнения.'
  return !(errors.price || errors.deadline)
}

/* ---- навигация ---- */
function next() {
  if (step.value === 1 && !validateStep1()) return
  if (step.value === 2 && !validateStep2()) return
  if (step.value < totalSteps) step.value += 1
}
function prev() {
  if (step.value > 1) step.value -= 1
}

/* ---- закрытие ---- */
const router = useRouter()
const emit = defineEmits(['close'])
function handleClose() {
  if (window.history.length > 1) {
    router.back()
  } else {
    emit('close')
  }
}

/* ---- публикация (заглушка POST) ---- */
async function publish() {
  publishing.value = true
  try {
    // здесь поставь реальный endpoint и fetch/axios
    await new Promise((r) => setTimeout(r, 1200))
    console.log('POST /api/tasks', { ...form })
    alert('Задание опубликовано!')
  } catch (e) {
    alert('Не удалось опубликовать. Попробуйте снова.')
  } finally {
    publishing.value = false
  }
}

/* ---- утилиты ---- */
function dayWord(n) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'день'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня'
  return 'дней'
}
</script>

<style>
:root { --mobile-h: 884px; }
body { min-height: max(var(--mobile-h), 100dvh); }

/* кастомная стрелка у select */
.form-select{
  background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2355e792' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position:right .75rem center;
  background-repeat:no-repeat;
  background-size:1.25em 1.25em;
  padding-right:2.5rem;
  -webkit-appearance:none; -moz-appearance:none; appearance:none;
}

/* анимация слайда справа -> налево */
.slide-left-enter-active,
.slide-left-leave-active { transition: transform .22s ease, opacity .22s ease; will-change: transform, opacity; }
.slide-left-enter-from { transform: translateX(30%); opacity: 0; }
.slide-left-enter-to   { transform: translateX(0);    opacity: 1; }
.slide-left-leave-from { transform: translateX(0);    opacity: 1; }
.slide-left-leave-to   { transform: translateX(-20%); opacity: 0; }
</style>
