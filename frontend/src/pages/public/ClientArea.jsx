import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge.jsx'
import StepProgress from '../../components/StepProgress.jsx'
import TextileTile from '../../components/TextileTile.jsx'
import { useFetch } from '../../api/useFetch.js'
import { getMe, createSurMesureOrder, uploadMyOrderPhoto, payInvoiceCheckout } from '../../api/me.js'
import { getTextiles } from '../../api/textiles.js'
import { getProducts } from '../../api/catalog.js'
import { getWorkflowSteps } from '../../api/orderStatuses.js'
import { measurementFields } from '../../mock/customOrder.js'

const menu = [
  { id: 'suivi', label: 'Suivi de commande', icon: 'bi-scissors' },
  { id: 'docs', label: 'Devis & factures', icon: 'bi-receipt' },
  { id: 'creation', label: 'Mesures & pièce sur-mesure', icon: 'bi-stars' },
]

function orderBadgeStatus(steps, slug) {
  const index = steps.findIndex((s) => s.id === slug)
  const step = steps[index]
  if (!step) return 'neutral'
  if (step.isFinal) return 'ok'
  if (index === 0) return 'info'
  return 'warn'
}

const invoiceStatusLabels = { en_attente: 'En attente', payee: 'Payée', partielle: 'Partielle', impayee: 'Impayée' }
const invoiceBadgeStatus = { en_attente: 'warn', payee: 'ok', partielle: 'info', impayee: 'danger' }

const quoteStatusLabels = { en_attente: 'En attente', accepte: 'Accepté', refuse: 'Refusé' }
const quoteBadgeStatus = { en_attente: 'warn', accepte: 'ok', refuse: 'danger' }

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

