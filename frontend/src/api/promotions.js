import { apiList } from './client.js'

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

function formatPeriode(debut, fin) {
  const d1 = new Date(debut)
  const d2 = new Date(fin)
  return `${String(d1.getDate()).padStart(2, '0')}–${String(d2.getDate()).padStart(2, '0')} ${MOIS[d2.getMonth()]} ${d2.getFullYear()}`
}

function formatMontant(value) {
  return value ? `${value.toLocaleString('fr-FR')} F` : '—'
}

export async function getPromotions() {
  const rows = await apiList('promotions')
  return rows.map((p) => ({
    id: p.id,
    nom: p.nom,
    periode: formatPeriode(p.debut, p.fin),
    cible: p.cible,
    reduction: p.reduction,
    statut: p.statut,
    statutLabel: p.statut_label,
    ca: formatMontant(p.ca),
  }))
}

export async function getEvents() {
  const rows = await apiList('events')
  return rows.map((e) => ({
    id: e.id,
    nom: e.nom,
    date: (e.date || '').slice(0, 10),
    lieu: e.lieu,
    statut: e.statut,
    statutLabel: e.statut_label,
    remplissage: e.remplissage,
    capacite: e.capacite,
  }))
}
