import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useFetch } from '../../api/useFetch.js'
import { getFinanceKpis, getPaymentMethods, getExpenseCategories, getCashMovements } from '../../api/finances.js'

export default function Finances() {
  const { data: financeKpis, loading: loadingKpis } = useFetch(getFinanceKpis, [])
  const { data: paymentMethods, loading: loadingPayment } = useFetch(getPaymentMethods, [])
  const { data: expenseCategories, loading: loadingExpense } = useFetch(getExpenseCategories, [])
  const { data: cashMovements, loading: loadingCash } = useFetch(getCashMovements, [])

  if (loadingKpis || loadingPayment || loadingExpense || loadingCash
    || !financeKpis || !paymentMethods || !expenseCategories || !cashMovements) {
    return <p className="text-muted">Chargement…</p>
  }

  const totalDepenses = cashMovements.filter((m) => m.type === 'out').reduce((sum, m) => sum + m.montant, 0)

  return (
    <div>
      <div className="row row-cols-2 row-cols-md-4 g-3 mb-3">
        {financeKpis.map((k) => (
          <div className="col" key={k.label}>
            <div className="glass p-3 h-100">
              <div className="font-display fs-3" style={{ color: k.color }}>{k.valeur}</div>
              <div className="eyebrow mt-1">{k.label}</div>
              <div className="small mt-1" style={{ color: k.color }}>{k.delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-6">
          <div className="glass p-3 h-100">
            <div className="eyebrow mb-3">Soldes par moyen de paiement</div>
            {paymentMethods.map((m) => (
              <div key={m.id} className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>{m.label}</span>
                  <span className="font-mono">{m.montant}</span>
                </div>
                <div className="progress" style={{ height: 8 }}>
                  <div className="progress-bar rounded-pill" style={{ width: `${m.pct}%`, background: m.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="glass p-3 h-100">
            <div className="eyebrow mb-3">Dépenses par catégorie</div>
            <div className="d-flex align-items-center gap-4 flex-wrap">
              <div style={{ width: 160, height: 160, position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseCategories} dataKey="pct" nameKey="label" innerRadius={48} outerRadius={72} paddingAngle={3}>
                      {expenseCategories.map((c) => <Cell key={c.id} fill={c.color} stroke="none" />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <div className="font-display fs-6">{(totalDepenses / 1000000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M F</div>
                  <div className="text-muted" style={{ fontSize: '.65rem' }}>total</div>
                </div>
              </div>
              <div className="d-flex flex-column gap-2">
                {expenseCategories.map((c) => (
                  <div key={c.id} className="d-flex align-items-center gap-2 small">
                    <span style={{ width: 12, height: 12, background: c.color, borderRadius: 3, display: 'inline-block' }}></span>
                    {c.label} — {c.pct}%
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-3">
        <div className="eyebrow mb-3">Mouvements de caisse</div>
        {cashMovements.map((m) => (
          <div key={m.id} className="d-flex align-items-center gap-3 border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
            <i className={`bi ${m.type === 'in' ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle'}`} style={{ color: m.type === 'in' ? 'var(--iro-green)' : 'var(--iro-red)' }}></i>
            <div className="flex-grow-1">
              <div className="small">{m.label}</div>
              <div className="text-muted font-mono" style={{ fontSize: '.7rem' }}>{m.date} · {m.moyen}</div>
            </div>
            <span className="font-mono fw-semibold" style={{ color: m.type === 'in' ? 'var(--iro-green)' : 'var(--iro-red)' }}>
              {m.type === 'in' ? '+' : '-'}{m.montant.toLocaleString('fr-FR')} F
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
