import { defineStore } from 'pinia'
import { fetchMyProfile, type UserProfile } from '@/api/profile'

type StoreStatus = 'idle' | 'loading' | 'ready'
const DEFAULT_AVATAR = 'https://i.pravatar.cc/300?img=47'

const ACCESS_KEY = 'access'
const REFRESH_KEY = 'refresh'
const PROFILE_KEY = 'profile'

type StoredProfile = UserProfile & { name: string; skills: string[] }

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as StoredProfile | null,
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
    setTokens(access: string, refresh?: string) {
      localStorage.setItem(ACCESS_KEY, access)
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
    },
    setProfile(profile: UserProfile) {
      const normalizeSkills = Array.isArray(profile.skills) ? profile.skills.filter(Boolean) : []
      const normalized: StoredProfile = {
        ...profile,
        name: profile.displayName || profile.username || profile.phone || 'User',
        avatarUrl: profile.avatarUrl || DEFAULT_AVATAR,
        skills: normalizeSkills,
      }
      this.profile = normalized
      this.status = 'ready'
      localStorage.setItem(PROFILE_KEY, JSON.stringify(normalized))
    },
    isProfileComplete(profile: StoredProfile | null = this.profile) {
      if (!profile) return false
      const hasText = (value?: string | null) => Boolean(value && value.trim())
      const hasSkills = Array.isArray(profile.skills) && profile.skills.length > 0
      return (
        hasText(profile.displayName) &&
        hasText(profile.email) &&
        hasText(profile.about) &&
        hasText(profile.education) &&
        hasText(profile.status) &&
        hasSkills
      )
    },
    hydrateFromStorage(): boolean {
      if (this.profile) return true
      const access = localStorage.getItem(ACCESS_KEY)
      const storedProfile = localStorage.getItem(PROFILE_KEY)
      if (!access || !storedProfile) return false
      try {
        const parsed = JSON.parse(storedProfile) as UserProfile
        this.setProfile(parsed)
        return true
      } catch {
        this.clearProfile()
        return false
      }
    },
    async ensureProfile(): Promise<boolean> {
      if (this.profile) return true
      const access = localStorage.getItem(ACCESS_KEY)
      if (!access) return false

      // Try cached profile first
      if (this.hydrateFromStorage()) return true

      try {
        this.status = 'loading'
        const remote = await fetchMyProfile()
        this.setProfile(remote)
        return true
      } catch (error) {
        this.clearProfile()
        throw error
      }
    },
    needsCompletion(): boolean {
      return !this.isProfileComplete()
    },
    async loadProfile(): Promise<void> {
      const access = localStorage.getItem(ACCESS_KEY)
      if (!access) {
        this.clearProfile()
        return
      }
      this.status = 'loading'
      try {
        const remote = await fetchMyProfile()
        this.setProfile(remote)
      } catch (error) {
        this.status = 'idle'
        throw error
      }
    },
  },
})
