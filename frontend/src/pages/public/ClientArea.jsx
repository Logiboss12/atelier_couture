import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge.jsx'
import { currentClient } from '../../mock/clientArea.js'

const menu = [
  { id: 'suivi', label: 'Suivi de commande', icon: 'bi-scissors' },
  { id: 'mesures', label: 'Carnet de mesures', icon: 'bi-rulers' },
  { id: 'docs', label: 'Devis & factures', icon: 'bi-receipt' },
]

export default function ClientArea() {
  const [active, setActive] = useState('suivi')
  const { commandeSuivie, mensurations, documents } = currentClient

  return (
    <div className="container">
      <h1 className="display-5 mb-1">Bonjour, {currentClient.nom.split(' ')[0]}</h1>
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
            <div className="glass p-4">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                <div>
                  <div className="font-mono text-muted small">{commandeSuivie.ref}</div>
                  <div className="font-display fs-4">{commandeSuivie.modele}</div>
                </div>
                <StatusBadge status="warn">{commandeSuivie.statut}</StatusBadge>
              </div>

              <div className="position-relative d-flex justify-content-between px-2 mb-3">
                <div className="position-absolute top-50 start-0 end-0" style={{ height: 2, background: 'var(--iro-border)', zIndex: 0 }}></div>
                {commandeSuivie.etapes.map((etape, i) => {
                  const done = i < commandeSuivie.etapeActive
                  const isActive = i === commandeSuivie.etapeActive
                  return (
                    <div key={etape} className="d-flex flex-column align-items-center position-relative" style={{ zIndex: 1 }}>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 34, height: 34,
                          background: done ? 'var(--iro-green)' : isActive ? 'var(--iro-grad)' : 'var(--iro-bg)',
                          border: done || isActive ? 'none' : '2px solid var(--iro-border)',
                          boxShadow: isActive ? '0 0 0 6px rgba(255,77,141,.18)' : 'none',
                          color: done || isActive ? '#160a12' : 'var(--iro-faint)',
                        }}
                      >
                        {done ? <i className="bi bi-check-lg"></i> : i + 1}
                      </div>
                      <span className="font-mono small mt-2 text-center d-none d-sm-block" style={{ color: done || isActive ? 'var(--iro-text)' : 'var(--iro-faint)' }}>{etape}</span>
                    </div>
                  )
                })}
              </div>

              <div className="row g-3 mt-3">
                <div className="col-12 col-md-6">
                  <div className="glass p-3">
                    <div className="eyebrow mb-2">Carnet de mesures</div>
                    {Object.entries(mensurations).map(([k, v]) => (
                      <div key={k} className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                        <span className="text-muted text-capitalize">{k}</span>
                        <span className="font-mono">{v} cm</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="glass p-3">
                    <div className="eyebrow mb-2">Devis & factures</div>
                    {documents.map((d) => (
                      <div key={d.id} className="d-flex justify-content-between align-items-center border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                        <div>
                          <div className="small">{d.label}</div>
                          <div className="font-mono text-muted" style={{ fontSize: '.75rem' }}>{d.montant}</div>
                        </div>
                        <button type="button" className="btn-ghost btn btn-sm">↓ PDF</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === 'mesures' && (
            <div className="glass p-4">
              <div className="eyebrow mb-3">Carnet de mesures</div>
              {Object.entries(mensurations).map(([k, v]) => (
                <div key={k} className="d-flex justify-content-between border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                  <span className="text-muted text-capitalize">{k}</span>
                  <span className="font-mono">{v} cm</span>
                </div>
              ))}
            </div>
          )}

          {active === 'docs' && (
            <div className="glass p-4">
              <div className="eyebrow mb-3">Devis & factures</div>
              {documents.map((d) => (
                <div key={d.id} className="d-flex justify-content-between align-items-center border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                  <div>
                    <div className="small">{d.label}</div>
                    <div className="font-mono text-muted" style={{ fontSize: '.75rem' }}>{d.montant}</div>
                  </div>
                  <button type="button" className="btn-ghost btn btn-sm">↓ PDF</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
