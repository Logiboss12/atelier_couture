import { apiList, apiCreate, apiUpdate, apiRemove } from './client.js'

function normalize(m) {
  return {
    id: m.id,
    clientId: m.client_id,
    typeVetement: m.type_vetement,
    label: m.label,
    valeurs: m.valeurs || {},
    priseLe: (m.prise_le || '').slice(0, 10),
    notes: m.notes,
  }
}

export async function getMeasurements(clientId) {
  const rows = await apiList('measurements', clientId ? { client_id: clientId } : undefined)
  return rows.map(normalize)
}

export async function createMeasurement(data) {
  return normalize(await apiCreate('measurements', data))
}

export async function updateMeasurement(id, data) {
  return normalize(await apiUpdate('measurements', id, data))
}

export function deleteMeasurement(id) {
  return apiRemove('measurements', id)
}
