<!-- src/views/AuthTelegram.vue -->
<template>
  <section
    class="relative flex min-h-screen items-center justify-center bg-background-light px-4 py-12 text-gray-900 transition-colors dark:bg-background-dark dark:text-white sm:px-6 lg:px-8"
  >
    <!-- Фон -->
    <Transition appear name="bg-bloom">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          class="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl opacity-25 dark:opacity-20"
          style="background: radial-gradient(50% 50% at 50% 50%, rgba(56,189,248,0.35) 0%, rgba(99,102,241,0.22) 45%, rgba(0,0,0,0) 70%);"
        />
        <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background-light/60 to-transparent dark:from-background-dark/60" />
      </div>
    </Transition>

    <div class="w-full max-w-md">
      <Transition appear name="auth-pop">
        <div
          class="auth-card rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-md shadow-xl dark:border-white/10 dark:bg-black/30"
        >
          <header class="mb-6 text-center fade-in-step" style="--i:0;">
            <h1 class="text-2xl font-bold tracking-tight">Вход / Регистрация</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Локальная демо-авторизация «как через Telegram». Код генерируется на клиенте.
            </p>
          </header>

          <!-- Шаг 0 -->
          <form class="space-y-3 fade-in-step" style="--i:1;" @submit.prevent="handleStart">
            <label class="block text-sm font-medium" for="phone">Номер телефона</label>
            <div class="relative">
              <input
                id="phone"
                v-model.trim="phone"
                inputmode="tel"
                autocomplete="tel"
                placeholder="+7 999 123-45-67"
                class="w-full rounded-xl border border-[#047857]/30 bg-white/80 px-4 py-3 outline-none transition
                       focus:border-[#047857] focus:ring-2 focus:ring-[#047857] disabled:border-[#047857]/20
                       dark:border-[#047857]/40 dark:bg-white/5 dark:focus:border-[#34d399] dark:focus:ring-[#34d399]"
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
                     bg-[#047857] text-white hover:bg-[#059669] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34d399]
                     disabled:cursor-not-allowed disabled:bg-[#047857]/60 disabled:opacity-60"
              :disabled="!phoneValid || loadingStart || !!startCode"
            >
              {{ startCode ? 'Код уже получен' : (loadingStart ? 'Генерируем…' : 'Получить код (демо)') }}
            </button>
          </form>

          <!-- Код -->
          <div
            v-if="startCode"
            class="fade-in-step mt-4 rounded-xl border border-[#047857]/30 bg-[#047857]/5 p-4 dark:border-[#34d399]/30 dark:bg-[#047857]/10"
            style="--i:2;"
          >
            <div class="flex items-center justify-between gap-2">
              <div>
                <p class="text-xs uppercase tracking-wide text-[#047857] dark:text-[#34d399]">Start code (демо)</p>
                <p class="font-mono text-lg font-semibold">{{ startCode }}</p>
              </div>
              <button
                class="rounded-lg border border-[#047857]/40 px-3 py-2 text-sm font-medium text-[#047857] transition
                       hover:bg-[#047857]/10 disabled:cursor-not-allowed disabled:opacity-60
                       dark:border-[#34d399]/60 dark:text-[#34d399] dark:hover:bg-[#34d399]/10"
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
                class="flex-1 rounded-lg border border-[#047857]/40 px-3 py-2 text-center text-sm font-medium text-[#047857] transition
                       hover:bg-[#047857]/10 dark:border-[#34d399]/60 dark:text-[#34d399] dark:hover:bg-[#34d399]/10"
              >
                Открыть Telegram
              </a>
              <button
                type="button"
                class="flex-1 rounded-lg border border-[#047857]/40 px-3 py-2 text-sm font-medium text-[#047857] transition
                       hover:bg-[#047857]/10 dark:border-[#34d399]/60 dark:text-[#34d399] dark:hover:bg-[#34d399]/10"
                @click="resetStart"
              >
                Сменить код
              </button>
            </div>

            <p class="mt-2 text-xs text-gray-600 dark:text-gray-300">
              Срок жизни кода: <span class="font-medium">{{ ttlLabel }}</span>
            </p>
          </div>

          <!-- Проверка -->
          <form class="mt-6 space-y-3 fade-in-step" style="--i:3;" @submit.prevent="handleVerify">
            <label class="block text-sm font-medium" for="otp">Код из «Telegram»</label>
            <div class="relative">
              <input
                id="otp"
                v-model.trim="verifyCode"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="Введите сгенерированный код (или 123456)"
                class="w-full rounded-xl border border-[#047857]/30 bg-white/80 px-4 py-3 outline-none transition
                       focus:border-[#047857] focus:ring-2 focus:ring-[#047857] disabled:border-[#047857]/20
                       dark:border-[#047857]/40 dark:bg-white/5 dark:focus:border-[#34d399] dark:focus:ring-[#34d399]"
                :disabled="!startCode || loadingVerify"
                maxlength="12"
              />
              <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <span class="text-xs text-gray-500 dark:text-gray-400">OTP</span>
              </div>
            </div>

            <button
              type="submit"
              class="w-full rounded-xl bg-[#047857] px-4 py-3 font-semibold text-white transition
                     hover:bg-[#059669] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34d399]
                     disabled:cursor-not-allowed disabled:bg-[#047857]/60 disabled:opacity-60 dark:bg-[#059669] dark:hover:bg-[#34d399]"
              :disabled="!startCode || loadingVerify"
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

          <footer class="fade-in-step mt-6 text-center text-xs text-gray-500 dark:text-gray-400" style="--i:4;">
            Демо: без сервера. Код = {{ startCode || '—' }}, допустим также «123456».
          </footer>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const TG_BOT = (import.meta.env.VITE_TELEGRAM_BOT || '').replace(/^@/, '')
const router = useRouter()
const userStore = useUserStore()

const loadingStart = ref(false)
const loadingVerify = ref(false)
const startCode = ref<string | null>(null)
const startExpiresAt = ref<number | null>(null)
const verifyCode = ref('')
const errorMsg = ref('')
const copied = ref(false)
const phone = ref('')
const phoneError = ref('')
let timer: number | null = null

const phoneValid = computed(() => /^\+\d{8,15}$/.test(normalizePhone(phone.value)))
const ttlMs = computed(() => Math.max(0, (startExpiresAt.value || 0) - Date.now()))
const ttlLabel = computed(() => {
  const s = Math.ceil(ttlMs.value / 1000)
  return s <= 0 ? 'истёк' : `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
})
const tgDeepLink = computed(() => {
  const code = startCode.value || ''
  if (!TG_BOT) return '#'
  return `https://t.me/${TG_BOT}${code ? `?start=${encodeURIComponent(code)}` : ''}`
})
const canSubmit = computed(() => !!startCode.value && verifyCode.value.length >= 4 && !loadingVerify.value)

function randomCode(len = 6) {
  const digits = '0123456789'
  return Array.from({ length: len }, () => digits[Math.floor(Math.random() * digits.length)]).join('')
}

async function handleStart() {
  phoneError.value = ''
  errorMsg.value = ''
  copied.value = false
  const normalized = normalizePhone(phone.value)
  if (!/^\+\d{8,15}$/.test(normalized)) {
    phoneError.value = 'Введите корректный номер в формате +XXXXXXXXXXX'
    return
  }
  loadingStart.value = true
  try {
    startCode.value = randomCode(6)
    startExpiresAt.value = Date.now() + 5 * 60 * 1000
    if (timer) clearInterval(timer)
    timer = window.setInterval(() => {
      if (ttlMs.value <= 0 && timer) {
        clearInterval(timer)
        timer = null
      }
    }, 1000)
  } finally {
    loadingStart.value = false
  }
}

async function handleVerify() {
  if (!canSubmit.value) return
  errorMsg.value = ''
  loadingVerify.value = true
  try {
    const ok = verifyCode.value.trim() === startCode.value || verifyCode.value.trim() === '123456'
    const alive = (startExpiresAt.value || 0) > Date.now()
    if (!ok) throw new Error('Неверный код')
    if (!alive) throw new Error('Срок действия кода истёк')
    localStorage.setItem('access', 'demo-access-token')
    localStorage.setItem('refresh', 'demo-refresh-token')
    const normalized = normalizePhone(phone.value)
    await Promise.all([
      userStore.bootstrapDemoProfile({ id: 'demo', name: 'Demo User', phone: normalized }),
      router.replace({ name: 'chats' }),
    ])
  } catch (e: any) {
    errorMsg.value = String(e?.message || 'Ошибка проверки')
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
  if (timer) clearInterval(timer)
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1200)
  } catch {}
}

function normalizePhone(raw: string) {
  let d = raw.replace(/[^\d+]/g, '')
  if (/^8\d{10}$/.test(d)) d = '+7' + d.slice(1)
  if (/^7\d{10,14}$/.test(d)) d = '+' + d
  d = d.replace(/^0+/, '').replace(/^\++/, '+')
  if (!d.startsWith('+') && /^\d{8,15}$/.test(d)) d = '+' + d
  return d
}
function normalizePhoneInline() {
  const n = normalizePhone(phone.value)
  phone.value = n
  phoneError.value = /^\+\d{8,15}$/.test(n) ? '' : 'Формат: +XXXXXXXXXXX'
}

onMounted(() => { if (localStorage.getItem('access')) router.replace('/chats') })
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
input { font-size: 16px; }

/* ===== Плавное появление карточки ===== */
.auth-pop-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98) rotateX(6deg);
  filter: blur(6px);
  transform-origin: 50% 20%;
}
.auth-pop-enter-active {
  transition:
    opacity .6s cubic-bezier(.22,.61,.36,1),
    transform .6s cubic-bezier(.22,.61,.36,1),
    filter .6s cubic-bezier(.22,.61,.36,1);
}
.auth-pop-enter-to {
  opacity: 1;
  transform: none;
  filter: none;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.18),
              0 0 0 1px rgba(52, 211, 153, 0.1);
}

/* ===== Мягкое "распускание" фона ===== */
.bg-bloom-enter-from { opacity: 0; transform: scale(0.96); }
.bg-bloom-enter-active { transition: opacity .8s ease, transform .8s ease; }
.bg-bloom-enter-to { opacity: 1; transform: scale(1); }

/* ===== Каскадная лестница появления содержимого ===== */
.fade-in-step {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp .6s forwards;
  animation-delay: calc(var(--i) * 0.12s + 0.25s);
}
@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .auth-pop-enter-active,
  .bg-bloom-enter-active,
  .fade-in-step { transition: none !important; animation: none !important; opacity: 1 !important; transform: none !important; }
}
</style>
