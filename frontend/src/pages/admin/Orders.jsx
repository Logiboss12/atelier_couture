import { useState } from 'react'
import TextileTile from '../../components/TextileTile.jsx'
import { orderStatuses } from '../../mock/orders.js'
import { useFetch } from '../../api/useFetch.js'
import { getOrders } from '../../api/orders.js'
import { createQuote } from '../../api/quotes.js'

function urgencyColor(dateStr) {
  const days = (new Date(dateStr) - new Date('2026-07-13')) / 86400000
  if (days <= 1) return 'var(--iro-red)'
  if (days <= 3) return 'var(--iro-orange)'
  return 'var(--iro-faint)'
}

function OrderCard({ order }) {
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [montant, setMontant] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSendQuote = async () => {
    setSending(true)
    try {
      await createQuote({
        client_id: order.clientId,
        order_id: order.id,
        modele: order.modele,
        montant: Number(montant),
      })
      setSent(true)
      setShowQuoteForm(false)
      setMontant('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="kanban-card p-3">
      <div className="d-flex align-items-center gap-2 mb-2">
        <TextileTile variant={order.tissu} style={{ width: 34, height: 34, flexShrink: 0 }} />
        <div>
          <div className="small fw-semibold">{order.client}</div>
          <div className="font-mono text-muted" style={{ fontSize: '.68rem' }}>{order.ref}</div>
        </div>
      </div>
      <div className="small mb-2">{order.modele}</div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="font-mono" style={{ fontSize: '.72rem', color: urgencyColor(order.echeance) }}>
          <i className="bi bi-clock me-1"></i>{order.echeance}
        </span>
        <span className="font-mono text-muted" style={{ fontSize: '.7rem' }}>{order.assigne}</span>
      </div>

      {showQuoteForm ? (
        <div className="d-flex gap-2">
          <input
            type="number" className="form-control form-control-sm" placeholder="Montant (F)"
            value={montant} onChange={(e) => setMontant(e.target.value)}
          />
          <button type="button" className="btn btn-sm" style={{ background: 'var(--iro-green)', color: '#0a2b1c' }} onClick={handleSendQuote} disabled={sending || !montant}>
            {sending ? '…' : '✓'}
          </button>
        </div>
      ) : (
        <button type="button" className="btn-ghost btn btn-sm w-100" onClick={() => { setShowQuoteForm(true); setSent(false) }}>
          <i className="bi bi-receipt me-1"></i>{sent ? 'Devis envoyé ✓' : 'Envoyer un devis'}
        </button>
      )}
    </div>
  )
}

export default function Orders() {
  const { data: orders, loading } = useFetch(getOrders, [])

  if (loading || !orders) return <p className="text-muted">Chargement…</p>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted mb-0 d-none d-sm-block">Glissez les commandes d'une étape à l'autre.</p>
        <button type="button" className="btn-iro btn btn-sm ms-auto">
          <i className="bi bi-plus-lg me-1"></i>Nouvelle commande
        </button>
      </div>

      <div className="d-flex gap-3 overflow-auto pb-2">
        {orderStatuses.map((status) => {
          const items = orders.filter((o) => o.statut === status.id)
          return (
            <div key={status.id} className="kanban-col glass p-3 d-flex flex-column">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="rounded-circle" style={{ width: 10, height: 10, background: status.color }}></span>
                <span className="font-display">{status.label}</span>
                <span className="badge rounded-pill ms-auto" style={{ background: 'rgba(255,255,255,.08)' }}>{items.length}</span>
              </div>
              <div className="d-flex flex-column gap-2 overflow-auto">
                {items.map((o) => <OrderCard key={o.id} order={o} />)}
                {items.length === 0 && <p className="text-muted small mb-0">Aucune commande.</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
