<template>
  <div class="bg-background-light text-black dark:bg-background-dark dark:text-white">
    <div class="flex min-h-screen flex-col">
      <!-- Header -->
      <header
        class="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 px-5 py-4 backdrop-blur dark:bg-background-dark/80"
      >
        <h1 class="flex-1 text-center text-lg font-semibold">{{ headerTitle }}</h1>

        <!-- Настройки (SVG) -->
        <RouterLink
          v-if="!isLoginRoute"
          :to="{ name: 'settings' }"
          class="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:hover:bg-white/10"
          aria-label="Настройки"
        >
          <SvgIcon name="settings" :active="route.name === 'settings'" />
        </RouterLink>
      </header>

      <!-- Content -->
      <main class="flex-1">
        <RouterView />
      </main>

      <!-- Floating SVG Menu -->
      <div v-if="!isLoginRoute" class="fixed inset-x-0 bottom-4 z-20 flex justify-center">
        <!-- Контейнер меню (пилюля) -->
        <transition name="fade">
          <nav
            v-if="menuOpen"
            class="mx-4 flex items-center gap-2 rounded-full border border-black/10 bg-background-light/80 px-3 py-2 shadow-lg backdrop-blur dark:border-white/10 dark:bg-background-dark/80"
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
              <SvgIcon :name="item.name" :active="route.name === item.name" />
            </RouterLink>
          </nav>
        </transition>

        <!-- Кнопка открытия/закрытия меню -->
        <button
          type="button"
          class="ml-2 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-lg transition hover:scale-105 active:scale-95 dark:border-white/10 dark:bg-[#0f1713] dark:text-white"
          @click="menuOpen = !menuOpen"
          aria-label="Меню"
        >
          <SvgIcon :name="menuOpen ? 'close' : 'menu'" :active="false" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

type NavItem = {
  name: 'chats' | 'tasks' | 'responses' | 'create-task' | 'profile'
  label: string
}

const ACTIVE = '#10221C' // цвет активной вкладки по ТЗ

const navItems: NavItem[] = [
  { name: 'chats',       label: 'Чаты' },
  { name: 'tasks',       label: 'Задачи' },
  { name: 'responses',   label: 'Отклики' },
  { name: 'create-task', label: 'Создать' },
  { name: 'profile',     label: 'Профиль' },
]

const route = useRoute()
const menuOpen = ref(false)

const isLoginRoute = computed(() => route.name === 'login')

const headerTitle = computed(() => {
  if (route.meta?.title) return route.meta.title as string
  const currentNav = navItems.find((item) => item.name === route.name)
  return currentNav?.label ?? 'Приложение'
})

const bubbleClass = (name: string) =>
  route.name === name
    ? 'bg-[rgba(16,34,28,0.10)] text-[color:var(--active)]'
    : 'text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10'
</script>

<!-- Локальный компонент иконок (включая «Настройки») -->
<script lang="ts">
import { defineComponent, h } from 'vue'

const ACTIVE = '#10221C'

export default {}
export const SvgIcon = defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
    active: { type: Boolean, default: false },
    size: { type: Number, default: 22 },
  },
  setup(props) {
    const c = props.active ? ACTIVE : 'currentColor'
    const s = props.size

    const icons: Record<string, any> = {
      // Настройки (ползунки)
      settings: h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        // Линии треков
        h('path', { d: 'M4 7h12M4 12h16M4 17h10', stroke: c, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
        // Ползунки
        h('circle', { cx: '16', cy: '7', r: '2.2', stroke: c, 'stroke-width': '1.8', fill: 'none' }),
        h('circle', { cx: '8',  cy: '12', r: '2.2', stroke: c, 'stroke-width': '1.8', fill: 'none' }),
        h('circle', { cx: '15', cy: '17', r: '2.2', stroke: c, 'stroke-width': '1.8', fill: 'none' }),
      ]),

      // Чаты (speech bubbles)
      chats: h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('path', { d: 'M4 12a6 6 0 1 1 11.7 2.4L18 18l-3.6-1.3A6 6 0 0 1 4 12Z', stroke: c, 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
        h('path', { d: 'M14.5 5.5A5.5 5.5 0 1 1 21 11l1.5 3-3-1A5.5 5.5 0 0 1 14.5 5.5Z', stroke: c, 'stroke-width': '1.2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.7' }),
      ]),

      // Задачи (checklist)
      tasks: h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('rect', { x: '4', y: '3.5', width: '16', height: '17', rx: '2.5', stroke: c, 'stroke-width': '1.8' }),
        h('path', { d: 'M8 8h8M8 12h8M8 16h5', stroke: c, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
      ]),

      // Отклики (inbox)
      responses: h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('path', { d: 'M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5Z', stroke: c, 'stroke-width': '1.8' }),
        h('path', { d: 'M4 14h4l2 2h4l2-2h4', stroke: c, 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      ]),

      // Создать (plus in circle)
      'create-task': h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('circle', { cx: '12', cy: '12', r: '8.5', stroke: c, 'stroke-width': '1.8' }),
        h('path', { d: 'M12 8v8M8 12h8', stroke: c, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
      ]),

      // Профиль (user)
      profile: h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('circle', { cx: '12', cy: '8', r: '3.2', stroke: c, 'stroke-width': '1.8' }),
        h('path', { d: 'M5 19a7 7 0 0 1 14 0', stroke: c, 'stroke-width': '1.8', 'stroke-linecap': 'round' }),
      ]),

      // Кнопка меню (бургер)
      menu: h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('path', { d: 'M4 7h16M4 12h16M4 17h16', stroke: c, 'stroke-width': '2', 'stroke-linecap': 'round' }),
      ]),

      // Кнопка закрытия (крест)
      close: h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' }, [
        h('path', { d: 'M6 6l12 12M18 6l-12 12', stroke: c, 'stroke-width': '2', 'stroke-linecap': 'round' }),
      ]),
    }

    return () => icons[props.name] ?? h('svg', { width: s, height: s })
  },
})
</script>

<style scoped>
:root {
  --active: #10221C;
}

/* Плавное появление пилюли меню */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 160ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
