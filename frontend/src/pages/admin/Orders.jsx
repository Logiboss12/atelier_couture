import { useState } from 'react'
import TextileTile from '../../components/TextileTile.jsx'
import { orderStatuses } from '../../mock/orders.js'
import { useFetch } from '../../api/useFetch.js'
import { getOrders, updateOrderStatus } from '../../api/orders.js'
import { createQuote } from '../../api/quotes.js'

function urgencyColor(dateStr) {
  const days = (new Date(dateStr) - new Date()) / 86400000
  if (days <= 1) return 'var(--iro-red)'
  if (days <= 3) return 'var(--iro-orange)'
  return 'var(--iro-faint)'
}

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

function OrderCard({ order, onDragStart }) {
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [montantMatieres, setMontantMatieres] = useState('')
  const [montantMainOeuvre, setMontantMainOeuvre] = useState('')
  const [echeanceDevis, setEcheanceDevis] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const total = (Number(montantMatieres) || 0) + (Number(montantMainOeuvre) || 0)

  const handleSendQuote = async () => {
    setSending(true)
    try {
      await createQuote({
        client_id: order.clientId,
        order_id: order.id,
        modele: order.modele,
        montant_matieres: Number(montantMatieres) || 0,
        montant_main_oeuvre: Number(montantMainOeuvre) || 0,
        echeance: echeanceDevis || null,
      })
      setSent(true)
      setShowQuoteForm(false)
      setMontantMatieres('')
      setMontantMainOeuvre('')
      setEcheanceDevis('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className="kanban-card p-3"
      draggable
      onDragStart={(e) => onDragStart(e, order.id)}
      style={{ cursor: 'grab' }}
    >
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
        <div className="d-flex flex-column gap-2">
          <input
            type="number" className="form-control form-control-sm" placeholder="Matières premières (F)"
            value={montantMatieres} onChange={(e) => setMontantMatieres(e.target.value)}
          />
          <input
            type="number" className="form-control form-control-sm" placeholder="Main d'œuvre (F)"
            value={montantMainOeuvre} onChange={(e) => setMontantMainOeuvre(e.target.value)}
          />
          <input
            type="date" className="form-control form-control-sm"
            value={echeanceDevis} onChange={(e) => setEcheanceDevis(e.target.value)}
          />
          <div className="d-flex justify-content-between align-items-center small">
            <span className="text-muted">Total</span>
            <span className="font-mono fw-semibold">{money(total)}</span>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn-ghost btn btn-sm flex-grow-1" onClick={() => setShowQuoteForm(false)}>
              Annuler
            </button>
            <button
              type="button" className="btn btn-sm flex-grow-1"
              style={{ background: 'var(--iro-green)', color: '#0a2b1c' }}
              onClick={handleSendQuote} disabled={sending || total <= 0}
            >
              {sending ? '…' : 'Envoyer'}
            </button>
          </div>
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
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: orders, loading } = useFetch(getOrders, [refreshKey])
  const [dragOverColumn, setDragOverColumn] = useState(null)
  const [moving, setMoving] = useState(false)

  const handleDragStart = (e, orderId) => {
    e.dataTransfer.setData('text/plain', String(orderId))
  }

  const handleDrop = async (e, statusId) => {
    e.preventDefault()
    setDragOverColumn(null)
    const orderId = e.dataTransfer.getData('text/plain')
    if (!orderId) return

    setMoving(true)
    try {
      await updateOrderStatus(orderId, statusId)
      setRefreshKey((k) => k + 1)
    } finally {
      setMoving(false)
    }
  }

  if (loading || !orders) return <p className="text-muted">Chargement…</p>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted mb-0 d-none d-sm-block">Glissez les commandes d'une étape à l'autre.</p>
        {moving && <span className="text-muted small">Mise à jour…</span>}
      </div>

      <div className="d-flex gap-3 overflow-auto pb-2">
        {orderStatuses.map((status) => {
          const items = orders.filter((o) => o.statut === status.id)
          return (
            <div
              key={status.id}
              className="kanban-col glass p-3 d-flex flex-column"
              onDragOver={(e) => { e.preventDefault(); setDragOverColumn(status.id) }}
              onDragLeave={() => setDragOverColumn((c) => (c === status.id ? null : c))}
              onDrop={(e) => handleDrop(e, status.id)}
              style={{ outline: dragOverColumn === status.id ? '2px dashed var(--iro-magenta)' : 'none', outlineOffset: -2 }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="rounded-circle" style={{ width: 10, height: 10, background: status.color }}></span>
                <span className="font-display">{status.label}</span>
                <span className="badge rounded-pill ms-auto" style={{ background: 'rgba(255,255,255,.08)' }}>{items.length}</span>
              </div>
              <div className="d-flex flex-column gap-2 overflow-auto">
                {items.map((o) => <OrderCard key={o.id} order={o} onDragStart={handleDragStart} />)}
                {items.length === 0 && <p className="text-muted small mb-0">Aucune commande.</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
