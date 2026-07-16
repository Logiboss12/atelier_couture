import { useState } from 'react'
import { useFetch } from '../../api/useFetch.js'
import { getQuotes, removeQuote } from '../../api/quotes.js'
import { getPendingInvoices, confirmInvoice, downloadInvoicePdf } from '../../api/invoices.js'

const paymentLabels = {
  carte: 'Carte bancaire',
  mobile_money: 'Mobile Money',
  especes_livraison: 'Espèces à la livraison',
}

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

export default function Quotes() {
  const [quotesRefreshKey, setQuotesRefreshKey] = useState(0)
  const { data: quotes, loading } = useFetch(getQuotes, [quotesRefreshKey])
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: pendingInvoices } = useFetch(getPendingInvoices, [refreshKey])
  const [confirmingId, setConfirmingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const handleConfirm = async (id) => {
    setConfirmingId(id)
    try {
      await confirmInvoice(id)
      setRefreshKey((k) => k + 1)
    } finally {
      setConfirmingId(null)
    }
  }

  const handleDeleteQuote = async (quote) => {
    if (!confirm(`Supprimer le devis ${quote.ref} (${quote.client}) ? Cette action est définitive.`)) return
    setDeletingId(quote.id)
    try {
      await removeQuote(quote.id)
      setQuotesRefreshKey((k) => k + 1)
    } finally {
      setDeletingId(null)
    }
  }

  const handlePrintQuote = (q) => {
    const win = window.open('', '_blank', 'width=600,height=800')
    if (!win) return
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    win.document.write(`<!doctype html>
<html><head><title>${esc(`Devis ${q.ref}`)}</title>
<style>
  body{ font-family: Arial, sans-serif; color:#111; padding:32px; }
  h2{ margin-bottom: 24px; }
  .row{ display:flex; justify-content:space-between; border-bottom:1px solid #ddd; padding:8px 0; }
  .total{ font-weight:bold; font-size:1.1rem; color:#c0392b; margin-top: 12px; }
</style>
</head><body>
  <h2>MAISON ÌRÓ &mdash; DEVIS #${esc(q.ref)}</h2>
  <div class="row"><span>Client</span><span>${esc(q.client)}</span></div>
  <div class="row"><span>Modèle</span><span>${esc(q.modele)}</span></div>
  ${q.echeance ? `<div class="row"><span>Échéance</span><span>${esc(q.echeance)}</span></div>` : ''}
  ${q.montantMatieres != null ? `<div class="row"><span>Matières premières</span><span>${esc(money(q.montantMatieres))}</span></div>` : ''}
  ${q.montantMainOeuvre != null ? `<div class="row"><span>Main d'œuvre</span><span>${esc(money(q.montantMainOeuvre))}</span></div>` : ''}
  <div class="row total"><span>TOTAL</span><span>${esc(money(q.montant))}</span></div>
</body></html>`)
    win.document.close()
    win.focus()
    win.print()
  }

  if (loading || !quotes) return <p className="text-muted">Chargement…</p>

  return (
    <div className="d-flex flex-column gap-3">
      {pendingInvoices && pendingInvoices.length > 0 && (
        <div className="glass p-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="eyebrow mb-0">Factures en attente de validation</div>
            <span className="badge rounded-pill" style={{ background: 'var(--iro-orange)' }}>{pendingInvoices.length} à valider</span>
          </div>
          {pendingInvoices.map((inv) => (
            <div key={inv.id} className="d-flex align-items-center gap-3 border-bottom py-3 flex-wrap" style={{ borderColor: 'var(--iro-border)' }}>
              <div className="flex-grow-1">
                <div className="small fw-semibold">{inv.client}</div>
                <div className="font-mono text-muted" style={{ fontSize: '.72rem' }}>
                  {inv.numero}{inv.orderRef ? ` · commande ${inv.orderRef}` : ''}
                </div>
                <div className="text-muted" style={{ fontSize: '.72rem' }}>
                  {inv.adresseLivraison}, {inv.villeLivraison} · {inv.telLivraison} · {paymentLabels[inv.modePaiement] || inv.modePaiement}
                </div>
              </div>
              <div className="font-display">{inv.total.toLocaleString('fr-FR')} F</div>
              <button
                type="button"
                className="btn-ghost btn btn-sm"
                onClick={() => downloadInvoicePdf(inv.id, `facture-${inv.numero}.pdf`)}
                title="Télécharger la facture (PDF)"
              >
                <i className="bi bi-download"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: 'var(--iro-green)', color: '#0a2b1c' }}
                onClick={() => handleConfirm(inv.id)}
                disabled={confirmingId === inv.id}
              >
                {confirmingId === inv.id ? '…' : '✓ Confirmer'}
              </button>
            </div>
          ))}
        </div>
      )}

    <div className="glass p-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="eyebrow mb-0">Devis en attente</div>
        <span className="badge rounded-pill" style={{ background: 'var(--iro-magenta)' }}>{quotes.length} à traiter</span>
      </div>

      {quotes.length === 0 && <p className="text-muted small mb-0">Aucun devis en attente.</p>}

      {quotes.map((q) => (
        <div key={q.id} className="border-bottom" style={{ borderColor: 'var(--iro-border)' }}>
          <div className="d-flex align-items-center gap-3 py-3 flex-wrap">
            <div className="flex-grow-1" style={{ minWidth: 160 }}>
              <div className="small fw-semibold">{q.client}</div>
              <div className="font-mono text-muted" style={{ fontSize: '.72rem' }}>{q.ref} · {q.modele}</div>
            </div>
            <div className="font-display" style={{ minWidth: 110 }}>{money(q.montant)}</div>
            <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,.08)' }}>En attente du client</span>
            <button
              type="button"
              className="btn-ghost btn btn-sm"
              onClick={() => setExpandedId((id) => (id === q.id ? null : q.id))}
            >
              <i className={`bi ${expandedId === q.id ? 'bi-chevron-up' : 'bi-chevron-down'} me-1`}></i>Détails
            </button>
            <button
              type="button"
              className="btn-ghost btn btn-sm"
              style={{ color: 'var(--iro-red)' }}
              onClick={() => handleDeleteQuote(q)}
              disabled={deletingId === q.id}
              aria-label={`Supprimer le devis ${q.ref}`}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>

          {expandedId === q.id && (
            <div className="pb-3">
              <div className="d-flex flex-column mb-2">
                <div className="d-flex justify-content-between border-bottom py-1" style={{ borderColor: 'var(--iro-border)' }}>
                  <span className="text-muted small">Échéance</span>
                  <span className="font-mono small">{q.echeance || '—'}</span>
                </div>
                {q.montantMatieres != null && (
                  <div className="d-flex justify-content-between border-bottom py-1" style={{ borderColor: 'var(--iro-border)' }}>
                    <span className="text-muted small">Matières premières</span>
                    <span className="font-mono small">{money(q.montantMatieres)}</span>
                  </div>
                )}
                {q.montantMainOeuvre != null && (
                  <div className="d-flex justify-content-between border-bottom py-1" style={{ borderColor: 'var(--iro-border)' }}>
                    <span className="text-muted small">Main d'œuvre</span>
                    <span className="font-mono small">{money(q.montantMainOeuvre)}</span>
                  </div>
                )}
              </div>
              <button type="button" className="btn-ghost btn btn-sm" onClick={() => handlePrintQuote(q)}>
                <i className="bi bi-printer me-1"></i>Imprimer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
    </div>
  )
}
