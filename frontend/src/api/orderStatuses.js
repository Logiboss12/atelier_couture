import { apiList, request } from './client.js'

function normalize(s) {
  return { id: s.slug, dbId: s.id, label: s.label, color: s.color, isFinal: !!s.is_final }
}

export async function getWorkflowSteps() {
  const rows = await apiList('order-statuses')
  return rows.map(normalize)
}

export async function createWorkflowStep(data) {
  const s = await request('/order-statuses', {
    method: 'POST',
    body: JSON.stringify({ slug: data.slug, label: data.label, color: data.color, is_final: data.isFinal ?? false }),
  })
  return normalize(s)
}

export async function updateWorkflowStep(dbId, data) {
  const s = await request(`/order-statuses/${dbId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return normalize(s)
}

export function deleteWorkflowStep(dbId) {
  return request(`/order-statuses/${dbId}`, { method: 'DELETE' })
}

export async function reorderWorkflowSteps(dbIds) {
  const rows = await request('/order-statuses/reorder', { method: 'PUT', body: JSON.stringify({ ids: dbIds }) })
  return rows.map(normalize)
}
