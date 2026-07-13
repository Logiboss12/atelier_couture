import { useMemo, useState } from 'react'
import TextileTile from '../../components/TextileTile.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { shopFilters, shopProducts } from '../../mock/shop.js'

const stockLabel = { ok: 'En stock', warn: 'Stock bas', danger: 'Rupture' }

export default function Shop() {
  const cart = useCart()
  const [categorie, setCategorie] = useState(null)
  const [taille, setTaille] = useState(null)
  const [maxPrix, setMaxPrix] = useState(650000)

  const filtered = useMemo(() => shopProducts.filter((p) =>
    (!categorie || p.categorie === categorie) &&
    (!taille || p.tailles.includes(taille)) &&
    p.prix <= maxPrix
  ), [categorie, taille, maxPrix])

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <span className="eyebrow">Boutique</span>
          <h1 className="display-4 mt-2 mb-0">Prêt-à-porter</h1>
        </div>
        <span className="btn-ghost btn btn-sm position-relative">
          <i className="bi bi-bag me-1"></i> Panier
          {cart.count > 0 && <span className="badge rounded-pill ms-2" style={{ background: 'var(--iro-magenta)' }}>{cart.count}</span>}
        </span>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-3">
          <div className="glass p-3 d-none d-lg-block" style={{ position: 'sticky', top: '6.5rem' }}>
            <FiltersBody
              categorie={categorie} setCategorie={setCategorie}
              taille={taille} setTaille={setTaille}
              maxPrix={maxPrix} setMaxPrix={setMaxPrix}
            />
          </div>

          <div className="d-lg-none">
            <button className="btn btn-ghost w-100 mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#shopFilters">
              <i className="bi bi-sliders me-2"></i>Filtres
            </button>
            <div className="collapse glass p-3" id="shopFilters">
              <FiltersBody
                categorie={categorie} setCategorie={setCategorie}
                taille={taille} setTaille={setTaille}
                maxPrix={maxPrix} setMaxPrix={setMaxPrix}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-9">
          <div className="row row-cols-2 row-cols-lg-3 g-3">
            {filtered.map((p) => (
              <div className="col" key={p.id}>
                <div className="glass h-100 overflow-hidden">
                  <div className="position-relative">
                    <TextileTile variant={p.tile.replace('tile-', '')} image={p.image} className="ratio ratio-1x1 rounded-0"></TextileTile>
                    <span className="position-absolute top-0 start-0 m-2">
                      <StatusBadge status={p.stock}>{stockLabel[p.stock]}</StatusBadge>
                    </span>
                  </div>
                  <div className="card-body p-3">
                    <div className="fw-semibold">{p.nom}</div>
                    <div className="font-mono text-muted small">{p.categorie}</div>
                    <div className="d-flex gap-1 my-2">
                      {p.couleurs.map((c, i) => (
                        <span key={i} className="swatch-dot" style={{ background: c }}></span>
                      ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="font-display">{p.prix.toLocaleString('fr-FR')} F</span>
                      <button
                        type="button"
                        className="btn-iro btn btn-sm"
                        onClick={() => cart.addItem(p)}
                        disabled={p.stock === 'danger'}
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-muted">Aucun article ne correspond à ces filtres.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FiltersBody({ categorie, setCategorie, taille, setTaille, maxPrix, setMaxPrix }) {
  return (
    <>
      <div className="mb-3">
        <div className="eyebrow mb-2">Catégorie</div>
        <div className="d-flex flex-wrap gap-2">
          {shopFilters.categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`badge rounded-pill border-0 ${categorie === c ? '' : ''}`}
              style={{
                padding: '.5rem .8rem', cursor: 'pointer',
                background: categorie === c ? 'var(--iro-grad)' : 'rgba(255,255,255,.06)',
                color: categorie === c ? '#160a12' : 'var(--iro-text)',
              }}
              onClick={() => setCategorie(categorie === c ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <div className="eyebrow mb-2">Taille</div>
        <div className="d-flex flex-wrap gap-2">
          {shopFilters.tailles.map((t) => (
            <button
              key={t}
              type="button"
              className="badge rounded-pill border-0"
              style={{
                padding: '.5rem .8rem', cursor: 'pointer',
                background: taille === t ? 'var(--iro-grad)' : 'rgba(255,255,255,.06)',
                color: taille === t ? '#160a12' : 'var(--iro-text)',
              }}
              onClick={() => setTaille(taille === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <div className="eyebrow mb-2">Couleur</div>
        <div className="d-flex flex-wrap gap-2">
          {shopFilters.couleurs.map((c) => (
            <span key={c.id} className="swatch-dot" style={{ background: c.hex, width: 22, height: 22 }}></span>
          ))}
        </div>
      </div>
      <div>
        <div className="eyebrow mb-2">Prix max : {maxPrix.toLocaleString('fr-FR')} F</div>
        <input
          type="range" className="form-range" min="50000" max="650000" step="10000"
          value={maxPrix} onChange={(e) => setMaxPrix(Number(e.target.value))}
        />
      </div>
    </>
  )
}
