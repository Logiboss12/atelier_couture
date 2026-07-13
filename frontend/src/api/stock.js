import { apiList } from './client.js'
import { getProducts } from './catalog.js'

const STATUT_LABEL = { ok: 'OK', warn: 'Bas', danger: 'Rupture proche' }

function pluralUnite(n, unite) {
  return `${n} ${unite}${n > 1 ? 's' : ''}`
}

export async function getFabricStocks() {
  const rows = await apiList('fabric-stocks')
  return rows.map((f) => ({
    id: f.id,
    nom: f.textile?.nom ?? '',
    tile: f.textile?.tile ?? 'tile-wax',
    quantite: `${f.quantite_metres} m`,
    niveau: f.niveau,
    statut: STATUT_LABEL[f.statut] ?? f.statut,
    badge: f.statut,
  }))
}

export async function getFinishedStock() {
  const products = await getProducts()
  return products.map((p) => ({
    id: p.id,
    nom: p.nom,
    tile: `tile-${p.tissu}`,
    quantite: pluralUnite(p.stock, 'unité'),
    niveau: p.stockNiveau,
    statut: STATUT_LABEL[p.statut] ?? p.statut,
    badge: p.statut,
  }))
}

export async function getReorderAlerts() {
  const [fabricStocks, finishedStock] = await Promise.all([getFabricStocks(), getFinishedStock()])
  const low = [...fabricStocks, ...finishedStock].filter((i) => i.badge !== 'ok')
  return low.map((i) => ({
    id: `${i.tile}-${i.id}`,
    nom: i.nom,
    tile: i.tile,
    reste: i.quantite.startsWith('0') ? 'Épuisé' : `${i.quantite} restants`,
    statut: i.badge,
  }))
}

export async function getStockKpis() {
  const [fabricStocks, products] = await Promise.all([getFabricStocks(), getProducts()])

  const totalMetres = fabricStocks.reduce((sum, f) => sum + parseInt(f.quantite, 10), 0)
  const alertesRupture = [...fabricStocks, ...products].filter((i) => (i.badge ?? i.statut) === 'danger').length
  const valeurStock = products.reduce((sum, p) => sum + p.stock * p.prix, 0)

  return [
    { label: 'Références actives', valeur: String(products.length), icon: 'bi-tag' },
    { label: 'Tissus en stock', valeur: `${totalMetres.toLocaleString('fr-FR')} m`, icon: 'bi-layers' },
    { label: 'Alertes de rupture', valeur: String(alertesRupture), icon: 'bi-exclamation-triangle' },
    { label: 'Valeur du stock', valeur: `${valeurStock.toLocaleString('fr-FR')} F`, icon: 'bi-cash-stack' },
  ]
}

export async function getStockMovements() {
  const rows = await apiList('stock-movements')
  return rows
    .filter((m) => !m.fournisseur)
    .map((m) => ({
      id: m.id,
      type: m.type,
      label: m.label,
      date: (m.date || '').slice(0, 10),
      quantite: `${m.type === 'in' ? '+' : '-'}${Number(m.quantite_valeur)} ${m.quantite_unite}`,
    }))
}

export async function getRecentEntries() {
  const rows = await apiList('stock-movements', { type: 'in' })
  return rows
    .filter((m) => m.fournisseur)
    .map((m) => ({
      id: m.id,
      label: m.label,
      meta: `Fournisseur ${m.fournisseur} · ${(m.date || '').slice(0, 10)}`,
      quantite: `+${Number(m.quantite_valeur)} ${m.quantite_unite}`,
    }))
}
