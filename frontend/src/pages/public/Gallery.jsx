import { useState } from 'react'
import { Link } from 'react-router-dom'
import { galleryCategories } from '../../mock/gallery.js'
import { photos } from '../../assets/images/index.js'
export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('Tout')

  const galleryItems = [
    { id: 'g1', nom: 'Boubou Wax Impérial', categorie: 'Grand boubou', tile: 'tile-wax', image: photos.images7, description: 'Un grand boubou sculpté dans un wax profond, pensé pour un impact visuel fort et une élégance intemporelle.' },
    { id: 'g2', nom: 'Tailleur Bazin Riche', categorie: 'Tailleur', tile: 'tile-bazin', image: photos.costume3, description: 'Un tailleur sobre et luxueux en bazin, alliant coupe raffinée et matière soyeuse.' },
    { id: 'g3', nom: 'Robe Dentelle Étoile', categorie: 'Robe de mariée', tile: 'tile-dentelle', image: photos.images2, description: 'Une robe de mariée délicate, entre transparence, broderie et lumière sculptée.' },
    { id: 'g4', nom: 'Ensemble Kente Prestige', categorie: 'Grand boubou', tile: 'tile-kente', image: photos.images10, description: 'Un ensemble haut de gamme où le kente s’exprime avec une énergie chromatique et une noblesse affirmée.' },
    { id: 'g5', nom: 'Costume Indigo Nuit', categorie: 'Tailleur', tile: 'tile-indigo', image: photos.costume1, description: 'Un costume d’après-midi et de soirée, conçu pour le glamour discret et le chic contemporain.' },
    { id: 'g6', nom: 'Robe Soie Duchesse', categorie: 'Prêt-à-porter', tile: 'tile-soie', image: photos.images9, description: 'Une robe prêt-à-porter au drapé fluide, pensée pour la modernité avec une touche de luxe.' },
    { id: 'g7', nom: 'Veste Jacquard Horizon', categorie: 'Tailleur', tile: 'tile-jacquard', image: photos.images1, description: 'Une veste structurée en jacquard, idéale pour des looks à la fois puissants et raffinés.' },
    { id: 'g8', nom: 'Boubou Hibiscus Enfant', categorie: 'Enfant', tile: 'tile-hibiscus', image: photos.images4, description: 'Une pièce légère et joyeuse, conçue pour les occasions festives avec une touche de couleur.' },
    { id: 'g9', nom: 'Robe de mariée Kente & Dentelle', categorie: 'Robe de mariée', tile: 'tile-kente', image: photos.images3, description: 'Une création de cérémonie où le kente rencontre la dentelle pour un mariage plein de caractère.' },
    { id: 'g10', nom: 'Ensemble Wax Prêt-à-porter', categorie: 'Prêt-à-porter', tile: 'tile-wax', image: photos.images5, description: 'Un look accessible mais soigné, pensé pour une présence affirmée au quotidien comme en soirée.' },
    { id: 'g11', nom: 'Costume Enfant Bazin', categorie: 'Enfant', tile: 'tile-bazin', image: photos.costume2, description: 'Une tenue enfantine élégante, confortable et pleine de douceur pour les grands rendez-vous.' },
    { id: 'g12', nom: 'Grand boubou Jacquard', categorie: 'Grand boubou', tile: 'tile-jacquard', image: photos.images6, description: 'Une pièce majestueuse qui mêle tradition, texture et présence visuelle à chaque mouvement.' },
  ]

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
                  <img src={galleryItems[0]?.image} alt={galleryItems[0]?.nom} className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                </div>
              </div>
              <div className="col-6">
                <div className="ratio ratio-1x1 rounded-3 overflow-hidden">
                  <img src={galleryItems[3]?.image} alt={galleryItems[3]?.nom} className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                </div>
              </div>
              <div className="col-12">
                <div className="glass p-3 rounded-3" style={{ background: 'rgba(255,255,255,.05)' }}>
                  <div className="font-display fs-5">Échantillon d’inspiration</div>
                  <p className="text-muted small mb-3 mt-2">
                    Chaque image illustre notre approche : des formes affirmées, des détails travaillés et
                    une élégance qui transcende les tendances.
                  </p>
                  <Link to="/sur-mesure" className="btn-iro btn">Commencer votre projet</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="glass p-3 p-md-4 rounded-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <span className="eyebrow">Collections</span>
            <h2 className="display-6 mt-2 mb-1">Choisissez votre univers</h2>
            <p className="text-muted mb-0">Affinez votre sélection par catégorie et explorez nos pièces les plus inspirantes.</p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            {galleryCategories.map((cat) => (
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
        </div>
      </section>

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {filtered.map((item) => (
          <div className="col" key={item.id}>
            <article className="glass hover-lift h-100 overflow-hidden">
              <div className="position-relative">
                <div className="ratio ratio-4x5 overflow-hidden">
                  <img src={item.image} alt={item.nom} className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} />
                </div>
                <div className="position-absolute top-0 start-0 p-3">
                  <span className="status neutral">{item.categorie}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="font-display fs-5">{item.nom}</div>
                <p className="text-muted small mt-2 mb-3">{item.description}</p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge rounded-pill" style={{ background: 'rgba(255,138,61,.16)', color: 'var(--iro-orange)', border: '1px solid rgba(255,138,61,.25)' }}>{item.categorie}</span>
                  <span className="badge rounded-pill" style={{ background: 'rgba(123,92,255,.16)', color: 'var(--iro-text)', border: '1px solid rgba(123,92,255,.25)' }}>Sur-mesure</span>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      <section className="glass text-center p-4 p-md-5 rounded-4 mt-5" style={{ background: 'linear-gradient(120deg, rgba(255,138,61,.12), rgba(255,77,141,.12) 60%, rgba(123,92,255,.12))' }}>
        <span className="eyebrow">Envie d’une pièce unique ?</span>
        <h2 className="display-6 mt-2 mb-3">Réservez votre session de création</h2>
        <p className="text-muted mb-4">Rencontrons-nous à Dakar ou Paris pour imaginer ensemble votre prochaine tenue.</p>
        <Link to="/sur-mesure" className="btn-iro btn btn-lg">Réserver maintenant</Link>
      </section>
    </div>
  )
}
