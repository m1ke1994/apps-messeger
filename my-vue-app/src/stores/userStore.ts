import { defineStore } from 'pinia'

interface UserProfile {
  id: string
  name: string
  phone?: string
  email?: string
}

type StoreStatus = 'idle' | 'loading' | 'ready'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    status: 'idle' as StoreStatus,
  }),
  actions: {
    setProfile(profile: UserProfile) {
      this.profile = profile
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
