import { apiList, apiCreate, apiRemove } from './client.js'

export function createQuote(data) {
  return apiCreate('quotes', data)
}

export function removeQuote(id) {
  return apiRemove('quotes', id)
}

export async function getQuotes() {
  const rows = await apiList('quotes')
  return rows
    .filter((q) => q.statut === 'en_attente')
    .map((q) => ({
      id: q.id,
      ref: q.ref,
      client: q.client?.nom ?? '',
      modele: q.modele,
      montant: q.montant,
      montantMatieres: q.montant_matieres,
      montantMainOeuvre: q.montant_main_oeuvre,
      echeance: (q.echeance || '').slice(0, 10),
    }))
}
