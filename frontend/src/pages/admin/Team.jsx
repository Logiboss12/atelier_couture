import { useFetch } from '../../api/useFetch.js'
import { getTeamMembers } from '../../api/teamMembers.js'

export default function Team() {
  const { data: team, loading } = useFetch(getTeamMembers, [])

  if (loading || !team) return <p className="text-muted">Chargement…</p>

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
      {team.map((m) => (
        <div className="col" key={m.id}>
          <div className="glass p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="rounded-circle flex-shrink-0" style={{ width: 52, height: 52, background: 'var(--iro-grad)' }}></span>
              <div>
                <div className="font-display">{m.nom}</div>
                <div className="font-mono small" style={{ color: m.roleColor }}>{m.role}</div>
              </div>
            </div>

            <div className="eyebrow mb-2">Permissions</div>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {m.permissions.map((p) => (
                <span key={p} className="badge rounded-pill border" style={{ borderColor: 'var(--iro-border)', background: 'rgba(255,255,255,.05)', color: 'var(--iro-text)' }}>{p}</span>
              ))}
            </div>

            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Charge de travail</span>
              <span>{m.charge}%</span>
            </div>
            <div className="progress mb-3" style={{ height: 8 }}>
              <div className="progress-bar rounded-pill" style={{ width: `${m.charge}%`, background: 'var(--iro-grad)' }}></div>
            </div>

            <div className="font-mono text-muted small">{m.assignees} commandes assignées</div>
          </div>
        </div>
      ))}
    </div>
  )
}
