export const financeKpis = [
  { label: 'Solde de caisse', valeur: '18 400 000 F', delta: '+6,2%', color: 'var(--iro-green)' },
  { label: 'Entrées (mois)', valeur: '9 850 000 F', delta: '+3,8%', color: 'var(--iro-blue)' },
  { label: 'Sorties (mois)', valeur: '4 120 000 F', delta: '-1,4%', color: 'var(--iro-orange)' },
  { label: 'Bénéfice net', valeur: '5 730 000 F', delta: '+8,1%', color: 'var(--iro-violet)' },
]

export const paymentMethods = [
  { id: 'mm', label: 'Mobile Money', montant: '5 200 000 F', pct: 53, color: 'var(--iro-orange)' },
  { id: 'esp', label: 'Espèces', montant: '2 100 000 F', pct: 21, color: 'var(--iro-green)' },
  { id: 'carte', label: 'Carte bancaire', montant: '1 650 000 F', pct: 17, color: 'var(--iro-blue)' },
  { id: 'vir', label: 'Virement', montant: '900 000 F', pct: 9, color: 'var(--iro-violet)' },
]

export const expenseCategories = [
  { id: 'ex1', label: 'Matières premières', pct: 44, color: 'var(--iro-orange)' },
  { id: 'ex2', label: 'Salaires', pct: 30, color: 'var(--iro-violet)' },
  { id: 'ex3', label: 'Logistique', pct: 14, color: 'var(--iro-blue)' },
  { id: 'ex4', label: 'Marketing', pct: 12, color: 'var(--iro-magenta)' },
]

export const cashMovements = [
  { id: 'cm1', type: 'in', label: 'Commande IRO-2045 — solde final', date: '2026-07-13', moyen: 'Mobile Money', montant: 365000 },
  { id: 'cm2', type: 'out', label: 'Achat tissu — Sotiba', date: '2026-07-12', moyen: 'Virement', montant: 640000 },
  { id: 'cm3', type: 'in', label: 'Commande IRO-2049 — acompte', date: '2026-07-12', moyen: 'Espèces', montant: 90000 },
  { id: 'cm4', type: 'out', label: 'Salaires équipe atelier', date: '2026-07-10', moyen: 'Virement', montant: 1800000 },
  { id: 'cm5', type: 'in', label: 'Boutique en ligne — 4 ventes', date: '2026-07-09', moyen: 'Carte bancaire', montant: 214000 },
]

export const revenueByMonth = [
  { mois: 'Fév', ca: 5200000 },
  { mois: 'Mar', ca: 6100000 },
  { mois: 'Avr', ca: 5800000 },
  { mois: 'Mai', ca: 7400000 },
  { mois: 'Jun', ca: 8900000 },
  { mois: 'Jul', ca: 9850000 },
]
