import { apiList } from './client.js'

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
    }))
}

export async function getInvoicePreview() {
  const rows = await apiList('invoices')
  const invoice = rows[0]
  if (!invoice) return null

  return {
    numero: invoice.numero,
    client: invoice.client?.nom ?? '',
    date: (invoice.date || '').slice(0, 10),
    lignes: (invoice.lines || []).map((l) => ({ label: l.label, montant: l.montant })),
    total: invoice.total,
  }
}
