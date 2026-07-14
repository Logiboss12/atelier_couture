import { request, setToken } from './client.js'

export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  return data.user
}

export async function register(name, email, password, passwordConfirmation) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  })
  setToken(data.token)
  return data.user
}

export async function logout() {
  try {
    await request('/auth/logout', { method: 'POST' })
  } finally {
    setToken(null)
  }
}

export function me() {
  return request('/auth/me')
}
