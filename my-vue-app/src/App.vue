<template>
  <div class="bg-background-light text-black dark:bg-background-dark dark:text-white">
    <div class="flex min-h-screen flex-col">
      <!-- Header -->
      <header
        class="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 px-5 py-4 backdrop-blur dark:bg-background-dark/80"
      >
        <!-- Back button -->
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

        <!-- Title -->
        <h1 class="flex-1 text-center text-lg font-semibold">{{ headerTitle }}</h1>

        <!-- Settings (hidden on login) -->
        <RouterLink
          v-if="!isLoginRoute"
          :to="{ name: 'settings' }"
          class="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:hover:bg-white/10"
          aria-label="Настройки"
        >
          <SvgIcon name="settings" :active="route.name === 'settings'" />
        </RouterLink>
        <div v-else class="h-10 w-10"></div>
      </header>

      <!-- Main content -->
      <main class="relative flex-1 overflow-hidden">
        <RouterView v-slot="{ Component, route: activeRoute }">
          <Transition :name="transitionName" mode="out-in">
            <component :is="Component" :key="activeRoute.fullPath" class="route-view" />
          </Transition>
        </RouterView>
      </main>

      <!-- Floating bottom nav -->
      <div v-if="!isLoginRoute" class="fixed inset-x-0 bottom-4 z-20 flex justify-center">
        <transition name="fade">
          <nav
            v-if="menuOpen"
            class="mx-4 flex items-center gap-2 rounded-full border border-black/10 bg-background-light/80 px-3 py-2 shadow-lg backdrop-blur dark:border-white/10 dark:bg-background-dark/80"
            aria-label="Основная навигация"
          >
            <RouterLink
              v-for="item in navItems"
              :key="item.name"
              :to="{ name: item.name }"
              class="group flex items-center justify-center rounded-full p-2 transition"
              :class="bubbleClass(item.name)"
              :aria-label="item.label"
              @click="menuOpen = false"
            >
              <SvgIcon :name="item.icon" :active="route.name === item.name" />
            </RouterLink>
          </nav>
        </transition>

        <button
          type="button"
          class="ml-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#047857] text-white shadow-lg transition hover:bg-[#059669] hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#059669]"
          @click="toggleMenu"
          aria-label="Меню"
        >
          <SvgIcon :name="menuOpen ? 'close' : 'menu'" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useNavigationDirectionStore } from './stores/navigationDirection'

type NavName = 'chats' | 'tasks' | 'responses' | 'create-task' | 'profile'
type NavItem = { name: NavName; label: string; icon: string }

const navItems: NavItem[] = [
  { name: 'chats',       label: 'Чаты',    icon: 'chats' },
  { name: 'tasks',       label: 'Задачи',  icon: 'tasks' },
  { name: 'responses',   label: 'Отклики', icon: 'responses' },
  { name: 'create-task', label: 'Создать', icon: 'create-task' },
  { name: 'profile',     label: 'Профиль', icon: 'profile' },
]

const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)
const navigationStore = useNavigationDirectionStore()
const { direction } = storeToRefs(navigationStore)
const transitionName = computed(() => (direction.value === 'back' ? 'slide-back' : 'slide-forward'))

/** Безопасные прокси к текущему роуту */
const rName = computed(() => String((route as any)?.name ?? ''))
const rMeta = computed<Record<string, any>>(
  () => (((route as any)?.meta ?? {}) as Record<string, any>)
)

const isLoginRoute = computed(() => rName.value === 'login')
const showBackButton = computed(() => Boolean(rMeta.value.showBack))

const headerTitle = computed(() => {
  const metaTitle = rMeta.value.title
  if (typeof metaTitle === 'string') return metaTitle

  const fallback: Record<string, string> = {
    chats: 'Чаты',
    tasks: 'Задачи',
    responses: 'Отклики',
    'create-task': 'Создать задачу',
    profile: 'Профиль',
    'task-detail': 'Задача',
    settings: 'Настройки',
    login: 'Вход',
  }
  return fallback[rName.value] ?? 'Приложение'
})

