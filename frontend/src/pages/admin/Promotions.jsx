import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge.jsx'
import { promotions, events } from '../../mock/promotions.js'
import { collections } from '../../mock/catalog.js'

const reductions = ['-10%', '-20%', '-30%', '-40%', '-50%']
const canaux = ['WhatsApp', 'Instagram', 'Boutique']

export default function Promotions() {
  const [nom, setNom] = useState('')
  const [reduction, setReduction] = useState('-20%')
  const [cible, setCible] = useState(collections[0]?.nom)
  const [selectedCanaux, setSelectedCanaux] = useState(['WhatsApp'])

  const toggleCanal = (c) => {
    setSelectedCanaux((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])
  }

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-8">
        <div className="glass p-3 mb-3">
          <div className="eyebrow mb-3">Promotions</div>
          {promotions.map((p) => (
            <div key={p.id} className="d-flex align-items-center gap-3 border-bottom py-3" style={{ borderColor: 'var(--iro-border)' }}>
              <span className="rounded-pill flex-shrink-0" style={{ width: 4, height: 40, background: p.statut === 'ok' ? 'var(--iro-green)' : p.statut === 'info' ? 'var(--iro-blue)' : 'var(--iro-faint)' }}></span>
              <div className="flex-grow-1">
                <div className="fw-semibold small">{p.nom}</div>
                <div className="text-muted font-mono" style={{ fontSize: '.72rem' }}>{p.periode} · {p.cible}</div>
              </div>
              <div className="font-display fs-4" style={{ color: 'var(--iro-orange)' }}>{p.reduction}</div>
              <div className="text-end">
                <StatusBadge status={p.statut}>{p.statutLabel}</StatusBadge>
                <div className="font-mono text-muted mt-1" style={{ fontSize: '.7rem' }}>CA {p.ca}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass p-3">
          <div className="eyebrow mb-3">Événements</div>
          <div className="row row-cols-1 row-cols-sm-2 g-3">
            {events.map((e) => (
              <div className="col" key={e.id}>
                <div className="glass p-3 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <i className="bi bi-calendar-event fs-4" style={{ color: 'var(--iro-violet)' }}></i>
                    <StatusBadge status={e.statut}>{e.statutLabel}</StatusBadge>
                  </div>
                  <div className="font-display fs-6">{e.nom}</div>
                  <div className="text-muted font-mono" style={{ fontSize: '.7rem' }}>{e.date} · {e.lieu}</div>
                  <div className="progress mt-2" style={{ height: 6 }}>
                    <div className="progress-bar rounded-pill" style={{ width: `${e.remplissage}%`, background: 'var(--iro-grad)' }}></div>
                  </div>
                  <div className="text-muted small mt-1">{e.capacite}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="glass p-4">
          <div className="eyebrow mb-3">Lancer une promotion</div>
          <input type="text" className="form-control mb-3" placeholder="Nom de la promotion" value={nom} onChange={(e) => setNom(e.target.value)} />

          <div className="eyebrow mb-2">Réduction</div>
          <div className="d-flex gap-2 flex-wrap mb-3">
            {reductions.map((r) => (
              <button
                key={r} type="button" className="badge rounded-pill border-0"
                style={{ padding: '.5rem .8rem', cursor: 'pointer', background: reduction === r ? 'var(--iro-grad)' : 'rgba(255,255,255,.06)', color: reduction === r ? '#160a12' : 'var(--iro-text)' }}
                onClick={() => setReduction(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="eyebrow mb-2">Période</div>
          <div className="d-flex gap-2 mb-3">
            <input type="date" className="form-control" />
            <input type="date" className="form-control" />
          </div>

          <div className="eyebrow mb-2">Cible</div>
          <div className="d-flex gap-2 flex-wrap mb-3">
            {collections.map((c) => (
              <button
                key={c.id} type="button" className="badge rounded-pill border-0"
                style={{ padding: '.5rem .8rem', cursor: 'pointer', background: cible === c.nom ? 'var(--iro-grad)' : 'rgba(255,255,255,.06)', color: cible === c.nom ? '#160a12' : 'var(--iro-text)' }}
                onClick={() => setCible(c.nom)}
              >
                {c.nom}
              </button>
            ))}
          </div>

          <div className="eyebrow mb-2">Canaux</div>
          <div className="d-flex gap-2 flex-wrap mb-3">
            {canaux.map((c) => (
              <button
                key={c} type="button" className="badge rounded-pill border-0"
                style={{ padding: '.5rem .8rem', cursor: 'pointer', background: selectedCanaux.includes(c) ? 'var(--iro-grad)' : 'rgba(255,255,255,.06)', color: selectedCanaux.includes(c) ? '#160a12' : 'var(--iro-text)' }}
                onClick={() => toggleCanal(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="glass p-3 mb-3" style={{ background: 'linear-gradient(120deg, rgba(255,138,61,.16), rgba(255,77,141,.1))' }}>
            <div className="eyebrow mb-1">Aperçu remise</div>
            <div className="font-display fs-3" style={{ color: 'var(--iro-orange)' }}>{reduction} sur {cible}</div>
          </div>

          <button type="button" className="btn-iro btn w-100 mb-2">Programmer la promotion</button>
          <button type="button" className="btn-ghost btn w-100">+ Créer un événement</button>
        </div>
      </div>
    </div>
  )
}
