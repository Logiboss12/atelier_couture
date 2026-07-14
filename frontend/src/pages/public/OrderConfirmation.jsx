import { Link, Navigate, useLocation } from 'react-router-dom'

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

export default function OrderConfirmation() {
  const location = useLocation()
  const invoices = location.state?.invoices || (location.state?.invoice ? [location.state.invoice] : null)

  if (!invoices || invoices.length === 0) {
    return <Navigate to="/boutique" replace />
  }

  const total = invoices.reduce((sum, inv) => sum + inv.total, 0)

  return (
    <div className="container text-center" style={{ maxWidth: 560 }}>
      <div className="status warn d-inline-flex align-items-center gap-2 p-3 fs-6 mb-4">
        <i className="bi bi-hourglass-split"></i> En attente de validation
      </div>
      <h1 className="display-4 mb-3">Merci pour votre commande !</h1>
      <p className="text-muted mb-4">
        {invoices.length > 1
          ? `Vos factures ${invoices.map((i) => i.numero).join(' et ')} ont été enregistrées et seront validées par notre équipe.`
          : `Votre facture ${invoices[0].numero} a été enregistrée et sera validée par notre équipe.`
        } Elle{invoices.length > 1 ? 's' : ''} deviendra{invoices.length > 1 ? 'ent' : ''} téléchargeable{invoices.length > 1 ? 's' : ''} dans votre espace client dès confirmation.
      </p>

      {invoices.map((invoice) => (
        <div className="glass p-4 text-start mb-3" key={invoice.id}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="font-mono text-muted small">Facture {invoice.numero}</span>
            <span className="font-mono text-muted small">{money(invoice.total)}</span>
          </div>
          {invoice.lines.map((line) => (
            <div key={line.id} className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
              <span>{line.label}</span>
              <span className="font-mono">{money(line.montant)}</span>
            </div>
          ))}
        </div>
      ))}

      {invoices.length > 1 && (
        <div className="d-flex justify-content-between pt-1 mb-4 px-2">
          <span className="font-display fs-5">Total</span>
          <span className="font-display fs-5 text-gradient">{money(total)}</span>
        </div>
      )}

      <div className="d-flex justify-content-center gap-2 flex-wrap">
        <Link to="/espace-client" className="btn-iro btn">Voir mes factures</Link>
        <Link to="/boutique" className="btn-ghost btn">Continuer mes achats</Link>
      </div>
    </div>
  )
}
