import { request, apiUpload, apiDownload } from './client.js'

export function getMe() {
  return request('/me')
}

export function createSurMesureOrder(data) {
  return request('/me/orders', { method: 'POST', body: JSON.stringify(data) })
}

export function createMyMeasurement(data) {
  return request('/me/measurements', { method: 'POST', body: JSON.stringify(data) })
}

export function uploadMyOrderPhoto(orderId, file) {
  const formData = new FormData()
  formData.append('photo', file)
  return apiUpload(`/me/orders/${orderId}/photos`, formData)
}

export function checkout(payload) {
  return request('/me/checkout', { method: 'POST', body: JSON.stringify(payload) })
}

export function getMyInvoice(id) {
  return request(`/me/invoices/${id}`)
}

export function downloadMyInvoicePdf(id, filename) {
  return apiDownload(`/me/invoices/${id}/pdf`, filename)
}

export function convertQuote(id, payload) {
  return request(`/me/quotes/${id}/convert`, { method: 'POST', body: JSON.stringify(payload) })
}

export function markNotificationRead(id) {
  return request(`/me/notifications/${id}/read`, { method: 'POST' })
}
