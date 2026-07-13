export const textiles = [
  { id: 'wax', nom: 'Wax Hollandais', origine: 'Dakar', tile: 'tile-wax' },
  { id: 'kente', nom: 'Kente tissé', origine: 'Accra', tile: 'tile-kente' },
  { id: 'indigo', nom: 'Bogolan Indigo', origine: 'Bamako', tile: 'tile-indigo' },
  { id: 'hibiscus', nom: 'Percale Hibiscus', origine: 'Dakar', tile: 'tile-hibiscus' },
  { id: 'bazin', nom: 'Bazin Riche', origine: 'Thiès', tile: 'tile-bazin' },
  { id: 'jacquard', nom: 'Jacquard Lyonnais', origine: 'Paris', tile: 'tile-jacquard' },
  { id: 'dentelle', nom: 'Dentelle de Calais', origine: 'Paris', tile: 'tile-dentelle' },
  { id: 'soie', nom: 'Soie Duchesse', origine: 'Paris', tile: 'tile-soie' },
]

export const tileForTextile = (id) => textiles.find((t) => t.id === id)?.tile || 'tile-wax'
