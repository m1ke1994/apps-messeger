<!-- src/views/AuthTelegram.vue -->
<template>
  <section
    class="relative flex min-h-screen items-center justify-center bg-background-light px-4 py-12 text-gray-900 transition-colors dark:bg-background-dark dark:text-white sm:px-6 lg:px-8"
  >
    <!-- Фон (мягкий, без артефактов) -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        class="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl opacity-25 dark:opacity-20"
        style="background: radial-gradient(50% 50% at 50% 50%, rgba(56,189,248,0.35) 0%, rgba(99,102,241,0.22) 45%, rgba(0,0,0,0) 70%);"
      />
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background-light/60 to-transparent dark:from-background-dark/60" />
    </div>

    <div class="w-full max-w-md">
      <div class="rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-md shadow-xl dark:border-white/10 dark:bg-black/30">
        <header class="mb-6 text-center">
          <h1 class="text-2xl font-bold tracking-tight">Вход / Регистрация</h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Авторизация через Telegram. Сначала подтвердим номер, затем введёшь код.
          </p>
        </header>

        <!-- Шаг 0: номер телефона -->
        <form class="space-y-3" @submit.prevent="handleStart">
          <label class="block text-sm font-medium" for="phone">Номер телефона</label>
          <div class="relative">
            <input
              id="phone"
              v-model.trim="phone"
              inputmode="tel"
              autocomplete="tel"
              placeholder="+7 999 123-45-67"
              class="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none transition
                     focus:ring-2 focus:ring-sky-400 dark:border-white/10 dark:bg-white/5"
              :disabled="loadingStart || !!startCode"
              @blur="normalizePhoneInline"
            />
            <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <span class="text-xs text-gray-500 dark:text-gray-400">E.164</span>
            </div>
          </div>
          <p v-if="phoneError" class="text-sm text-rose-600 dark:text-rose-300">{{ phoneError }}</p>

          <button
            type="submit"
            class="w-full rounded-xl px-4 py-3 text-base font-semibold transition active:scale-[0.99]
                   bg-[#229ED9] text-white hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="!phoneValid || loadingStart || !!startCode"
          >
            {{ startCode ? 'Код уже получен' : (loadingStart ? 'Отправляем…' : 'Получить код в Telegram') }}
          </button>
        </form>

        <!-- Блок со start-кодом и диплинком -->
        <div
          v-if="startCode"
          class="mt-4 rounded-xl border border-sky-300/40 bg-sky-50/60 p-4 dark:border-sky-400/20 dark:bg-sky-400/10"
        >
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-wide text-sky-700 dark:text-sky-300">Start code</p>
              <p class="font-mono text-lg font-semibold">{{ startCode }}</p>
            </div>
            <button
              class="rounded-lg border border-black/10 px-3 py-2 text-sm transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
              @click="copy(startCode)"
              :disabled="copied"
            >
              {{ copied ? 'Скопировано' : 'Копировать' }}
            </button>
          </div>

          <div class="mt-3 flex flex-col gap-2 sm:flex-row">
            <a
              :href="tgDeepLink"
              target="_blank"
              rel="noopener"
              class="flex-1 rounded-lg border border-black/10 px-3 py-2 text-center text-sm font-medium transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
            >
              Открыть Telegram
            </a>
            <button
              type="button"
              class="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
              @click="resetStart"
            >
              Сменить код
            </button>
          </div>

          <p class="mt-2 text-xs text-gray-600 dark:text-gray-300">
            Срок жизни кода: <span class="font-medium">{{ ttlLabel }}</span>
          </p>
        </div>

        <!-- Шаг 2: ввод проверочного кода -->
        <form class="mt-6 space-y-3" @submit.prevent="handleVerify">
          <label class="block text-sm font-medium" for="otp">Код из Telegram</label>
          <div class="relative">
            <input
              id="otp"
              v-model.trim="verifyCode"
              inputmode="numeric"
              autocomplete="one-time-code"
              placeholder="Введите 6–8 значный код"
              class="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 outline-none transition
                     focus:ring-2 focus:ring-sky-400 dark:border-white/10 dark:bg-white/5"
              :disabled="!startCode || loadingVerify"
              maxlength="12"
            />
            <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <span class="text-xs text-gray-500 dark:text-gray-400">OTP</span>
            </div>
          </div>

          <button
            type="submit"
            class="w-full rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition
                   hover:bg-gray-800 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
            :disabled="!canSubmit || loadingVerify"
          >
            {{ loadingVerify ? 'Проверяем…' : 'Войти' }}
          </button>

          <p
            v-if="errorMsg"
            class="rounded-lg border border-rose-400/30 bg-rose-100/60 p-3 text-sm text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200"
          >
            {{ errorMsg }}
          </p>
        </form>

        <footer class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Нажимая «Войти», вы соглашаетесь с условиями сервиса и политикой конфиденциальности.
        </footer>
      </div>

      <div class="mt-4 text-center">
        <router-link
          to="/"
          class="text-sm text-gray-600 underline-offset-4 hover:underline dark:text-gray-300"
        >
          На главную
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// ENV
// VITE_API_BASE_URL=https://api.example.com
// VITE_TELEGRAM_BOT=your_bot_username  (без @)
const API = import.meta.env.VITE_API_BASE_URL || ''
const TG_BOT = (import.meta.env.VITE_TELEGRAM_BOT || '').replace(/^@/, '')

const router = useRouter()
const userStore = useUserStore()

// UI/State
const loadingStart = ref(false)
const loadingVerify = ref(false)
const startCode = ref<string | null>(null)
const startExpiresAt = ref<number | null>(null) // unix ms
const verifyCode = ref('')
const errorMsg = ref('')
const copied = ref(false)

// Телефон
const phone = ref('')
const phoneError = ref('')

// Таймер
let timer: number | null = null

// ======== Computed ========
const phoneValid = computed(() => {
  const normalized = normalizePhone(phone.value)
  // Примитивная проверка E.164: + и от 8 до 15 цифр
  return /^\+\d{8,15}$/.test(normalized)
})

const ttlMs = computed(() => {
  if (!startExpiresAt.value) return 0
  return Math.max(0, startExpiresAt.value - Date.now())
})

const ttlLabel = computed(() => {
  const ms = ttlMs.value
  const s = Math.ceil(ms / 1000)
  const m = Math.floor(s / 60)
  const ss = s % 60
  if (!ms) return 'истёк'
  return `${m}:${ss.toString().padStart(2, '0')}`
})

const tgDeepLink = computed(() => {
  const code = startCode.value || ''
  if (!TG_BOT) return '#'
  const startParam = code ? `?start=${encodeURIComponent(code)}` : ''
  return `https://t.me/${TG_BOT}${startParam}`
})

const canSubmit = computed(() => {
  return !!startCode.value && verifyCode.value.length >= 4 && !loadingVerify.value
})

// ======== Methods ========
async function handleStart() {
  errorMsg.value = ''
  phoneError.value = ''
  copied.value = false

  const normalized = normalizePhone(phone.value)
  if (!/^\+\d{8,15}$/.test(normalized)) {
    phoneError.value = 'Введите корректный номер в формате +XXXXXXXXXXX'
    return
  }

  loadingStart.value = true
  try {
    // бек ожидает номер для связки
    const res = await fetch(`${API}/api/auth/telegram/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: normalized }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    startCode.value = data.start_code || data.startCode
    if (!startCode.value) throw new Error('Не получили start_code')

    const expiresIso = data.expires_at || data.expiresAt
    const ttl = typeof data.ttl === 'number' ? data.ttl : null

    if (expiresIso) {
      startExpiresAt.value = typeof expiresIso === 'number' ? expiresIso : Date.parse(expiresIso)
    } else if (ttl) {
      startExpiresAt.value = Date.now() + ttl * 1000
    } else {
      startExpiresAt.value = Date.now() + 5 * 60 * 1000
    }

    if (timer) window.clearInterval(timer)
    timer = window.setInterval(() => {
      if (ttlMs.value <= 0 && timer) {
        window.clearInterval(timer)
        timer = null
      }
    }, 1000)
  } catch (e: any) {
    errorMsg.value = normalizeErr(e, 'Не удалось отправить код. Попробуйте позже.')
    startCode.value = null
    startExpiresAt.value = null
  } finally {
    loadingStart.value = false
  }
}

async function handleVerify() {
  if (!canSubmit.value) return
  errorMsg.value = ''
  loadingVerify.value = true
  try {
    const payload = {
      start_code: startCode.value,
      code: verifyCode.value.trim(),
    }
    const res = await fetch(`${API}/api/auth/telegram/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    const access = data.access || data.token?.access
    const refresh = data.refresh || data.token?.refresh
    if (!access || !refresh) throw new Error('Пустой ответ авторизации')

    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)

    await userStore.fetchProfile()
    router.replace('/chats')
  } catch (e: any) {
    errorMsg.value = normalizeErr(e, 'Неверный код или истёк срок действия. Запросите новый.')
  } finally {
    loadingVerify.value = false
  }
}

function resetStart() {
  startCode.value = null
  startExpiresAt.value = null
  verifyCode.value = ''
  errorMsg.value = ''
  copied.value = false
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1200)
  } catch { /* no-op */ }
}

