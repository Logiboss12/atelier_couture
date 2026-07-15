import { apiList, apiCreate, apiUpdate, apiRemove, apiUpload } from './client.js'

export async function getTextiles() {
  const rows = await apiList('textiles')
  return rows.map((t) => ({ id: t.slug, dbId: t.id, nom: t.nom, origine: t.origine, tile: t.tile, image: t.image_url }))
}

export async function getTextilesAdmin() {
  const rows = await apiList('textiles')
  return rows.map((t) => ({ id: t.id, slug: t.slug, nom: t.nom, origine: t.origine, tile: t.tile, image: t.image_url }))
}

export function createTextile(data) {
  return apiCreate('textiles', data)
}

export function updateTextile(id, data) {
  return apiUpdate('textiles', id, data)
}

export function deleteTextile(id) {
  return apiRemove('textiles', id)
}

export function uploadTextileImage(id, file) {
  const formData = new FormData()
  formData.append('image', file)
  return apiUpload(`/textiles/${id}/image`, formData)
}
