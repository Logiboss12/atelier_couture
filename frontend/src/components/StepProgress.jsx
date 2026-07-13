export default function StepProgress({ steps, active }) {
  return (
    <div className="d-flex align-items-center mb-4" role="list" aria-label="Étapes de la commande">
      {steps.map((step, i) => (
        <div key={step} className="d-flex align-items-center flex-grow-1" role="listitem">
          <div className="d-flex flex-column align-items-center" style={{ minWidth: 32 }}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center font-mono"
              style={{
                width: 32, height: 32, fontSize: '.8rem',
                background: i < active ? 'var(--iro-green)' : i === active ? 'var(--iro-grad)' : 'rgba(255,255,255,.08)',
                color: i <= active ? '#160a12' : 'var(--iro-faint)',
                border: i <= active ? 'none' : '1px solid var(--iro-border)',
              }}
              aria-current={i === active ? 'step' : undefined}
            >
              {i < active ? <i className="bi bi-check-lg"></i> : i + 1}
            </div>
            <span className="font-mono d-none d-md-block mt-1 text-center" style={{ fontSize: '.68rem', color: i <= active ? 'var(--iro-text)' : 'var(--iro-faint)' }}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-grow-1 mx-2" style={{ height: 2, background: i < active ? 'var(--iro-green)' : 'var(--iro-border)' }}></div>
          )}
        </div>
      ))}
    </div>
  )
}
