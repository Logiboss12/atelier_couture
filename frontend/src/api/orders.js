import { apiList, apiUpdate, apiUpload, request } from './client.js'

function normalize(o) {
  return {
    id: o.id,
    ref: o.ref,
    clientId: o.client_id,
    client: o.client?.nom ?? '',
    clientTel: o.client?.tel ?? null,
    modele: o.modele,
    instructions: o.instructions ?? '',
    photos: o.photo_urls ?? [],
    measurement: o.measurement
      ? { id: o.measurement.id, typeVetement: o.measurement.type_vetement, priseLe: (o.measurement.prise_le || '').slice(0, 10), valeurs: o.measurement.valeurs || {} }
      : null,
    tissu: o.textile?.slug ?? 'wax',
    statut: o.statut,
    echeance: (o.echeance || '').slice(0, 10),
    assigne: o.assignee?.nom ?? '',
  }
}

export async function getOrders() {
  const rows = await apiList('orders')
  return rows.map(normalize)
}

export async function getRecentOrders(limit = 5) {
  const orders = await getOrders()
  return [...orders].sort((a, b) => b.id - a.id).slice(0, limit)
}

export function updateOrderStatus(id, statut) {
  return apiUpdate('orders', id, { statut })
}

export function updateOrderInstructions(id, instructions) {
  return apiUpdate('orders', id, { instructions })
}

export function uploadOrderPhoto(id, file) {
  const formData = new FormData()
  formData.append('photo', file)
  return apiUpload(`/orders/${id}/photos`, formData)
}

export function removeOrderPhoto(id, path) {
  return request(`/orders/${id}/photos`, { method: 'DELETE', body: JSON.stringify({ path }) })
}
