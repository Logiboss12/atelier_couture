import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge.jsx'
import TextileTile from '../../components/TextileTile.jsx'
import { useFetch } from '../../api/useFetch.js'
import { getClients } from '../../api/clients.js'
import { getOrders } from '../../api/orders.js'

export default function Clients() {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const { data: clients, loading: loadingClients } = useFetch(getClients, [])
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
                onClick={() => setSelectedId(c.id)}
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
              <div className="font-mono text-muted small">{selected.ville}, {selected.pays} · client depuis {selected.depuis}</div>
            </div>
            <a href={`https://wa.me/${selected.tel.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="btn-ghost btn btn-sm">
              <i className="bi bi-whatsapp me-1"></i>WhatsApp
            </a>
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-3 mb-3">
            <div className="col">
              <div className="glass p-3 h-100">
                <div className="eyebrow mb-2">Coordonnées</div>
                <div className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}><span className="text-muted">Téléphone</span><span className="font-mono">{selected.tel}</span></div>
                <div className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}><span className="text-muted">Email</span><span className="font-mono small">{selected.email}</span></div>
                <div className="d-flex justify-content-between py-2"><span className="text-muted">Commandes</span><span className="font-mono">{selected.commandes}</span></div>
              </div>
            </div>
            <div className="col">
              <div className="glass p-3 h-100">
                <div className="eyebrow mb-2">Carnet de mesures</div>
                {Object.entries(selected.mensurations).map(([k, v]) => (
                  <div key={k} className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                    <span className="text-muted text-capitalize">{k}</span>
                    <span className="font-mono">{v} cm</span>
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
