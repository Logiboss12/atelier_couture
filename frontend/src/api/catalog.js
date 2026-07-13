import { apiList } from './client.js'

export async function getCollections() {
  const rows = await apiList('collections')
  return rows.map((c) => ({ id: c.id, nom: c.nom, tile: c.tile, articles: c.products_count ?? 0 }))
}

export async function getProducts() {
  const rows = await apiList('products')
  return rows.map((p) => ({
    id: p.id,
    nom: p.nom,
    collection: p.collection?.nom ?? '',
    tissu: p.textile?.slug ?? 'wax',
    categorie: p.categorie,
    variantes: p.variantes,
    stock: p.stock,
    stockNiveau: p.stock_niveau,
    prix: p.prix,
    statut: p.statut,
    publie: p.publie,
    tailles: p.tailles || [],
    couleurs: p.couleurs || [],
  }))
}
