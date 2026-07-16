import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge.jsx'
import TextileTile from '../../components/TextileTile.jsx'
import { useFetch } from '../../api/useFetch.js'
import { getClients } from '../../api/clients.js'
import { getOrders } from '../../api/orders.js'
import { createMeasurement, deleteMeasurement } from '../../api/measurements.js'
import { measurementFields } from '../../mock/customOrder.js'

export default function Clients() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [showMeasurementForm, setShowMeasurementForm] = useState(false)

  const { data: clients, loading: loadingClients } = useFetch(getClients, [refreshKey])
  const { data: orders } = useFetch(getOrders, [])

  if (loadingClients || !clients) return <p className="text-muted">Chargement…</p>
  if (clients.length === 0) return <p className="text-muted">Aucun client enregistré.</p>

  const filtered = clients.filter((c) => c.nom.toLowerCase().includes(search.toLowerCase()))
  const selected = clients.find((c) => c.id === selectedId) || clients[0]
  const history = (orders || []).filter((o) => o.client === selected.nom)

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-4">
        <div className="glass p-2">
          <div className="input-group mb-2">
            <span className="input-group-text bg-transparent border-0" style={{ color: 'var(--iro-faint)' }}><i className="bi bi-search"></i></span>
            <input type="search" className="form-control border-0 bg-transparent" placeholder="Rechercher un client…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="d-flex flex-column gap-1" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                className="btn d-flex align-items-center gap-2 rounded-3 p-2 text-start border-0"
                style={{ background: selectedId === c.id ? 'rgba(255,77,141,.14)' : 'transparent', color: 'var(--iro-text)' }}
                onClick={() => { setSelectedId(c.id); setShowMeasurementForm(false) }}
              >
                <span className="rounded-circle flex-shrink-0" style={{ width: 40, height: 40, background: 'var(--iro-grad)' }}></span>
                <span className="flex-grow-1">
                  <span className="d-block small fw-semibold">{c.nom}</span>
                  <span className="d-block font-mono text-muted" style={{ fontSize: '.7rem' }}>{c.ville} · {c.commandes} cmd</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-8">
        <div className="glass p-4">
          <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3" style={{ borderColor: 'var(--iro-border)' }}>
            <span className="rounded-circle flex-shrink-0" style={{ width: 64, height: 64, background: 'var(--iro-grad)' }}></span>
            <div className="flex-grow-1">
              <div className="font-display fs-3">{selected.nom}</div>
              <div className="font-mono text-muted small">
                {[selected.ville, selected.pays].filter(Boolean).join(', ') || 'Localisation inconnue'}
                {selected.depuis ? ` · client depuis ${selected.depuis}` : ''}
              </div>
            </div>
            {selected.tel && (
              <a href={`https://wa.me/${selected.tel.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="btn-ghost btn btn-sm">
                <i className="bi bi-whatsapp me-1"></i>WhatsApp
              </a>
            )}
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-3 mb-3">
            <div className="col">
              <div className="glass p-3 h-100">
                <div className="eyebrow mb-2">Coordonnées</div>
                <div className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}><span className="text-muted">Téléphone</span><span className="font-mono">{selected.tel || '—'}</span></div>
                <div className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}><span className="text-muted">Email</span><span className="font-mono small">{selected.email}</span></div>
                <div className="d-flex justify-content-between py-2"><span className="text-muted">Commandes</span><span className="font-mono">{selected.commandes}</span></div>
              </div>
            </div>
            <div className="col">
              <div className="glass p-3 h-100">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="eyebrow mb-0">Carnet de mesures</div>
                  <button type="button" className="btn-ghost btn btn-sm" onClick={() => setShowMeasurementForm((v) => !v)}>
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </div>

                {showMeasurementForm && (
                  <MeasurementForm
                    clientId={selected.id}
                    onSaved={() => { setShowMeasurementForm(false); setRefreshKey((k) => k + 1) }}
                    onCancel={() => setShowMeasurementForm(false)}
                  />
                )}

                {selected.measurements.length === 0 && !showMeasurementForm && (
                  <p className="text-muted small mb-0">Aucune mesure enregistrée pour ce client.</p>
                )}

                {selected.measurements.map((m) => (
                  <div key={m.id} className="border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="small fw-semibold">{m.typeVetement}</span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="font-mono text-muted" style={{ fontSize: '.68rem' }}>{m.priseLe}</span>
                        <button
                          type="button" className="btn-ghost btn btn-sm p-0" style={{ width: 22, height: 22, lineHeight: 1 }}
                          onClick={async () => { if (confirm('Supprimer cette prise de mesures ?')) { await deleteMeasurement(m.id); setRefreshKey((k) => k + 1) } }}
                        >
                          <i className="bi bi-x" style={{ fontSize: '.85rem' }}></i>
                        </button>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {Object.entries(m.valeurs).map(([k, v]) => (
                        <span key={k} className="font-mono text-muted" style={{ fontSize: '.7rem' }}>{k} {v}cm</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="eyebrow mb-2">Historique des commandes</div>
          {history.length === 0 && <p className="text-muted small">Aucune commande enregistrée pour ce client.</p>}
          {history.map((o) => (
            <div key={o.id} className="d-flex align-items-center gap-3 border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
              <TextileTile variant={o.tissu} style={{ width: 40, height: 40, flexShrink: 0 }} />
              <div className="flex-grow-1">
                <div className="small fw-semibold">{o.modele}</div>
                <div className="font-mono text-muted" style={{ fontSize: '.7rem' }}>{o.ref} · {o.echeance}</div>
              </div>
              <StatusBadge status={o.statut === 'livree' ? 'ok' : o.statut === 'recue' ? 'info' : 'warn'}>{o.statut}</StatusBadge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MeasurementForm({ clientId, onSaved, onCancel }) {
  const [typeVetement, setTypeVetement] = useState('')
  const [valeurs, setValeurs] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const nonEmpty = Object.fromEntries(Object.entries(valeurs).filter(([, v]) => v !== '' && v != null))
      await createMeasurement({ client_id: clientId, type_vetement: typeVetement, valeurs: nonEmpty })
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="mb-3" onSubmit={handleSubmit}>
      <input
        type="text" className="form-control form-control-sm mb-2" placeholder="Type de vêtement (ex. Tailleur, Robe de soirée)"
        value={typeVetement} onChange={(e) => setTypeVetement(e.target.value)} required
      />
      <div className="row row-cols-2 g-2 mb-2">
        {measurementFields.map((f) => (
          <div className="col" key={f.id}>
            <input
              type="number" className="form-control form-control-sm" placeholder={f.label}
              value={valeurs[f.id] ?? ''} onChange={(e) => setValeurs((v) => ({ ...v, [f.id]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      {error && <div className="status danger p-2 mb-2 small">{error}</div>}
      <div className="d-flex gap-2">
        <button type="button" className="btn-ghost btn btn-sm" onClick={onCancel}>Annuler</button>
        <button type="submit" className="btn-iro btn btn-sm" disabled={saving}>{saving ? '…' : 'Enregistrer'}</button>
      </div>
    </form>
  )
}
