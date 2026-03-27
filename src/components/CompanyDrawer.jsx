import { useState, useEffect, useRef } from 'react'
import MemoGenerator from './MemoGenerator'
import { getSynergyMatches } from '../lib/portfolio'

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

const FOUNDER_HIGHLIGHT_COLORS = {
  'Top University': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'Deep Technical': 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  'Prior VC-backed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'Seasoned Founder': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'Seasoned Operator': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'Prior Exit': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  'YC Backed': 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-th-surface border border-th-bd rounded-lg p-3">
      <div className="text-[10px] font-medium text-th-tx4 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[14px] font-semibold text-th-tx">{value || '—'}</div>
    </div>
  )
}

function CompanyLogo({ domain, company }) {
  const [imgError, setImgError] = useState(false)

  if (domain && !imgError) {
    return (
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={company}
        onError={() => setImgError(true)}
        className="w-10 h-10 rounded-lg bg-th-surface object-contain border border-th-bd-sub"
      />
    )
  }

  return (
    <div className="w-10 h-10 rounded-lg bg-th-active flex items-center justify-center flex-shrink-0 text-[13px] font-bold text-th-tx3">
      {company.slice(0, 2).toUpperCase()}
    </div>
  )
}

export default function CompanyDrawer({ deal, onClose, onTrack, onPass, onNoteUpdate }) {
  const [note, setNote] = useState(deal.notes || '')
  const [noteSaved, setNoteSaved] = useState(false)
  const noteTimer = useRef(null)

  useEffect(() => {
    setNote(deal.notes || '')
    setNoteSaved(false)
  }, [deal.id, deal.notes])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleNoteChange = (val) => {
    setNote(val)
    setNoteSaved(false)
    clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => {
      onNoteUpdate(deal.id, val)
      setNoteSaved(true)
    }, 800)
  }

  const synergyMatches = getSynergyMatches(deal.iconiq_synergy)

  const openLinkedIn = (name) => {
    window.open(`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-[480px] z-50 bg-th-panel border-l border-th-bd-sub flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-th-bd-sub flex-shrink-0">
          <div className="flex items-start gap-3">
            <CompanyLogo domain={deal.domain} company={deal.company} />
            <div>
              <h2 className="text-[16px] font-semibold text-th-tx leading-tight">{deal.company}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[12px] text-th-tx3">{deal.sector}</span>
                <span className="text-th-bd">·</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STAGE_COLORS[deal.stage] || 'bg-th-active text-th-tx3'}`}>
                  {deal.stage}
                </span>
              </div>
              {deal.contributor_name && deal.source !== 'seed' && (
                <div className="text-[11px] text-th-tx4 mt-0.5">Added by {deal.contributor_name}</div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-th-tx4 hover:text-th-tx transition-colors mt-1 flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-6">

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTrack(deal.id, !deal.tracked)}
                className={`flex-1 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                  deal.tracked
                    ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
                    : 'bg-th-surface text-th-tx2 border-th-bd hover:border-th-bd-str hover:text-th-tx'
                }`}
              >
                {deal.tracked ? '✓ Tracking' : 'Track'}
              </button>
              <button
                onClick={() => onPass(deal.id, !deal.passed)}
                className={`flex-1 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                  deal.passed
                    ? 'bg-th-active text-th-tx2 border-th-bd'
                    : 'bg-th-surface text-th-tx2 border-th-bd hover:border-th-bd-str hover:text-th-tx'
                }`}
              >
                {deal.passed ? 'Passed' : 'Pass'}
              </button>
            </div>

            {/* Key metrics */}
            <div>
              <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Key Metrics</div>
              <div className="grid grid-cols-3 gap-2">
                <MetricCard label="Raise" value={deal.amount_m ? `$${deal.amount_m}M` : null} />
                <MetricCard label="ARR" value={deal.arr} />
                <MetricCard label="Headcount" value={deal.headcount ? deal.headcount.toLocaleString() : null} />
                <MetricCard label="HC Growth" value={deal.headcount_growth} />
                <MetricCard label="Lead" value={deal.lead_investor} />
                <MetricCard label="Date" value={deal.date} />
              </div>
            </div>

            {/* Description */}
            {deal.description && (
              <div>
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Overview</div>
                <p className="text-[13px] text-th-tx2 leading-relaxed">{deal.description}</p>
              </div>
            )}

            {/* Founders */}
            {(deal.founders || []).length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Founders</div>
                <div className="space-y-2">
                  {deal.founders.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-th-surface border border-th-bd rounded-lg px-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-medium text-th-tx">{f.name}</div>
                        <div className="text-[11px] text-th-tx3 mt-0.5">{f.bg}</div>
                      </div>
                      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        {f.highlight && (
                          <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${FOUNDER_HIGHLIGHT_COLORS[f.highlight] || 'bg-th-hover text-th-tx3'}`}>
                            {f.highlight}
                          </span>
                        )}
                        <button
                          onClick={() => openLinkedIn(f.name)}
                          className="flex items-center gap-1 text-[11px] text-th-tx4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title={`Find ${f.name} on LinkedIn`}
                        >
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                            <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                            <path d="M4 6.5v5M4 4.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M7 11.5V8.5a1.5 1.5 0 013 0v3M7 6.5v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                          </svg>
                          <span className="hidden group-hover:inline">LinkedIn</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ICONIQ Synergy */}
            {synergyMatches.length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">ICONIQ Portfolio Synergy</div>
                <div className="space-y-1.5">
                  {synergyMatches.map(m => (
                    <div key={m.name} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-th-surface border border-th-bd">
                      <div className="flex items-center gap-2">
                        {m.inPortfolio ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="7" fill="#14532d"/>
                            <path d="M3.5 7l2.5 2.5 4.5-4.5" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="6.5" stroke="currentColor" className="text-th-bd"/>
                          </svg>
                        )}
                        <span className={`text-[13px] ${m.inPortfolio ? 'text-th-tx' : 'text-th-tx3'}`}>
                          {m.name}
                        </span>
                      </div>
                      {m.isp7 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900 font-medium">
                          ISP VII
                        </span>
                      )}
                      {m.inPortfolio && !m.isp7 && (
                        <span className="text-[10px] text-th-tx4">Portfolio</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitive landscape */}
            {(deal.competitors || []).length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Competitive Landscape</div>
                <div className="space-y-1.5">
                  {deal.competitors.map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-th-surface border border-th-bd rounded-lg px-3 py-2.5">
                      <div>
                        <div className="text-[13px] font-medium text-th-tx">{c.name}</div>
                        <div className="text-[11px] text-th-tx4 mt-0.5">{c.focus}</div>
                      </div>
                      <span className="text-[11px] text-th-tx3 font-medium whitespace-nowrap ml-3">{c.funding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signals */}
            {(deal.signals || []).length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Signals</div>
                <div className="flex flex-wrap gap-1.5">
                  {deal.signals.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-th-surface border border-th-bd text-th-tx2">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider">Notes</div>
                {noteSaved && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Saved</span>
                )}
              </div>
              <textarea
                value={note}
                onChange={e => handleNoteChange(e.target.value)}
                placeholder="Add notes about this deal..."
                rows={3}
                className="w-full bg-th-surface border border-th-bd rounded-lg px-3 py-2.5 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str transition-colors resize-none"
              />
            </div>

            {/* AI Memo */}
            <div className="border-t border-th-bd-sub pt-4">
              <MemoGenerator deal={deal} />
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
