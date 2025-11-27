const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://127.0.0.1:8000'

export type VerifyTelegramResponse = {
  token: string
  refresh?: string
  user: { id: number; phone?: string; username?: string }
}

export async function verifyTelegramCode(phone: string, code: string): Promise<VerifyTelegramResponse> {
  const res = await fetch(`${API_BASE}/api/auth/telegram/verify-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const detail = data?.detail || 'Не удалось подтвердить код'
    throw new Error(typeof detail === 'string' ? detail : 'Ошибка проверки кода')
  }

  return res.json()
}
