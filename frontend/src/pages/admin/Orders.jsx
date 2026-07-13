import TextileTile from '../../components/TextileTile.jsx'
import { orderStatuses } from '../../mock/orders.js'
import { useFetch } from '../../api/useFetch.js'
import { getOrders } from '../../api/orders.js'

function urgencyColor(dateStr) {
  const days = (new Date(dateStr) - new Date('2026-07-13')) / 86400000
  if (days <= 1) return 'var(--iro-red)'
  if (days <= 3) return 'var(--iro-orange)'
  return 'var(--iro-faint)'
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
                {items.map((o) => (
                  <div key={o.id} className="kanban-card p-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <TextileTile variant={o.tissu} style={{ width: 34, height: 34, flexShrink: 0 }} />
                      <div>
                        <div className="small fw-semibold">{o.client}</div>
                        <div className="font-mono text-muted" style={{ fontSize: '.68rem' }}>{o.ref}</div>
                      </div>
                    </div>
                    <div className="small mb-2">{o.modele}</div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="font-mono" style={{ fontSize: '.72rem', color: urgencyColor(o.echeance) }}>
                        <i className="bi bi-clock me-1"></i>{o.echeance}
                      </span>
                      <span className="font-mono text-muted" style={{ fontSize: '.7rem' }}>{o.assigne}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p className="text-muted small mb-0">Aucune commande.</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
