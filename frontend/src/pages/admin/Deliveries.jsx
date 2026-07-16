import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge.jsx'
import { useFetch } from '../../api/useFetch.js'
import { getDeliveries, getTodayStatusCounts } from '../../api/deliveries.js'
import {
  getDeliveryGroups, createDeliveryGroup, deleteDeliveryGroup, updateDeliveryGroup,
  addDeliveryToGroup, removeDeliveryFromGroup,
} from '../../api/deliveryGroups.js'

const STATUT_BADGE = { a_planifier: 'neutral', planifiee: 'info', confirmee: 'ok', en_route: 'warn', livree: 'ok' }
const STATUT_LABEL = { a_planifier: 'À planifier', planifiee: 'Planifiée', confirmee: 'Confirmée', en_route: 'En route', livree: 'Livrée' }

export default function Deliveries() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: deliveries, loading: loadingDeliveries } = useFetch(getDeliveries, [refreshKey])
  const { data: todayStatusCounts, loading: loadingCounts } = useFetch(getTodayStatusCounts, [refreshKey])
  const { data: groups, loading: loadingGroups } = useFetch(getDeliveryGroups, [refreshKey])
  const [addingToGroup, setAddingToGroup] = useState(null)

  const refresh = () => setRefreshKey((k) => k + 1)

  if (loadingDeliveries || loadingCounts || loadingGroups || !deliveries || !todayStatusCounts || !groups) {
    return <p className="text-muted">Chargement…</p>
  }

  const ungrouped = deliveries.filter((d) => !d.deliveryGroupId)

  const handleAddToGroup = async (deliveryId, groupId) => {
    if (!groupId) return
    setAddingToGroup(deliveryId)
    try {
      await addDeliveryToGroup(groupId, deliveryId)
      refresh()
    } finally {
      setAddingToGroup(null)
    }
  }

  const handleRemoveFromGroup = async (groupId, deliveryId) => {
    await removeDeliveryFromGroup(groupId, deliveryId)
    refresh()
  }

  const handleGroupStatut = async (groupId, statut) => {
    await updateDeliveryGroup(groupId, { statut })
    refresh()
  }

  const handleDeleteGroup = async (group) => {
    if (!confirm(`Supprimer la tournée « ${group.label} » ? Les livraisons redeviennent individuelles.`)) return
    await deleteDeliveryGroup(group.id)
    refresh()
  }

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-8">
        <div className="glass p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="eyebrow mb-0">Livraisons individuelles</div>
            <button type="button" className="btn-iro btn btn-sm"><i className="bi bi-plus-lg me-1"></i>Planifier</button>
          </div>
          {ungrouped.map((d) => (
            <div key={d.id} className="d-flex align-items-center gap-3 border-bottom py-3 flex-wrap" style={{ borderColor: 'var(--iro-border)' }}>
              <div className="text-center" style={{ minWidth: 64 }}>
                <div className="font-display">{d.heure}</div>
                <div className="text-muted font-mono" style={{ fontSize: '.68rem' }}>{d.jour}</div>
              </div>
              <div className="flex-grow-1">
                <div className="small fw-semibold">{d.client}</div>
                <div className="text-muted font-mono" style={{ fontSize: '.72rem' }}>{d.zone} · {d.contenu}</div>
              </div>
              <StatusBadge status={d.statut}>{d.statutLabel}</StatusBadge>
              {groups.length > 0 && (
                <select
                  className="form-select form-select-sm" style={{ width: 'auto' }}
                  value="" disabled={addingToGroup === d.id}
                  onChange={(e) => handleAddToGroup(d.id, e.target.value)}
                >
                  <option value="">+ Ajouter à une tournée</option>
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
                </select>
              )}
            </div>
          ))}
          {ungrouped.length === 0 && <p className="text-muted small mb-0">Aucune livraison individuelle.</p>}
        </div>
      </div>

      <div className="col-12 col-lg-4 d-flex flex-column gap-3">
        <div className="glass p-3">
          <div className="eyebrow mb-3">Tournées groupées</div>
          {groups.length === 0 && <p className="text-muted small">Aucune tournée pour le moment.</p>}
          <div className="d-flex flex-column gap-3 mb-3">
            {groups.map((g) => (
              <div key={g.id} className="p-3 rounded-3" style={{ background: 'linear-gradient(120deg, rgba(123,92,255,.16), rgba(77,124,255,.12))' }}>
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="font-display fs-6">{g.label}</span>
                      <StatusBadge status={STATUT_BADGE[g.statut]}>{STATUT_LABEL[g.statut]}</StatusBadge>
                    </div>
                    <div className="text-muted small">{g.zone} · {g.date}{g.heureDepart ? ` · départ ${g.heureDepart}` : ''}</div>
                  </div>
                  <button type="button" className="btn-ghost btn btn-sm p-1" onClick={() => handleDeleteGroup(g)} title="Supprimer la tournée">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

                <select
                  className="form-select form-select-sm mb-2" style={{ width: 'auto' }}
                  value={g.statut} onChange={(e) => handleGroupStatut(g.id, e.target.value)}
                >
                  {Object.entries(STATUT_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>

                <div className="small text-muted mb-1">{g.deliveries.length} livraison(s)</div>
                {g.deliveries.map((d) => (
                  <div key={d.id} className="d-flex align-items-center justify-content-between py-1">
                    <span className="small">{d.client} — {d.contenu}</span>
                    <button type="button" className="btn-ghost btn btn-sm p-0" style={{ width: 20, height: 20 }} onClick={() => handleRemoveFromGroup(g.id, d.id)} title="Retirer de la tournée">
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <CreateGroupForm onCreated={refresh} />
        </div>

        <div className="glass p-3">
          <div className="eyebrow mb-3">Statuts du jour</div>
          {todayStatusCounts.map((s) => (
            <div key={s.label} className="d-flex align-items-center justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
              <div className="d-flex align-items-center gap-2">
                <span className="rounded-circle" style={{ width: 10, height: 10, background: s.color }}></span>
                <span className="small">{s.label}</span>
              </div>
              <span className="font-display">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CreateGroupForm({ onCreated }) {
  const [label, setLabel] = useState('')
  const [zone, setZone] = useState('')
  const [date, setDate] = useState('')
  const [heureDepart, setHeureDepart] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await createDeliveryGroup({ label, zone, date, heure_depart: heureDepart || null })
      setLabel('')
      setZone('')
      setDate('')
      setHeureDepart('')
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
      <input type="text" className="form-control form-control-sm" placeholder="Nom de la tournée (ex. Zone Plateau)" value={label} onChange={(e) => setLabel(e.target.value)} required />
      <input type="text" className="form-control form-control-sm" placeholder="Zone" value={zone} onChange={(e) => setZone(e.target.value)} required />
      <div className="d-flex gap-2">
        <input type="date" className="form-control form-control-sm" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" className="form-control form-control-sm" value={heureDepart} onChange={(e) => setHeureDepart(e.target.value)} />
      </div>
      {error && <div className="status danger p-2 small">{error}</div>}
      <button type="submit" className="btn-iro btn btn-sm" disabled={saving}>
        <i className="bi bi-plus-lg me-1"></i>{saving ? '…' : 'Créer une tournée'}
      </button>
    </form>
  )
}
