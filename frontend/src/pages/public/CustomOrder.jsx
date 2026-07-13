import { useState } from 'react'
import StepProgress from '../../components/StepProgress.jsx'
import TextileTile from '../../components/TextileTile.jsx'
import { modelOptions, measurementFields } from '../../mock/customOrder.js'
import { useFetch } from '../../api/useFetch.js'
import { getTextiles } from '../../api/textiles.js'

const steps = ['Modèle', 'Tissu', 'Inspiration', 'Mensurations', 'Devis']

export default function CustomOrder() {
  const [step, setStep] = useState(0)
  const [model, setModel] = useState(null)
  const [fabric, setFabric] = useState(null)
  const [note, setNote] = useState('')
  const [measurements, setMeasurements] = useState({})
  const [sent, setSent] = useState(false)

  const { data: textiles } = useFetch(getTextiles, [])

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const selectedModel = modelOptions.find((m) => m.id === model)
  const selectedFabric = (textiles || []).find((t) => t.id === fabric)

  return (
    <div className="container" style={{ maxWidth: 920 }}>
      <span className="eyebrow">Sur-mesure</span>
      <h1 className="display-4 mt-2 mb-4">Créez votre pièce</h1>

      <StepProgress steps={steps} active={step} />

      <div className="glass p-4" style={{ minHeight: 380 }}>
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
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="border border-2 border-dashed rounded-4 p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center" style={{ borderColor: 'var(--iro-border)' }}>
                <i className="bi bi-cloud-upload fs-1 mb-2" style={{ color: 'var(--iro-faint)' }}></i>
                <p className="text-muted mb-0">Glissez vos photos d'inspiration ici</p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="inspiration-note" className="form-label eyebrow">Décrivez votre idée</label>
              <textarea
                id="inspiration-note" className="form-control h-100" rows={6}
                placeholder="Coupe, couleurs, occasion, inspirations…"
                value={note} onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
          </div>
        )}

        {step === 3 && (
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

        {step === 4 && (
          <div>
            <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
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
              <div className="col">
                <div className="glass p-3 h-100">
                  <div className="eyebrow">Délai estimé</div>
                  <div className="font-display fs-5">3 à 4 semaines</div>
                </div>
              </div>
            </div>
            <div className="glass p-3 mb-4">
              <div className="eyebrow">Fourchette de prix estimée</div>
              <div className="font-display fs-3" style={{ color: 'var(--iro-green)' }}>180 000 – 320 000 F</div>
            </div>
            {sent ? (
              <div className="status ok p-3 fs-6 d-inline-flex align-items-center gap-2">
                <i className="bi bi-check-circle"></i> Votre demande a été envoyée. Notre équipe vous recontactera sous 48h.
              </div>
            ) : (
              <button type="button" className="btn-iro btn btn-lg" onClick={() => setSent(true)}>
                Envoyer ma demande
              </button>
            )}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn-ghost btn" onClick={prev} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>
          <i className="bi bi-arrow-left me-2"></i>Précédent
        </button>
        <button type="button" className="btn-iro btn" onClick={next} style={{ visibility: step === steps.length - 1 ? 'hidden' : 'visible' }}>
          Suivant<i className="bi bi-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  )
}
