export default function KpiCard({ icon, label, value, delta, color = 'var(--iro-text)' }) {
  return (
    <div className="glass p-3 h-100">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <i className={`bi ${icon} fs-5`} style={{ color }} aria-hidden="true"></i>
        {delta && (
          <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,.08)', color }}>
            {delta}
          </span>
        )}
      </div>
      <div className="font-display fs-3" style={{ color }}>{value}</div>
      <div className="eyebrow mt-1">{label}</div>
    </div>
  )
}
