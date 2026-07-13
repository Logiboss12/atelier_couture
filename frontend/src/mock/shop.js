import { photos } from '../assets/images/index.js'

export const shopFilters = {
  categories: ['Grand boubou', 'Tailleur', 'Robe', 'Prêt-à-porter', 'Enfant'],
  tailles: ['S', 'M', 'L', 'XL', 'XXL'],
  couleurs: [
    { id: 'orange', hex: '#ff8a3d' },
    { id: 'magenta', hex: '#ff4d8d' },
    { id: 'violet', hex: '#7b5cff' },
    { id: 'gold', hex: '#f2c94c' },
    { id: 'indigo', hex: '#2233a8' },
    { id: 'noir', hex: '#160a12' },
  ],
}

export const shopProducts = [
  { id: 'sp1', nom: 'Grand boubou brodé', categorie: 'Grand boubou', tile: 'tile-wax', image: photos.images7, prix: 145000, stock: 'ok', tailles: ['S', 'M', 'L', 'XL'], couleurs: ['#ff8a3d', '#160a12'] },
  { id: 'sp2', nom: 'Tailleur trois pièces', categorie: 'Tailleur', tile: 'tile-bazin', image: photos.costume3, prix: 265000, stock: 'ok', tailles: ['M', 'L', 'XL'], couleurs: ['#f2c94c'] },
  { id: 'sp3', nom: 'Robe soirée jacquard', categorie: 'Robe', tile: 'tile-jacquard', image: photos.images3, prix: 380000, stock: 'warn', tailles: ['S', 'M'], couleurs: ['#7b5cff'] },
  { id: 'sp4', nom: 'Ensemble kente cérémonie', categorie: 'Grand boubou', tile: 'tile-kente', image: photos.images10, prix: 210000, stock: 'ok', tailles: ['S', 'M', 'L'], couleurs: ['#f2c94c', '#c8102e'] },
  { id: 'sp5', nom: 'Boubou hibiscus enfant', categorie: 'Enfant', tile: 'tile-hibiscus', prix: 68000, stock: 'danger', tailles: ['4A', '6A', '8A'], couleurs: ['#ff5da2'] },
  { id: 'sp6', nom: 'Costume indigo', categorie: 'Tailleur', tile: 'tile-indigo', image: photos.costume1, prix: 365000, stock: 'ok', tailles: ['M', 'L', 'XL'], couleurs: ['#2233a8'] },
  { id: 'sp7', nom: 'Robe soie duchesse', categorie: 'Robe', tile: 'tile-soie', image: photos.images9, prix: 298000, stock: 'ok', tailles: ['S', 'M', 'L'], couleurs: ['#ff9ecb'] },
  { id: 'sp8', nom: 'Veste bazin brodée', categorie: 'Prêt-à-porter', tile: 'tile-bazin', image: photos.images1, prix: 155000, stock: 'warn', tailles: ['S', 'M', 'L', 'XL'], couleurs: ['#c9a227'] },
]
