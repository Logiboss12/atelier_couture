import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { Link } from 'react-router-dom'
import KpiCard from '../../components/KpiCard.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import TextileTile from '../../components/TextileTile.jsx'
import { orderStatuses } from '../../mock/orders.js'
import { relanceAlerts, dueSoon } from '../../mock/alerts.js'
import { useFetch } from '../../api/useFetch.js'
import { getOrders } from '../../api/orders.js'
import { getFinanceSummary } from '../../api/finances.js'

const statusMap = Object.fromEntries(orderStatuses.map((s) => [s.id, s]))

const MOIS_COURTS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

function formatF(value) {
  return `${(value ?? 0).toLocaleString('fr-FR')} F`
}

export default function Dashboard() {
  const { data: orders } = useFetch(getOrders, [])
  const { data: summary } = useFetch(getFinanceSummary, [])

  const recentOrders = [...(orders || [])].sort((a, b) => b.id - a.id).slice(0, 5)

  const now = new Date()
  const commandesDuJour = (orders || []).filter((o) => o.echeance === now.toISOString().slice(0, 10)).length
  const echeances48h = (orders || []).filter((o) => {
    if (!o.echeance || o.statut === 'livree') return false
    const hours = (new Date(o.echeance) - now) / 3600000
    return hours >= 0 && hours <= 48
  }).length

  const rentabilite = summary?.entrees_mois > 0
    ? Math.round((summary.benefice_net / summary.entrees_mois) * 100)
    : 0

  const revenueByMonth = (summary?.revenue_by_month ?? []).map((r) => ({
    mois: MOIS_COURTS[Number(r.mois.split('-')[1]) - 1],
    ca: r.ca,
  }))

  return (
    <div>
      <div className="row row-cols-2 row-cols-xl-5 g-3 mb-3">
        <div className="col"><KpiCard icon="bi-scissors" label="Commandes du jour" value={String(commandesDuJour)} color="var(--iro-text)" /></div>
        <div className="col"><KpiCard icon="bi-alarm" label="Échéances 48h" value={String(echeances48h)} delta={echeances48h > 0 ? 'urgent' : ''} color="var(--iro-orange)" /></div>
        <div className="col"><KpiCard icon="bi-cash-coin" label="Solde de caisse" value={formatF(summary?.solde)} color="var(--iro-green)" /></div>
        <div className="col"><KpiCard icon="bi-exclamation-circle" label="Impayés" value={formatF(summary?.impayes)} delta={summary ? `${summary.impayes_count} facture(s)` : ''} color="var(--iro-red)" /></div>
        <div className="col"><KpiCard icon="bi-graph-up-arrow" label="Rentabilité" value={`${rentabilite}%`} color="var(--iro-violet)" /></div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-8">
          <div className="glass p-3 h-100">
            <div className="eyebrow mb-3">Chiffre d'affaires — 6 derniers mois</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" vertical={false} />
                <XAxis dataKey="mois" stroke="rgba(244,240,234,.5)" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1c1636', border: '1px solid rgba(255,255,255,.09)', borderRadius: 12, color: '#f4f0ea' }}
                  formatter={(v) => `${v.toLocaleString('fr-FR')} F`}
                />
                <Bar dataKey="ca" radius={[8, 8, 0, 0]} fill="url(#barGrad)" />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff8a3d" />
                    <stop offset="100%" stopColor="#7b5cff" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="glass p-3 h-100">
            <div className="eyebrow mb-3">Alertes de relance</div>
            <div className="d-flex flex-column">
              {relanceAlerts.map((a) => (
                <div key={a.id} className="d-flex align-items-center gap-3 border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                  <span className="rounded-circle flex-shrink-0" style={{ width: 10, height: 10, background: a.color }}></span>
                  <div className="flex-grow-1">
                    <div className="small">{a.titre}</div>
                    <div className="text-muted font-mono" style={{ fontSize: '.7rem' }}>{a.meta}</div>
                  </div>
                  <StatusBadge status={a.tagStatus}>{a.tag}</StatusBadge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="glass p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="eyebrow mb-0">Commandes récentes</div>
              <Link to="/admin/commandes" className="small">Voir tout</Link>
            </div>
            {(recentOrders || []).map((o) => (
              <div key={o.id} className="d-flex align-items-center gap-3 border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                <TextileTile variant={o.tissu} style={{ width: 40, height: 40, flexShrink: 0 }} />
                <div className="flex-grow-1">
                  <div className="small fw-semibold">{o.client}</div>
                  <div className="font-mono text-muted" style={{ fontSize: '.7rem' }}>{o.ref} · {o.modele}</div>
                </div>
                <StatusBadge status={o.statut === 'livree' ? 'ok' : o.statut === 'recue' ? 'info' : 'warn'}>{statusMap[o.statut]?.label}</StatusBadge>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="glass p-3 h-100">
            <div className="eyebrow mb-3">Échéances 24/48h</div>
            {dueSoon.map((d) => (
              <div key={d.id} className="d-flex align-items-center gap-3 border-bottom py-2" style={{ borderColor: 'var(--iro-border)' }}>
                <span className="font-mono fw-bold" style={{ color: d.heures <= 12 ? 'var(--iro-red)' : d.heures <= 24 ? 'var(--iro-orange)' : 'var(--iro-blue)', minWidth: 46 }}>
                  {d.heures}h
                </span>
                <div className="flex-grow-1">
                  <div className="small fw-semibold">{d.client}</div>
                  <div className="text-muted" style={{ fontSize: '.75rem' }}>{d.modele}</div>
                </div>
                <span className="font-mono text-muted small">{d.assigne}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
