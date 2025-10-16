<template>
  <div class="flex min-h-screen flex-col bg-background-light text-black dark:bg-background-dark dark:text-white">
    <header class="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 px-5 py-4 backdrop-blur dark:bg-background-dark/80">
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

      <h1 class="flex-1 text-center text-lg font-semibold">{{ headerTitle }}</h1>
      <div class="h-10 w-10"></div>
    </header>

    <main
      class="relative flex-1 overflow-hidden"
      style="padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 5rem);"
    >
      <RouterView v-slot="{ Component, route: activeRoute }">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="activeRoute.fullPath" class="route-view" />
        </Transition>
      </RouterView>
    </main>

    <footer
      v-if="!isLoginRoute"
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
          <SvgIcon :name="item.icon" :active="route.name === item.name" />
        </RouterLink>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, defineComponent, h, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useNavigationDirectionStore } from './stores/navigationDirection'

type NavName = 'chats' | 'tasks' | 'responses' | 'create-task' | 'profile' | 'settings'
type NavItem = { name: NavName; label: string; icon: string }

const navItems: NavItem[] = [
  { name: 'chats', label: 'Чаты', icon: 'chats' },
  { name: 'tasks', label: 'Задачи', icon: 'tasks' },
  { name: 'responses', label: 'Отклики', icon: 'responses' },
  { name: 'create-task', label: 'Создать задачу', icon: 'create-task' },
  { name: 'profile', label: 'Профиль', icon: 'profile' },
  { name: 'settings', label: 'Настройки', icon: 'settings' },
]

const TITLE_MAP: Record<string, string> = {
  chats: 'Чаты',
  tasks: 'Задачи',
  responses: 'Отклики',
  'create-task': 'Создать задачу',
  profile: 'Профиль',
  settings: 'Настройки',
  'task-detail': 'Задача',
  login: 'Вход',
}

const route = useRoute()
const router = useRouter()
const navigationStore = useNavigationDirectionStore()
const { direction } = storeToRefs(navigationStore)
const transitionName = computed(() => (direction.value === 'back' ? 'slide-back' : 'slide-forward'))

const rName = computed(() => String((route as any)?.name ?? ''))
const rMeta = computed<Record<string, unknown>>(() => ((route as any)?.meta ?? {}) as Record<string, unknown>)

const isLoginRoute = computed(() => rName.value === 'login')
const showBackButton = computed(() => Boolean(rMeta.value.showBack))

const headerTitle = computed(() => {
  const metaTitle = rMeta.value.title
  if (typeof metaTitle === 'string') return metaTitle
  return TITLE_MAP[rName.value] ?? 'Помощник'
})

const handleBack = () => {
  navigationStore.prepareDirectionOnce('back')
  if (window.history.length > 1) router.back()
  else router.push({ name: 'chats' })
}

const bubbleClass = (name: string) =>
  rName.value === name
    ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
    : 'text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10'

onMounted(() => {
  router.afterEach((to) => {
    const metaTitle = (to as any)?.meta?.title as string | undefined
    const nextName = String((to as any)?.name ?? '')
    document.title = metaTitle ?? TITLE_MAP[nextName] ?? 'Помощник'
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

    const color = props.active ? ACTIVE_COLOR : 'currentColor'

    const icons: Record<string, () => ReturnType<typeof h>> = {
      settings: () =>
        h('svg', { ...baseAttrs, viewBox: '0 0 50 50' }, [
          h('path', {
            d: 'M22.2 2a1 1 0 0 0-.98.84l-.97 5.95a18.6 18.6 0 0 0-3.34 1.37l-4.9-3.51a1 1 0 0 0-1.3.1l-3.89 3.89a1 1 0 0 0-.11 1.28l3.46 4.95a18.6 18.6 0 0 0-1.38 3.33l-5.93.99a1 1 0 0 0-.84.98v5.5a1 1 0 0 0 .82.98l5.93 1.05a18.5 18.5 0 0 0 1.39 3.35l-3.5 4.9a1 1 0 0 0 .1 1.3l3.89 3.89a1 1 0 0 0 1.28.11l4.95-3.46a18.6 18.6 0 0 0 3.33 1.38l.99 5.94a1 1 0 0 0 .98.84h5.5a1 1 0 0 0 .98-.83l1.06-5.99a18.7 18.7 0 0 0 3.33-1.4l4.99 3.5a1 1 0 0 0 1.3-.1l3.89-3.89a1 1 0 0 0 .11-1.28l-3.46-4.95a18.6 18.6 0 0 0 1.38-3.32l5.94-1.06a1 1 0 0 0 .84-.98v-5.5a1 1 0 0 0-.84-.97l-6-1.03a18.5 18.5 0 0 0-1.37-3.32l3.5-4.99a1 1 0 0 0-.1-1.3l-3.89-3.89a1 1 0 0 0-1.28-.11l-5.02 3.54A18.6 18.6 0 0 0 29.74 8l-1.05-6A1 1 0 0 0 27.7 2z',
            fill: 'none',
            stroke: color,
            'stroke-width': '2',
          }),
          h('circle', { cx: '25', cy: '25', r: '8', stroke: color, 'stroke-width': '2', fill: 'none' }),
        ]),
      chats: () =>
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
      tasks: () =>
        h('svg', baseAttrs, [
          h('rect', { x: '4', y: '3.5', width: '16', height: '17', rx: '2.5', stroke: color, 'stroke-width': '1.8' }),
          h('path', { d: 'M8 8h8M8 12h8M8 16h5', stroke: color, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
        ]),
      responses: () =>
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
      'create-task': () =>
        h('svg', baseAttrs, [
          h('circle', { cx: '12', cy: '12', r: '8.5', stroke: color, 'stroke-width': '1.8' }),
          h('path', { d: 'M12 8v8M8 12h8', stroke: color, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
        ]),
      profile: () =>
        h('svg', baseAttrs, [
          h('circle', { cx: '12', cy: '8', r: '3.2', stroke: color, 'stroke-width': '1.8' }),
          h('path', { d: 'M5 19a7 7 0 0 1 14 0', stroke: color, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
        ]),
    }

    return () => {
      const renderIcon = icons[props.name]
      return renderIcon ? renderIcon() : h('svg', baseAttrs)
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