const handleBack = () => {
  navigationStore.prepareDirectionOnce('back')
  if (window.history.length > 1) router.back()
  else router.push({ name: 'chats' })
}

const toggleMenu = () => { menuOpen.value = !menuOpen.value }

const bubbleClass = (name: string) =>
  rName.value === name
    ? 'bg-[rgba(16,34,28,0.12)] text-emerald-600 dark:text-emerald-200'
    : 'text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10'

/** Закрываем меню и обновляем document.title после каждой навигации */
onMounted(() => {
  router.afterEach((to) => {
    menuOpen.value = false
    const metaTitle = (to as any)?.meta?.title as string | undefined
    const map: Record<string, string> = {
      chats: 'Чаты',
      tasks: 'Задачи',
      responses: 'Отклики',
      'create-task': 'Создать задачу',
      profile: 'Профиль',
      'task-detail': 'Задача',
      settings: 'Настройки',
      login: 'Вход',
    }
    const name = String((to as any)?.name ?? '')
    document.title = metaTitle ?? map[name] ?? 'Приложение'
  })
})

/** Иконки */
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
    // settings (шестерёнка из твоего SVG) — в том же объекте, где остальные иконки
settings: () =>
  h('svg', { ...baseAttrs, viewBox: '0 0 50 50' }, [
    h('path', {
      d: 'M 22.205078 2 A 1.0001 1.0001 0 0 0 21.21875 2.8378906 L 20.246094 8.7929688 C 19.076509 9.1331971 17.961243 9.5922728 16.910156 10.164062 L 11.996094 6.6542969 A 1.0001 1.0001 0 0 0 10.708984 6.7597656 L 6.8183594 10.646484 A 1.0001 1.0001 0 0 0 6.7070312 11.927734 L 10.164062 16.873047 C 9.583454 17.930271 9.1142098 19.051824 8.765625 20.232422 L 2.8359375 21.21875 A 1.0001 1.0001 0 0 0 2.0019531 22.205078 L 2.0019531 27.705078 A 1.0001 1.0001 0 0 0 2.8261719 28.691406 L 8.7597656 29.742188 C 9.1064607 30.920739 9.5727226 32.043065 10.154297 33.101562 L 6.6542969 37.998047 A 1.0001 1.0001 0 0 0 6.7597656 39.285156 L 10.648438 43.175781 A 1.0001 1.0001 0 0 0 11.927734 43.289062 L 16.882812 39.820312 C 17.936999 40.39548 19.054994 40.857928 20.228516 41.201172 L 21.21875 47.164062 A 1.0001 1.0001 0 0 0 22.205078 48 L 27.705078 48 A 1.0001 1.0001 0 0 0 28.691406 47.173828 L 29.751953 41.1875 C 30.920633 40.838997 32.033372 40.369697 33.082031 39.791016 L 38.070312 43.291016 A 1.0001 1.0001 0 0 0 39.351562 43.179688 L 43.240234 39.287109 A 1.0001 1.0001 0 0 0 43.34375 37.996094 L 39.787109 33.058594 C 40.355783 32.014958 40.813915 30.908875 41.154297 29.748047 L 47.171875 28.693359 A 1.0001 1.0001 0 0 0 47.998047 27.707031 L 47.998047 22.207031 A 1.0001 1.0001 0 0 0 47.160156 21.220703 L 41.152344 20.238281 C 40.80968 19.078827 40.350281 17.974723 39.78125 16.931641 L 43.289062 11.933594 A 1.0001 1.0001 0 0 0 43.177734 10.652344 L 39.287109 6.7636719 A 1.0001 1.0001 0 0 0 37.996094 6.6601562 L 33.072266 10.201172 C 32.023186 9.6248101 30.909713 9.1579916 29.738281 8.8125 L 28.691406 2.828125 A 1.0001 1.0001 0 0 0 27.705078 2 L 22.205078 2 z M 23.056641 4 L 26.865234 4 L 27.861328 9.6855469 A 1.0001 1.0001 0 0 0 28.603516 10.484375 C 30.066026 10.848832 31.439607 11.426549 32.693359 12.185547 A 1.0001 1.0001 0 0 0 33.794922 12.142578 L 38.474609 8.7792969 L 41.167969 11.472656 L 37.835938 16.220703 A 1.0001 1.0001 0 0 0 37.796875 17.310547 C 38.548366 18.561471 39.118333 19.926379 39.482422 21.380859 A 1.0001 1.0001 0 0 0 40.291016 22.125 L 45.998047 23.058594 L 45.998047 26.867188 L 40.279297 27.871094 A 1.0001 1.0001 0 0 0 39.482422 28.617188 C 39.122545 30.069817 38.552234 31.434687 37.800781 32.685547 A 1.0001 1.0001 0 0 0 37.845703 33.785156 L 41.224609 38.474609 L 38.53125 41.169922 L 33.791016 37.84375 A 1.0001 1.0001 0 0 0 32.697266 37.808594 C 31.44975 38.567585 30.074755 39.148028 28.617188 39.517578 A 1.0001 1.0001 0 0 0 27.876953 40.3125 L 26.867188 46 L 23.052734 46 L 22.111328 40.337891 A 1.0001 1.0001 0 0 0 21.365234 39.53125 C 19.90185 39.170557 18.522094 38.59371 17.259766 37.835938 A 1.0001 1.0001 0 0 0 16.171875 37.875 L 11.46875 41.169922 L 8.7734375 38.470703 L 12.097656 33.824219 A 1.0001 1.0001 0 0 0 12.138672 32.724609 C 11.372652 31.458855 10.793319 30.079213 10.427734 28.609375 A 1.0001 1.0001 0 0 0 9.6328125 27.867188 L 4.0019531 26.867188 L 4.0019531 23.052734 L 9.6289062 22.117188 A 1.0001 1.0001 0 0 0 10.435547 21.373047 C 10.804273 19.898143 11.383325 18.518729 12.146484 17.255859 A 1.0001 1.0001 0 0 0 12.111328 16.164062 L 8.8261719 11.46875 L 11.523438 8.7734375 L 16.185547 12.105469 A 1.0001 1.0001 0 0 0 17.28125 12.148438 C 18.536908 11.394293 19.919867 10.822081 21.384766 10.462891 A 1.0001 1.0001 0 0 0 22.132812 9.6523438 L 23.056641 4 z M 25 17 C 20.593567 17 17 20.593567 17 25 C 17 29.406433 20.593567 33 25 33 C 29.406433 33 33 29.406433 33 25 C 33 20.593567 29.406433 17 25 17 z M 25 19 C 28.325553 19 31 21.674447 31 25 C 31 28.325553 28.325553 31 25 31 C 21.674447 31 19 28.325553 19 25 C 19 21.674447 21.674447 19 25 19 z',
      fill: 'none',
      stroke: color,
      'stroke-width': '1.8',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      // чтобы толщина штриха не "худела" при скейле
      'vector-effect': 'non-scaling-stroke',
    }),
  ]),

     chats: () =>
  h('svg', {
    ...baseAttrs,
    viewBox: '0 0 512 512',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  }, [
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
            stroke: color, 'stroke-width': '1.8',
          }),
          h('path', {
            d: 'M4 14h4l2 2h4l2-2h4',
            stroke: color, 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
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
        h('svg', { ...baseAttrs, width: 24, height: 24 }, [
          h('path', { d: 'M4 7h16M4 12h16M4 17h16', stroke: color, 'stroke-width': '2', 'stroke-linecap': 'round' }),
        ]),
      close: () =>
        h('svg', { ...baseAttrs, width: 24, height: 24 }, [
          h('path', { d: 'M6 6l12 12M18 6l-12 12', stroke: color, 'stroke-width': '2', 'stroke-linecap': 'round' }),
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
