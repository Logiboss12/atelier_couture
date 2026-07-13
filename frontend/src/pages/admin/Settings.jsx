import { useState } from 'react'

const paymentSwitches = [
  { id: 'esp', label: 'Espèces', checked: true },
  { id: 'mm', label: 'Mobile Money', checked: true },
  { id: 'carte', label: 'Carte bancaire', checked: true },
  { id: 'vir', label: 'Virement', checked: false },
]

export default function Settings() {
  const [switches, setSwitches] = useState(paymentSwitches)

  const toggle = (id) => setSwitches((prev) => prev.map((s) => s.id === id ? { ...s, checked: !s.checked } : s))

  return (
    <div className="row g-3" style={{ maxWidth: 1000 }}>
      <div className="col-12 col-lg-6">
        <div className="glass p-4">
          <div className="eyebrow mb-3">Profil de l'atelier</div>
          <div className="border border-2 border-dashed rounded-3 p-4 text-center mb-2" style={{ borderColor: 'var(--iro-border)' }}>
            <i className="bi bi-image fs-1 d-block mb-2" style={{ color: 'var(--iro-faint)' }}></i>
            <span className="text-muted small">Aucun logo importé</span>
          </div>
          <button type="button" className="btn-ghost btn btn-sm mb-3">Importer un logo</button>

          <label className="font-mono small d-block mb-1">Nom</label>
          <input type="text" className="form-control mb-3" defaultValue="Maison Ìró" />

          <label className="font-mono small d-block mb-1">Sous-domaine</label>
          <div className="input-group">
            <input type="text" className="form-control" defaultValue="maison-iro" />
            <span className="input-group-text" style={{ background: 'rgba(0,0,0,.25)', border: '1px solid var(--iro-border)', color: 'var(--iro-text)' }}>.atelier.app</span>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-6 d-flex flex-column gap-3">
        <div className="glass p-4">
          <div className="eyebrow mb-3">Moyens de paiement</div>
          {switches.map((s) => (
            <div key={s.id} className="d-flex justify-content-between align-items-center border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
              <span className="small">{s.label}</span>
              <div className="form-check form-switch mb-0">
                <input className="form-check-input" type="checkbox" role="switch" checked={s.checked} onChange={() => toggle(s.id)} />
              </div>
            </div>
          ))}
        </div>

        <div className="glass p-4">
          <div className="eyebrow mb-3">Modèles de messages WhatsApp</div>
          <label className="font-mono small d-block mb-1">Confirmation de commande</label>
          <textarea className="form-control mb-3" rows={3} defaultValue={'Bonjour {client}, votre commande {ref} ({model}) a bien été reçue. Merci de votre confiance ! — Maison Ìró'}></textarea>
          <label className="font-mono small d-block mb-1">Commande prête</label>
          <textarea className="form-control" rows={3} defaultValue={'Bonjour {client}, votre commande {ref} est prête ! Retrait possible dès le {date}.'}></textarea>
        </div>
      </div>
    </div>
  )
}
