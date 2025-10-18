import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'app-theme-preference'

function readStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    return raw === 'dark' || raw === 'light' ? raw : null
  } catch {
    return null
  }
}

function detectSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  try {
    const matcher =
      typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null
    return matcher?.matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function applyDocumentTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.style.colorScheme = mode
  root.dataset.theme = mode
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: 'light' as ThemeMode,
    initialized: false,
  }),
  getters: {
    isDark: (state) => state.mode === 'dark',
  },
  actions: {
    init() {
      if (this.initialized) {
        this.applyTheme()
        return
      }
      const stored = readStoredTheme()
      this.mode = stored ?? detectSystemTheme()
      this.initialized = true
      this.persist()
      this.applyTheme()
    },
    setTheme(mode: ThemeMode) {
      if (mode !== 'light' && mode !== 'dark') return
      this.mode = mode
      this.initialized = true
      this.persist()
      this.applyTheme()
    },
    toggleTheme() {
      this.setTheme(this.mode === 'dark' ? 'light' : 'dark')
    },
    applyTheme() {
      applyDocumentTheme(this.mode)
    },
    persist() {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, this.mode)
      } catch {
        // ignore storage errors (quota, privacy mode, etc.)
      }
    },
  },
})