export default function ClientArea() {
  const [active, setActive] = useState('suivi')
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, loading, error } = useFetch(getMe, [refreshKey])
  const { data: workflowSteps } = useFetch(getWorkflowSteps, [])
  const navigate = useNavigate()
  const [payingId, setPayingId] = useState(null)
  const [payError, setPayError] = useState(null)
  const [payErrorId, setPayErrorId] = useState(null)

  const client = data?.client
  const measurements = client?.measurements || []
  const steps = workflowSteps || []

  const handlePay = async (invoiceId) => {
    setPayingId(invoiceId)
    setPayError(null)
    setPayErrorId(null)
    try {
      const { payment_url: paymentUrl } = await payInvoiceCheckout(invoiceId)
      window.location.href = paymentUrl
    } catch (err) {
      setPayError(err.message)
      setPayErrorId(invoiceId)
      setPayingId(null)
    }
  }

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
                  Aucune commande pour le moment. Lancez-vous depuis l'onglet « Mesures & pièce sur-mesure ».
                </div>
              )}
              {(client?.orders || []).map((order) => (
                <div className="glass p-4" key={order.id}>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                    <div>
                      <div className="font-mono text-muted small">{order.ref}</div>
                      <div className="font-display fs-4">{order.modele}</div>
                    </div>
                    <StatusBadge status={orderBadgeStatus(steps, order.statut)}>{steps.find((s) => s.id === order.statut)?.label || order.statut}</StatusBadge>
                  </div>
                  <StepProgress steps={steps.map((s) => s.label)} active={steps.findIndex((s) => s.id === order.statut)} />
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
                        {inv.statut === 'en_attente' && inv.mode_paiement === 'mobile_money' && (
                          <button type="button" className="btn-iro btn btn-sm" onClick={() => handlePay(inv.id)} disabled={payingId === inv.id}>
                            <i className="bi bi-phone me-1"></i>{payingId === inv.id ? 'Redirection…' : 'Payer par Mobile Money'}
                          </button>
                        )}
                      </div>
                      {payErrorId === inv.id && (
                        <div className="status danger p-2 mt-2 small">{payError}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === 'creation' && (
            <SurMesureForm measurements={measurements} onCreated={() => { setRefreshKey((k) => k + 1); setActive('suivi') }} />
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ id, open, onToggle, title, icon, summary, children }) {
  return (
    <div className="glass p-0 overflow-hidden">
      <button
        type="button"
        className="btn w-100 d-flex align-items-center gap-3 p-3 border-0 text-start"
        style={{ color: 'var(--iro-text)', background: 'transparent' }}
        onClick={() => onToggle(id)}
        aria-expanded={open}
      >
        <i className={`bi ${icon} fs-5`} style={{ color: 'var(--iro-orange)' }}></i>
        <span className="flex-grow-1">
          <span className="d-block font-display">{title}</span>
          <span className="d-block text-muted small">{summary}</span>
        </span>
        <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
      </button>
      {open && <div className="p-3 pt-0">{children}</div>}
    </div>
  )
}

function SurMesureForm({ measurements: existingMeasurements = [], onCreated }) {
  const [openSection, setOpenSection] = useState('style')
  const [styleMode, setStyleMode] = useState('catalog')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [styleLabel, setStyleLabel] = useState('')
  const [stylePhotoFiles, setStylePhotoFiles] = useState([])
  const [fabric, setFabric] = useState(null)
  const [selectedMeasurementId, setSelectedMeasurementId] = useState(existingMeasurements[0]?.id ?? 'new')
  const [measurementValues, setMeasurementValues] = useState({})
  const [instructions, setInstructions] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [queuedOffline, setQueuedOffline] = useState(false)

  const { data: textiles } = useFetch(getTextiles, [])
  const { data: products } = useFetch(getProducts, [])
  const styleProducts = (products || []).filter((p) => p.type === 'vetement' && p.publie !== false)

  const toggleSection = (id) => setOpenSection((cur) => (cur === id ? null : id))

  const selectedProduct = styleProducts.find((p) => p.id === selectedProductId)
  const selectedFabric = (textiles || []).find((t) => t.id === fabric)
  const styleName = styleMode === 'catalog' ? selectedProduct?.nom : styleLabel
  const hasStyle = styleMode === 'catalog' ? !!selectedProduct : (!!styleLabel.trim() || stylePhotoFiles.length > 0)

  const selectedMeasurement = existingMeasurements.find((m) => m.id === selectedMeasurementId)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    setQueuedOffline(false)
    try {
      const order = await createSurMesureOrder({
        modele: styleName || 'Pièce sur-mesure',
        textile_id: selectedFabric?.dbId ?? null,
        instructions: instructions || null,
        ...(selectedMeasurementId !== 'new' ? { measurement_id: selectedMeasurementId } : measurementValues),
      })

      for (const file of stylePhotoFiles) {
        await uploadMyOrderPhoto(order.id, file).catch(() => {})
      }

      onCreated()
    } catch (err) {
      if (!navigator.onLine) {
        setQueuedOffline(true)
      } else {
        setError(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
      <Section
        id="style" open={openSection === 'style'} onToggle={toggleSection}
        title="Style" icon="bi-palette"
        summary={styleMode === 'catalog' ? (selectedProduct?.nom || 'Choisir un style dans le catalogue') : (styleLabel || (stylePhotoFiles.length ? `${stylePhotoFiles.length} photo(s) ajoutée(s)` : 'Ajouter une photo de style'))}
      >
        <div className="d-flex gap-2 mb-3">
          <button type="button" className={`btn btn-sm ${styleMode === 'catalog' ? 'btn-iro' : 'btn-ghost'}`} onClick={() => setStyleMode('catalog')}>
            <i className="bi bi-grid me-1"></i>Choisir dans le catalogue
          </button>
          <button type="button" className={`btn btn-sm ${styleMode === 'photo' ? 'btn-iro' : 'btn-ghost'}`} onClick={() => setStyleMode('photo')}>
            <i className="bi bi-camera me-1"></i>Ajouter une photo
          </button>
        </div>

        {styleMode === 'catalog' ? (
          <div className="row row-cols-2 row-cols-md-3 g-3">
            {styleProducts.map((p) => (
              <div className="col" key={p.id}>
                <button
                  type="button"
                  className="btn w-100 h-100 p-0 overflow-hidden text-start"
                  style={{ borderRadius: 16, border: `2px solid ${selectedProductId === p.id ? 'var(--iro-magenta)' : 'var(--iro-border)'}` }}
                  onClick={() => setSelectedProductId(p.id)}
                  aria-pressed={selectedProductId === p.id}
                >
                  {p.image ? (
                    <div className="ratio ratio-1x1">
                      <img src={p.image} alt={p.nom} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    </div>
                  ) : (
                    <TextileTile variant={p.tissu} className="ratio ratio-1x1 rounded-0"></TextileTile>
                  )}
                  <div className="p-2">
                    <div className="fw-semibold small">{p.nom}</div>
                    <div className="font-mono text-muted" style={{ fontSize: '.7rem' }}>{p.categorie || '—'}</div>
                  </div>
                </button>
              </div>
            ))}
            {styleProducts.length === 0 && <p className="text-muted small mb-0">Aucun modèle publié dans le catalogue pour le moment.</p>}
          </div>
        ) : (
          <div>
            <input
              type="text" className="form-control mb-2" placeholder="Nom du style (ex. Robe portefeuille)"
              value={styleLabel} onChange={(e) => setStyleLabel(e.target.value)}
            />
            <input
              type="file" accept="image/*" multiple className="form-control mb-2"
              onChange={(e) => setStylePhotoFiles(Array.from(e.target.files || []))}
            />
            {stylePhotoFiles.length > 0 && (
              <div className="d-flex flex-wrap gap-2">
                {stylePhotoFiles.map((file, i) => (
                  <img key={i} src={URL.createObjectURL(file)} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                ))}
              </div>
            )}
          </div>
        )}
      </Section>

      <Section
        id="tissu" open={openSection === 'tissu'} onToggle={toggleSection}
        title="Tissu" icon="bi-layers"
        summary={selectedFabric?.nom || 'Aucun tissu choisi (facultatif)'}
      >
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
      </Section>

      <Section
        id="mesures" open={openSection === 'mesures'} onToggle={toggleSection}
        title="Carnet de mesures" icon="bi-rulers"
        summary={selectedMeasurementId === 'new' ? 'Nouvelle prise de mesures' : `Réutiliser « ${selectedMeasurement?.type_vetement} » (${selectedMeasurement?.prise_le?.slice(0, 10)})`}
      >
        {existingMeasurements.length > 0 && (
          <div className="mb-3 d-flex flex-column gap-2">
            {existingMeasurements.map((m) => (
              <label
                key={m.id}
                className="d-flex align-items-center gap-2 p-2 rounded-3"
                style={{ border: `2px solid ${selectedMeasurementId === m.id ? 'var(--iro-magenta)' : 'var(--iro-border)'}`, cursor: 'pointer' }}
              >
                <input
                  type="radio" name="measurement-choice" checked={selectedMeasurementId === m.id}
                  onChange={() => setSelectedMeasurementId(m.id)}
                />
                <span className="small flex-grow-1">
                  Réutiliser <strong>{m.type_vetement}</strong>
                  <span className="text-muted"> — pris le {m.prise_le?.slice(0, 10)}</span>
                </span>
              </label>
            ))}
            <label
              className="d-flex align-items-center gap-2 p-2 rounded-3"
              style={{ border: `2px solid ${selectedMeasurementId === 'new' ? 'var(--iro-magenta)' : 'var(--iro-border)'}`, cursor: 'pointer' }}
            >
              <input type="radio" name="measurement-choice" checked={selectedMeasurementId === 'new'} onChange={() => setSelectedMeasurementId('new')} />
              <span className="small">Nouvelle prise de mesures</span>
            </label>
          </div>
        )}

        {selectedMeasurementId === 'new' && (
          <div className="row row-cols-2 row-cols-md-3 g-3">
            {measurementFields.map((f) => (
              <div className="col" key={f.id}>
                <div className="form-floating">
                  <input
                    type="number" className="form-control" id={f.id} placeholder={f.label}
                    value={measurementValues[f.id] || ''}
                    onChange={(e) => setMeasurementValues((m) => ({ ...m, [f.id]: e.target.value }))}
                  />
                  <label htmlFor={f.id}>{f.label}</label>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section
        id="instructions" open={openSection === 'instructions'} onToggle={toggleSection}
        title="Instructions" icon="bi-chat-left-text"
        summary={instructions ? `${instructions.slice(0, 60)}${instructions.length > 60 ? '…' : ''}` : 'Aucune instruction particulière (facultatif)'}
      >
        <textarea
          className="form-control" rows={4}
          placeholder="Détails de finition, occasion, contraintes de délai…"
          value={instructions} onChange={(e) => setInstructions(e.target.value)}
        />
      </Section>

      <div className="glass p-4">
        {error && (
          <div className="status danger p-3 mb-3">
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}
        {queuedOffline && (
          <div className="status warn p-3 mb-3">
            <i className="bi bi-wifi-off me-2"></i>
            Vous êtes hors-ligne. Votre demande a été enregistrée sur cet appareil et sera envoyée automatiquement dès le retour du réseau.
          </div>
        )}
        <button type="button" className="btn-iro btn btn-lg" onClick={handleSubmit} disabled={submitting || !hasStyle}>
          {submitting ? 'Envoi…' : 'Envoyer ma demande'}
        </button>
        {!hasStyle && <p className="text-muted small mt-2 mb-0">Choisissez un style (catalogue ou photo) pour envoyer votre demande.</p>}
      </div>
    </div>
  )
}
