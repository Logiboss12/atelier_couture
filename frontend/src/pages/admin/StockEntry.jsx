import { useState } from 'react'
import { Link } from 'react-router-dom'
import { textiles } from '../../mock/textiles.js'
import { products } from '../../mock/catalog.js'
import { recentEntries } from '../../mock/stock.js'

export default function StockEntry() {
  const [type, setType] = useState('tissu')
  const [item, setItem] = useState(null)
  const [validated, setValidated] = useState(false)

  const unite = type === 'tissu' ? 'm' : 'unités'
  const items = type === 'tissu' ? textiles.map((t) => t.nom) : products.map((p) => p.nom)

  return (
    <div>
      <div className="mb-3">
        <Link to="/admin/stocks" className="btn-ghost btn btn-sm"><i className="bi bi-arrow-left me-2"></i>Retour à l'inventaire</Link>
        <h1 className="font-display fs-3 mt-3 mb-0">Entrée en stock</h1>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="glass p-4">
            <div className="eyebrow mb-2">Type d'élément</div>
            <div className="btn-group w-100 mb-3" role="group">
              {[{ id: 'tissu', label: 'Tissu / Matière' }, { id: 'article', label: 'Article fini' }].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="btn flex-fill"
                  style={{
                    background: type === t.id ? 'var(--iro-grad)' : 'rgba(255,255,255,.06)',
                    color: type === t.id ? '#160a12' : 'var(--iro-text)',
                    border: '1px solid var(--iro-border)',
                  }}
                  onClick={() => { setType(t.id); setItem(null) }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="eyebrow mb-2">Élément concerné</div>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {items.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="badge rounded-pill border-0"
                  style={{
                    padding: '.5rem .8rem', cursor: 'pointer',
                    background: item === name ? 'var(--iro-grad)' : 'rgba(255,255,255,.06)',
                    color: item === name ? '#160a12' : 'var(--iro-text)',
                  }}
                  onClick={() => setItem(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="row row-cols-1 row-cols-md-2 g-3">
              <div className="col">
                <label className="font-mono small d-block mb-1">Quantité reçue</label>
                <div className="input-group">
                  <input type="number" className="form-control" placeholder="0" />
                  <span className="input-group-text" style={{ background: 'rgba(0,0,0,.25)', border: '1px solid var(--iro-border)', color: 'var(--iro-text)' }}>{unite}</span>
                </div>
              </div>
              <div className="col">
                <label className="font-mono small d-block mb-1">Date de réception</label>
                <input type="date" className="form-control" defaultValue="2026-07-13" />
              </div>
              <div className="col">
                <label className="font-mono small d-block mb-1">Fournisseur</label>
                <input type="text" className="form-control" placeholder="Nom du fournisseur" />
              </div>
              <div className="col">
                <label className="font-mono small d-block mb-1">Coût unitaire (F)</label>
                <input type="number" className="form-control" placeholder="0" />
              </div>
              <div className="col">
                <label className="font-mono small d-block mb-1">N° bon de livraison</label>
                <input type="text" className="form-control" placeholder="BL-0000" />
              </div>
              <div className="col">
                <label className="font-mono small d-block mb-1">Emplacement</label>
                <input type="text" className="form-control" placeholder="Ex. Réserve A" />
              </div>
            </div>

            <label className="font-mono small d-block mt-3 mb-1">Note</label>
            <textarea className="form-control" rows={3} placeholder="Observations sur la réception…"></textarea>
          </div>
        </div>

        <div className="col-12 col-lg-4 d-flex flex-column gap-3">
          <div className="glass p-4" style={{ background: 'linear-gradient(120deg, rgba(41,193,126,.14), rgba(77,124,255,.1))' }}>
            <div className="eyebrow mb-3">Récapitulatif</div>
            <div className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'rgba(255,255,255,.12)' }}><span className="text-muted">Type</span><span>{type === 'tissu' ? 'Tissu / Matière' : 'Article fini'}</span></div>
            <div className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'rgba(255,255,255,.12)' }}><span className="text-muted">Unité</span><span className="font-mono">{unite}</span></div>
            <div className="d-flex justify-content-between py-2"><span className="text-muted">Mouvement</span><span style={{ color: 'var(--iro-green)' }}>Entrée +</span></div>
            <button type="button" className="btn w-100 mt-2" style={{ background: 'var(--iro-green)', color: '#0a2b1c' }} onClick={() => setValidated(true)} disabled={!item}>
              Valider l'entrée en stock
            </button>
            {validated && <div className="status ok mt-2 d-block text-center">Entrée enregistrée ✓</div>}
          </div>

          <div className="glass p-3">
            <div className="eyebrow mb-3">Entrées récentes</div>
            {recentEntries.map((e) => (
              <div key={e.id} className="d-flex align-items-center gap-2 border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                <i className="bi bi-arrow-down-circle" style={{ color: 'var(--iro-green)' }}></i>
                <div className="flex-grow-1">
                  <div className="small">{e.label}</div>
                  <div className="text-muted font-mono" style={{ fontSize: '.68rem' }}>{e.meta}</div>
                </div>
                <span className="font-mono small" style={{ color: 'var(--iro-green)' }}>{e.quantite}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
