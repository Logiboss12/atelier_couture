export const stockKpis = [
  { label: 'Références actives', valeur: '86', icon: 'bi-tag' },
  { label: 'Tissus en stock', valeur: '1 240 m', icon: 'bi-layers' },
  { label: 'Alertes de rupture', valeur: '5', icon: 'bi-exclamation-triangle' },
  { label: 'Valeur du stock', valeur: '18 400 000 F', icon: 'bi-cash-stack' },
]

export const reorderAlerts = [
  { id: 'r1', nom: 'Dentelle de Calais', tile: 'tile-dentelle', reste: '4 m restants', statut: 'danger' },
  { id: 'r2', nom: 'Soie Duchesse', tile: 'tile-soie', reste: '7 m restants', statut: 'warn' },
  { id: 'r3', nom: 'Boubou prêt-à-porter (M)', tile: 'tile-hibiscus', reste: 'Épuisé', statut: 'danger' },
]

export const fabricStock = [
  { id: 'f1', nom: 'Wax Hollandais', tile: 'tile-wax', quantite: '320 m', niveau: 78, statut: 'OK', badge: 'ok' },
  { id: 'f2', nom: 'Kente tissé', tile: 'tile-kente', quantite: '95 m', niveau: 42, statut: 'Bas', badge: 'warn' },
  { id: 'f3', nom: 'Bogolan Indigo', tile: 'tile-indigo', quantite: '180 m', niveau: 65, statut: 'OK', badge: 'ok' },
  { id: 'f4', nom: 'Dentelle de Calais', tile: 'tile-dentelle', quantite: '4 m', niveau: 8, statut: 'Rupture proche', badge: 'danger' },
  { id: 'f5', nom: 'Soie Duchesse', tile: 'tile-soie', quantite: '7 m', niveau: 15, statut: 'Rupture proche', badge: 'danger' },
]

export const finishedStock = [
  { id: 'a1', nom: 'Grand boubou brodé', tile: 'tile-wax', quantite: '12 unités', niveau: 60, statut: 'OK', badge: 'ok' },
  { id: 'a2', nom: 'Robe de soirée jacquard', tile: 'tile-jacquard', quantite: '5 unités', niveau: 30, statut: 'Bas', badge: 'warn' },
  { id: 'a3', nom: 'Robe de mariée dentelle', tile: 'tile-dentelle', quantite: '2 unités', niveau: 12, statut: 'Rupture proche', badge: 'danger' },
  { id: 'a4', nom: 'Boubou prêt-à-porter', tile: 'tile-hibiscus', quantite: '0 unité', niveau: 0, statut: 'Épuisé', badge: 'danger' },
  { id: 'a5', nom: 'Veste bazin brodée', tile: 'tile-bazin', quantite: '15 unités', niveau: 82, statut: 'OK', badge: 'ok' },
]

export const stockMovements = [
  { id: 'm1', type: 'in', label: 'Wax Hollandais — réception fournisseur', date: '2026-07-12', quantite: '+50 m' },
  { id: 'm2', type: 'out', label: 'Robe de mariée dentelle — commande IRO-2044', date: '2026-07-12', quantite: '-1 unité' },
  { id: 'm3', type: 'out', label: 'Soie Duchesse — commande IRO-2048', date: '2026-07-11', quantite: '-3 m' },
  { id: 'm4', type: 'in', label: 'Bazin Riche — réception fournisseur', date: '2026-07-10', quantite: '+80 m' },
  { id: 'm5', type: 'out', label: 'Grand boubou brodé — commande IRO-2041', date: '2026-07-09', quantite: '-1 unité' },
]

export const recentEntries = [
  { id: 'e1', label: 'Wax Hollandais', meta: 'Fournisseur Sotiba · 2026-07-12', quantite: '+50 m' },
  { id: 'e2', label: 'Bazin Riche', meta: 'Fournisseur Thiès Textile · 2026-07-10', quantite: '+80 m' },
  { id: 'e3', label: 'Kente tissé', meta: 'Fournisseur Accra Looms · 2026-07-06', quantite: '+30 m' },
]
