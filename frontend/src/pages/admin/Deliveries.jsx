import StatusBadge from '../../components/StatusBadge.jsx'
import { useFetch } from '../../api/useFetch.js'
import { getDeliveries, getTodayStatusCounts } from '../../api/deliveries.js'

export default function Deliveries() {
  const { data: deliveries, loading: loadingDeliveries } = useFetch(getDeliveries, [])
  const { data: todayStatusCounts, loading: loadingCounts } = useFetch(getTodayStatusCounts, [])

  if (loadingDeliveries || loadingCounts || !deliveries || !todayStatusCounts) {
    return <p className="text-muted">Chargement…</p>
  }

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-8">
        <div className="glass p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="eyebrow mb-0">Livraisons planifiées</div>
            <button type="button" className="btn-iro btn btn-sm"><i className="bi bi-plus-lg me-1"></i>Planifier</button>
          </div>
          {deliveries.map((d) => (
            <div key={d.id} className="d-flex align-items-center gap-3 border-bottom py-3 flex-wrap" style={{ borderColor: 'var(--iro-border)' }}>
              <div className="text-center" style={{ minWidth: 64 }}>
                <div className="font-display">{d.heure}</div>
                <div className="text-muted font-mono" style={{ fontSize: '.68rem' }}>{d.jour}</div>
              </div>
              <div className="flex-grow-1">
                <div className="small fw-semibold">{d.client}</div>
                <div className="text-muted font-mono" style={{ fontSize: '.72rem' }}>{d.zone} · {d.contenu}</div>
              </div>
              <StatusBadge status={d.type}>{d.typeLabel}</StatusBadge>
              <StatusBadge status={d.statut}>{d.statutLabel}</StatusBadge>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-4 d-flex flex-column gap-3">
        <div className="glass p-4" style={{ background: 'linear-gradient(120deg, rgba(123,92,255,.16), rgba(77,124,255,.12))' }}>
          <div className="eyebrow mb-2">Tournée groupée</div>
          <div className="font-display fs-5 mb-1">Zone Plateau</div>
          <p className="text-muted small mb-3">4 livraisons · 12 km · départ 15:00</p>
          <button type="button" className="btn btn-light w-100">Voir l'itinéraire</button>
        </div>

        <div className="glass p-3">
          <div className="eyebrow mb-3">Statuts du jour</div>
          {todayStatusCounts.map((s) => (
            <div key={s.label} className="d-flex align-items-center justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle" style={{ width: 10, height: 10, background: s.color }}></span>
                <span className="small">{s.label}</span>
              </div>
              <span className="font-display">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
