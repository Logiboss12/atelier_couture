import { apiList, apiCreate, apiUpdate, apiRemove, apiUpload } from './client.js'

export async function getCollections() {
  const rows = await apiList('collections')
  return rows.map((c) => ({ id: c.id, nom: c.nom, tile: c.tile, articles: c.products_count ?? 0 }))
}

export async function getProducts() {
  const rows = await apiList('products')
  return rows.map((p) => ({
    id: p.id,
    nom: p.nom,
    type: p.type,
    collectionId: p.collection_id,
    collection: p.collection?.nom ?? '',
    textileId: p.textile_id,
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
    image: p.image_url,
  }))
}

export function createProduct(data) {
  return apiCreate('products', data)
}

export function updateProduct(id, data) {
  return apiUpdate('products', id, data)
}

export function deleteProduct(id) {
  return apiRemove('products', id)
}

export function uploadProductImage(id, file) {
  const formData = new FormData()
  formData.append('image', file)
  return apiUpload(`/products/${id}/image`, formData)
}
