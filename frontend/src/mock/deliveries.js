export const deliveries = [
  { id: 'dl1', heure: '10:00', jour: 'Aujourd\'hui', client: 'Julien Moreau', zone: 'Almadies', contenu: 'IRO-2045 · Costume indigo', type: 'info', typeLabel: 'Individuelle', statut: 'warn', statutLabel: 'En route' },
  { id: 'dl2', heure: '11:30', jour: 'Aujourd\'hui', client: 'Aïssatou Diop', zone: 'Ngor', contenu: 'IRO-2049 · Ensemble enfant wax', type: 'violet', typeLabel: 'Groupée', statut: 'info', statutLabel: 'Planifiée' },
  { id: 'dl3', heure: '15:00', jour: 'Aujourd\'hui', client: 'Zone Plateau (4 clients)', zone: 'Plateau', contenu: 'Tournée groupée', type: 'violet', typeLabel: 'Groupée', statut: 'info', statutLabel: 'Planifiée' },
  { id: 'dl4', heure: '09:00', jour: 'Demain', client: 'Fatou Ndiaye', zone: 'Saint-Louis', contenu: 'IRO-2044 · Robe de mariée', type: 'info', typeLabel: 'Individuelle', statut: 'neutral', statutLabel: 'À planifier' },
  { id: 'dl5', heure: '14:00', jour: 'Demain', client: 'Mariama Sow', zone: 'Thiès', contenu: 'IRO-2046 · Ensemble kente', type: 'info', typeLabel: 'Individuelle', statut: 'ok', statutLabel: 'Confirmée' },
]

export const todayStatusCounts = [
  { label: 'Planifiées', count: 6, color: 'var(--iro-blue)' },
  { label: 'En route', count: 2, color: 'var(--iro-orange)' },
  { label: 'Livrées', count: 4, color: 'var(--iro-green)' },
]
