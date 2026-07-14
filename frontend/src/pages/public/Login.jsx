import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const user = await login(email, password)
      const redirectTo = location.state?.from || (user.role === 'admin' ? '/admin' : '/espace-client')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 460 }}>
      <span className="eyebrow">Connexion</span>
      <h1 className="display-5 mt-2 mb-4">Bon retour</h1>

      <form className="glass p-4" onSubmit={handleSubmit}>
        {error && (
          <div className="status danger p-3 mb-3">
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        <label className="form-label small text-muted" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          className="form-control mb-3"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label className="form-label small text-muted" htmlFor="login-password">Mot de passe</label>
        <input
          id="login-password"
          type="password"
          className="form-control mb-4"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button type="submit" className="btn-iro btn w-100" disabled={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>

        <p className="text-muted small text-center mt-3 mb-0">
          Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
        </p>
      </form>
    </div>
  )
}
