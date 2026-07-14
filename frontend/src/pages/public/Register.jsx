import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setSubmitting(true)
    try {
      await register(name, email, password, passwordConfirmation)
      navigate('/espace-client', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 460 }}>
      <span className="eyebrow">Inscription</span>
      <h1 className="display-5 mt-2 mb-4">Créer un compte</h1>

      <form className="glass p-4" onSubmit={handleSubmit}>
        {error && (
          <div className="status danger p-3 mb-3">
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        <label className="form-label small text-muted" htmlFor="register-name">Nom complet</label>
        <input
          id="register-name"
          type="text"
          className="form-control mb-3"
          placeholder="Aïda Ndiaye"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />

        <label className="form-label small text-muted" htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          className="form-control mb-3"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="form-label small text-muted" htmlFor="register-password">Mot de passe</label>
        <input
          id="register-password"
          type="password"
          className="form-control mb-3"
          placeholder="8 caractères minimum"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />

        <label className="form-label small text-muted" htmlFor="register-password-confirmation">Confirmer le mot de passe</label>
        <input
          id="register-password-confirmation"
          type="password"
          className="form-control mb-4"
          placeholder="••••••••"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />

        <button type="submit" className="btn-iro btn w-100" disabled={submitting}>
          {submitting ? 'Création…' : 'Créer mon compte'}
        </button>

        <p className="text-muted small text-center mt-3 mb-0">
          Déjà un compte ? <Link to="/connexion">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}
