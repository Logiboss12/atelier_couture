import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge.jsx'
import StepProgress from '../../components/StepProgress.jsx'
import TextileTile from '../../components/TextileTile.jsx'
import { useFetch } from '../../api/useFetch.js'
import { getMe, createSurMesureOrder } from '../../api/me.js'
import { getTextiles } from '../../api/textiles.js'
import { modelOptions, measurementFields } from '../../mock/customOrder.js'

const menu = [
  { id: 'suivi', label: 'Suivi de commande', icon: 'bi-scissors' },
  { id: 'mesures', label: 'Carnet de mesures', icon: 'bi-rulers' },
  { id: 'docs', label: 'Devis & factures', icon: 'bi-receipt' },
  { id: 'sur-mesure', label: 'Créer une pièce sur-mesure', icon: 'bi-stars' },
]

const orderSteps = ['recue', 'encours', 'finition', 'prete', 'livree']
const orderStepLabels = ['Reçue', 'En cours', 'Finition', 'Prête', 'Livrée']
const orderBadgeStatus = { recue: 'info', encours: 'warn', finition: 'warn', prete: 'ok', livree: 'neutral' }

const invoiceStatusLabels = { en_attente: 'En attente', payee: 'Payée', partielle: 'Partielle', impayee: 'Impayée' }
const invoiceBadgeStatus = { en_attente: 'warn', payee: 'ok', partielle: 'info', impayee: 'danger' }

const quoteStatusLabels = { en_attente: 'En attente', accepte: 'Accepté', refuse: 'Refusé' }
const quoteBadgeStatus = { en_attente: 'warn', accepte: 'ok', refuse: 'danger' }

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

