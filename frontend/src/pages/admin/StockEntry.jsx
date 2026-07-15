import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFetch } from '../../api/useFetch.js'
import { getProducts } from '../../api/catalog.js'
import { getFabricStocks, getRecentEntries, createStockMovement } from '../../api/stock.js'

export default function StockEntry() {
  const [type, setType] = useState('tissu')
  const [itemId, setItemId] = useState('')
  const [quantite, setQuantite] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [fournisseur, setFournisseur] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [validated, setValidated] = useState(false)

  const { data: fabricStocks, loading: loadingFabric } = useFetch(getFabricStocks, [refreshKey])
  const { data: products, loading: loadingProducts } = useFetch(getProducts, [refreshKey])
  const { data: recentEntries, loading: loadingEntries } = useFetch(getRecentEntries, [refreshKey])

  if (loadingFabric || loadingProducts || loadingEntries || !fabricStocks || !products || !recentEntries) {
    return <p className="text-muted">Chargement…</p>
  }

  const unite = type === 'tissu' ? 'm' : 'unités'
  const items = type === 'tissu' ? fabricStocks : products
  const selectedItem = items.find((it) => String(it.id) === String(itemId))

  const handleTypeChange = (t) => {
    setType(t)
    setItemId('')
    setValidated(false)
  }

  const handleSubmit = async () => {
    if (!selectedItem || !quantite) return
    setSaving(true)
    setError(null)
    try {
      await createStockMovement({
        type: 'in',
        label: `Reception ${selectedItem.nom}`,
        quantite_valeur: Number(quantite),
        quantite_unite: unite,
        fournisseur: fournisseur || null,
        date,
        fabric_stock_id: type === 'tissu' ? selectedItem.id : null,
        product_id: type === 'article' ? selectedItem.id : null,
      })
      setValidated(true)
      setQuantite('')
      setFournisseur('')
      setItemId('')
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

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
                  onClick={() => handleTypeChange(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="eyebrow mb-2">Élément concerné</div>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  className="badge rounded-pill border-0"
                  style={{
                    padding: '.5rem .8rem', cursor: 'pointer',
                    background: String(itemId) === String(it.id) ? 'var(--iro-grad)' : 'rgba(255,255,255,.06)',
                    color: String(itemId) === String(it.id) ? '#160a12' : 'var(--iro-text)',
                  }}
                  onClick={() => setItemId(it.id)}
                >
                  {it.nom}
                </button>
              ))}
              {items.length === 0 && <p className="text-muted small mb-0">Aucun élément disponible.</p>}
            </div>

            <div className="row row-cols-1 row-cols-md-2 g-3">
              <div className="col">
                <label className="font-mono small d-block mb-1">Quantité reçue</label>
                <div className="input-group">
                  <input type="number" className="form-control" placeholder="0" value={quantite} onChange={(e) => setQuantite(e.target.value)} min="0" />
                  <span className="input-group-text" style={{ background: 'rgba(0,0,0,.25)', border: '1px solid var(--iro-border)', color: 'var(--iro-text)' }}>{unite}</span>
                </div>
              </div>
              <div className="col">
                <label className="font-mono small d-block mb-1">Date de réception</label>
                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="col">
                <label className="font-mono small d-block mb-1">Fournisseur</label>
                <input type="text" className="form-control" placeholder="Nom du fournisseur" value={fournisseur} onChange={(e) => setFournisseur(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4 d-flex flex-column gap-3">
          <div className="glass p-4" style={{ background: 'linear-gradient(120deg, rgba(41,193,126,.14), rgba(77,124,255,.1))' }}>
            <div className="eyebrow mb-3">Récapitulatif</div>
            <div className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'rgba(255,255,255,.12)' }}><span className="text-muted">Type</span><span>{type === 'tissu' ? 'Tissu / Matière' : 'Article fini'}</span></div>
            <div className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'rgba(255,255,255,.12)' }}><span className="text-muted">Élément</span><span>{selectedItem?.nom || '—'}</span></div>
            <div className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'rgba(255,255,255,.12)' }}><span className="text-muted">Unité</span><span className="font-mono">{unite}</span></div>
            <div className="d-flex justify-content-between py-2"><span className="text-muted">Mouvement</span><span style={{ color: 'var(--iro-green)' }}>Entrée +</span></div>
            {error && <div className="status danger p-2 mt-2 small">{error}</div>}
            <button type="button" className="btn w-100 mt-2" style={{ background: 'var(--iro-green)', color: '#0a2b1c' }} onClick={handleSubmit} disabled={!itemId || !quantite || saving}>
              {saving ? 'Enregistrement…' : "Valider l'entrée en stock"}
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
            {recentEntries.length === 0 && <p className="text-muted small mb-0">Aucune entrée récente.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
