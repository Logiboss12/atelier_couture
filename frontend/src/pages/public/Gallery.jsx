import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import TextileTile from '../../components/TextileTile.jsx'
import { useFetch } from '../../api/useFetch.js'
import { getProducts } from '../../api/catalog.js'
import { getTextiles } from '../../api/textiles.js'

const TYPE_LABELS = { vetement: 'Vêtements', mercerie: 'Mercerie', tissu: 'Tissus' }

export default function Gallery() {
  const [activeType, setActiveType] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Tout')
  const { data: products, loading: loadingProducts } = useFetch(getProducts, [])
  const { data: textiles, loading: loadingTextiles } = useFetch(getTextiles, [])
  const loading = loadingProducts || loadingTextiles

  const published = useMemo(() => (products || []).filter((p) => p.publie !== false), [products])
  const publishedTextiles = useMemo(() => (textiles || []).filter((t) => t.publie !== false), [textiles])
  const types = useMemo(() => [...new Set(published.map((p) => p.type).filter(Boolean))], [published])
  const isTissu = activeType === 'tissu'

  const galleryItems = useMemo(() => {
    if (isTissu) {
      return publishedTextiles.map((t) => ({
        id: `textile-${t.dbId}`, nom: t.nom, categorie: t.origine, image: t.image, tissu: t.id, isTextile: true,
      }))
    }
    return published.filter((p) => !activeType || p.type === activeType)
  }, [isTissu, publishedTextiles, published, activeType])

  const categories = useMemo(
    () => ['Tout', ...new Set(galleryItems.map((g) => g.categorie).filter(Boolean))],
    [galleryItems]
  )

  const handleTypeChange = (t) => {
    setActiveType(activeType === t ? null : t)
    setActiveCategory('Tout')
  }

  const filtered = activeCategory === 'Tout'
    ? galleryItems
    : galleryItems.filter((g) => g.categorie === activeCategory)

  return (
    <div className="container py-4 py-lg-5">
      <section className="row align-items-center g-4 g-lg-5 mb-5">
        <div className="col-12 col-lg-7">
          <span className="eyebrow">Galerie</span>
          <h1 className="display-4 mt-3">Le meilleur de nos ateliers, capturé en images</h1>
          <p className="lead text-muted mt-3">
            Découvrez nos réalisations sur-mesure : du grand boubou aux tailleurs structurés,
            en passant par des robes de mariée et des pièces enfantines pleines de caractère.
          </p>
          <div className="d-flex flex-wrap gap-2 mt-4">
            {['Coupe précise', 'Matières nobles', 'Finitions main', 'Dakar · Paris'].map((tag) => (
              <span key={tag} className="badge rounded-pill" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--iro-border)', color: 'var(--iro-text)' }}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="glass p-3 p-md-4 rounded-4">
            <div className="row g-3">
              <div className="col-6">
                <div className="ratio ratio-1x1 rounded-3 overflow-hidden">
                  {galleryItems[0]?.image ? (
                    <img src={galleryItems[0].image} alt={galleryItems[0]?.nom} className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                  ) : (
                    <TextileTile variant={galleryItems[0]?.tissu} className="w-100 h-100 rounded-0" />
                  )}
                </div>
              </div>
              <div className="col-6">
                <div className="ratio ratio-1x1 rounded-3 overflow-hidden">
                  {galleryItems[1]?.image ? (
                    <img src={galleryItems[1].image} alt={galleryItems[1]?.nom} className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                  ) : (
                    <TextileTile variant={galleryItems[1]?.tissu} className="w-100 h-100 rounded-0" />
                  )}
                </div>
              </div>
              <div className="col-12">
                <div className="glass p-3 rounded-3" style={{ background: 'rgba(255,255,255,.05)' }}>
                  <div className="font-display fs-5">Échantillon d'inspiration</div>
                  <p className="text-muted small mb-3 mt-2">
                    Chaque image illustre notre approche : des formes affirmées, des détails travaillés et
                    une élégance qui transcende les tendances.
                  </p>
                  <Link to="/espace-client" className="btn-iro btn">Commencer votre projet</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="glass p-3 p-md-4 rounded-4 mb-4">
        <div>
          <span className="eyebrow">Collections</span>
          <h2 className="display-6 mt-2 mb-1">Choisissez votre univers</h2>
          <p className="text-muted mb-0">Affinez votre sélection par catégorie et explorez nos pièces les plus inspirantes.</p>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          <button
            type="button" className={`btn btn-sm ${!activeType ? 'btn-iro' : 'btn-ghost'}`}
            onClick={() => handleTypeChange(null)}
          >
            Tout
          </button>
          {types.map((t) => (
            <button
              key={t} type="button" className={`btn btn-sm ${activeType === t ? 'btn-iro' : 'btn-ghost'}`}
              onClick={() => handleTypeChange(t)}
            >
              {TYPE_LABELS[t] || t}
            </button>
          ))}
          {publishedTextiles.length > 0 && (
            <button
              type="button" className={`btn btn-sm ${isTissu ? 'btn-iro' : 'btn-ghost'}`}
              onClick={() => handleTypeChange('tissu')}
            >
              Tissus
            </button>
          )}
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn rounded-pill ${activeCategory === cat ? 'btn-iro' : 'btn-ghost btn-sm'}`}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {loading && <p className="text-muted">Chargement…</p>}

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {filtered.map((item) => (
          <div className="col" key={item.id}>
            <article className="glass hover-lift h-100 overflow-hidden">
              <div className="position-relative">
                <div className="ratio ratio-4x5 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.nom} className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                  ) : (
                    <TextileTile variant={item.tissu} className="w-100 h-100 rounded-0" />
                  )}
                </div>
                <div className="position-absolute top-0 start-0 p-3">
                  <span className="status neutral">{item.categorie || 'Création'}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="font-display fs-5">{item.nom}</div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {item.categorie && (
                    <span className="badge rounded-pill" style={{ background: 'rgba(255,138,61,.16)', color: 'var(--iro-orange)', border: '1px solid rgba(255,138,61,.25)' }}>{item.categorie}</span>
                  )}
                  <span className="badge rounded-pill" style={{ background: 'rgba(123,92,255,.16)', color: 'var(--iro-text)', border: '1px solid rgba(123,92,255,.25)' }}>{item.isTextile ? 'Matière' : 'Sur-mesure'}</span>
                </div>
              </div>
            </article>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-muted">Aucune création dans cette catégorie pour le moment.</p>
        )}
      </div>

      <section className="glass text-center p-4 p-md-5 rounded-4 mt-5" style={{ background: 'linear-gradient(120deg, rgba(255,138,61,.12), rgba(255,77,141,.12) 60%, rgba(123,92,255,.12))' }}>
        <span className="eyebrow">Envie d'une pièce unique ?</span>
        <h2 className="display-6 mt-2 mb-3">Réservez votre session de création</h2>
        <p className="text-muted mb-4">Rencontrons-nous à Dakar ou Paris pour imaginer ensemble votre prochaine tenue.</p>
        <Link to="/espace-client" className="btn-iro btn btn-lg">Réserver maintenant</Link>
      </section>
    </div>
  )
}
