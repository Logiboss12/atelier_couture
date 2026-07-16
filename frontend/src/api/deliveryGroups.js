import { apiList, apiCreate, apiUpdate, apiRemove, request } from './client.js'

function normalize(g) {
  return {
    id: g.id,
    label: g.label,
    zone: g.zone,
    date: (g.date || '').slice(0, 10),
    heureDepart: g.heure_depart?.slice(0, 5) ?? null,
    statut: g.statut,
    deliveries: (g.deliveries || []).map((d) => ({
      id: d.id,
      client: d.client?.nom ?? d.client_label,
      contenu: d.contenu,
      statut: d.statut,
    })),
  }
}

export async function getDeliveryGroups() {
  const rows = await apiList('delivery-groups')
  return rows.map(normalize)
}

export async function createDeliveryGroup(data) {
  return normalize(await apiCreate('delivery-groups', data))
}

export async function updateDeliveryGroup(id, data) {
  return normalize(await apiUpdate('delivery-groups', id, data))
}

export function deleteDeliveryGroup(id) {
  return apiRemove('delivery-groups', id)
}

export async function addDeliveryToGroup(groupId, deliveryId) {
  return normalize(await request(`/delivery-groups/${groupId}/deliveries/${deliveryId}`, { method: 'POST' }))
}

export async function removeDeliveryFromGroup(groupId, deliveryId) {
  return normalize(await request(`/delivery-groups/${groupId}/deliveries/${deliveryId}`, { method: 'DELETE' }))
}
