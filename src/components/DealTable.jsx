import { useState } from 'react'

const SIGNAL_COLORS = {
  'Top-tier lead': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
  'Revenue acceleration': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  'High ARR growth': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  'IPO candidate': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
  'Category leader': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900',
  'Viral adoption': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900',
  'Open-source moat': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  'ICONIQ style': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
  'Financial crime AI': 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-900',
  'Anthropic built': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900',
  'Deep Technical': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
  'Full-stack AI': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900',
  Profitable: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  'EU sovereignty': 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-900',
  '$1B ARR': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
  'On-prem deployment': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
  'Consumer breakout': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900',
  'API monetization': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  'Rapid growth': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
  'Fortune 500': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
  'Regulated verticals': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
  'Creator economy': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900',
  'Enterprise API': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900',
  'Media adoption': 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-900',
  'ICONIQ portfolio': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
  'Fintech native': 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-900',
}

const STAGE_COLORS = {
  'Pre-Seed': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
  'Seed': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
  'Series A': 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  'Series B': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'Series C': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'Series D': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'Series E': 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  'Series F': 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  'Series F+': 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  'Pre-IPO': 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  'Growth': 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
}

function CompanyAvatar({ domain, company }) {
  const [imgError, setImgError] = useState(false)

  if (domain && !imgError) {
    return (
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={company}
        onError={() => setImgError(true)}
        className="w-7 h-7 rounded bg-th-surface object-contain flex-shrink-0 border border-th-bd-sub"
      />
    )
  }

  return (
    <div className="w-7 h-7 rounded bg-th-active flex items-center justify-center flex-shrink-0 text-[11px] font-semibold text-th-tx3">
      {company.slice(0, 2).toUpperCase()}
    </div>
  )
}

function SignalChip({ label }) {
  const cls = SIGNAL_COLORS[label] || 'bg-th-hover text-th-tx3 border-th-bd'
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${cls} whitespace-nowrap`}>
      {label}
    </span>
  )
}

function StagePill({ stage }) {
  const cls = STAGE_COLORS[stage] || 'bg-th-hover text-th-tx3'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${cls} whitespace-nowrap`}>
      {stage}
    </span>
  )
}

function TierBadge({ tier }) {
  if (tier === 'Tier 1') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"/>
        T1
      </span>
    )
  }
  if (tier === 'Tier 2') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-300">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"/>
        T2
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-th-tx3">
      <span className="w-1.5 h-1.5 rounded-full bg-th-bd-str inline-block"/>
      {tier?.slice(0, 4) || '—'}
    </span>
  )
}

function TrackButton({ tracked, dealId, onTrack }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onTrack(dealId, !tracked) }}
      className={`px-3 py-1 rounded text-[11px] font-medium transition-all border ${
        tracked
          ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900 dark:hover:bg-blue-900'
          : 'bg-transparent text-th-tx3 border-th-bd hover:border-th-bd-str hover:text-th-tx2'
      }`}
    >
      {tracked ? 'Tracking' : 'Track'}
    </button>
  )
}

export default function DealTable({ deals, onRowClick, onTrack, selectedDealId }) {
  return (
    <div className="flex-1 overflow-auto bg-th-bg">
      <table className="w-full min-w-[900px] border-collapse">
        <thead className="sticky top-0 z-10">
          <tr className="bg-th-panel border-b border-th-bd-sub">
            {['Company', 'Sector', 'Stage', 'Raise', 'Lead Investor', 'Signals', ''].map(h => (
              <th
                key={h}
                className="text-left px-4 py-3 text-[11px] font-medium text-th-tx4 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deals.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center text-[13px] text-th-tx4">
                No deals match this filter.
              </td>
            </tr>
          )}
          {deals.map(deal => (
            <tr
              key={deal.id}
              onClick={() => onRowClick(deal)}
              className={`border-b border-th-bd-sub cursor-pointer transition-colors group ${
                selectedDealId === deal.id
                  ? 'bg-th-hover'
                  : 'hover:bg-th-panel'
              }`}
            >
              {/* Company */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <CompanyAvatar domain={deal.domain} company={deal.company} />
                  <div>
                    <div className="text-[13px] font-medium text-th-tx leading-tight">{deal.company}</div>
                    <div className="text-[11px] text-th-tx4 mt-0.5">{deal.date}</div>
                  </div>
                  {deal.tracked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" title="Tracked"/>
                  )}
                  {deal.passed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-th-bd-str flex-shrink-0" title="Passed"/>
                  )}
                  {deal.source !== 'seed' && deal.contributor_name && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-th-hover border border-th-bd text-th-tx4 whitespace-nowrap">
                      {deal.contributor_name}
                    </span>
                  )}
                </div>
              </td>

              {/* Sector */}
              <td className="px-4 py-3">
                <span className="text-[12px] text-th-tx2">{deal.sector}</span>
              </td>

              {/* Stage */}
              <td className="px-4 py-3">
                <StagePill stage={deal.stage} />
              </td>

              {/* Raise */}
              <td className="px-4 py-3">
                <span className="text-[13px] font-medium text-th-tx">
                  {deal.amount_m ? `$${deal.amount_m}M` : '—'}
                </span>
              </td>

              {/* Lead Investor */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-th-tx2 truncate max-w-[140px]">{deal.lead_investor}</span>
                  <TierBadge tier={deal.lead_tier} />
                </div>
              </td>

              {/* Signals */}
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1 max-w-[240px]">
                  {(deal.signals || []).slice(0, 3).map(s => (
                    <SignalChip key={s} label={s} />
                  ))}
                  {(deal.signals || []).length > 3 && (
                    <span className="text-[10px] text-th-tx4 self-center">+{deal.signals.length - 3}</span>
                  )}
                </div>
              </td>

              {/* Track */}
              <td className="px-4 py-3">
                <TrackButton tracked={deal.tracked} dealId={deal.id} onTrack={onTrack} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-th-bd-sub text-[11px] text-th-tx4">
        {deals.length} deal{deals.length !== 1 ? 's' : ''} shown
      </div>
    </div>
  )
}
