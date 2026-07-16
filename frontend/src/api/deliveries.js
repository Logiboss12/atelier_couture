import { apiList } from './client.js'

const TYPE_BADGE = { individuelle: 'info', groupee: 'info' }
const TYPE_LABEL = { individuelle: 'Individuelle', groupee: 'Groupée' }

const STATUT_BADGE = { a_planifier: 'neutral', planifiee: 'info', confirmee: 'ok', en_route: 'warn', livree: 'ok' }
const STATUT_LABEL = { a_planifier: 'À planifier', planifiee: 'Planifiée', confirmee: 'Confirmée', en_route: 'En route', livree: 'Livrée' }

function formatJour(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

export async function getDeliveries() {
  const rows = await apiList('deliveries')
  return rows.map((d) => ({
    id: d.id,
    heure: d.heure?.slice(0, 5) ?? '',
    jour: formatJour(d.date),
    client: d.client?.nom ?? d.client_label,
    zone: d.zone,
    contenu: d.contenu,
    deliveryGroupId: d.delivery_group_id ?? null,
    type: TYPE_BADGE[d.type] ?? 'info',
    typeLabel: TYPE_LABEL[d.type] ?? d.type,
    statut: STATUT_BADGE[d.statut] ?? 'neutral',
    statutLabel: STATUT_LABEL[d.statut] ?? d.statut,
  }))
}

export async function getTodayStatusCounts() {
  const deliveries = await getDeliveries()
  const planifiees = deliveries.filter((d) => d.statut === 'info' || d.statut === 'neutral').length
  const enRoute = deliveries.filter((d) => d.statutLabel === 'En route').length
  const livrees = deliveries.filter((d) => d.statutLabel === 'Livrée').length

  return [
    { label: 'Planifiées', count: planifiees, color: 'var(--iro-blue)' },
    { label: 'En route', count: enRoute, color: 'var(--iro-orange)' },
    { label: 'Livrées', count: livrees, color: 'var(--iro-green)' },
  ]
}
