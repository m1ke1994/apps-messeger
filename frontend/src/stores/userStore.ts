import { defineStore } from 'pinia'

interface UserProfile {
  id: string
  name: string
  phone?: string
  email?: string
}

type StoreStatus = 'idle' | 'loading' | 'ready'

const ACCESS_KEY = 'access'
const REFRESH_KEY = 'refresh'
const PROFILE_KEY = 'profile'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    status: 'idle' as StoreStatus,
  }),
  actions: {
    setLoading() {
      this.status = 'loading'
    },
    clearProfile() {
      this.profile = null
      this.status = 'idle'
      localStorage.removeItem(ACCESS_KEY)
      localStorage.removeItem(REFRESH_KEY)
      localStorage.removeItem(PROFILE_KEY)
    },
    setSession(access: string, refresh: string | undefined, profile: UserProfile) {
      localStorage.setItem(ACCESS_KEY, access)
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
      this.profile = profile
      this.status = 'ready'
    },
    setProfile(profile: UserProfile) {
      this.profile = profile
      this.status = 'ready'
    },
    hydrateFromStorage(): boolean {
      if (this.profile) return true
      const access = localStorage.getItem(ACCESS_KEY)
      const storedProfile = localStorage.getItem(PROFILE_KEY)
      if (!access || !storedProfile) return false
      try {
        const parsed = JSON.parse(storedProfile) as UserProfile
        this.profile = parsed
        this.status = 'ready'
        return true
      } catch {
        this.clearProfile()
        return false
      }
    },
    async bootstrapDemoProfile(partial?: Partial<UserProfile>) {
      this.status = 'loading'
      this.profile = {
        id: partial?.id ?? 'demo',
        name: partial?.name ?? 'Demo User',
        phone: partial?.phone,
        email: partial?.email,
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500)
      })

      this.status = 'ready'
    },
    async fetchProfile() {
      if (this.status === 'loading') {
        return
      }

      this.status = 'loading'

      try {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 600)
        })

        const generatedId =
          typeof globalThis !== 'undefined' &&
          'crypto' in globalThis &&
          typeof globalThis.crypto?.randomUUID === 'function'
            ? globalThis.crypto.randomUUID()
            : String(Date.now())

        this.profile = {
          id: generatedId,
          name: 'New user',
        }
        this.status = 'ready'
      } catch (error) {
        this.status = 'idle'
        throw error
      }
    },
  },
})
