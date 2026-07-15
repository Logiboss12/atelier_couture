import { useState } from 'react'
import TextileTile from '../../components/TextileTile.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { useFetch } from '../../api/useFetch.js'
import {
  getCollections, getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage,
} from '../../api/catalog.js'
import { getTextilesAdmin, createTextile, updateTextile, deleteTextile, uploadTextileImage } from '../../api/textiles.js'

const TILE_OPTIONS = ['wax', 'kente', 'indigo', 'hibiscus', 'bazin', 'jacquard', 'dentelle', 'soie']

const tabs = [
  { id: 'vetement', label: 'Vêtements', icon: 'bi-person-standing-dress' },
  { id: 'mercerie', label: 'Mercerie', icon: 'bi-scissors' },
  { id: 'tissu', label: 'Tissus', icon: 'bi-layers' },
]

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

export default function Catalog() {
  const [tab, setTab] = useState('vetement')
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: collections, loading: loadingCollections } = useFetch(getCollections, [refreshKey])
  const { data: products, loading: loadingProducts } = useFetch(getProducts, [refreshKey])
  const { data: textiles, loading: loadingTextiles } = useFetch(getTextilesAdmin, [refreshKey])

  const refresh = () => setRefreshKey((k) => k + 1)

  if (loadingCollections || loadingProducts || loadingTextiles || !collections || !products || !textiles) {
    return <p className="text-muted">Chargement…</p>
  }

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

      <div className="d-flex gap-2 mb-3">
        {tabs.map((t) => (
          <button
            key={t.id} type="button"
            className={`btn btn-sm ${tab === t.id ? 'btn-iro' : 'btn-ghost'}`}
            onClick={() => setTab(t.id)}
          >
            <i className={`bi ${t.icon} me-1`}></i>{t.label}
          </button>
        ))}
      </div>

      {tab === 'tissu' ? (
        <TissusPanel textiles={textiles} onChanged={refresh} />
      ) : (
        <ProductsPanel
          type={tab}
          products={products.filter((p) => p.type === tab)}
          collections={collections}
          textiles={textiles}
          onChanged={refresh}
        />
      )}
    </div>
  )
}

