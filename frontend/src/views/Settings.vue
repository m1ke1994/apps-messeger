<template>
  <section class="min-h-full px-4 py-6 sm:px-6">
    <div class="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Настройки</h1>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Управляйте оформлением интерфейса и быстрыми ссылками.
        </p>
      </header>

      <section
        class="rounded-2xl bg-card-light/95 p-6 shadow-soft ring-1 ring-border-light/60 transition dark:bg-card-dark/90 dark:ring-border-dark/60"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="max-w-sm space-y-1">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Тема приложения</h2>
            <p class="text-sm text-slate-600 dark:text-slate-300">
              Переключайте светлую или тёмную тему. Выбор сохраняется между сессиями.
            </p>
          </div>

          <div
            class="inline-flex rounded-xl border border-border-light/80 bg-white/80 p-1 shadow-sm transition dark:border-white/10 dark:bg-white/5"
            role="radiogroup"
            aria-label="Режим темы"
          >
            <button
              v-for="option in themeOptions"
              :key="option.value"
              type="button"
              class="flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              :class="[
                currentTheme === option.value
                  ? 'bg-[#047857] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/10',
              ]"
              :aria-pressed="currentTheme === option.value"
              @click="handleSelect(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </section>

      <section
        class="rounded-2xl bg-card-light/95 p-6 shadow-soft ring-1 ring-border-light/60 transition dark:bg-card-dark/90 dark:ring-border-dark/60"
      >
        <div class="space-y-1">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Быстрые ссылки</h2>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Подборка разделов, которые пригодятся чаще всего.
          </p>
        </div>

        <ul class="mt-5 space-y-2">
          <li v-for="item in quickLinks" :key="item.label">
            <RouterLink
              v-if="item.to"
              :to="item.to"
              class="group flex items-center justify-between rounded-xl border border-border-light/80 bg-white/80 px-4 py-3 text-left transition hover:border-primary/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div>
                <p class="text-base font-semibold text-slate-800 transition group-hover:text-primary dark:text-slate-100">
                  {{ item.label }}
                </p>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {{ item.description }}
                </p>
              </div>
              <svg
                class="h-4 w-4 text-slate-400 transition group-hover:text-primary dark:text-slate-500 dark:group-hover:text-primary/80"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 5l5 5-5 5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </RouterLink>

            <a
              v-else
              :href="item.href"
              class="group flex items-center justify-between rounded-xl border border-dashed border-slate-300/70 bg-white/60 px-4 py-3 text-left transition hover:border-slate-400 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
              aria-disabled="true"
              @click.prevent
            >
              <div>
                <p class="flex items-center gap-2 text-base font-semibold text-slate-500 dark:text-slate-300">
                  {{ item.label }}
                  <span
                    class="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 transition group-hover:bg-slate-300 dark:bg-white/10 dark:text-slate-300 dark:group-hover:bg-white/20"
                  >
                    скоро
                  </span>
                </p>
                <p class="mt-0.5 text-xs text-slate-500/80 dark:text-slate-400">
                  {{ item.description }}
                </p>
              </div>
              <svg class="h-4 w-4 text-slate-400/70 dark:text-slate-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M7 5l5 5-5 5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeMode } from '../stores/themeStore'
import { useThemeStore } from '../stores/themeStore'

const themeStore = useThemeStore()
themeStore.init()

const themeOptions: Array<{ value: ThemeMode; label: string }> = [
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
]

const currentTheme = computed(() => themeStore.mode)

function handleSelect(mode: ThemeMode) {
  themeStore.setTheme(mode)
}

interface QuickLink {
  label: string
  description: string
  to?: { name: string }
  href?: string
}

const quickLinks: QuickLink[] = [
  {
    label: 'Мои задачи',
    description: 'Перейти к вашему списку задач и фильтрам.',
    to: { name: 'tasks' },
  },
  {
    label: 'Правила использования',
    description: 'Документ с основными требованиями сервиса.',
    href: '#',
  },
  {
    label: 'Политика и конфиденциальность',
    description: 'Узнайте, как мы работаем с вашими данными.',
    href: '#',
  },
]

</script>
