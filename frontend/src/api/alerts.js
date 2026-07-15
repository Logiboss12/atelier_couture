import { apiList } from './client.js'

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

export async function getRelanceAlerts() {
  const [invoices, quotes] = await Promise.all([apiList('invoices'), apiList('quotes')])

  const invoiceAlerts = invoices
    .filter((inv) => inv.statut === 'impayee' || inv.statut === 'en_attente')
    .map((inv) => ({
      id: `invoice-${inv.id}`,
      titre: `Facture ${inv.numero}`,
      meta: `${inv.client?.nom ?? ''} · ${money(inv.total)}`,
      tag: inv.statut === 'impayee' ? 'Impayée' : 'En attente',
      tagStatus: inv.statut === 'impayee' ? 'danger' : 'warn',
      color: inv.statut === 'impayee' ? 'var(--iro-red)' : 'var(--iro-orange)',
      tel: inv.client?.tel ?? null,
      clientNom: inv.client?.nom ?? '',
      message: `Bonjour ${inv.client?.nom ?? ''}, un petit rappel concernant votre facture ${inv.numero} (${money(inv.total)}) — Maison Ìró.`,
    }))

  const quoteAlerts = quotes
    .filter((q) => q.statut === 'en_attente')
    .map((q) => ({
      id: `quote-${q.id}`,
      titre: `Devis ${q.ref}`,
      meta: `${q.client?.nom ?? ''} · ${money(q.montant)}`,
      tag: 'Devis en attente',
      tagStatus: 'info',
      color: 'var(--iro-blue)',
      tel: q.client?.tel ?? null,
      clientNom: q.client?.nom ?? '',
      message: `Bonjour ${q.client?.nom ?? ''}, votre devis ${q.ref} (${money(q.montant)}) est prêt — n'hésitez pas à le consulter dans votre espace client. Maison Ìró.`,
    }))

  return [...invoiceAlerts, ...quoteAlerts]
}