function normalizeErr(e: any, fallback: string) {
  return String(e?.response?.data?.detail || e?.response?.data?.message || e?.message || fallback)
}

// Нормализация телефона в E.164 с простыми правилами СНГ
function normalizePhone(raw: string): string {
  let digits = String(raw).replace(/[^\d+]/g, '')
  // если начинается с 8 и длина >= 10 — преобразуем в +7…
  if (/^8\d{10}$/.test(digits)) digits = '+7' + digits.slice(1)
  // если начинается с 7 без плюса — добавим плюс
  if (/^7\d{10,14}$/.test(digits)) digits = '+' + digits
  // если нет плюса и начинается с 0 — уберём ведущие нули
  if (/^0+\d+$/.test(digits)) digits = digits.replace(/^0+/, '')
  // если начинается с ++ — исправим
  digits = digits.replace(/^\++/, '+')
  // если без плюса, но похоже на международный — добавим
  if (!digits.startsWith('+') && /^\d{8,15}$/.test(digits)) digits = '+' + digits
  return digits
}

function normalizePhoneInline() {
  const n = normalizePhone(phone.value)
  phone.value = n
  phoneError.value = /^\+\d{8,15}$/.test(n) ? '' : 'Формат: +XXXXXXXXXXX'
}

// ======== Lifecycle ========
onMounted(() => {
  if (localStorage.getItem('access')) router.replace('/chats')
})
onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style scoped>
/* Устраняем масштабирование на iOS при фокусе */
input { font-size: 16px; }
</style>
