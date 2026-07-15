const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
const TOKEN_KEY = 'iro_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function request(path, options = {}) {
  const token = getToken()
  const isFormData = options.body instanceof FormData

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.message || (body?.errors && Object.values(body.errors)[0]?.[0])
    throw new Error(message || `Requête API échouée (${res.status}) : ${path}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export function apiList(resource, params) {
  const query = params ? `?${new URLSearchParams(params)}` : ''
  return request(`/${resource}${query}`)
}

export function apiGet(resource, id) {
  return request(`/${resource}/${id}`)
}

export function apiCreate(resource, data) {
  return request(`/${resource}`, { method: 'POST', body: JSON.stringify(data) })
}

export function apiUpdate(resource, id, data) {
  return request(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function apiRemove(resource, id) {
  return request(`/${resource}/${id}`, { method: 'DELETE' })
}

export function apiUpload(path, formData) {
  return request(path, { method: 'POST', body: formData })
}
