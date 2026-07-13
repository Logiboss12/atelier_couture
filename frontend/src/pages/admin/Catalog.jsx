import TextileTile from '../../components/TextileTile.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { collections, products } from '../../mock/catalog.js'

export default function Catalog() {
  return (
    <div>
      <div className="eyebrow mb-2">Collections</div>
      <div className="d-flex gap-3 overflow-auto pb-2 mb-4">
        {collections.map((c) => (
          <div key={c.id} className="glass flex-shrink-0 overflow-hidden" style={{ width: 190 }}>
            <TextileTile variant={c.tile.replace('tile-', '')} className="ratio ratio-16x9 rounded-0"></TextileTile>
            <div className="p-2">
              <div className="fw-semibold small">{c.nom}</div>
              <div className="text-muted font-mono" style={{ fontSize: '.7rem' }}>{c.articles} articles</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-3">
        <div className="eyebrow mb-3">Articles</div>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr className="text-muted small">
                <th>Article</th>
                <th>Variantes</th>
                <th>Stock</th>
                <th>Prix</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <TextileTile variant={p.tissu} style={{ width: 40, height: 40, flexShrink: 0 }} />
                      <div>
                        <div className="small fw-semibold">{p.nom}</div>
                        <div className="font-mono text-muted" style={{ fontSize: '.7rem' }}>{p.collection}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.variantes}</td>
                  <td style={{ color: p.statut === 'danger' ? 'var(--iro-red)' : p.statut === 'warn' ? 'var(--iro-orange)' : 'var(--iro-green)' }}>
                    {p.stock}
                  </td>
                  <td className="font-display">{p.prix.toLocaleString('fr-FR')} F</td>
                  <td><StatusBadge status={p.publie ? 'ok' : 'warn'}>{p.publie ? 'Publié' : 'Brouillon'}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
