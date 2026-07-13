import { photos } from '../assets/images/index.js'

export const testimonials = [
  { id: 'te1', nom: 'Aïssatou Diop', ville: 'Dakar', note: 5, texte: 'Ma robe de mariage était exactement comme je l\'imaginais. Un travail d\'orfèvre.' },
  { id: 'te2', nom: 'Camille Dubois', ville: 'Paris', note: 5, texte: 'Le mélange wax et jacquard est unique. Je reçois des compliments à chaque sortie.' },
  { id: 'te3', nom: 'Moussa Fall', ville: 'Dakar', note: 4, texte: 'Costume impeccable, délais respectés. L\'équipe est très professionnelle.' },
  { id: 'te4', nom: 'Julien Moreau', ville: 'Lyon', note: 5, texte: 'Suivi de commande très clair depuis l\'espace client, du jamais vu pour un atelier.' },
  { id: 'te5', nom: 'Fatou Ndiaye', ville: 'Saint-Louis', note: 5, texte: 'La qualité des tissus et des finitions est exceptionnelle, je recommande vivement.' },
]

export const heroStats = [
  { valeur: '12 ans', label: 'D\'expérience' },
  { valeur: '2 400+', label: 'Pièces créées' },
  { valeur: '2', label: 'Ateliers Dakar · Paris' },
]

export const materials = [
  { id: 'wax', nom: 'Wax', tile: 'tile-wax' },
  { id: 'kente', nom: 'Kente', tile: 'tile-kente' },
  { id: 'bazin', nom: 'Bazin', tile: 'tile-bazin' },
  { id: 'indigo', nom: 'Indigo', tile: 'tile-indigo' },
  { id: 'jacquard', nom: 'Jacquard', tile: 'tile-jacquard' },
  { id: 'dentelle', nom: 'Dentelle', tile: 'tile-dentelle' },
]

export const featuredCreations = [
  { id: 'fc1', nom: 'Boubou Wax Impérial', desc: 'Broderie main, wax hollandais premium', tile: 'tile-wax', image: photos.images7 },
  { id: 'fc2', nom: 'Robe Dentelle Étoile', desc: 'Dentelle de Calais, doublure soie', tile: 'tile-dentelle', image: photos.images2 },
  { id: 'fc3', nom: 'Costume Indigo Nuit', desc: 'Bogolan indigo, coupe italienne', tile: 'tile-indigo', image: photos.costume1 },
]
