const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://127.0.0.1:8000'

type RequestOptions = RequestInit & { auth?: boolean }

async function parseBody(res: Response) {
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      return await res.json()
    } catch {
      return null
    }
  }
  try {
    return await res.text()
  } catch {
    return null
  }
}

function getErrorMessage(data: any, fallback: string) {
  if (!data) return fallback
  if (typeof data === 'string') return data
  if (typeof data?.detail === 'string') return data.detail
  if (Array.isArray(data?.detail) && typeof data.detail[0] === 'string') return data.detail[0]
  if (typeof data?.message === 'string') return data.message
  return fallback
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, ...rest } = options
  const headers = new Headers(rest.headers || {})
  if (auth) {
    const access = localStorage.getItem('access')
    if (access) {
      headers.set('Authorization', `Bearer ${access}`)
    }
  }

  const res = await fetch(`${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`, {
    ...rest,
    headers,
  })

  const data = await parseBody(res)
  if (!res.ok) {
    const detail = getErrorMessage(data, res.statusText || 'Request failed')
    throw new Error(detail)
  }

  return data as T
}

export { API_BASE }
