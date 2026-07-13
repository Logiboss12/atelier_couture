import { apiList } from './client.js'

export async function getTextiles() {
  const rows = await apiList('textiles')
  return rows.map((t) => ({ id: t.slug, dbId: t.id, nom: t.nom, origine: t.origine, tile: t.tile }))
}
