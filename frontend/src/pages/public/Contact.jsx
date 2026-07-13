const channels = [
  { icon: 'bi-geo-alt', label: 'Adresse', value: 'Rue 12, Almadies, Dakar · Le Marais, Paris' },
  { icon: 'bi-telephone', label: 'Téléphone', value: '+221 77 512 34 56' },
  { icon: 'bi-envelope', label: 'Email', value: 'contact@maison-iro.com' },
  { icon: 'bi-instagram', label: 'Instagram', value: '@maisoniro' },
]

export default function Contact() {
  return (
    <div className="container">
      <span className="eyebrow">Contact</span>
      <h1 className="display-4 mt-2 mb-4">Parlons de votre projet</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-6 d-flex flex-column gap-3">
          {channels.map((c) => (
            <div key={c.label} className="glass d-flex align-items-center gap-3 p-3">
              <i className={`bi ${c.icon} fs-4`} style={{ color: 'var(--iro-orange)' }}></i>
              <div>
                <div className="font-mono small text-muted">{c.label}</div>
                <div>{c.value}</div>
              </div>
            </div>
          ))}
          <a href="https://wa.me/221775123456" target="_blank" rel="noreferrer" className="btn w-100" style={{ background: 'var(--iro-green)', color: '#0a2b1c' }}>
            <i className="bi bi-whatsapp me-2"></i>Écrire sur WhatsApp
          </a>
        </div>

        <div className="col-12 col-lg-6">
          <div className="glass ratio ratio-1x1 position-relative d-flex align-items-center justify-content-center" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            <span
              className="position-absolute rounded-circle"
              style={{ width: 16, height: 16, background: 'var(--iro-magenta)', boxShadow: '0 0 0 8px rgba(255,77,141,.2)', animation: 'float-a 3s ease-in-out infinite' }}
            ></span>
            <span className="font-mono text-muted small">[ carte interactive ]</span>
          </div>
        </div>
      </div>
    </div>
  )
}
