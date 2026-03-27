import { useState } from 'react'
import { ISP7_PORTFOLIO, ISP7_STATS, FUND_STATS } from '../lib/portfolio'
import PortfolioDrawer from './PortfolioDrawer'

function moicColor(moic) {
  if (moic >= 3) return 'text-emerald-600 dark:text-emerald-300'
  if (moic >= 2) return 'text-blue-600 dark:text-blue-300'
  if (moic >= 1.5) return 'text-sky-600 dark:text-sky-300'
  if (moic < 1) return 'text-red-500 dark:text-red-400'
  return 'text-th-tx2'
}

function statusBadge(status) {
  if (status?.includes('Public')) return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900'
  if (status?.includes('Acquired') || status?.includes('Realized')) return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900'
  return 'bg-th-hover text-th-tx3 border-th-bd'
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-th-surface border border-th-bd rounded-lg px-4 py-3">
      <div className="text-[10px] font-medium text-th-tx4 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[18px] font-semibold text-th-tx leading-tight">{value}</div>
      {sub && <div className="text-[11px] text-th-tx4 mt-0.5">{sub}</div>}
    </div>
  )
}

const SORT_OPTIONS = [
  { key: 'gross_moic', label: 'MOIC ↓' },
  { key: 'fmv_m', label: 'FMV ↓' },
  { key: 'invested_m', label: 'Invested ↓' },
  { key: 'date', label: 'Date ↓' },
]

export default function PortfolioTab() {
  const [selectedCo, setSelectedCo] = useState(null)
  const [sort, setSort] = useState('gross_moic')
  const [search, setSearch] = useState('')
  const [showFundStats, setShowFundStats] = useState(false)

  const filtered = ISP7_PORTFOLIO
    .filter(co => {
      if (!search) return true
      const q = search.toLowerCase()
      return co.company.toLowerCase().includes(q) || co.sector?.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sort === 'date') return new Date(b.date) - new Date(a.date)
      return (b[sort] || 0) - (a[sort] || 0)
    })

  return (
    <div className="flex flex-col h-full bg-th-bg overflow-hidden">
      {/* Header stats */}
      <div className="flex-shrink-0 border-b border-th-bd-sub bg-th-panel px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[15px] font-semibold text-th-tx">ISP VII Portfolio</h2>
            <p className="text-[12px] text-th-tx4 mt-0.5">As of December 31, 2025 · {ISP7_PORTFOLIO.length} companies</p>
          </div>
          <button
            onClick={() => setShowFundStats(s => !s)}
            className="text-[12px] text-th-tx3 hover:text-th-tx transition-colors px-3 py-1.5 rounded-lg border border-th-bd hover:border-th-bd-str bg-th-surface"
          >
            {showFundStats ? 'Hide fund stats' : 'All fund stats'}
          </button>
        </div>

        {/* ISP VII summary */}
        <div className="grid grid-cols-5 gap-2">
          <StatCard label="Net MOIC" value={`${ISP7_STATS.net_moic}x`} sub="ISP VII" />
          <StatCard label="Net IRR" value={ISP7_STATS.net_irr} sub="since inception" />
          <StatCard label="NAV" value={`$${(ISP7_STATS.nav_m / 1000).toFixed(1)}B`} sub="as of 12/31/25" />
          <StatCard label="Active Cos" value={ISP7_STATS.active_cos} sub="unrealized" />
          <StatCard label="% Deployed" value={`${ISP7_STATS.pct_invested}%`} sub="of committed" />
        </div>

        {/* All fund stats */}
        {showFundStats && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[700px] text-[12px]">
              <thead>
                <tr className="border-b border-th-bd-sub">
                  {['Fund','Committed','Invested','Total Value','Gross MOIC','Net MOIC','Net IRR','DPI'].map(h => (
                    <th key={h} className="text-left pb-2 pr-4 text-[10px] text-th-tx4 uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FUND_STATS.map(f => (
                  <tr key={f.fund} className={`border-b border-th-bd-sub ${f.fund === 'ISP VII' ? 'text-th-tx font-medium' : 'text-th-tx3'}`}>
                    <td className="py-1.5 pr-4">{f.fund}</td>
                    <td className="py-1.5 pr-4">${(f.committed_m / 1000).toFixed(1)}B</td>
                    <td className="py-1.5 pr-4">${(f.invested_m / 1000).toFixed(1)}B</td>
                    <td className="py-1.5 pr-4">${(f.total_value_m / 1000).toFixed(1)}B</td>
                    <td className={`py-1.5 pr-4 ${moicColor(f.gross_moic)}`}>{f.gross_moic}x</td>
                    <td className={`py-1.5 pr-4 ${moicColor(f.net_moic)}`}>{f.net_moic}x</td>
                    <td className="py-1.5 pr-4">{f.net_irr}</td>
                    <td className="py-1.5 pr-4">{f.dpi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Search + sort */}
        <div className="flex items-center gap-3 mt-3">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-th-tx4" width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="w-full bg-th-surface border border-th-bd rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
            />
          </div>
          <div className="flex items-center gap-1">
            {SORT_OPTIONS.map(o => (
              <button
                key={o.key}
                onClick={() => setSort(o.key)}
                className={`px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors ${
                  sort === o.key
                    ? 'bg-th-hover text-th-tx border border-th-bd'
                    : 'text-th-tx3 hover:text-th-tx2'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-th-panel border-b border-th-bd-sub">
              {['Company','Sector','Entry Date','Status','% Fund','Invested','FMV','MOIC',''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-medium text-th-tx4 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(co => (
              <tr
                key={co.company}
                onClick={() => setSelectedCo(co)}
                className="border-b border-th-bd-sub cursor-pointer hover:bg-th-panel transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-th-active flex items-center justify-center text-[10px] font-bold text-th-tx3 flex-shrink-0">
                      {co.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-th-tx flex items-center gap-1.5">
                        {co.company}
                        {co.isp7_new && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900 font-medium">NEW</span>
                        )}
                      </div>
                      {co.hq && <div className="text-[10px] text-th-tx4">{co.hq}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-th-tx3">{co.sector}</td>
                <td className="px-4 py-3 text-[12px] text-th-tx3 whitespace-nowrap">{co.date}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${statusBadge(co.status)}`}>
                    {co.status?.split(' ')[0]}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-th-tx3">{co.fund_pct}%</td>
                <td className="px-4 py-3 text-[13px] font-medium text-th-tx whitespace-nowrap">${co.invested_m}M</td>
                <td className="px-4 py-3 text-[13px] font-medium text-th-tx whitespace-nowrap">${co.fmv_m}M</td>
                <td className="px-4 py-3">
                  <span className={`text-[13px] font-semibold ${moicColor(co.gross_moic)}`}>{co.gross_moic}x</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-[11px] text-th-tx4 hover:text-th-tx2 transition-colors px-2 py-1 rounded border border-transparent hover:border-th-bd">
                    Profile →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-th-bd-sub text-[11px] text-th-tx4">
          {filtered.length} companies · Total FMV: ${(filtered.reduce((s, c) => s + (c.fmv_m || 0), 0) / 1000).toFixed(2)}B
        </div>
      </div>

      {selectedCo && (
        <PortfolioDrawer company={selectedCo} onClose={() => setSelectedCo(null)} />
      )}
    </div>
  )
}
