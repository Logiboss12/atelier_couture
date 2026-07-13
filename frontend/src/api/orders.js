import { apiList } from './client.js'

function normalize(o) {
  return {
    id: o.id,
    ref: o.ref,
    client: o.client?.nom ?? '',
    modele: o.modele,
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
