import { apiRequest } from './client'

export type UserProfile = {
  id: string | number
  displayName: string
  username?: string
  about?: string
  skills?: string[]
  education?: string
  status?: string
  avatarUrl?: string
  telegramUsername?: string
  phone?: string
  email?: string
}

export type UpdateProfilePayload = Partial<
  Pick<UserProfile, 'displayName' | 'username' | 'about' | 'email' | 'skills' | 'education' | 'status'>
>

export function fetchMyProfile() {
  return apiRequest<UserProfile>('/api/profile/me/')
}

export function updateMyProfile(payload: UpdateProfilePayload) {
  return apiRequest<UserProfile>('/api/profile/me/', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<UserProfile>('/api/profile/avatar/', {
    method: 'POST',
    body: formData,
  })
}