export default function ClientArea() {
  const [active, setActive] = useState('suivi')
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, loading, error } = useFetch(getMe, [refreshKey])
  const navigate = useNavigate()

  const client = data?.client
  const measurementValues = client
    ? { poitrine: client.poitrine, taille: client.taille, hanches: client.hanches, epaule: client.epaule, manche: client.manche, longueur: client.longueur }
    : {}

  if (loading) {
    return (
      <div className="container d-flex justify-content-center py-5">
        <div className="spinner-border" style={{ color: 'var(--iro-magenta)' }} role="status">
          <span className="visually-hidden">Chargement…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="status danger p-3">
          <i className="bi bi-exclamation-circle me-2"></i>Impossible de charger votre espace client.
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="display-5 mb-1">Bonjour, {data.user.name.split(' ')[0]}</h1>
      <p className="text-muted mb-4">Votre espace client Maison Ìró</p>

      <div className="row g-4">
        <div className="col-12 col-lg-3">
          <div className="glass p-2">
            <nav className="nav flex-column">
              {menu.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="nav-link text-start d-flex align-items-center gap-2 rounded-3 px-3 py-2 border-0 bg-transparent"
                  style={{ borderLeft: active === m.id ? '3px solid var(--iro-magenta)' : '3px solid transparent', color: active === m.id ? 'var(--iro-text)' : 'var(--iro-muted)' }}
                  onClick={() => setActive(m.id)}
                >
                  <i className={`bi ${m.icon}`}></i> {m.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="col-12 col-lg-9">
          {active === 'suivi' && (
            <div className="d-flex flex-column gap-3">
              {(client?.orders || []).length === 0 && (
                <div className="glass p-4 text-muted">
                  Aucune commande pour le moment. Lancez-vous depuis l'onglet « Créer une pièce sur-mesure ».
                </div>
              )}
              {(client?.orders || []).map((order) => (
                <div className="glass p-4" key={order.id}>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                    <div>
                      <div className="font-mono text-muted small">{order.ref}</div>
                      <div className="font-display fs-4">{order.modele}</div>
                    </div>
                    <StatusBadge status={orderBadgeStatus[order.statut] || 'neutral'}>{orderStepLabels[orderSteps.indexOf(order.statut)] || order.statut}</StatusBadge>
                  </div>
                  <StepProgress steps={orderStepLabels} active={orderSteps.indexOf(order.statut)} />
                </div>
              ))}
            </div>
          )}

          {active === 'mesures' && (
            <div className="glass p-4">
              <div className="eyebrow mb-3">Carnet de mesures</div>
              {Object.entries(measurementValues).map(([k, v]) => (
                <div key={k} className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                  <span className="text-muted text-capitalize">{k}</span>
                  <span className="font-mono">{v != null ? `${v} cm` : '—'}</span>
                </div>
              ))}
            </div>
          )}

          {active === 'docs' && (
            <div className="d-flex flex-column gap-4">
              <div>
                <div className="eyebrow mb-3">Devis</div>
                {(client?.quotes || []).length === 0 && (
                  <div className="glass p-4 text-muted">Aucun devis pour le moment.</div>
                )}
                <div className="d-flex flex-column gap-3">
                  {(client?.quotes || []).map((q) => {
                    const hasBreakdown = q.montant_matieres != null || q.montant_main_oeuvre != null
                    return (
                      <div className="glass p-4" key={q.id}>
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                          <div>
                            <div className="font-mono text-muted small">{q.ref}</div>
                            <div className="font-display fs-5">{q.modele}</div>
                            {q.order && (
                              <div className="text-muted small">Commande {q.order.ref}</div>
                            )}
                          </div>
                          <StatusBadge status={quoteBadgeStatus[q.statut] || 'neutral'}>{quoteStatusLabels[q.statut] || q.statut}</StatusBadge>
                        </div>

                        <div className="row row-cols-2 row-cols-md-3 g-2 mb-3">
                          {hasBreakdown && (
                            <>
                              <div className="col">
                                <div className="glass p-3 h-100">
                                  <div className="eyebrow" style={{ fontSize: '.65rem' }}>Matières premières</div>
                                  <div className="font-display fs-6">{money(q.montant_matieres)}</div>
                                </div>
                              </div>
                              <div className="col">
                                <div className="glass p-3 h-100">
                                  <div className="eyebrow" style={{ fontSize: '.65rem' }}>Main d'œuvre</div>
                                  <div className="font-display fs-6">{money(q.montant_main_oeuvre)}</div>
                                </div>
                              </div>
                            </>
                          )}
                          <div className="col">
                            <div className="glass p-3 h-100">
                              <div className="eyebrow" style={{ fontSize: '.65rem' }}>Total</div>
                              <div className="font-display fs-6 text-gradient">{money(q.montant)}</div>
                            </div>
                          </div>
                        </div>

                        {q.echeance && (
                          <div className="text-muted small mb-3">
                            <i className="bi bi-calendar-event me-2"></i>
                            Livraison estimée : {new Date(q.echeance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        )}

                        {q.statut === 'en_attente' && (
                          <button
                            type="button"
                            className="btn-iro btn btn-sm"
                            onClick={() => navigate('/devis/paiement', { state: { quote: q } })}
                          >
                            Convertir en commande
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="eyebrow mb-3">Factures</div>
                {(client?.invoices || []).length === 0 && (
                  <div className="glass p-4 text-muted">Aucune facture pour le moment.</div>
                )}
                <div className="d-flex flex-column gap-3">
                  {(client?.invoices || []).map((inv) => (
                    <div className="glass p-4" key={inv.id}>
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <div className="font-mono text-muted small">Facture {inv.numero}</div>
                        <StatusBadge status={invoiceBadgeStatus[inv.statut] || 'neutral'}>{invoiceStatusLabels[inv.statut] || inv.statut}</StatusBadge>
                      </div>
                      {(inv.lines || []).map((line) => (
                        <div key={line.id} className="d-flex justify-content-between text-muted border-bottom py-1" style={{ fontSize: '.8rem', borderColor: 'var(--iro-border)' }}>
                          <span>{line.label}</span>
                          <span className="font-mono">{money(line.montant)}</span>
                        </div>
                      ))}
                      <div className="d-flex justify-content-between align-items-center pt-2">
                        <span className="font-display">{money(inv.total)}</span>
                        {inv.statut !== 'en_attente' && (
                          <Link to={`/facture/${inv.id}`} className="btn-ghost btn btn-sm">
                            <i className="bi bi-download me-1"></i>Télécharger
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === 'sur-mesure' && (
            <SurMesureForm onCreated={() => { setRefreshKey((k) => k + 1); setActive('suivi') }} />
          )}
        </div>
      </div>
    </div>
  )
}

const wizardSteps = ['Modèle', 'Tissu', 'Mensurations', 'Récapitulatif']

function SurMesureForm({ onCreated }) {
  const [step, setStep] = useState(0)
  const [model, setModel] = useState(null)
  const [fabric, setFabric] = useState(null)
  const [measurements, setMeasurements] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const { data: textiles } = useFetch(getTextiles, [])

  const next = () => setStep((s) => Math.min(s + 1, wizardSteps.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const selectedModel = modelOptions.find((m) => m.id === model)
  const selectedFabric = (textiles || []).find((t) => t.id === fabric)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await createSurMesureOrder({
        modele: selectedModel?.nom || 'Pièce sur-mesure',
        textile_id: selectedFabric?.dbId ?? null,
        ...measurements,
      })
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <StepProgress steps={wizardSteps} active={step} />

      <div className="glass p-4" style={{ minHeight: 320 }}>
        {step === 0 && (
          <div className="row row-cols-2 row-cols-md-3 g-3">
            {modelOptions.map((m) => (
              <div className="col" key={m.id}>
                <button
                  type="button"
                  className="btn w-100 h-100 text-start p-3"
                  style={{
                    background: 'rgba(255,255,255,.04)', borderRadius: 16,
                    border: `2px solid ${model === m.id ? 'var(--iro-magenta)' : 'var(--iro-border)'}`,
                    color: 'var(--iro-text)',
                  }}
                  onClick={() => setModel(m.id)}
                  aria-pressed={model === m.id}
                >
                  <i className={`bi ${m.icon} fs-3 d-block mb-2`} style={{ color: 'var(--iro-orange)' }}></i>
                  {m.nom}
                </button>
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="row row-cols-2 row-cols-md-3 g-3">
            {(textiles || []).map((t) => (
              <div className="col" key={t.id}>
                <button
                  type="button"
                  className="btn w-100 h-100 p-0 overflow-hidden text-start"
                  style={{ borderRadius: 16, border: `2px solid ${fabric === t.id ? 'var(--iro-magenta)' : 'var(--iro-border)'}` }}
                  onClick={() => setFabric(t.id)}
                  aria-pressed={fabric === t.id}
                >
                  <TextileTile variant={t.tile.replace('tile-', '')} className="ratio ratio-16x9 rounded-0"></TextileTile>
                  <div className="p-2">
                    <div className="fw-semibold small">{t.nom}</div>
                    <div className="font-mono text-muted" style={{ fontSize: '.7rem' }}>{t.origine}</div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="row row-cols-2 row-cols-md-3 g-3">
            {measurementFields.map((f) => (
              <div className="col" key={f.id}>
                <div className="form-floating">
                  <input
                    type="number" className="form-control" id={f.id} placeholder={f.label}
                    value={measurements[f.id] || ''}
                    onChange={(e) => setMeasurements((m) => ({ ...m, [f.id]: e.target.value }))}
                  />
                  <label htmlFor={f.id}>{f.label}</label>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="row row-cols-1 row-cols-md-2 g-3 mb-4">
              <div className="col">
                <div className="glass p-3 h-100">
                  <div className="eyebrow">Modèle</div>
                  <div className="font-display fs-5">{selectedModel?.nom || '—'}</div>
                </div>
              </div>
              <div className="col">
                <div className="glass p-3 h-100">
                  <div className="eyebrow">Tissu</div>
                  <div className="font-display fs-5">{selectedFabric?.nom || '—'}</div>
                </div>
              </div>
            </div>
            {error && (
              <div className="status danger p-3 mb-3">
                <i className="bi bi-exclamation-circle me-2"></i>{error}
              </div>
            )}
            <button type="button" className="btn-iro btn btn-lg" onClick={handleSubmit} disabled={submitting || !selectedModel}>
              {submitting ? 'Envoi…' : 'Envoyer ma demande'}
            </button>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn-ghost btn" onClick={prev} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>
          <i className="bi bi-arrow-left me-2"></i>Précédent
        </button>
        <button type="button" className="btn-iro btn" onClick={next} style={{ visibility: step === wizardSteps.length - 1 ? 'hidden' : 'visible' }}>
          Suivant<i className="bi bi-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  )
}
