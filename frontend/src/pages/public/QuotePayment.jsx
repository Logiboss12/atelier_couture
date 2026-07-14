import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import StepProgress from '../../components/StepProgress.jsx'
import { convertQuote } from '../../api/me.js'

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

const wizardSteps = ['Livraison', 'Paiement', 'Plan', 'Aperçu']

const paymentMethods = [
  { id: 'carte', label: 'Carte bancaire', icon: 'bi-credit-card' },
  { id: 'mobile_money', label: 'Mobile Money', icon: 'bi-phone' },
  { id: 'especes_livraison', label: 'Espèces à la livraison', icon: 'bi-cash' },
]

export default function QuotePayment() {
  const location = useLocation()
  const navigate = useNavigate()
  const quote = location.state?.quote

  const [step, setStep] = useState(0)
  const [adresse, setAdresse] = useState('')
  const [ville, setVille] = useState('')
  const [tel, setTel] = useState('')
  const [modePaiement, setModePaiement] = useState(null)
  const [plan, setPlan] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!quote) {
    return <Navigate to="/espace-client" replace />
  }

  const acompte = Math.round(quote.montant * 0.5)
  const solde = quote.montant - acompte

  const canLeaveLivraison = adresse.trim() && ville.trim() && tel.trim()
  const selectedMethod = paymentMethods.find((m) => m.id === modePaiement)

  const goNext = () => setStep((s) => Math.min(s + 1, wizardSteps.length - 1))
  const goPrev = () => setStep((s) => Math.max(s - 1, 0))

  const handleConfirm = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const { invoices } = await convertQuote(quote.id, {
        mode_paiement: modePaiement,
        adresse_livraison: adresse,
        ville_livraison: ville,
        tel_livraison: tel,
        paiement_plan: plan,
      })
      navigate('/commande/confirmation', { state: { invoices } })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <span className="eyebrow">Devis {quote.ref}</span>
      <h1 className="display-4 mt-2 mb-4">Convertir en commande définitive</h1>

      <StepProgress steps={wizardSteps} active={step} />

      {step === 0 && (
        <div className="glass p-4 mb-4">
          <div className="eyebrow mb-3">Informations de livraison</div>
          <label className="form-label small text-muted" htmlFor="qp-adresse">Adresse</label>
          <input
            id="qp-adresse" type="text" className="form-control mb-3"
            placeholder="Rue, quartier…" value={adresse} onChange={(e) => setAdresse(e.target.value)}
          />
          <label className="form-label small text-muted" htmlFor="qp-ville">Ville</label>
          <input
            id="qp-ville" type="text" className="form-control mb-3"
            placeholder="Dakar, Paris…" value={ville} onChange={(e) => setVille(e.target.value)}
          />
          <label className="form-label small text-muted" htmlFor="qp-tel">Téléphone</label>
          <input
            id="qp-tel" type="tel" className="form-control"
            placeholder="+221 77 …" value={tel} onChange={(e) => setTel(e.target.value)}
          />
        </div>
      )}

      {step === 1 && (
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

      {step === 2 && (
        <div className="glass p-4 mb-4">
          <div className="eyebrow mb-3">Plan de paiement</div>
          <div className="d-flex flex-column gap-2">
            <button
              type="button"
              className="btn w-100 text-start p-3"
              style={{
                background: 'rgba(255,255,255,.04)', borderRadius: 16,
                border: `2px solid ${plan === 'total' ? 'var(--iro-magenta)' : 'var(--iro-border)'}`,
                color: 'var(--iro-text)',
              }}
              onClick={() => setPlan('total')}
              aria-pressed={plan === 'total'}
            >
              <div className="fw-semibold">Paiement intégral</div>
              <div className="text-muted small">{money(quote.montant)} en une seule fois</div>
            </button>
            <button
              type="button"
              className="btn w-100 text-start p-3"
              style={{
                background: 'rgba(255,255,255,.04)', borderRadius: 16,
                border: `2px solid ${plan === 'tranches' ? 'var(--iro-magenta)' : 'var(--iro-border)'}`,
                color: 'var(--iro-text)',
              }}
              onClick={() => setPlan('tranches')}
              aria-pressed={plan === 'tranches'}
            >
              <div className="fw-semibold">Paiement en 2 fois</div>
              <div className="text-muted small">{money(acompte)} d'acompte + {money(solde)} à la livraison</div>
            </button>
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
              <span className="font-mono text-nowrap small">Devis {quote.ref}</span>
            </div>

            <div className="d-flex justify-content-between border-bottom py-2">
              <span className="small">{quote.modele}</span>
              <span className="font-mono small">{money(quote.montant)}</span>
            </div>

            {plan === 'tranches' && (
              <>
                <div className="d-flex justify-content-between text-muted py-1" style={{ fontSize: '.8rem' }}>
                  <span>→ Acompte 50% (à payer maintenant)</span>
                  <span>{money(acompte)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted py-1" style={{ fontSize: '.8rem' }}>
                  <span>→ Solde 50% (à la livraison)</span>
                  <span>{money(solde)}</span>
                </div>
              </>
            )}

            <div className="d-flex justify-content-between pt-3 mb-3">
              <span className="font-display">TOTAL</span>
              <span className="font-display" style={{ color: 'var(--iro-red)' }}>{money(quote.montant)}</span>
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
          onClick={goPrev}
          style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
        >
          <i className="bi bi-arrow-left me-2"></i>Précédent
        </button>

        {step < wizardSteps.length - 1 ? (
          <button
            type="button" className="btn-iro btn"
            onClick={goNext}
            disabled={(step === 0 && !canLeaveLivraison) || (step === 1 && !modePaiement) || (step === 2 && !plan)}
          >
            Suivant<i className="bi bi-arrow-right ms-2"></i>
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
