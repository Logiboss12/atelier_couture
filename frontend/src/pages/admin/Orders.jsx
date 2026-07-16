import { useEffect, useState } from 'react'
import TextileTile from '../../components/TextileTile.jsx'
import { useFetch } from '../../api/useFetch.js'
import {
  getOrders, updateOrderStatus, updateOrderInstructions, uploadOrderPhoto, removeOrderPhoto,
} from '../../api/orders.js'
import { getWorkflowSteps } from '../../api/orderStatuses.js'
import { getWhatsAppTemplate } from '../../api/settings.js'
import { createQuote } from '../../api/quotes.js'

const DEFAULT_WHATSAPP_TEMPLATE = 'Bonjour {client}, votre commande {ref} ({modele}) est passée à « {statut} ». — Maison Ìró'

function urgencyColor(dateStr) {
  const days = (new Date(dateStr) - new Date()) / 86400000
  if (days <= 1) return 'var(--iro-red)'
  if (days <= 3) return 'var(--iro-orange)'
  return 'var(--iro-faint)'
}

const money = (n) => `${Number(n || 0).toLocaleString('fr-FR')} F`

function buildWhatsAppLink(order, statusLabel, template) {
  if (!order.clientTel) return null
  const message = template
    .replace(/\{client\}/g, order.client)
    .replace(/\{ref\}/g, order.ref)
    .replace(/\{modele\}/g, order.modele)
    .replace(/\{statut\}/g, statusLabel || order.statut)
  return `https://wa.me/${order.clientTel.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

function OrderDetails({ order, onChanged }) {
  const [instructions, setInstructions] = useState(order.instructions)
  const [savingInstructions, setSavingInstructions] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleSaveInstructions = async () => {
    setSavingInstructions(true)
    try {
      await updateOrderInstructions(order.id, instructions)
      onChanged()
    } finally {
      setSavingInstructions(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadOrderPhoto(order.id, file)
      onChanged()
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleRemovePhoto = async (path) => {
    await removeOrderPhoto(order.id, path)
    onChanged()
  }

  return (
    <div className="mt-2 pt-2 border-top" style={{ borderColor: 'var(--iro-border)' }} onDragStart={(e) => e.stopPropagation()} draggable={false}>
      {order.measurement && (
        <>
          <label className="font-mono small d-block mb-1 text-muted">Mesures utilisées</label>
          <div className="mb-2 p-2 rounded-3" style={{ background: 'rgba(255,255,255,.04)' }}>
            <div className="d-flex justify-content-between mb-1">
              <span className="small fw-semibold">{order.measurement.typeVetement}</span>
              <span className="font-mono text-muted" style={{ fontSize: '.68rem' }}>{order.measurement.priseLe}</span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(order.measurement.valeurs).map(([k, v]) => (
                <span key={k} className="font-mono text-muted" style={{ fontSize: '.68rem' }}>{k} {v}cm</span>
              ))}
            </div>
          </div>
        </>
      )}

      <label className="font-mono small d-block mb-1 text-muted">Instructions</label>
      <textarea
        className="form-control form-control-sm mb-2" rows={2}
        value={instructions} onChange={(e) => setInstructions(e.target.value)}
        placeholder="Notes de coupe, finitions, remarques du client…"
      />
      <button type="button" className="btn-ghost btn btn-sm w-100 mb-2" onClick={handleSaveInstructions} disabled={savingInstructions}>
        {savingInstructions ? '…' : 'Enregistrer les instructions'}
      </button>

      <label className="font-mono small d-block mb-1 text-muted">Photos</label>
      {order.photos.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mb-2">
          {order.photos.map((p) => (
            <div key={p.path} className="position-relative">
              <img src={p.url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
              <button
                type="button"
                className="btn btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center"
                style={{ width: 16, height: 16, background: 'var(--iro-red)', color: '#fff', borderRadius: '50%', lineHeight: 1, fontSize: '.6rem' }}
                onClick={() => handleRemovePhoto(p.path)}
                title="Supprimer"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          ))}
        </div>
      )}
      <input type="file" accept="image/*" className="form-control form-control-sm" onChange={handleUpload} disabled={uploading} />
    </div>
  )
}

function OrderCard({ order, onDragStart, onChanged, statusLabel, whatsappTemplate }) {
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [montantMatieres, setMontantMatieres] = useState('')
  const [montantMainOeuvre, setMontantMainOeuvre] = useState('')
  const [echeanceDevis, setEcheanceDevis] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const total = (Number(montantMatieres) || 0) + (Number(montantMainOeuvre) || 0)
  const waHref = buildWhatsAppLink(order, statusLabel, whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE)

  const handleSendQuote = async () => {
    setSending(true)
    try {
      await createQuote({
        client_id: order.clientId,
        order_id: order.id,
        modele: order.modele,
        montant_matieres: Number(montantMatieres) || 0,
        montant_main_oeuvre: Number(montantMainOeuvre) || 0,
        echeance: echeanceDevis || null,
      })
      setSent(true)
      setShowQuoteForm(false)
      setMontantMatieres('')
      setMontantMainOeuvre('')
      setEcheanceDevis('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className="kanban-card p-3"
      draggable
      onDragStart={(e) => onDragStart(e, order.id)}
      style={{ cursor: 'grab' }}
    >
      <div className="d-flex align-items-center gap-2 mb-2">
        <TextileTile variant={order.tissu} style={{ width: 34, height: 34, flexShrink: 0 }} />
        <div className="flex-grow-1">
          <div className="small fw-semibold">{order.client}</div>
          <div className="font-mono text-muted" style={{ fontSize: '.68rem' }}>{order.ref}</div>
        </div>
        {waHref && (
          <a
            href={waHref} target="_blank" rel="noreferrer"
            className="btn-ghost btn btn-sm p-1" style={{ lineHeight: 1 }}
            title="Prévenir le client par WhatsApp"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="bi bi-whatsapp"></i>
          </a>
        )}
      </div>
      <div className="small mb-2">{order.modele}</div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="font-mono" style={{ fontSize: '.72rem', color: urgencyColor(order.echeance) }}>
          <i className="bi bi-clock me-1"></i>{order.echeance}
        </span>
        <span className="font-mono text-muted" style={{ fontSize: '.7rem' }}>{order.assigne}</span>
      </div>

      <button type="button" className="btn-ghost btn btn-sm w-100 mb-2" onClick={() => setShowDetails((v) => !v)}>
        <i className={`bi ${showDetails ? 'bi-chevron-up' : 'bi-chevron-down'} me-1`}></i>
        {showDetails ? 'Masquer' : 'Détails'}
        {order.photos.length > 0 && !showDetails && <span className="ms-1"><i className="bi bi-image"></i> {order.photos.length}</span>}
      </button>
      {showDetails && <OrderDetails order={order} onChanged={onChanged} />}

      {showQuoteForm ? (
        <div className="d-flex flex-column gap-2">
          <input
            type="number" className="form-control form-control-sm" placeholder="Matières premières (F)"
            value={montantMatieres} onChange={(e) => setMontantMatieres(e.target.value)}
          />
          <input
            type="number" className="form-control form-control-sm" placeholder="Main d'œuvre (F)"
            value={montantMainOeuvre} onChange={(e) => setMontantMainOeuvre(e.target.value)}
          />
          <input
            type="date" className="form-control form-control-sm"
            value={echeanceDevis} onChange={(e) => setEcheanceDevis(e.target.value)}
          />
          <div className="d-flex justify-content-between align-items-center small">
            <span className="text-muted">Total</span>
            <span className="font-mono fw-semibold">{money(total)}</span>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn-ghost btn btn-sm flex-grow-1" onClick={() => setShowQuoteForm(false)}>
              Annuler
            </button>
            <button
              type="button" className="btn btn-sm flex-grow-1"
              style={{ background: 'var(--iro-green)', color: '#0a2b1c' }}
              onClick={handleSendQuote} disabled={sending || total <= 0}
            >
              {sending ? '…' : 'Envoyer'}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn-ghost btn btn-sm w-100" onClick={() => { setShowQuoteForm(true); setSent(false) }}>
          <i className="bi bi-receipt me-1"></i>{sent ? 'Devis envoyé ✓' : 'Envoyer un devis'}
        </button>
      )}
    </div>
  )
}

export default function Orders() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: fetchedOrders, loading } = useFetch(getOrders, [refreshKey])
  const { data: workflowSteps, loading: loadingSteps } = useFetch(getWorkflowSteps, [])
  const { data: whatsappSettings } = useFetch(getWhatsAppTemplate, [])
  const [orders, setOrders] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)
  const [moving, setMoving] = useState(false)
  const [offlineNotice, setOfflineNotice] = useState(false)

  useEffect(() => {
    if (fetchedOrders) setOrders(fetchedOrders)
  }, [fetchedOrders])

  const handleDragStart = (e, orderId) => {
    e.dataTransfer.setData('text/plain', String(orderId))
  }

  const handleDrop = async (e, statusId) => {
    e.preventDefault()
    setDragOverColumn(null)
    const orderId = e.dataTransfer.getData('text/plain')
    if (!orderId) return

    const previousOrders = orders
    setOrders((prev) => prev.map((o) => (String(o.id) === orderId ? { ...o, statut: statusId } : o)))
    setOfflineNotice(false)

    setMoving(true)
    try {
      await updateOrderStatus(orderId, statusId)
      if (navigator.onLine) setRefreshKey((k) => k + 1)
    } catch {
      if (navigator.onLine) {
        setOrders(previousOrders)
      } else {
        setOfflineNotice(true)
      }
    } finally {
      setMoving(false)
    }
  }

  if (loading || loadingSteps || !orders || !workflowSteps) return <p className="text-muted">Chargement…</p>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted mb-0 d-none d-sm-block">Glissez les commandes d'une étape à l'autre. Le workflow se personnalise dans Paramètres.</p>
        {moving && <span className="text-muted small">Mise à jour…</span>}
        {offlineNotice && (
          <span className="text-muted small">
            <i className="bi bi-wifi-off me-1"></i>Hors-ligne — sera synchronisé au retour du réseau
          </span>
        )}
      </div>

      <div className="d-flex gap-3 overflow-auto pb-2">
        {workflowSteps.map((status) => {
          const items = orders.filter((o) => o.statut === status.id)
          return (
            <div
              key={status.id}
              className="kanban-col glass p-3 d-flex flex-column"
              onDragOver={(e) => { e.preventDefault(); setDragOverColumn(status.id) }}
              onDragLeave={() => setDragOverColumn((c) => (c === status.id ? null : c))}
              onDrop={(e) => handleDrop(e, status.id)}
              style={{ outline: dragOverColumn === status.id ? '2px dashed var(--iro-magenta)' : 'none', outlineOffset: -2 }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="rounded-circle" style={{ width: 10, height: 10, background: status.color }}></span>
                <span className="font-display">{status.label}</span>
                <span className="badge rounded-pill ms-auto" style={{ background: 'rgba(255,255,255,.08)' }}>{items.length}</span>
              </div>
              <div className="d-flex flex-column gap-2 overflow-auto">
                {items.map((o) => (
                  <OrderCard
                    key={o.id} order={o} onDragStart={handleDragStart} onChanged={() => setRefreshKey((k) => k + 1)}
                    statusLabel={status.label} whatsappTemplate={whatsappSettings?.whatsapp_template_status}
                  />
                ))}
                {items.length === 0 && <p className="text-muted small mb-0">Aucune commande.</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
