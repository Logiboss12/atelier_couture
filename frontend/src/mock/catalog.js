export const collections = [
  { id: 'col1', nom: 'Racines', articles: 12, tile: 'tile-wax' },
  { id: 'col2', nom: 'Horizon Paris', articles: 9, tile: 'tile-jacquard' },
  { id: 'col3', nom: 'Cérémonie', articles: 14, tile: 'tile-kente' },
  { id: 'col4', nom: 'Mariées', articles: 6, tile: 'tile-dentelle' },
]

export const products = [
  { id: 'p1', nom: 'Grand boubou brodé', collection: 'Racines', tissu: 'wax', variantes: 4, stock: 12, prix: 145000, statut: 'ok', publie: true, tailles: ['S', 'M', 'L', 'XL'], couleurs: ['#ff8a3d', '#d1451b', '#160a12'] },
  { id: 'p2', nom: 'Robe de soirée jacquard', collection: 'Horizon Paris', tissu: 'jacquard', variantes: 3, stock: 5, prix: 380000, statut: 'warn', publie: true, tailles: ['S', 'M', 'L'], couleurs: ['#7b5cff', '#4a34b8'] },
  { id: 'p3', nom: 'Tailleur trois pièces', collection: 'Horizon Paris', tissu: 'bazin', variantes: 5, stock: 8, prix: 265000, statut: 'ok', publie: true, tailles: ['M', 'L', 'XL', 'XXL'], couleurs: ['#c9a227', '#160a12'] },
  { id: 'p4', nom: 'Robe de mariée dentelle', collection: 'Mariées', tissu: 'dentelle', variantes: 2, stock: 2, prix: 650000, statut: 'danger', publie: true, tailles: ['S', 'M'], couleurs: ['#f4f0ea'] },
  { id: 'p5', nom: 'Ensemble kente cérémonie', collection: 'Cérémonie', tissu: 'kente', variantes: 4, stock: 10, prix: 210000, statut: 'ok', publie: true, tailles: ['S', 'M', 'L', 'XL'], couleurs: ['#f2c94c', '#0a7d3c', '#c8102e'] },
  { id: 'p6', nom: 'Boubou prêt-à-porter', collection: 'Racines', tissu: 'hibiscus', variantes: 3, stock: 0, prix: 98000, statut: 'danger', publie: false, tailles: ['S', 'M', 'L'], couleurs: ['#ff5da2', '#8a1e5a'] },
  { id: 'p7', nom: 'Costume indigo', collection: 'Horizon Paris', tissu: 'indigo', variantes: 3, stock: 6, prix: 365000, statut: 'warn', publie: true, tailles: ['M', 'L', 'XL'], couleurs: ['#2233a8', '#38208f'] },
  { id: 'p8', nom: 'Veste bazin brodée', collection: 'Cérémonie', tissu: 'bazin', variantes: 4, stock: 15, prix: 155000, statut: 'ok', publie: false, tailles: ['S', 'M', 'L', 'XL'], couleurs: ['#c9a227'] },
]
