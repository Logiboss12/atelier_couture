import { useState } from 'react'
import { useFetch } from '../../api/useFetch.js'
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../../api/teamMembers.js'

export default function Team() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [editing, setEditing] = useState(undefined) // undefined = closed, null = create, object = edit
  const { data: team, loading } = useFetch(getTeamMembers, [refreshKey])

  const refresh = () => setRefreshKey((k) => k + 1)
  const handleSaved = () => { setEditing(undefined); refresh() }

  const handleDelete = async (member) => {
    if (!confirm(`Retirer « ${member.nom} » de l'équipe ?`)) return
    await deleteTeamMember(member.id)
    refresh()
  }

  if (loading || !team) return <p className="text-muted">Chargement…</p>

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button type="button" className="btn-iro btn btn-sm" onClick={() => setEditing(null)}>
          <i className="bi bi-person-plus me-1"></i>Ajouter un membre
        </button>
      </div>

      {editing !== undefined && (
        <TeamMemberForm member={editing} onSaved={handleSaved} onCancel={() => setEditing(undefined)} />
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
        {team.map((m) => (
          <div className="col" key={m.id}>
            <div className="glass p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="rounded-circle flex-shrink-0" style={{ width: 52, height: 52, background: 'var(--iro-grad)' }}></span>
                <div className="flex-grow-1">
                  <div className="font-display">{m.nom}</div>
                  <div className="font-mono small" style={{ color: m.roleColor }}>{m.role}</div>
                </div>
                <div className="d-flex gap-1">
                  <button type="button" className="btn-ghost btn btn-sm" onClick={() => setEditing(m)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button type="button" className="btn-ghost btn btn-sm" onClick={() => handleDelete(m)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <div className="mb-3">
                {m.hasAccount ? (
                  <span className="badge rounded-pill" style={{ background: 'var(--iro-green)', color: '#0a2b1c' }}>
                    <i className="bi bi-shield-check me-1"></i>Accès back-office · {m.accountEmail}
                  </span>
                ) : (
                  <span className="badge rounded-pill border" style={{ borderColor: 'var(--iro-border)', background: 'rgba(255,255,255,.05)' }}>
                    Pas de compte de connexion
                  </span>
                )}
              </div>

              {m.permissions.length > 0 && (
                <>
                  <div className="eyebrow mb-2">Permissions</div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {m.permissions.map((p) => (
                      <span key={p} className="badge rounded-pill border" style={{ borderColor: 'var(--iro-border)', background: 'rgba(255,255,255,.05)', color: 'var(--iro-text)' }}>{p}</span>
                    ))}
                  </div>
                </>
              )}

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
        {team.length === 0 && <p className="text-muted">Aucun membre d'équipe pour le moment.</p>}
      </div>
    </div>
  )
}

function TeamMemberForm({ member, onSaved, onCancel }) {
  const isEdit = !!member
  const [nom, setNom] = useState(member?.nom ?? '')
  const [role, setRole] = useState(member?.role ?? '')
  const [roleColor, setRoleColor] = useState(member?.roleColor ?? '#ff8a3d')
  const [charge, setCharge] = useState(member?.charge ?? 0)
  const [grantAccount, setGrantAccount] = useState(false)
  const [email, setEmail] = useState(member?.accountEmail ?? '')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const canGrantAccount = !isEdit || !member.hasAccount

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        nom,
        role,
        role_color: roleColor,
        charge: Number(charge) || 0,
      }

      if (canGrantAccount && grantAccount) {
        payload.email = email
        payload.password = password
      }

      if (isEdit) {
        await updateTeamMember(member.id, payload)
      } else {
        await createTeamMember(payload)
      }

      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="glass p-4 mb-3" onSubmit={handleSubmit}>
      <div className="row g-2">
        <div className="col-12 col-sm-6">
          <label className="font-mono small d-block mb-1">Nom</label>
          <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div className="col-12 col-sm-6">
          <label className="font-mono small d-block mb-1">Rôle (ex. Couturier, Styliste)</label>
          <input type="text" className="form-control" value={role} onChange={(e) => setRole(e.target.value)} required />
        </div>
        <div className="col-6 col-sm-3">
          <label className="font-mono small d-block mb-1">Couleur</label>
          <input type="color" className="form-control form-control-color w-100" value={roleColor} onChange={(e) => setRoleColor(e.target.value)} />
        </div>
        <div className="col-6 col-sm-3">
          <label className="font-mono small d-block mb-1">Charge (%)</label>
          <input type="number" className="form-control" min="0" max="100" value={charge} onChange={(e) => setCharge(e.target.value)} />
        </div>
      </div>

      {canGrantAccount && (
        <div className="mt-3">
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input" type="checkbox" role="switch" id="grant-account"
              checked={grantAccount} onChange={(e) => setGrantAccount(e.target.checked)}
            />
            <label className="form-check-label small" htmlFor="grant-account">
              Créer un accès back-office (rôle Couturier / Employé — accès limité : clients, commandes, livraisons)
            </label>
          </div>
          {grantAccount && (
            <div className="row g-2">
              <div className="col-12 col-sm-6">
                <label className="font-mono small d-block mb-1">Email de connexion</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required={grantAccount} />
              </div>
              <div className="col-12 col-sm-6">
                <label className="font-mono small d-block mb-1">Mot de passe</label>
                <input type="password" className="form-control" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required={grantAccount} />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="status danger p-3 mt-3">
          <i className="bi bi-exclamation-circle me-2"></i>{error}
        </div>
      )}

      <div className="d-flex gap-2 mt-3">
        <button type="button" className="btn-ghost btn btn-sm" onClick={onCancel}>Annuler</button>
        <button type="submit" className="btn-iro btn btn-sm" disabled={saving}>
          {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer'}
        </button>
      </div>
    </form>
  )
}
