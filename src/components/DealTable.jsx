const SIGNAL_COLORS = {
  'Top-tier lead': 'bg-blue-950 text-blue-300 border-blue-900',
  'Revenue acceleration': 'bg-emerald-950 text-emerald-300 border-emerald-900',
  'High ARR growth': 'bg-emerald-950 text-emerald-300 border-emerald-900',
  'IPO candidate': 'bg-amber-950 text-amber-300 border-amber-900',
  'Category leader': 'bg-purple-950 text-purple-300 border-purple-900',
  'Viral adoption': 'bg-purple-950 text-purple-300 border-purple-900',
  'Open-source moat': 'bg-emerald-950 text-emerald-300 border-emerald-900',
  'ICONIQ style': 'bg-amber-950 text-amber-300 border-amber-900',
  'Financial crime AI': 'bg-pink-950 text-pink-300 border-pink-900',
  'Anthropic built': 'bg-purple-950 text-purple-300 border-purple-900',
  'Deep Technical': 'bg-blue-950 text-blue-300 border-blue-900',
  'Full-stack AI': 'bg-purple-950 text-purple-300 border-purple-900',
  Profitable: 'bg-emerald-950 text-emerald-300 border-emerald-900',
  'EU sovereignty': 'bg-pink-950 text-pink-300 border-pink-900',
  '$1B ARR': 'bg-amber-950 text-amber-300 border-amber-900',
  'On-prem deployment': 'bg-blue-950 text-blue-300 border-blue-900',
  'Consumer breakout': 'bg-purple-950 text-purple-300 border-purple-900',
  'API monetization': 'bg-emerald-950 text-emerald-300 border-emerald-900',
  'Rapid growth': 'bg-emerald-950 text-emerald-300 border-emerald-900',
  'Fortune 500': 'bg-amber-950 text-amber-300 border-amber-900',
  'Regulated verticals': 'bg-blue-950 text-blue-300 border-blue-900',
  'Creator economy': 'bg-purple-950 text-purple-300 border-purple-900',
  'Enterprise API': 'bg-blue-950 text-blue-300 border-blue-900',
  'Media adoption': 'bg-pink-950 text-pink-300 border-pink-900',
  'ICONIQ portfolio': 'bg-amber-950 text-amber-300 border-amber-900',
  'Fintech native': 'bg-pink-950 text-pink-300 border-pink-900',
}

const STAGE_COLORS = {
  'Series A': 'bg-purple-950 text-purple-300',
  'Series B': 'bg-blue-950 text-blue-300',
  'Series C': 'bg-emerald-950 text-emerald-300',
  'Series D': 'bg-amber-950 text-amber-300',
  'Series E': 'bg-orange-950 text-orange-300',
  'Series F': 'bg-pink-950 text-pink-300',
  'Pre-IPO': 'bg-zinc-800 text-zinc-300',
}

function SignalChip({ label }) {
  const cls = SIGNAL_COLORS[label] || 'bg-zinc-900 text-zinc-400 border-zinc-800'
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${cls} whitespace-nowrap`}>
      {label}
    </span>
  )
}

function StagePill({ stage }) {
  const cls = STAGE_COLORS[stage] || 'bg-zinc-800 text-zinc-300'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${cls} whitespace-nowrap`}>
      {stage}
    </span>
  )
}

function TierBadge({ tier }) {
  if (tier === 'Tier 1') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"/>
        T1
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block"/>
      T2
    </span>
  )
}

function TrackButton({ tracked, dealId, onTrack }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onTrack(dealId, !tracked) }}
      className={`px-3 py-1 rounded text-[11px] font-medium transition-all border ${
        tracked
          ? 'bg-blue-950 text-blue-300 border-blue-900 hover:bg-blue-900'
          : 'bg-transparent text-[#71717a] border-[#2a2a2e] hover:border-[#3a3a3f] hover:text-[#a1a1aa]'
      }`}
    >
      {tracked ? 'Tracking' : 'Track'}
    </button>
  )
}

export default function DealTable({ deals, onRowClick, onTrack, selectedDealId }) {
  return (
    <div className="flex-1 overflow-auto bg-[#0a0a0b]">
      <table className="w-full min-w-[900px] border-collapse">
        <thead className="sticky top-0 z-10">
          <tr className="bg-[#111113] border-b border-[#2a2a2e]">
            {['Company', 'Sector', 'Stage', 'Raise', 'Lead Investor', 'Signals', ''].map(h => (
              <th
                key={h}
                className="text-left px-4 py-3 text-[11px] font-medium text-[#52525b] uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deals.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center text-[13px] text-[#52525b]">
                No deals match this filter.
              </td>
            </tr>
          )}
          {deals.map(deal => (
            <tr
              key={deal.id}
              onClick={() => onRowClick(deal)}
              className={`border-b border-[#1e1e22] cursor-pointer transition-colors group ${
                selectedDealId === deal.id
                  ? 'bg-[#1a1a20]'
                  : 'hover:bg-[#131316]'
              }`}
            >
              {/* Company */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#27272b] flex items-center justify-center flex-shrink-0 text-[11px] font-semibold text-[#71717a]">
                    {deal.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#f4f4f5] leading-tight">{deal.company}</div>
                    <div className="text-[11px] text-[#52525b] mt-0.5">{deal.date}</div>
                  </div>
                  {deal.tracked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" title="Tracked"/>
                  )}
                  {deal.passed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" title="Passed"/>
                  )}
                </div>
              </td>

              {/* Sector */}
              <td className="px-4 py-3">
                <span className="text-[12px] text-[#a1a1aa]">{deal.sector}</span>
              </td>

              {/* Stage */}
              <td className="px-4 py-3">
                <StagePill stage={deal.stage} />
              </td>

              {/* Raise */}
              <td className="px-4 py-3">
                <span className="text-[13px] font-medium text-[#f4f4f5]">
                  ${deal.amount_m}M
                </span>
              </td>

              {/* Lead Investor */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#a1a1aa] truncate max-w-[140px]">{deal.lead_investor}</span>
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
                    <span className="text-[10px] text-[#52525b] self-center">+{deal.signals.length - 3}</span>
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
      <div className="px-4 py-3 border-t border-[#1e1e22] text-[11px] text-[#52525b]">
        {deals.length} deal{deals.length !== 1 ? 's' : ''} shown
      </div>
    </div>
  )
}