function ProductsPanel({ type, products, collections, textiles, onChanged }) {
  const [editing, setEditing] = useState(undefined) // undefined = closed, null = create, object = edit

  const handleClose = () => setEditing(undefined)
  const handleSaved = () => { setEditing(undefined); onChanged() }

  const handleDelete = async (product) => {
    if (!confirm(`Supprimer « ${product.nom} » ?`)) return
    await deleteProduct(product.id)
    onChanged()
  }

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button type="button" className="btn-iro btn btn-sm" onClick={() => setEditing(null)}>
          <i className="bi bi-plus-lg me-1"></i>{type === 'vetement' ? 'Ajouter un vêtement' : 'Ajouter un article de mercerie'}
        </button>
      </div>

      {editing !== undefined && (
        <ProductForm
          type={type}
          product={editing}
          collections={collections}
          textiles={textiles}
          onSaved={handleSaved}
          onCancel={handleClose}
        />
      )}

      <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
        {products.map((p) => (
          <div className="col" key={p.id}>
            <div className="glass h-100 overflow-hidden">
              <div className="position-relative">
                {p.image ? (
                  <div className="ratio ratio-1x1">
                    <img src={p.image} alt={p.nom} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  </div>
                ) : (
                  <TextileTile variant={p.tissu} className="ratio ratio-1x1 rounded-0"></TextileTile>
                )}
                <span className="position-absolute top-0 start-0 m-2">
                  <StatusBadge status={p.publie ? 'ok' : 'warn'}>{p.publie ? 'Publié' : 'Brouillon'}</StatusBadge>
                </span>
              </div>
              <div className="p-3">
                <div className="small fw-semibold">{p.nom}</div>
                <div className="text-muted font-mono" style={{ fontSize: '.7rem' }}>{p.categorie || '—'}</div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="font-display">{money(p.prix)}</span>
                  <span className="text-muted small">Stock {p.stock}</span>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <button type="button" className="btn-ghost btn btn-sm flex-grow-1" onClick={() => setEditing(p)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button type="button" className="btn-ghost btn btn-sm flex-grow-1" onClick={() => handleDelete(p)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-muted">Aucun article dans cette catégorie.</p>}
      </div>
    </div>
  )
}

function ProductForm({ type, product, collections, textiles, onSaved, onCancel }) {
  const isEdit = !!product
  const [nom, setNom] = useState(product?.nom ?? '')
  const [categorie, setCategorie] = useState(product?.categorie ?? '')
  const [prix, setPrix] = useState(product?.prix ?? '')
  const [stock, setStock] = useState(product?.stock ?? 0)
  const [collectionId, setCollectionId] = useState(product?.collectionId ?? '')
  const [textileId, setTextileId] = useState(product?.textileId ?? '')
  const [tailles, setTailles] = useState((product?.tailles ?? []).join(', '))
  const [couleurs, setCouleurs] = useState((product?.couleurs ?? []).join(', '))
  const [publie, setPublie] = useState(product?.publie ?? true)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        nom,
        type,
        categorie: categorie || null,
        prix: Number(prix),
        stock: Number(stock) || 0,
        collection_id: collectionId || null,
        textile_id: textileId || null,
        tailles: tailles.split(',').map((t) => t.trim()).filter(Boolean),
        couleurs: couleurs.split(',').map((c) => c.trim()).filter(Boolean),
        publie,
      }

      const saved = isEdit ? await updateProduct(product.id, payload) : await createProduct(payload)

      if (imageFile) {
        await uploadProductImage(saved.id, imageFile)
      }

      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="glass p-4 mb-3" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label className="font-mono small d-block mb-1">Photo</label>
          <div className="border border-2 border-dashed rounded-3 p-3 text-center mb-2" style={{ borderColor: 'var(--iro-border)' }}>
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'cover' }} />
            ) : product?.image ? (
              <img src={product.image} alt={product.nom} style={{ maxWidth: '100%', maxHeight: 120, objectFit: 'cover' }} />
            ) : (
              <i className="bi bi-image fs-2" style={{ color: 'var(--iro-faint)' }}></i>
            )}
          </div>
          <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
        </div>

        <div className="col-12 col-md-8">
          <div className="row g-2">
            <div className="col-12 col-sm-6">
              <label className="font-mono small d-block mb-1">Nom</label>
              <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>
            <div className="col-12 col-sm-6">
              <label className="font-mono small d-block mb-1">{type === 'vetement' ? 'Catégorie (ex. Robe, Tailleur)' : 'Catégorie (ex. Boutons, Fils)'}</label>
              <input type="text" className="form-control" value={categorie} onChange={(e) => setCategorie(e.target.value)} />
            </div>
            <div className="col-6 col-sm-3">
              <label className="font-mono small d-block mb-1">Prix (F)</label>
              <input type="number" className="form-control" value={prix} onChange={(e) => setPrix(e.target.value)} required min="0" />
            </div>
            <div className="col-6 col-sm-3">
              <label className="font-mono small d-block mb-1">Stock</label>
              <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} min="0" />
            </div>
            <div className="col-12 col-sm-6">
              <label className="font-mono small d-block mb-1">Collection</label>
              <select className="form-select" value={collectionId} onChange={(e) => setCollectionId(e.target.value)}>
                <option value="">—</option>
                {collections.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div className="col-12 col-sm-6">
              <label className="font-mono small d-block mb-1">Tissu</label>
              <select className="form-select" value={textileId} onChange={(e) => setTextileId(e.target.value)}>
                <option value="">—</option>
                {textiles.map((t) => <option key={t.id} value={t.id}>{t.nom}</option>)}
              </select>
            </div>
            <div className="col-12 col-sm-6">
              <label className="font-mono small d-block mb-1">Tailles (séparées par virgule)</label>
              <input type="text" className="form-control" placeholder="S, M, L, XL" value={tailles} onChange={(e) => setTailles(e.target.value)} />
            </div>
            <div className="col-12 col-sm-6">
              <label className="font-mono small d-block mb-1">Couleurs (codes hex, séparées par virgule)</label>
              <input type="text" className="form-control" placeholder="#ff8a3d, #160a12" value={couleurs} onChange={(e) => setCouleurs(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="form-check form-switch mt-3">
        <input className="form-check-input" type="checkbox" role="switch" checked={publie} onChange={(e) => setPublie(e.target.checked)} id="product-publie" />
        <label className="form-check-label small" htmlFor="product-publie">Publié (visible sur le site)</label>
      </div>

      {error && (
        <div className="status danger p-3 mt-3">
          <i className="bi bi-exclamation-circle me-2"></i>{error}
        </div>
      )}

      <div className="d-flex gap-2 mt-3">
        <button type="button" className="btn-ghost btn btn-sm" onClick={onCancel}>Annuler</button>
        <button type="submit" className="btn-iro btn btn-sm" disabled={saving}>
          {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer'}
        </button>
      </div>
    </form>
  )
}

function TissusPanel({ textiles, onChanged }) {
  const [editing, setEditing] = useState(undefined)

  const handleDelete = async (textile) => {
    if (!confirm(`Supprimer « ${textile.nom} » ?`)) return
    await deleteTextile(textile.id)
    onChanged()
  }

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button type="button" className="btn-iro btn btn-sm" onClick={() => setEditing(null)}>
          <i className="bi bi-plus-lg me-1"></i>Ajouter un tissu
        </button>
      </div>

      {editing !== undefined && (
        <TextileForm
          textile={editing}
          onSaved={() => { setEditing(undefined); onChanged() }}
          onCancel={() => setEditing(undefined)}
        />
      )}

      <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
        {textiles.map((t) => (
          <div className="col" key={t.id}>
            <div className="glass h-100 overflow-hidden">
              {t.image ? (
                <div className="ratio ratio-16x9">
                  <img src={t.image} alt={t.nom} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </div>
              ) : (
                <TextileTile variant={t.tile.replace('tile-', '')} className="ratio ratio-16x9 rounded-0"></TextileTile>
              )}
              <div className="p-3">
                <div className="small fw-semibold">{t.nom}</div>
                <div className="text-muted font-mono" style={{ fontSize: '.7rem' }}>{t.origine}</div>
                <div className="d-flex gap-2 mt-2">
                  <button type="button" className="btn-ghost btn btn-sm flex-grow-1" onClick={() => setEditing(t)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button type="button" className="btn-ghost btn btn-sm flex-grow-1" onClick={() => handleDelete(t)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {textiles.length === 0 && <p className="text-muted">Aucun tissu enregistré.</p>}
      </div>
    </div>
  )
}

function TextileForm({ textile, onSaved, onCancel }) {
  const isEdit = !!textile
  const [nom, setNom] = useState(textile?.nom ?? '')
  const [slug, setSlug] = useState(textile?.slug ?? '')
  const [origine, setOrigine] = useState(textile?.origine ?? '')
  const [tile, setTile] = useState(textile?.tile?.replace('tile-', '') ?? TILE_OPTIONS[0])
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        nom,
        slug: slug || nom.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        origine: origine || null,
        tile: `tile-${tile}`,
      }
      const saved = isEdit ? await updateTextile(textile.id, payload) : await createTextile(payload)

      if (imageFile) {
        await uploadTextileImage(saved.id, imageFile)
      }

      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="glass p-4 mb-3" onSubmit={handleSubmit}>
      <div className="row g-2">
        <div className="col-12 col-sm-6">
          <label className="font-mono small d-block mb-1">Photo (facultative, remplace le motif visuel)</label>
          <div className="border border-2 border-dashed rounded-3 p-3 text-center mb-2" style={{ borderColor: 'var(--iro-border)' }}>
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'cover' }} />
            ) : textile?.image ? (
              <img src={textile.image} alt={textile.nom} style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'cover' }} />
            ) : (
              <i className="bi bi-image fs-2" style={{ color: 'var(--iro-faint)' }}></i>
            )}
          </div>
          <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
        </div>
        <div className="col-12 col-sm-6">
          <label className="font-mono small d-block mb-1">Nom</label>
          <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div className="col-12 col-sm-6">
          <label className="font-mono small d-block mb-1">Slug (identifiant)</label>
          <input type="text" className="form-control" placeholder="auto-généré si vide" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div className="col-12 col-sm-6">
          <label className="font-mono small d-block mb-1">Origine</label>
          <input type="text" className="form-control" value={origine} onChange={(e) => setOrigine(e.target.value)} />
        </div>
        <div className="col-12 col-sm-6">
          <label className="font-mono small d-block mb-1">Motif visuel</label>
          <select className="form-select" value={tile} onChange={(e) => setTile(e.target.value)}>
            {TILE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="status danger p-3 mt-3">
          <i className="bi bi-exclamation-circle me-2"></i>{error}
        </div>
      )}

      <div className="d-flex gap-2 mt-3">
        <button type="button" className="btn-ghost btn btn-sm" onClick={onCancel}>Annuler</button>
        <button type="submit" className="btn-iro btn btn-sm" disabled={saving}>
          {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer'}
        </button>
      </div>
    </form>
  )
}
