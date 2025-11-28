import { apiRequest } from './client'

export type VerifyTelegramResponse = {
  token: string
  refresh?: string
  user: { id: number; phone?: string; username?: string }
}

export async function verifyTelegramCode(phone: string, code: string): Promise<VerifyTelegramResponse> {
  return apiRequest<VerifyTelegramResponse>('/api/auth/telegram/verify-code/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
    auth: false,
  })
}
