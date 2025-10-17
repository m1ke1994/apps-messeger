<template>
  <section
    class="relative flex min-h-screen items-center justify-center bg-background-light px-4 py-12 text-gray-900 transition-colors dark:bg-background-dark dark:text-white sm:px-6 lg:px-8"
  >
    <div class="absolute inset-x-0 top-6 flex justify-center">
      <div class="h-52 w-52 rounded-full bg-primary-soft/30 blur-3xl dark:bg-primary-soft/20"></div>
    </div>

    <div
      class="relative z-10 w-full max-w-xl rounded-2xl bg-surface-light/80 p-8 shadow-soft ring-1 ring-black/5 backdrop-blur transition-all duration-300 ease-out hover:scale-[1.02] dark:bg-surface-dark/80 dark:ring-white/10 sm:p-10"
    >
      <header class="flex flex-col items-center gap-3 text-center">
        <span
          class="inline-flex items-center rounded-full bg-primary-soft/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary-soft dark:bg-primary-soft/10"
        >
          Codex Chat
        </span>
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold sm:text-4xl">{{ TEXT.welcomeHeadline }}</h1>
          <p class="text-sm text-subtext-light dark:text-subtext-dark sm:text-base">
            {{ TEXT.welcomeDescription }}
          </p>
        </div>
      </header>

      <nav class="mt-8 flex justify-center" role="tablist" aria-label="Toggle between login and registration">
        <div class="inline-flex rounded-full bg-black/5 p-1 dark:bg-white/10">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            :id="`tab-${tab.value}`"
            :aria-controls="`panel-${tab.value}`"
            :aria-selected="activeTab === tab.value"
            :class="[
              'relative min-w-[120px] rounded-full px-5 py-2 text-sm font-semibold transition-all',
              activeTab === tab.value
                ? 'bg-surface-light text-gray-900 shadow-md dark:bg-surface-dark dark:text-white'
                : 'text-subtext-light hover:text-gray-900 dark:text-subtext-dark dark:hover:text-white',
            ]"
            role="tab"
            @click="switchTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>
      </nav>

      <div class="mt-10 space-y-8">
        <div
          v-if="errorMessage"
          class="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <form
          v-if="isLoginTab"
          key="login"
          class="space-y-5"
          role="tabpanel"
          aria-labelledby="tab-login"
          id="panel-login"
          @submit.prevent="handleLogin"
        >
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ TEXT.labels.identifier }}
            </label>
            <input
              v-model.trim="loginForm.identifier"
              type="text"
              name="identifier"
              autocomplete="username"
              placeholder="+7 (999) 000-00-00"
              class="w-full rounded-xl border border-black/5 bg-white/80 px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-surface-dark/70 dark:text-white"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ TEXT.labels.secret }}
            </label>
            <input
              v-model.trim="loginForm.secret"
              type="password"
              name="secret"
              autocomplete="current-password"
              placeholder="Enter the SMS code or password"
              class="w-full rounded-xl border border-black/5 bg-white/80 px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-surface-dark/70 dark:text-white"
            />
          </div>

          <button
            type="submit"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isLoading"
          >
            {{ isLoading ? TEXT.buttons.loginLoading : TEXT.buttons.loginIdle }}
          </button>
        </form>

        <form
          v-else
          key="register"
          class="space-y-5"
          role="tabpanel"
          aria-labelledby="tab-register"
          id="panel-register"
          @submit.prevent="handleRegister"
        >
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ TEXT.labels.name }}
            </label>
            <input
              v-model.trim="registerForm.name"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="Enter full name"
              class="w-full rounded-xl border border-black/5 bg-white/80 px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-surface-dark/70 dark:text-white"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ TEXT.labels.contact }}
            </label>
            <input
              v-model.trim="registerForm.contact"
              type="text"
              name="contact"
              autocomplete="email"
              placeholder="+7 (999) 000-00-00"
              class="w-full rounded-xl border border-black/5 bg-white/80 px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-surface-dark/70 dark:text-white"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ TEXT.labels.password }}
            </label>
            <input
              v-model.trim="registerForm.password"
              type="password"
              name="password"
              autocomplete="new-password"
              placeholder="Create a secure password"
              class="w-full rounded-xl border border-black/5 bg-white/80 px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/10 dark:bg-surface-dark/70 dark:text-white"
            />
          </div>

          <button
            type="submit"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isLoading"
          >
            {{ isLoading ? TEXT.buttons.registerLoading : TEXT.buttons.registerIdle }}
          </button>
        </form>

        <div class="space-y-6">
          <div class="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-subtext-light dark:text-subtext-dark">
            <span class="h-px flex-1 bg-black/10 dark:bg-white/10" aria-hidden="true"></span>
            Or
            <span class="h-px flex-1 bg-black/10 dark:bg-white/10" aria-hidden="true"></span>
          </div>

          <button
            type="button"
            class="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-base font-semibold text-gray-900 transition-all hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-80 dark:border-white/10 dark:bg-surface-dark/70 dark:text-white"
            @click="handleTelegramAuth"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-6 w-6"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M22.999 3.001a1.5 1.5 0 0 0-2.072-1.384L2.225 9.398a1.317 1.317 0 0 0 .072 2.48l3.963 1.227 2.27 7.527a1.31 1.31 0 0 0 2.134.598l3.205-2.86 4.35 3.403a1.31 1.31 0 0 0 2.084-.74L22.94 3.315q.06-.157.059-.314ZM18.43 7.21l-8.59 7.53a.55.55 0 0 0-.18.31l-.42 2.641a.33.33 0 0 1-.642.044L7.58 14.31a.55.55 0 0 1 .214-.62l9.32-6.13a.24.24 0 0 1 .316.036.24.24 0 0 1-.002.356Z"
              />
            </svg>
            {{ TEXT.buttons.telegram }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/userStore'

type AuthTab = 'login' | 'register'

const TEXT = {
  welcomeHeadline: 'Welcome back',
  welcomeDescription: 'Sign in to continue collaborating with your team in Codex Chat.',
  tabs: {
    login: '\u0412\u0445\u043E\u0434',
    register: '\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F',
  },
  labels: {
    identifier: '\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u0438\u043B\u0438 email',
    secret: '\u041A\u043E\u0434 \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C',
    name: '\u0418\u043C\u044F',
    contact: '\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u0438\u043B\u0438 email',
    password: '\u041F\u0430\u0440\u043E\u043B\u044C',
  },
  buttons: {
    loginIdle: '\u0412\u043E\u0439\u0442\u0438',
    loginLoading: '\u0412\u0445\u043E\u0434\u0438\u043C\u2026',
    registerIdle: '\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442',
    registerLoading: '\u0421\u043E\u0437\u0434\u0430\u0451\u043C\u2026',
    telegram: '\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u0447\u0435\u0440\u0435\u0437 Telegram',
  },
} as const

const tabs: Array<{ label: string; value: AuthTab }> = [
  { label: TEXT.tabs.login, value: 'login' },
  { label: TEXT.tabs.register, value: 'register' },
]

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref<AuthTab>('login')
const isLoading = ref(false)
const errorMessage = ref('')

const loginForm = reactive({
  identifier: '',
  secret: '',
})

const registerForm = reactive({
  name: '',
  contact: '',
  password: '',
})

const isLoginTab = computed(() => activeTab.value === 'login')

const fakeRequest = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, 900)
  })

