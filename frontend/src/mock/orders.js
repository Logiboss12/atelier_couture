export const orderStatuses = [
  { id: 'recue', label: 'Reçue', color: 'var(--iro-blue)' },
  { id: 'encours', label: 'En cours', color: 'var(--iro-orange)' },
  { id: 'finition', label: 'Finition', color: 'var(--iro-violet)' },
  { id: 'prete', label: 'Prête', color: 'var(--iro-gold)' },
  { id: 'livree', label: 'Livrée', color: 'var(--iro-green)' },
]

export const orders = [
  { id: 'o1', ref: 'IRO-2041', client: 'Aïssatou Diop', modele: 'Grand boubou brodé', tissu: 'wax', statut: 'encours', echeance: '2026-07-15', assigne: 'Khady Sarr' },
  { id: 'o2', ref: 'IRO-2042', client: 'Camille Dubois', modele: 'Robe de soirée jacquard', tissu: 'jacquard', statut: 'finition', echeance: '2026-07-14', assigne: 'Omar Diallo' },
  { id: 'o3', ref: 'IRO-2043', client: 'Moussa Fall', modele: 'Tailleur trois pièces', tissu: 'bazin', statut: 'recue', echeance: '2026-07-22', assigne: 'Khady Sarr' },
  { id: 'o4', ref: 'IRO-2044', client: 'Fatou Ndiaye', modele: 'Robe de mariée dentelle', tissu: 'dentelle', statut: 'finition', echeance: '2026-07-18', assigne: 'Marième Cissé' },
  { id: 'o5', ref: 'IRO-2045', client: 'Julien Moreau', modele: 'Costume indigo', tissu: 'indigo', statut: 'prete', echeance: '2026-07-13', assigne: 'Omar Diallo' },
  { id: 'o6', ref: 'IRO-2046', client: 'Mariama Sow', modele: 'Ensemble kente cérémonie', tissu: 'kente', statut: 'livree', echeance: '2026-07-10', assigne: 'Khady Sarr' },
  { id: 'o7', ref: 'IRO-2047', client: 'Ibrahima Ba', modele: 'Boubou prêt-à-porter', tissu: 'hibiscus', statut: 'recue', echeance: '2026-07-25', assigne: 'Marième Cissé' },
  { id: 'o8', ref: 'IRO-2048', client: 'Léa Girard', modele: 'Robe soie duchesse', tissu: 'soie', statut: 'encours', echeance: '2026-07-16', assigne: 'Omar Diallo' },
  { id: 'o9', ref: 'IRO-2049', client: 'Aïssatou Diop', modele: 'Ensemble enfant wax', tissu: 'wax', statut: 'prete', echeance: '2026-07-13', assigne: 'Khady Sarr' },
  { id: 'o10', ref: 'IRO-2050', client: 'Camille Dubois', modele: 'Veste bazin brodée', tissu: 'bazin', statut: 'encours', echeance: '2026-07-19', assigne: 'Marième Cissé' },
  { id: 'o11', ref: 'IRO-2051', client: 'Moussa Fall', modele: 'Chemise jacquard', tissu: 'jacquard', statut: 'livree', echeance: '2026-07-08', assigne: 'Omar Diallo' },
  { id: 'o12', ref: 'IRO-2052', client: 'Fatou Ndiaye', modele: 'Grand boubou kente', tissu: 'kente', statut: 'recue', echeance: '2026-07-28', assigne: 'Khady Sarr' },
]

export const recentOrders = orders.slice(0, 5)
