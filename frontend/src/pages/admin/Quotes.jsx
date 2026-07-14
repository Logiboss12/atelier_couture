import { useState } from 'react'
import { useFetch } from '../../api/useFetch.js'
import { getQuotes, getInvoicePreview } from '../../api/quotes.js'
import { getPendingInvoices, confirmInvoice } from '../../api/invoices.js'

const paymentLabels = {
  carte: 'Carte bancaire',
  mobile_money: 'Mobile Money',
  especes_livraison: 'Espèces à la livraison',
}

export default function Quotes() {
  const { data: quotes, loading } = useFetch(getQuotes, [])
  const { data: invoicePreview } = useFetch(getInvoicePreview, [])
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: pendingInvoices } = useFetch(getPendingInvoices, [refreshKey])
  const [confirmingId, setConfirmingId] = useState(null)

  const handleConfirm = async (id) => {
    setConfirmingId(id)
    try {
      await confirmInvoice(id)
      setRefreshKey((k) => k + 1)
    } finally {
      setConfirmingId(null)
    }
  }

  if (loading || !quotes || !invoicePreview) return <p className="text-muted">Chargement…</p>

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

    <div className="row g-3">
      <div className="col-12 col-lg-7">
        <div className="glass p-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="eyebrow mb-0">Devis en attente</div>
            <span className="badge rounded-pill" style={{ background: 'var(--iro-magenta)' }}>{quotes.length} à traiter</span>
          </div>
          {quotes.map((q) => (
            <div key={q.id} className="d-flex align-items-center gap-3 border-bottom py-3" style={{ borderColor: 'var(--iro-border)' }}>
              <div className="flex-grow-1">
                <div className="small fw-semibold">{q.client}</div>
                <div className="font-mono text-muted" style={{ fontSize: '.72rem' }}>{q.ref} · {q.modele}</div>
              </div>
              <div className="font-display">{q.montant.toLocaleString('fr-FR')} F</div>
              <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,.08)' }}>En attente du client</span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-5">
        <div className="bg-light text-dark rounded-3 p-4 shadow">
          <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <span className="rounded-circle" style={{ width: 32, height: 32, background: 'var(--iro-grad)', display: 'inline-block' }}></span>
              <span className="font-display fs-5">MAISON ÌRÓ</span>
            </div>
            <span className="font-mono text-nowrap small text-end">FACTURE #{invoicePreview.numero}</span>
          </div>
          <div className="mb-3">
            <div className="small text-muted">Facturé à</div>
            <div className="fw-semibold">{invoicePreview.client}</div>
            <div className="small text-muted mt-1">Date</div>
            <div>{invoicePreview.date}</div>
          </div>
          {invoicePreview.lignes.map((l, i) => (
            <div key={i} className="d-flex justify-content-between border-bottom py-2">
              <span className="small">{l.label}</span>
              <span className="font-mono small text-nowrap">{l.montant.toLocaleString('fr-FR')} F</span>
            </div>
          ))}
          <div className="d-flex justify-content-between pt-3">
            <span className="font-display">TOTAL</span>
            <span className="font-display" style={{ color: 'var(--iro-red)' }}>{invoicePreview.total.toLocaleString('fr-FR')} F</span>
          </div>
        </div>
        <div className="d-flex gap-2 mt-3">
          <button type="button" className="btn-ghost btn flex-grow-1">↓ PDF</button>
          <button type="button" className="btn-iro btn flex-grow-1">Envoyer</button>
        </div>
      </div>
    </div>
    </div>
  )
}