const switchTab = (nextTab: AuthTab) => {
  if (nextTab === activeTab.value) return
  if (isLoading.value) return

  activeTab.value = nextTab
  errorMessage.value = ''
}

const handleLogin = async () => {
  if (!loginForm.identifier || !loginForm.secret) {
    errorMessage.value = 'Please fill in both fields.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await fakeRequest()
    console.log('login payload', { ...loginForm })
    await userStore.fetchProfile()
    router.push('/chats')
  } catch (error) {
    console.error('login error', error)
    errorMessage.value = 'Unable to sign in. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  if (!registerForm.name || !registerForm.contact || !registerForm.password) {
    errorMessage.value = 'Please complete all fields before continuing.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await fakeRequest()
    console.log('register payload', { ...registerForm })
    await userStore.fetchProfile()
    router.push('/chats')
  } catch (error) {
    console.error('register error', error)
    errorMessage.value = 'Account creation failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleTelegramAuth = async () => {
  if (isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await fakeRequest()
    console.log('telegram auth requested')
    await userStore.fetchProfile()
    router.push('/chats')
  } catch (error) {
    console.error('telegram auth error', error)
    errorMessage.value = 'Telegram sign-in failed. Please try a different method.'
  } finally {
    isLoading.value = false
  }
}
</script>
