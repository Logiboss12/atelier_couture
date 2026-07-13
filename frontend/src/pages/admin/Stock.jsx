import { Link } from 'react-router-dom'
import TextileTile from '../../components/TextileTile.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { useFetch } from '../../api/useFetch.js'
import { getStockKpis, getReorderAlerts, getFabricStocks, getFinishedStock, getStockMovements } from '../../api/stock.js'

function Gauge({ niveau, badge }) {
  const color = badge === 'ok' ? 'var(--iro-green)' : badge === 'warn' ? 'var(--iro-orange)' : 'var(--iro-red)'
  return (
    <div className="progress" style={{ height: 6 }}>
      <div className="progress-bar rounded-pill" style={{ width: `${niveau}%`, background: color }}></div>
    </div>
  )
}

function StockList({ title, items }) {
  return (
    <div className="glass p-3 h-100">
      <div className="eyebrow mb-3">{title}</div>
      {items.map((it) => (
        <div key={it.id} className="d-flex align-items-center gap-3 border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
          <TextileTile variant={it.tile.replace('tile-', '')} style={{ width: 40, height: 40, flexShrink: 0 }} />
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between">
              <span className="small fw-semibold">{it.nom}</span>
              <span className="font-mono small text-muted">{it.quantite}</span>
            </div>
            <Gauge niveau={it.niveau} badge={it.badge} />
          </div>
          <StatusBadge status={it.badge}>{it.statut}</StatusBadge>
        </div>
      ))}
    </div>
  )
}

export default function Stock() {
  const { data: stockKpis, loading: loadingKpis } = useFetch(getStockKpis, [])
  const { data: reorderAlerts, loading: loadingAlerts } = useFetch(getReorderAlerts, [])
  const { data: fabricStock, loading: loadingFabric } = useFetch(getFabricStocks, [])
  const { data: finishedStock, loading: loadingFinished } = useFetch(getFinishedStock, [])
  const { data: stockMovements, loading: loadingMovements } = useFetch(getStockMovements, [])

  if (loadingKpis || loadingAlerts || loadingFabric || loadingFinished || loadingMovements
    || !stockKpis || !reorderAlerts || !fabricStock || !finishedStock || !stockMovements) {
    return <p className="text-muted">Chargement…</p>
  }

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Link to="/admin/stocks/entree" className="btn-iro btn">
          <i className="bi bi-plus-lg me-1"></i>Nouvelle entrée en stock
        </Link>
      </div>

      <div className="row row-cols-2 row-cols-md-4 g-3 mb-3">
        {stockKpis.map((k) => (
          <div className="col" key={k.label}>
            <div className="glass p-3 h-100">
              <i className={`bi ${k.icon} fs-5 mb-2 d-block`} style={{ color: 'var(--iro-orange)' }}></i>
              <div className="font-display fs-4">{k.valeur}</div>
              <div className="eyebrow mt-1">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-3 mb-3" style={{ background: 'linear-gradient(120deg, rgba(255,93,108,.14), rgba(255,138,61,.1))', border: '1px solid rgba(255,93,108,.35)' }}>
        <div className="eyebrow mb-3">Réapprovisionnement conseillé</div>
        {reorderAlerts.map((r) => (
          <div key={r.id} className="d-flex align-items-center gap-3 border-bottom py-2" style={{ borderColor: 'rgba(255,255,255,.12)' }}>
            <TextileTile variant={r.tile.replace('tile-', '')} style={{ width: 40, height: 40, flexShrink: 0 }} />
            <div className="flex-grow-1">
              <div className="small fw-semibold">{r.nom}</div>
              <div className="text-muted small">{r.reste}</div>
            </div>
            <StatusBadge status={r.statut}>{r.statut === 'danger' ? 'Rupture proche' : 'Bas'}</StatusBadge>
            <button type="button" className="btn btn-light btn-sm">Commander</button>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-6"><StockList title="Stock tissus & matières" items={fabricStock} /></div>
        <div className="col-12 col-lg-6"><StockList title="Stock articles finis" items={finishedStock} /></div>
      </div>

      <div className="glass p-3">
        <div className="eyebrow mb-3">Mouvements de stock</div>
        {stockMovements.map((m) => (
          <div key={m.id} className="d-flex align-items-center gap-3 border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
            <i className={`bi ${m.type === 'in' ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle'}`} style={{ color: m.type === 'in' ? 'var(--iro-green)' : 'var(--iro-red)' }}></i>
            <div className="flex-grow-1">
              <div className="small">{m.label}</div>
              <div className="text-muted font-mono" style={{ fontSize: '.7rem' }}>{m.date}</div>
            </div>
            <span className="font-mono fw-semibold" style={{ color: m.type === 'in' ? 'var(--iro-green)' : 'var(--iro-red)' }}>{m.quantite}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
