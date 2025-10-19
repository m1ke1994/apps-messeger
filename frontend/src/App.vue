
<template>
  <div class="flex min-h-screen flex-col bg-background-light text-black dark:bg-background-dark dark:text-white">
    <header
      v-if="!isLoginRoute"
      class="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 px-5 py-4 backdrop-blur dark:bg-background-dark/80"
    >
      <div class="flex h-10 w-10 items-center justify-center">
        <button
          v-if="showBackButton && !isLoginRoute"
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-[#047857] text-white transition hover:bg-[#059669] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#059669]"
          @click="handleBack"
          aria-label="Назад"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      <div class="flex flex-1 items-center justify-center">
        <template v-if="isChatDetail">
          <div class="flex items-center gap-3">
            <div
              v-if="chatPeer?.avatar"
              class="h-10 w-10 rounded-full bg-cover bg-center"
              :style="chatPeerStyle"
            />
            <div
              v-else
              class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
            >
              {{ chatInitials }}
            </div>
            <div class="min-w-0 text-left">
              <p class="truncate font-semibold">{{ chatPeer?.name ?? 'Диалог' }}</p>
              <p class="text-xs text-emerald-600 dark:text-emerald-300">
                {{ chatPeer?.status ?? 'online' }}
              </p>
            </div>
          </div>
        </template>
        <template v-else>
          <h1 class="text-lg font-semibold">{{ headerTitle }}</h1>
        </template>
      </div>

      <div class="flex min-w-[4.5rem] items-center justify-end gap-2">
        <template v-if="isChatDetail">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-[#047857] text-white transition hover:bg-[#059669] active:scale-95"
            aria-label="Аудиозвонок"
            @click="openAudioCall"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-[22px] w-[22px]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59c.62.3 1.36.19 1.85-.3l1.2-1.2a1 1 0 011.05-.24l2.72.91a1 1 0 01.67.95v2.13a2 2 0 01-2.18 2A18 18 0 013 6.48 2 2 0 015 4.3h2.13a1 1 0 01.95.67l.91 2.72a1 1 0 01-.24 1.05l-1.2 1.2c-.49.49-.61 1.23-.3 1.85z" />
            </svg>
          </button>

          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-[#047857] text-white transition hover:bg-[#059669] active:scale-95"
            aria-label="Видеозвонок"
            @click="openVideoCall"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-[24px] w-[24px]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2.586l2.293-2.293A1 1 0 0 1 20 7v10a1 1 0 0 1-1.707.707L16 15.414V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
            </svg>
          </button>
        </template>
      </div>
    </header>

    <main
      class="relative flex-1 overflow-hidden"
      :style="{ paddingBottom: mainPaddingBottom }"
    >
      <RouterView v-slot="{ Component, route: activeRoute }">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="activeRoute.fullPath" class="route-view" />
        </Transition>
      </RouterView>
    </main>

    <footer
      v-if="!isLoginRoute && !isChatDetail && !hideNav"
      class="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-background-light/95 backdrop-blur dark:border-white/10 dark:bg-background-dark/95"
      style="padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 0.75rem);"
    >
      <nav
        class="mx-auto flex max-w-xl items-center justify-between gap-2 px-6 pt-2"
        aria-label="Основная навигация"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="group flex h-12 w-12 items-center justify-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          :class="bubbleClass(item.name)"
          :aria-label="item.label"
        >
          <SvgIcon :name="item.icon" :active="activeNavName === item.name" />
        </RouterLink>
      </nav>
    </footer>

    <Transition name="fade">
      <div
        v-if="isAppLoading"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        aria-live="assertive"
        aria-label="Загрузка данных"
      >
        <div class="flex flex-col items-center gap-3 text-white">
          <span class="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"></span>
          <p class="text-sm font-medium">Загружаем профиль…</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, defineComponent, h, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { peersMap, type PeerInfo } from './data/peers'
import { useNavigationDirectionStore } from './stores/navigationDirection'
import { useUserStore } from './stores/userStore'

type NavName = 'chats' | 'tasks' | 'responses' | 'create-task' | 'profile' | 'settings'
type NavItem = { name: NavName; label: string; icon: string }

const navItems: NavItem[] = [
  { name: 'chats', label: 'Чаты', icon: 'chats' },
  { name: 'tasks', label: 'Задачи', icon: 'tasks' },
  { name: 'responses', label: 'Мои отклики', icon: 'responses' },
  { name: 'create-task', label: 'Создать задачу', icon: 'create-task' },
  { name: 'profile', label: 'Профиль', icon: 'profile' },
  { name: 'settings', label: 'Настройки', icon: 'settings' },
]
// src/App.vue


const TITLE_MAP: Record<string, string> = {
  chats: 'Чаты',
  tasks: 'Задачи',
  responses: 'Мои отклики',
  'create-task': 'Создать задачу',
  profile: 'Профиль',
  settings: 'Настройки',
  'task-detail': 'Задача',
  'chat-detail': 'Диалог',
  login: 'Вход',
}

const route = useRoute()
const router = useRouter()
const navigationStore = useNavigationDirectionStore()
const userStore = useUserStore()
const { direction } = storeToRefs(navigationStore)
const { status } = storeToRefs(userStore)
const transitionName = computed(() => (direction.value === 'back' ? 'slide-back' : 'slide-forward'))

const rName = computed(() => String((route as any)?.name ?? ''))
const rMeta = computed<Record<string, unknown>>(() => ((route as any)?.meta ?? {}) as Record<string, unknown>)
const hideNav = computed(() => Boolean(rMeta.value.hideNav))
const isCallRoute = computed(() => rName.value === 'chat-audio-call' || rName.value === 'chat-video-call')

const isLoginRoute = computed(() => rName.value === 'auth')
const isChatDetail = computed(() => rName.value === 'chat-detail')

const showBackButton = computed(() => Boolean(rMeta.value.showBack))

const chatPeerId = computed(() => {
  if (!isChatDetail.value) return null
  const raw = route.params.id
  const parsed = typeof raw === 'string'
    ? parseInt(raw, 10)
    : Array.isArray(raw)
      ? parseInt(raw[0], 10)
      : NaN
  return Number.isFinite(parsed) ? parsed : null
})

const chatPeer = computed<PeerInfo | null>(() => {
  if (chatPeerId.value == null) return null
  return peersMap[chatPeerId.value] ?? null
})

const chatPeerStyle = computed(() => (chatPeer.value?.avatar ? { backgroundImage: `url('${chatPeer.value.avatar}')` } : {}))
const chatInitials = computed(() => chatPeer.value?.name?.charAt(0).toUpperCase() ?? 'Ч')

const headerTitle = computed(() => {
  if (isChatDetail.value && chatPeer.value) return chatPeer.value.name
  const metaTitle = rMeta.value.title
  if (typeof metaTitle === 'string') return metaTitle
  return TITLE_MAP[rName.value] ?? 'Помощник'
})

const handleBack = () => {
  navigationStore.prepareDirectionOnce('back')
  if (window.history.length > 1) router.back()
  else router.push({ name: 'chats' })
}

const openAudioCall = () => {
  if (chatPeerId.value == null) return
  navigationStore.prepareDirectionOnce('forward')
  router.push({ name: 'chat-audio-call', params: { id: chatPeerId.value } })
}

const openVideoCall = () => {
  if (chatPeerId.value == null) return
  navigationStore.prepareDirectionOnce('forward')
  router.push({ name: 'chat-video-call', params: { id: chatPeerId.value } })
}

const activeNavName = computed<NavName>(() => {
  if (rName.value === 'chat-detail' || isCallRoute.value) return 'chats'
  const found = navItems.find(item => item.name === rName.value)
  return found?.name ?? 'chats'
})

const mainPaddingBottom = computed(() => {
  if (hideNav.value) return '0'
  const base = isChatDetail.value ? '6rem' : '5rem'
  return `calc(env(safe-area-inset-bottom, 0px) + ${base})`
})

const bubbleClass = (name: NavName) =>
  activeNavName.value === name
    ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
    : 'text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10'

const isAppLoading = computed(() => status.value === 'loading')

onMounted(() => {
  router.afterEach((to) => {
    const metaTitle = (to as any)?.meta?.title as string | undefined
    const nextName = String((to as any)?.name ?? '')
    const nextChatId = to.params?.id
    let chatTitle: string | null = null
    if (nextName === 'chat-detail') {
      const parsed = typeof nextChatId === 'string'
        ? parseInt(nextChatId, 10)
        : Array.isArray(nextChatId)
          ? parseInt(nextChatId[0], 10)
          : NaN
      chatTitle = Number.isFinite(parsed) ? peersMap[parsed]?.name ?? null : null
    }
    document.title = metaTitle ?? chatTitle ?? TITLE_MAP[nextName] ?? 'Помощник'
  })
})

const ACTIVE_COLOR = '#047857'

const SvgIcon = defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
    active: { type: Boolean, default: false },
    size: { type: Number, default: 22 },
  },
  setup(props) {
    const baseAttrs = {
      width: props.size,
      height: props.size,
      viewBox: '0 0 24 24',
      fill: 'none',
      'aria-hidden': 'true',
    } as const

    const icons: Record<string, (color: string) => ReturnType<typeof h>> = {
      settings: (color) =>
        h('svg', { ...baseAttrs, viewBox: '0 0 50 50' }, [
          h('path', {
            d: 'M22.2 2a1 1 0 0 0-.98.84l-.97 5.95a18.6 18.6 0 0 0-3.34 1.37l-4.9-3.51a1 1 0 0 0-1.3.1l-3.89 3.89a1 1 0 0 0-.11 1.28l3.46 4.95a18.6 18.6 0 0 0-1.38 3.33l-5.93.99a1 1 0 0 0-.84.98v5.5a1 1 0 0 0 .82.98l5.93 1.05a18.5 18.5 0 0 0 1.39 3.35l-3.5 4.9a1 1 0 0 0 .1 1.3l3.89 3.89a1 1 0 0 0 1.28.11l4.95-3.46a18.6 18.6 0 0 0 3.33 1.38l.99 5.94a1 1 0 0 0 .98.84h5.5a1 1 0 0 0 .98-.83l1.06-5.99a18.7 18.7 0 0 0 3.33-1.4l4.99 3.5a1 1 0 0 0 1.3-.1l3.89-3.89a1 1 0 0 0 .11-1.28l-3.46-4.95a18.6 18.6 0 0 0 1.38-3.32l5.94-1.06a1 1 0 0 0 .84-.98v-5.5a1 1 0 0 0-.84-.97l-6-1.03a18.5 18.5 0 0 0-1.37-3.32l3.5-4.99a1 1 0 0 0-.1-1.3l-3.89-3.89a1 1 0 0 0-1.28-.11l-5.02 3.54A18.6 18.6 0 0 0 29.74 8l-1.05-6A1 1 0 0 0 27.7 2z',
            fill: 'none',
            stroke: color,
            'stroke-width': '3.5',
          }),
          h('circle', { cx: '25', cy: '25', r: '8', stroke: color, 'stroke-width': '3.5', fill: 'none' }),
        ]),
      chats: (color) =>
        h('svg', { ...baseAttrs, viewBox: '0 0 512 512' }, [
          h('path', {
            d: 'M256 32C132.3 32 32 120.9 32 232c0 49.6 23.4 95 62.6 130.1C85 401.2 72.3 437.3 72 438.3a8 8 0 0 0 7.5 10.6c30.7 0 74.4-21.8 97.4-35.2 24.3 8.2 50.8 12.3 79.1 12.3 123.7 0 224-88.9 224-200S379.7 32 256 32Z',
            stroke: color,
            'stroke-width': '42',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            fill: 'none',
          }),
          h('circle', { cx: '176', cy: '232', r: '16', fill: color }),
          h('circle', { cx: '256', cy: '232', r: '16', fill: color }),
          h('circle', { cx: '336', cy: '232', r: '16', fill: color }),
        ]),
      tasks: (color) =>
        h('svg', baseAttrs, [
          h('rect', { x: '4', y: '3.5', width: '16', height: '17', rx: '2.5', stroke: color, 'stroke-width': '1.8' }),
          h('path', { d: 'M8 8h8M8 12h8M8 16h5', stroke: color, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
        ]),
      responses: (color) =>
        h('svg', baseAttrs, [
          h('path', {
            d: 'M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5Z',
            stroke: color,
            'stroke-width': '1.8',
          }),
          h('path', {
            d: 'M4 14h4l2 2h4l2-2h4',
            stroke: color,
            'stroke-width': '1.8',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }),
        ]),
      'create-task': (color) =>
        h('svg', baseAttrs, [
          h('circle', { cx: '12', cy: '12', r: '8.5', stroke: color, 'stroke-width': '1.8' }),
          h('path', { d: 'M12 8v8M8 12h8', stroke: color, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
        ]),
      profile: (color) =>
        h('svg', baseAttrs, [
          h('circle', { cx: '12', cy: '8', r: '3.2', stroke: color, 'stroke-width': '1.8' }),
          h('path', { d: 'M5 19a7 7 0 0 1 14 0', stroke: color, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
        ]),
      phone: (color) =>
        h('svg', { ...baseAttrs, viewBox: '0 0 24 24' }, [
          h('path', {
            d: 'M4.5 5.5c-.3 3.9 3.6 8.4 7 10.8 1.6 1.1 3.7 1.1 5.2-.2l1-0.9a1 1 0 0 0-.1-1.6l-2.9-1.6a1 1 0 0 0-1.1.1l-.9.7c-1.5-0.8-3.4-2.7-4.2-4.2l.7-.9a1 1 0 0 0 .1-1.1L8.1 4c-.3-.6-1.1-.8-1.6-.4l-1 0.9c-.7.6-1.1 1.4-1 2z',
            fill: 'none',
            stroke: color,
            'stroke-width': '1.8',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }),
        ]),
      video: (color) =>
        h('svg', { ...baseAttrs, viewBox: '0 0 24 24' }, [
          h('path', {
            d: 'M3 6h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z',
            fill: 'none',
            stroke: color,
            'stroke-width': '1.8',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }),
          h('path', {
            d: 'M15 9l5-3v12l-5-3',
            fill: 'none',
            stroke: color,
            'stroke-width': '1.8',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }),
        ]),
    }

    return () => {
      const renderIcon = icons[props.name]
      if (!renderIcon) {
        return h('svg', baseAttrs)
      }
      const color = props.active ? ACTIVE_COLOR : 'currentColor'
      return renderIcon(color)
    }
  },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 160ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:global(.route-view) {
  min-height: 100%;
}

:global(.slide-forward-enter-active),
:global(.slide-forward-leave-active),
:global(.slide-back-enter-active),
:global(.slide-back-leave-active) {
  transition: transform 260ms ease, opacity 260ms ease;
}

:global(.slide-forward-enter-active),
:global(.slide-forward-leave-active),
:global(.slide-back-enter-active),
:global(.slide-back-leave-active) {
  position: absolute;
  inset: 0;
}

:global(.slide-forward-enter-from) {
  transform: translateX(22%);
  opacity: 0.35;
}

:global(.slide-forward-leave-to) {
  transform: translateX(-14%);
  opacity: 0;
}

:global(.slide-back-enter-from) {
  transform: translateX(-22%);
  opacity: 0.35;
}

:global(.slide-back-leave-to) {
  transform: translateX(14%);
  opacity: 0;
}

:global(.slide-forward-enter-to),
:global(.slide-forward-leave-from),
:global(.slide-back-enter-to),
:global(.slide-back-leave-from) {
  transform: translateX(0);
  opacity: 1;
}
</style>

