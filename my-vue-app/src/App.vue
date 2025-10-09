<template>
  <div class="bg-background-light text-black dark:bg-background-dark dark:text-white">
    <div class="flex min-h-screen flex-col">
      <header
        class="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 px-5 py-4 backdrop-blur dark:bg-background-dark/80">
        <div class="flex h-10 w-10 items-center justify-center">
          <button v-if="showBackButton && !isLoginRoute" type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:hover:bg-white/10"
            @click="handleBack" aria-label="Назад">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

        </div>

        <h1 class="flex-1 text-center text-lg font-semibold">{{ headerTitle }}</h1>

        <RouterLink v-if="!isLoginRoute" :to="{ name: 'settings' }"
          class="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:hover:bg-white/10"
          aria-label="Настройки">
          <SvgIcon name="settings" :active="route.name === 'settings'" />
        </RouterLink>
        <div v-else class="h-10 w-10"></div>
      </header>

      <main class="flex-1">
        <RouterView />
      </main>

      <div v-if="!isLoginRoute" class="fixed inset-x-0 bottom-4 z-20 flex justify-center">
        <transition name="fade">
          <nav v-if="menuOpen"
            class="mx-4 flex items-center gap-2 rounded-full border border-black/10 bg-background-light/80 px-3 py-2 shadow-lg backdrop-blur dark:border-white/10 dark:bg-background-dark/80"
            aria-label="Основная навигация">
            <RouterLink v-for="item in navItems" :key="item.name" :to="{ name: item.name }"
              class="group flex items-center justify-center rounded-full p-2 transition" :class="bubbleClass(item.name)"
              :aria-label="item.label" @click="menuOpen = false">
              <SvgIcon :name="item.icon" :active="route.name === item.name" />
            </RouterLink>
          </nav>
        </transition>

        <button type="button"
          class="ml-2 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-lg transition hover:scale-105 active:scale-95 dark:border-white/10 dark:bg-[#0f1713] dark:text-white"
          @click="toggleMenu" aria-label="Меню">
          <SvgIcon :name="menuOpen ? 'close' : 'menu'" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

type NavName = 'chats' | 'tasks' | 'responses' | 'create-task' | 'profile'
type NavItem = {
  name: NavName
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { name: 'chats', label: 'Чаты', icon: 'chats' },
  { name: 'tasks', label: 'Задачи', icon: 'tasks' },
  { name: 'responses', label: 'Отклики', icon: 'responses' },
  { name: 'create-task', label: 'Создать', icon: 'create-task' },
  { name: 'profile', label: 'Профиль', icon: 'profile' },
]

const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)

const isLoginRoute = computed(() => route.name === 'login')
const showBackButton = computed(() => Boolean(route.meta?.showBack))

const headerTitle = computed(() => {
  if (typeof route.meta?.title === 'string') {
    return route.meta.title as string
  }
  const currentNav = navItems.find((item) => item.name === route.name)
  return currentNav?.label ?? 'Приложение'
})

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push({ name: 'chats' })
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  }
)

const bubbleClass = (name: string) =>
  route.name === name
    ? 'bg-[rgba(16,34,28,0.12)] text-emerald-600 dark:text-emerald-200'
    : 'text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10'

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
        h('svg', baseAttrs, [
          h('path', { d: 'M4 7h12M4 12h16M4 17h10', stroke: color, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
          h('circle', { cx: '16', cy: '7', r: '2.2', stroke: color, 'stroke-width': '1.8', fill: 'none' }),
          h('circle', { cx: '8', cy: '12', r: '2.2', stroke: color, 'stroke-width': '1.8', fill: 'none' }),
          h('circle', { cx: '15', cy: '17', r: '2.2', stroke: color, 'stroke-width': '1.8', fill: 'none' }),
        ]),
      chats: () =>
        h('svg', baseAttrs, [
          h('path', {
            d: 'M4 12a6 6 0 1 1 11.7 2.4L18 18l-3.6-1.3A6 6 0 0 1 4 12Z',
            stroke: color,
            'stroke-width': '1.8',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }),
          h('path', {
            d: 'M14.5 5.5A5.5 5.5 0 1 1 21 11l1.5 3-3-1A5.5 5.5 0 0 1 14.5 5.5Z',
            stroke: color,
            'stroke-width': '1.2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            opacity: '0.7',
          }),
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
      menu: () =>
        h(
          'svg',
          { ...baseAttrs, width: 24, height: 24 },
          [h('path', { d: 'M4 7h16M4 12h16M4 17h16', stroke: color, 'stroke-width': '2', 'stroke-linecap': 'round' })]
        ),
      close: () =>
        h(
          'svg',
          { ...baseAttrs, width: 24, height: 24 },
          [h('path', { d: 'M6 6l12 12M18 6l-12 12', stroke: color, 'stroke-width': '2', 'stroke-linecap': 'round' })]
        ),
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
</style>
