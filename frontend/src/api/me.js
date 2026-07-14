import { request } from './client.js'

export function getMe() {
  return request('/me')
}

export function createSurMesureOrder(data) {
  return request('/me/orders', { method: 'POST', body: JSON.stringify(data) })
}

export function checkout(payload) {
  return request('/me/checkout', { method: 'POST', body: JSON.stringify(payload) })
}

export function getMyInvoice(id) {
  return request(`/me/invoices/${id}`)
}

export function convertQuote(id, payload) {
  return request(`/me/quotes/${id}/convert`, { method: 'POST', body: JSON.stringify(payload) })
}
