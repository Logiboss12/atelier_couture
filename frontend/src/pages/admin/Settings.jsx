import { useEffect, useState } from 'react'
import { useFetch } from '../../api/useFetch.js'
import { getWorkflowSteps, createWorkflowStep, updateWorkflowStep, deleteWorkflowStep, reorderWorkflowSteps } from '../../api/orderStatuses.js'
import { getSettings, updateSettings } from '../../api/settings.js'

const paymentSwitches = [
  { id: 'esp', label: 'Espèces', checked: true },
  { id: 'mm', label: 'Mobile Money', checked: true },
  { id: 'carte', label: 'Carte bancaire', checked: true },
  { id: 'vir', label: 'Virement', checked: false },
]

function slugify(label) {
  return label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '')
}

function WorkflowSettings() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: steps, loading } = useFetch(getWorkflowSteps, [refreshKey])
  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState('#ff8a3d')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const refresh = () => setRefreshKey((k) => k + 1)

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await createWorkflowStep({ slug: slugify(newLabel), label: newLabel, color: newColor })
      setNewLabel('')
      refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRename = async (step, label) => {
    await updateWorkflowStep(step.dbId, { label })
    refresh()
  }

  const handleRecolor = async (step, color) => {
    await updateWorkflowStep(step.dbId, { color })
    refresh()
  }

  const handleToggleFinal = async (step) => {
    await updateWorkflowStep(step.dbId, { is_final: !step.isFinal })
    refresh()
  }

  const handleDelete = async (step) => {
    if (!confirm(`Supprimer l'étape « ${step.label} » ?`)) return
    setError(null)
    try {
      await deleteWorkflowStep(step.dbId)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleMove = async (index, direction) => {
    const target = index + direction
    if (!steps || target < 0 || target >= steps.length) return
    const reordered = [...steps]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(target, 0, moved)
    await reorderWorkflowSteps(reordered.map((s) => s.dbId))
    refresh()
  }

  return (
    <div className="glass p-4 mb-3">
      <div className="eyebrow mb-3">Workflow de commande</div>
      <p className="text-muted small">Personnalisez les étapes du Kanban « Commandes » : ordre, libellé, couleur.</p>

      {loading || !steps ? (
        <p className="text-muted small mb-0">Chargement…</p>
      ) : (
        <div className="d-flex flex-column gap-2 mb-3">
          {steps.map((step, i) => (
            <div key={step.dbId} className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ border: '1px solid var(--iro-border)' }}>
              <div className="d-flex flex-column gap-1">
                <button type="button" className="btn-ghost btn btn-sm p-0" style={{ width: 22, height: 18, lineHeight: 1 }} onClick={() => handleMove(i, -1)} disabled={i === 0}>
                  <i className="bi bi-caret-up-fill" style={{ fontSize: '.65rem' }}></i>
                </button>
                <button type="button" className="btn-ghost btn btn-sm p-0" style={{ width: 22, height: 18, lineHeight: 1 }} onClick={() => handleMove(i, 1)} disabled={i === steps.length - 1}>
                  <i className="bi bi-caret-down-fill" style={{ fontSize: '.65rem' }}></i>
                </button>
              </div>
              <input
                type="color" className="form-control form-control-color p-0" style={{ width: 32, height: 32 }}
                value={/^#/.test(step.color) ? step.color : '#888888'}
                onChange={(e) => handleRecolor(step, e.target.value)}
                title="Couleur"
              />
              <input
                type="text" className="form-control form-control-sm" defaultValue={step.label}
                onBlur={(e) => { if (e.target.value && e.target.value !== step.label) handleRename(step, e.target.value) }}
              />
              <label className="d-flex align-items-center gap-1 small text-muted text-nowrap" title="Étape finale (commande terminée)">
                <input type="checkbox" checked={step.isFinal} onChange={() => handleToggleFinal(step)} /> Finale
              </label>
              <button type="button" className="btn-ghost btn btn-sm" onClick={() => handleDelete(step)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      <form className="d-flex gap-2" onSubmit={handleAdd}>
        <input
          type="color" className="form-control form-control-color p-0" style={{ width: 32, height: 32 }}
          value={newColor} onChange={(e) => setNewColor(e.target.value)}
        />
        <input
          type="text" className="form-control form-control-sm" placeholder="Nouvelle étape (ex. Contrôle qualité)"
          value={newLabel} onChange={(e) => setNewLabel(e.target.value)} required
        />
        <button type="submit" className="btn-iro btn btn-sm text-nowrap" disabled={saving}>
          <i className="bi bi-plus-lg me-1"></i>Ajouter
        </button>
      </form>
      {error && <div className="status danger p-2 mt-2 small">{error}</div>}
    </div>
  )
}

function PaymentSettings() {
  const { data: settings, loading } = useFetch(getSettings, [])
  const [apiKey, setApiKey] = useState('')
  const [siteId, setSiteId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (settings) {
      setApiKey(settings.cinetpay_api_key || '')
      setSiteId(settings.cinetpay_site_id || '')
    }
  }, [settings])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await updateSettings({ cinetpay_api_key: apiKey, cinetpay_site_id: siteId })
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass p-4">
      <div className="eyebrow mb-3">Paiement Mobile Money (CinetPay)</div>
      <p className="text-muted small">
        Renseignez vos identifiants CinetPay pour activer le paiement Mobile Money (MTN MoMo, Orange Money) en ligne.
        Les factures se valident alors automatiquement dès la confirmation du paiement.
      </p>

      {loading ? (
        <p className="text-muted small mb-0">Chargement…</p>
      ) : (
        <form onSubmit={handleSave}>
          <label className="font-mono small d-block mb-1">Clé API (apikey)</label>
          <input type="password" className="form-control mb-3" value={apiKey} onChange={(e) => setApiKey(e.target.value)} autoComplete="off" />

          <label className="font-mono small d-block mb-1">Identifiant du site (site_id)</label>
          <input type="text" className="form-control mb-3" value={siteId} onChange={(e) => setSiteId(e.target.value)} autoComplete="off" />

          {error && <div className="status danger p-2 mb-2 small">{error}</div>}
          {saved && <div className="status ok p-2 mb-2 small">Configuration enregistrée.</div>}

          <button type="submit" className="btn-iro btn btn-sm" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      )}
    </div>
  )
}

const DEFAULT_WHATSAPP_TEMPLATE = 'Bonjour {client}, votre commande {ref} ({modele}) est passée à « {statut} ». — Maison Ìró'

function WhatsAppSettings() {
  const { data: settings, loading } = useFetch(getSettings, [])
  const [template, setTemplate] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (settings) {
      setTemplate(settings.whatsapp_template_status || DEFAULT_WHATSAPP_TEMPLATE)
    }
  }, [settings])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateSettings({ whatsapp_template_status: template })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass p-4">
      <div className="eyebrow mb-3">Modèle de message WhatsApp</div>
      <p className="text-muted small">
        Utilisé pour préparer le message envoyé au client à chaque changement d'étape (bouton WhatsApp dans le Kanban « Commandes »).
        Variables disponibles : <code>{'{client}'}</code>, <code>{'{ref}'}</code>, <code>{'{modele}'}</code>, <code>{'{statut}'}</code>.
      </p>

      {loading ? (
        <p className="text-muted small mb-0">Chargement…</p>
      ) : (
        <form onSubmit={handleSave}>
          <textarea className="form-control mb-3" rows={3} value={template} onChange={(e) => setTemplate(e.target.value)}></textarea>
          {saved && <div className="status ok p-2 mb-2 small">Modèle enregistré.</div>}
          <button type="submit" className="btn-iro btn btn-sm" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      )}
    </div>
  )
}

export default function Settings() {
  const [switches, setSwitches] = useState(paymentSwitches)

  const toggle = (id) => setSwitches((prev) => prev.map((s) => s.id === id ? { ...s, checked: !s.checked } : s))

  return (
    <div className="row g-3" style={{ maxWidth: 1000 }}>
      <div className="col-12">
        <WorkflowSettings />
      </div>

      <div className="col-12">
        <PaymentSettings />
      </div>

      <div className="col-12 col-lg-6">
        <div className="glass p-4">
          <div className="eyebrow mb-3">Profil de l'atelier</div>
          <div className="border border-2 border-dashed rounded-3 p-4 text-center mb-2" style={{ borderColor: 'var(--iro-border)' }}>
            <i className="bi bi-image fs-1 d-block mb-2" style={{ color: 'var(--iro-faint)' }}></i>
            <span className="text-muted small">Aucun logo importé</span>
          </div>
          <button type="button" className="btn-ghost btn btn-sm mb-3">Importer un logo</button>

          <label className="font-mono small d-block mb-1">Nom</label>
          <input type="text" className="form-control mb-3" defaultValue="Maison Ìró" />

          <label className="font-mono small d-block mb-1">Sous-domaine</label>
          <div className="input-group">
            <input type="text" className="form-control" defaultValue="maison-iro" />
            <span className="input-group-text" style={{ background: 'rgba(0,0,0,.25)', border: '1px solid var(--iro-border)', color: 'var(--iro-text)' }}>.atelier.app</span>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-6 d-flex flex-column gap-3">
        <div className="glass p-4">
          <div className="eyebrow mb-3">Moyens de paiement</div>
          {switches.map((s) => (
            <div key={s.id} className="d-flex justify-content-between align-items-center border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
              <span className="small">{s.label}</span>
              <div className="form-check form-switch mb-0">
                <input className="form-check-input" type="checkbox" role="switch" checked={s.checked} onChange={() => toggle(s.id)} />
              </div>
            </div>
          ))}
        </div>

        <WhatsAppSettings />
      </div>
    </div>
  )
}
