import { apiList, apiUpdate, apiDownload } from './client.js'

export async function getPendingInvoices() {
  const rows = await apiList('invoices')
  return rows
    .filter((inv) => inv.statut === 'en_attente')
    .map((inv) => ({
      id: inv.id,
      numero: inv.numero,
      client: inv.client?.nom ?? '',
      orderRef: inv.order?.ref ?? null,
      total: inv.total,
      modePaiement: inv.mode_paiement,
      adresseLivraison: inv.adresse_livraison,
      villeLivraison: inv.ville_livraison,
      telLivraison: inv.tel_livraison,
      lignes: (inv.lines || []).map((l) => ({ id: l.id, label: l.label, montant: l.montant })),
    }))
}

export function confirmInvoice(id) {
  return apiUpdate('invoices', id, { statut: 'payee' })
}

export function downloadInvoicePdf(id, filename) {
  return apiDownload(`/invoices/${id}/pdf`, filename)
}
