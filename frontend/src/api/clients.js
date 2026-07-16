import { apiList, apiCreate } from './client.js'

export function createClient(data) {
  return apiCreate('clients', data)
}

export async function getClients() {
  const rows = await apiList('clients')
  return rows.map((c) => ({
    id: c.id,
    nom: c.nom,
    ville: c.ville,
    pays: c.pays,
    tel: c.tel,
    email: c.email,
    commandes: c.orders_count ?? 0,
    depuis: c.client_depuis,
    measurements: (c.measurements || []).map((m) => ({
      id: m.id,
      typeVetement: m.type_vetement,
      label: m.label,
      valeurs: m.valeurs || {},
      priseLe: (m.prise_le || '').slice(0, 10),
      notes: m.notes,
    })),
  }))
}
