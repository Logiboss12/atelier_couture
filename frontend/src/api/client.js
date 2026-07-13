const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || `Requête API échouée (${res.status}) : ${path}`)
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
