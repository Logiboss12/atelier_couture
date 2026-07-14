import { useParams } from 'react-router-dom'
import { useFetch } from '../../api/useFetch.js'
import { getMyInvoice } from '../../api/me.js'

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

const paymentLabels = {
  carte: 'Carte bancaire',
  mobile_money: 'Mobile Money',
  especes_livraison: 'Espèces à la livraison',
}

export default function InvoiceView() {
  const { id } = useParams()
  const { data: invoice, loading, error } = useFetch(() => getMyInvoice(id), [id])

  if (loading) {
    return (
      <div className="container d-flex justify-content-center py-5">
        <div className="spinner-border" style={{ color: 'var(--iro-magenta)' }} role="status">
          <span className="visually-hidden">Chargement…</span>
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="container">
        <div className="status danger p-3">
          <i className="bi bi-exclamation-circle me-2"></i>Facture introuvable.
        </div>
      </div>
    )
  }

  const pending = invoice.statut === 'en_attente'

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <span className="eyebrow">Facture {invoice.numero}</span>
        {!pending && (
          <button type="button" className="btn-iro btn btn-sm" onClick={() => window.print()}>
            <i className="bi bi-download me-2"></i>Télécharger (PDF)
          </button>
        )}
      </div>

      {pending && (
        <div className="status warn p-3 mb-4 no-print">
          <i className="bi bi-hourglass-split me-2"></i>
          En attente de validation par notre équipe. La facture sera téléchargeable une fois confirmée.
        </div>
      )}

      <div className="bg-light text-dark rounded-3 p-4 shadow" id="invoice-printable">
        <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="rounded-circle" style={{ width: 32, height: 32, background: 'var(--iro-grad)', display: 'inline-block' }}></span>
            <span className="font-display fs-5">MAISON ÌRÓ</span>
          </div>
          <span className="font-mono text-nowrap small">FACTURE #{invoice.numero}</span>
        </div>

        <div className="mb-3">
          <div className="small text-muted">Facturé à</div>
          <div className="fw-semibold">{invoice.client?.nom}</div>
          <div className="small text-muted mt-1">Date</div>
          <div>{(invoice.date || '').slice(0, 10)}</div>
        </div>

        {(invoice.lines || []).map((line) => (
          <div key={line.id} className="d-flex justify-content-between border-bottom py-2">
            <span className="small">{line.label}</span>
            <span className="font-mono small text-nowrap">{money(line.montant)}</span>
          </div>
        ))}

        <div className="d-flex justify-content-between pt-3 mb-3">
          <span className="font-display">TOTAL</span>
          <span className="font-display" style={{ color: 'var(--iro-red)' }}>{money(invoice.total)}</span>
        </div>

        {invoice.adresse_livraison && (
          <div className="border-top pt-3">
            <div className="small text-muted">Livraison</div>
            <div className="small">{invoice.adresse_livraison}, {invoice.ville_livraison}</div>
            <div className="small">{invoice.tel_livraison}</div>
            <div className="small text-muted mt-2">Paiement</div>
            <div className="small">{paymentLabels[invoice.mode_paiement] || invoice.mode_paiement}</div>
          </div>
        )}
      </div>
    </div>
  )
}
