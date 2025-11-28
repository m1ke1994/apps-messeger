<!-- src/views/AuthPage.vue -->
<template>
  <section
    class="relative flex min-h-screen items-center justify-center bg-background-light px-4 py-12 text-gray-900 transition-colors dark:bg-background-dark dark:text-white sm:px-6 lg:px-8"
  >
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
            <h1 class="text-2xl font-bold tracking-tight">Вход через Telegram</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Откройте бота, поделитесь контактом — получите одноразовый код и введите его здесь.
            </p>
          </header>

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
                :disabled="loadingStart"
                @blur="normalizePhoneInline"
              />
            </div>
            <p v-if="phoneError" class="text-sm text-rose-600 dark:text-rose-300">{{ phoneError }}</p>

            <button
              type="submit"
              class="w-full rounded-xl px-4 py-3 text-base font-semibold transition active:scale-[0.99]
                     bg-[#047857] text-white hover:bg-[#059669] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34d399]
                     disabled:cursor-not-allowed disabled:bg-[#047857]/60 disabled:opacity-60"
              :disabled="!phoneValid || loadingStart"
            >
              {{ loadingStart ? 'Открываем бота...' : 'Открыть Telegram-бот' }}
            </button>
          </form>

          <div
            v-if="startInitiated"
            class="fade-in-step mt-4 rounded-xl border border-[#047857]/30 bg-[#047857]/5 p-4 dark:border-[#34d399]/30 dark:bg-[#047857]/10"
            style="--i:2;"
          >
            <div class="flex flex-col gap-2">
              <p class="text-sm font-medium text-[#047857] dark:text-[#34d399]">Дальнейшие шаги</p>
              <ol class="list-decimal pl-5 text-sm leading-relaxed text-gray-800 dark:text-gray-100">
                <li>В Telegram нажмите кнопку «Отправить контакт».</li>
                <li>Получите код от бота и введите его ниже.</li>
              </ol>
              <div class="flex flex-col gap-2 sm:flex-row">
                <a
                  :href="tgDeepLink"
                  target="_blank"
                  rel="noopener"
                  class="flex-1 rounded-lg border border-[#047857]/40 px-3 py-2 text-center text-sm font-medium text-[#047857] transition
                         hover:bg-[#047857]/10 dark:border-[#34d399]/60 dark:text-[#34d399] dark:hover:bg-[#34d399]/10"
                >
                  Открыть Telegram
                </a>
                <p class="flex-1 rounded-lg border border-[#047857]/10 px-3 py-2 text-sm text-gray-700 dark:border-[#34d399]/20 dark:text-gray-200">
                  Код живёт: <span class="font-semibold">{{ ttlLabel }}</span>
                </p>
              </div>
            </div>
          </div>

          <form class="mt-6 space-y-3 fade-in-step" style="--i:3;" @submit.prevent="handleVerify">
            <label class="block text-sm font-medium" for="otp">Код из Telegram</label>
            <div class="relative">
              <input
                id="otp"
                v-model.trim="verifyCode"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="Ваш одноразовый код"
                class="w-full rounded-xl border border-[#047857]/30 bg-white/80 px-4 py-3 outline-none transition
                       focus:border-[#047857] focus:ring-2 focus:ring-[#047857] disabled:border-[#047857]/20
                       dark:border-[#047857]/40 dark:bg-white/5 dark:focus:border-[#34d399] dark:focus:ring-[#34d399]"
                :disabled="loadingVerify"
                maxlength="12"
              />
            </div>

            <button
              type="submit"
              class="w-full rounded-xl bg-[#047857] px-4 py-3 font-semibold text-white transition
                     hover:bg-[#059669] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34d399]
                     disabled:cursor-not-allowed disabled:bg-[#047857]/60 disabled:opacity-60 dark:bg-[#059669] dark:hover:bg-[#34d399]"
              :disabled="!canSubmit"
            >
              {{ loadingVerify ? 'Проверяем...' : 'Войти' }}
            </button>

            <p
              v-if="errorMsg"
              class="rounded-lg border border-rose-400/30 bg-rose-100/60 p-3 text-sm text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200"
            >
              {{ errorMsg }}
            </p>
          </form>

          <footer class="fade-in-step mt-6 text-center text-xs text-gray-500 dark:text-gray-400" style="--i:4;">
            Подсказка: бот пришлёт код после отправки контакта. Срок действия — 10 минут.
          </footer>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { verifyTelegramCode } from '@/api/auth'
import { useUserStore } from '@/stores/userStore'

const TG_BOT = (import.meta.env.VITE_TELEGRAM_BOT || 'app_messeger_bot').replace(/^@/, '')
const router = useRouter()
const userStore = useUserStore()

const loadingStart = ref(false)
const loadingVerify = ref(false)
const startInitiated = ref(false)
const startExpiresAt = ref<number | null>(null)
const verifyCode = ref('')
const errorMsg = ref('')
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
  if (!TG_BOT) return '#'
  return `https://t.me/${TG_BOT}`
})
const canSubmit = computed(() => phoneValid.value && verifyCode.value.trim().length >= 4 && !loadingVerify.value)

async function handleStart() {
  phoneError.value = ''
  errorMsg.value = ''
  const normalized = normalizePhone(phone.value)
  if (!/^\+\d{8,15}$/.test(normalized)) {
    phoneError.value = 'Укажите номер в формате +XXXXXXXXXXX'
    return
  }
  phone.value = normalized
  loadingStart.value = true
  try {
    startInitiated.value = true
    startExpiresAt.value = Date.now() + 10 * 60 * 1000
    if (tgDeepLink.value !== '#') {
      window.open(tgDeepLink.value, '_blank')
    }
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
  const normalized = normalizePhone(phone.value)
  try {
    const res = await verifyTelegramCode(normalized, verifyCode.value.trim())
    userStore.setTokens(res.token, res.refresh)

    try {
      await userStore.loadProfile()
    } catch (loadErr) {
      userStore.setProfile({
        id: res.user.id,
        displayName: res.user.username || res.user.phone || 'User',
        username: res.user.username,
        phone: res.user.phone,
        about: '',
        avatarUrl: '',
        email: '',
        telegramUsername: res.user.username,
      })
      console.error('Profile load failed right after login, using fallback', loadErr)
    }
    await router.replace({ name: 'chats' })
  } catch (e: any) {
    errorMsg.value = String(e?.message || 'Не удалось подтвердить код')
  } finally {
    loadingVerify.value = false
  }
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

onMounted(() => {
  userStore
    .ensureProfile()
    .then((ok) => {
      if (ok) router.replace({ name: 'chats' })
    })
    .catch(() => {
      userStore.clearProfile()
    })
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
input { font-size: 16px; }

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

.bg-bloom-enter-from { opacity: 0; transform: scale(0.96); }
.bg-bloom-enter-active { transition: opacity .8s ease, transform .8s ease; }
.bg-bloom-enter-to { opacity: 1; transform: scale(1); }

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
