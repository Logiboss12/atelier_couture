import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StepProgress from '../../components/StepProgress.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { checkout } from '../../api/me.js'

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

const wizardSteps = ['Panier', 'Livraison', 'Paiement', 'Aperçu']

const paymentMethods = [
  { id: 'carte', label: 'Carte bancaire', icon: 'bi-credit-card' },
  { id: 'mobile_money', label: 'Mobile Money', icon: 'bi-phone' },
  { id: 'especes_livraison', label: 'Espèces à la livraison', icon: 'bi-cash' },
]

export default function Cart() {
  const cart = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [adresse, setAdresse] = useState('')
  const [ville, setVille] = useState('')
  const [tel, setTel] = useState('')
  const [modePaiement, setModePaiement] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const goNext = () => {
    if (step === 0 && !isAuthenticated) {
      navigate('/connexion', { state: { from: '/panier' } })
      return
    }
    setStep((s) => Math.min(s + 1, wizardSteps.length - 1))
  }
  const goPrev = () => setStep((s) => Math.max(s - 1, 0))

  const canLeaveLivraison = adresse.trim() && ville.trim() && tel.trim()

  const handleConfirm = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const invoice = await checkout({
        items: cart.items.map((i) => (
          i.kind === 'textile'
            ? { textile_id: i.id, quantite: i.qty }
            : { product_id: i.id, quantite: i.qty }
        )),
        adresse_livraison: adresse,
        ville_livraison: ville,
        tel_livraison: tel,
        mode_paiement: modePaiement,
      })
      cart.clearCart()
      navigate('/commande/confirmation', { state: { invoice } })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="container text-center py-5">
        <i className="bi bi-bag fs-1 d-block mb-3" style={{ color: 'var(--iro-faint)' }}></i>
        <h1 className="display-5 mb-3">Votre panier est vide</h1>
        <Link to="/boutique" className="btn-iro btn">Découvrir la boutique</Link>
      </div>
    )
  }

  const selectedMethod = paymentMethods.find((m) => m.id === modePaiement)

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <span className="eyebrow">Panier</span>
      <h1 className="display-4 mt-2 mb-4">Finaliser ma commande</h1>

      <StepProgress steps={wizardSteps} active={step} />

      {step === 0 && (
        <div className="glass p-4 mb-4">
          {cart.items.map((i) => (
            <div key={`${i.kind}-${i.id}`} className="d-flex align-items-center justify-content-between flex-wrap gap-2 border-bottom py-3" style={{ borderColor: 'var(--iro-border)' }}>
              <div>
                <div className="fw-semibold">{i.nom}</div>
                <div className="font-mono text-muted small">{money(i.prix)} / {i.unite}</div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <button type="button" className="btn btn-ghost btn-sm rounded-circle" onClick={() => cart.decrementItem(i.id, i.kind)} aria-label={`Diminuer la quantité de ${i.nom}`}>
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="font-mono" style={{ minWidth: 24, textAlign: 'center' }}>{i.qty}</span>
                  <button type="button" className="btn btn-ghost btn-sm rounded-circle" onClick={() => cart.incrementItem(i.id, i.kind)} aria-label={`Augmenter la quantité de ${i.nom}`}>
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                <span className="font-mono" style={{ minWidth: 100, textAlign: 'right' }}>{money(i.prix * i.qty)}</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => cart.removeItem(i.id, i.kind)} aria-label={`Retirer ${i.nom} du panier`}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-between align-items-center pt-3">
            <span className="font-display fs-4">Total</span>
            <span className="font-display fs-4 text-gradient">{money(cart.total)}</span>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="glass p-4 mb-4">
          <div className="eyebrow mb-3">Informations de livraison</div>
          <label className="form-label small text-muted" htmlFor="cart-adresse">Adresse</label>
          <input
            id="cart-adresse" type="text" className="form-control mb-3"
            placeholder="Rue, quartier…" value={adresse} onChange={(e) => setAdresse(e.target.value)}
          />
          <label className="form-label small text-muted" htmlFor="cart-ville">Ville</label>
          <input
            id="cart-ville" type="text" className="form-control mb-3"
            placeholder="Dakar, Paris…" value={ville} onChange={(e) => setVille(e.target.value)}
          />
          <label className="form-label small text-muted" htmlFor="cart-tel">Téléphone</label>
          <input
            id="cart-tel" type="tel" className="form-control"
            placeholder="+221 77 …" value={tel} onChange={(e) => setTel(e.target.value)}
          />
        </div>
      )}

      {step === 2 && (
        <div className="glass p-4 mb-4">
          <div className="eyebrow mb-3">Mode de paiement</div>
          <div className="d-flex flex-column gap-2">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                type="button"
                className="btn w-100 text-start p-3 d-flex align-items-center gap-3"
                style={{
                  background: 'rgba(255,255,255,.04)', borderRadius: 16,
                  border: `2px solid ${modePaiement === m.id ? 'var(--iro-magenta)' : 'var(--iro-border)'}`,
                  color: 'var(--iro-text)',
                }}
                onClick={() => setModePaiement(m.id)}
                aria-pressed={modePaiement === m.id}
              >
                <i className={`bi ${m.icon} fs-4`} style={{ color: 'var(--iro-orange)' }}></i>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mb-4">
          <div className="bg-light text-dark rounded-3 p-4 shadow">
            <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle" style={{ width: 32, height: 32, background: 'var(--iro-grad)', display: 'inline-block' }}></span>
                <span className="font-display fs-5">MAISON ÌRÓ</span>
              </div>
              <span className="font-mono text-nowrap small">Aperçu facture</span>
            </div>

            {cart.items.map((i) => (
              <div key={`${i.kind}-${i.id}`} className="d-flex justify-content-between border-bottom py-2">
                <span className="small">{i.nom} × {i.qty} {i.unite}</span>
                <span className="font-mono small">{money(i.prix * i.qty)}</span>
              </div>
            ))}

            <div className="d-flex justify-content-between pt-3 mb-3">
              <span className="font-display">TOTAL</span>
              <span className="font-display" style={{ color: 'var(--iro-red)' }}>{money(cart.total)}</span>
            </div>

            <div className="small text-muted">Livraison</div>
            <div className="small">{adresse}, {ville}</div>
            <div className="small mb-2">{tel}</div>
            <div className="small text-muted">Paiement</div>
            <div className="small">{selectedMethod?.label}</div>
          </div>

          {error && (
            <div className="status danger p-3 mt-3">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <button
          type="button" className="btn-ghost btn"
          onClick={step === 0 ? undefined : goPrev}
          style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
        >
          <i className="bi bi-arrow-left me-2"></i>Précédent
        </button>

        {step < wizardSteps.length - 1 ? (
          <button
            type="button" className="btn-iro btn"
            onClick={goNext}
            disabled={(step === 1 && !canLeaveLivraison) || (step === 2 && !modePaiement)}
          >
            {step === 0 && !isAuthenticated ? 'Se connecter pour continuer' : 'Suivant'}<i className="bi bi-arrow-right ms-2"></i>
          </button>
        ) : (
          <button type="button" className="btn-iro btn btn-lg" onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Validation…' : 'Confirmer ma commande'}
          </button>
        )}
      </div>
    </div>
  )
}
