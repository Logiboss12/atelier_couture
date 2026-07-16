import { apiGet, apiList } from './client.js'

const MOYEN_LABELS = {
  mobile_money: 'Mobile Money',
  especes: 'Espèces',
  carte: 'Carte bancaire',
  virement: 'Virement',
}

const MOYEN_COLORS = {
  mobile_money: 'var(--iro-orange)',
  especes: 'var(--iro-green)',
  carte: 'var(--iro-blue)',
  virement: 'var(--iro-violet)',
}

const CATEGORIE_COLORS = {
  'Matières premières': 'var(--iro-orange)',
  Salaires: 'var(--iro-violet)',
  Logistique: 'var(--iro-blue)',
  Marketing: 'var(--iro-magenta)',
}

function formatF(value) {
  return `${(value ?? 0).toLocaleString('fr-FR')} F`
}

export async function getFinanceSummary() {
  return apiGet('finances', 'summary')
}

export async function getFinanceKpis() {
  const summary = await getFinanceSummary()
  return [
    { label: 'Solde de caisse', valeur: formatF(summary.solde), delta: '', color: 'var(--iro-green)' },
    { label: 'Entrées (mois)', valeur: formatF(summary.entrees_mois), delta: '', color: 'var(--iro-blue)' },
    { label: 'Sorties (mois)', valeur: formatF(summary.sorties_mois), delta: '', color: 'var(--iro-orange)' },
    { label: 'Bénéfice net', valeur: formatF(summary.benefice_net), delta: '', color: 'var(--iro-violet)' },
    { label: 'Impayés', valeur: formatF(summary.impayes), delta: `${summary.impayes_count} facture(s)`, color: 'var(--iro-red)' },
  ]
}

export async function getOrderProfitability() {
  const summary = await getFinanceSummary()
  return {
    margeMoyennePct: summary.marge_moyenne_pct,
    orders: (summary.order_profitability || []).map((o) => ({
      orderId: o.order_id,
      ref: o.ref,
      modele: o.modele,
      montant: o.montant,
      montantMatieres: o.montant_matieres,
      marge: o.marge,
      margePct: o.marge_pct,
      payee: o.payee,
    })),
  }
}

export async function getPaymentMethods() {
  const summary = await getFinanceSummary()
  return summary.payment_methods.map((m) => ({
    id: m.moyen_paiement,
    label: MOYEN_LABELS[m.moyen_paiement] ?? m.moyen_paiement,
    montant: formatF(m.montant),
    pct: m.pct,
    color: MOYEN_COLORS[m.moyen_paiement] ?? 'var(--iro-faint)',
  }))
}

export async function getExpenseCategories() {
  const summary = await getFinanceSummary()
  return summary.expense_categories.map((c) => ({
    id: c.categorie,
    label: c.categorie,
    pct: c.pct,
    color: CATEGORIE_COLORS[c.categorie] ?? 'var(--iro-faint)',
  }))
}

export async function getCashMovements() {
  const rows = await apiList('cash-movements')
  return rows.map((m) => ({
    id: m.id,
    type: m.type,
    label: m.label,
    date: (m.date || '').slice(0, 10),
    moyen: MOYEN_LABELS[m.moyen_paiement] ?? m.moyen_paiement,
    montant: m.montant,
  }))
}
