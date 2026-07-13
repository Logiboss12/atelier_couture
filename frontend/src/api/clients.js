import { apiList } from './client.js'

export async function getClients() {
  const rows = await apiList('clients')
  return rows.map((c) => ({
    id: c.id,
    nom: c.nom,
    ville: c.ville,
    pays: c.pays,
    tel: c.tel,
    email: c.email,
    commandes: c.orders_count ?? 0,
    depuis: c.client_depuis,
    mensurations: {
      poitrine: c.poitrine,
      taille: c.taille,
      hanches: c.hanches,
      epaule: c.epaule,
      manche: c.manche,
      longueur: c.longueur,
    },
  }))
}
