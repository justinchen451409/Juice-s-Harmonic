import { useState, useEffect, useRef } from 'react'
import MemoGenerator from './MemoGenerator'
import { getSynergyMatches } from '../lib/portfolio'

const STAGE_COLORS = {
  'Series A': 'bg-purple-950 text-purple-300',
  'Series B': 'bg-blue-950 text-blue-300',
  'Series C': 'bg-emerald-950 text-emerald-300',
  'Series D': 'bg-amber-950 text-amber-300',
  'Series E': 'bg-orange-950 text-orange-300',
  'Series F': 'bg-pink-950 text-pink-300',
  'Pre-IPO': 'bg-zinc-800 text-zinc-300',
}

const FOUNDER_HIGHLIGHT_COLORS = {
  'Top University': 'bg-blue-950 text-blue-300',
  'Deep Technical': 'bg-purple-950 text-purple-300',
  'Prior VC-backed': 'bg-emerald-950 text-emerald-300',
  'Seasoned Founder': 'bg-amber-950 text-amber-300',
  'Seasoned Operator': 'bg-amber-950 text-amber-300',
  'Prior Exit': 'bg-green-950 text-green-300',
  'YC Backed': 'bg-orange-950 text-orange-300',
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-[#18181b] border border-[#2a2a2e] rounded-lg p-3">
      <div className="text-[10px] font-medium text-[#52525b] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[14px] font-semibold text-[#f4f4f5]">{value || '—'}</div>
    </div>
  )
}

export default function CompanyDrawer({ deal, onClose, onTrack, onPass, onNoteUpdate }) {
  const [note, setNote] = useState(deal.notes || '')
  const [noteSaved, setNoteSaved] = useState(false)
  const noteTimer = useRef(null)
  const drawerRef = useRef(null)

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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-[480px] z-50 bg-[#111113] border-l border-[#2a2a2e] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#2a2a2e] flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#27272b] flex items-center justify-center flex-shrink-0 text-[13px] font-bold text-[#71717a]">
              {deal.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#f4f4f5] leading-tight">{deal.company}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[12px] text-[#71717a]">{deal.sector}</span>
                <span className="text-[#3a3a3f]">·</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STAGE_COLORS[deal.stage] || 'bg-zinc-800 text-zinc-300'}`}>
                  {deal.stage}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#52525b] hover:text-[#f4f4f5] transition-colors mt-1 flex-shrink-0"
          >
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
                    ? 'bg-blue-950 text-blue-300 border-blue-800 hover:bg-blue-900'
                    : 'bg-[#18181b] text-[#a1a1aa] border-[#2a2a2e] hover:border-[#3a3a3f] hover:text-[#f4f4f5]'
                }`}
              >
                {deal.tracked ? '✓ Tracking' : 'Track'}
              </button>
              <button
                onClick={() => onPass(deal.id, !deal.passed)}
                className={`flex-1 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                  deal.passed
                    ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    : 'bg-[#18181b] text-[#a1a1aa] border-[#2a2a2e] hover:border-[#3a3a3f] hover:text-[#f4f4f5]'
                }`}
              >
                {deal.passed ? 'Passed' : 'Pass'}
              </button>
            </div>

            {/* Key metrics */}
            <div>
              <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Key Metrics</div>
              <div className="grid grid-cols-3 gap-2">
                <MetricCard label="Raise" value={`$${deal.amount_m}M`} />
                <MetricCard label="ARR" value={deal.arr} />
                <MetricCard label="Headcount" value={deal.headcount ? `${deal.headcount.toLocaleString()}` : null} />
                <MetricCard label="HC Growth" value={deal.headcount_growth} />
                <MetricCard label="Lead" value={deal.lead_investor} />
                <MetricCard label="Date" value={deal.date} />
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Overview</div>
              <p className="text-[13px] text-[#a1a1aa] leading-relaxed">{deal.description}</p>
            </div>

            {/* Founders */}
            {(deal.founders || []).length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Founders</div>
                <div className="space-y-2">
                  {deal.founders.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#18181b] border border-[#2a2a2e] rounded-lg px-3 py-2.5">
                      <div>
                        <div className="text-[13px] font-medium text-[#f4f4f5]">{f.name}</div>
                        <div className="text-[11px] text-[#71717a] mt-0.5">{f.bg}</div>
                      </div>
                      {f.highlight && (
                        <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${FOUNDER_HIGHLIGHT_COLORS[f.highlight] || 'bg-zinc-900 text-zinc-400'}`}>
                          {f.highlight}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ICONIQ Synergy */}
            {synergyMatches.length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">ICONIQ Portfolio Synergy</div>
                <div className="space-y-1.5">
                  {synergyMatches.map(m => (
                    <div key={m.name} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#18181b] border border-[#2a2a2e]">
                      <div className="flex items-center gap-2">
                        {m.inPortfolio ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="7" fill="#14532d"/>
                            <path d="M3.5 7l2.5 2.5 4.5-4.5" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="6.5" stroke="#3a3a3f"/>
                          </svg>
                        )}
                        <span className={`text-[13px] ${m.inPortfolio ? 'text-[#f4f4f5]' : 'text-[#71717a]'}`}>
                          {m.name}
                        </span>
                      </div>
                      {m.isp7 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-900 font-medium">
                          ISP VII
                        </span>
                      )}
                      {m.inPortfolio && !m.isp7 && (
                        <span className="text-[10px] text-[#52525b]">Portfolio</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitive landscape */}
            {(deal.competitors || []).length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Competitive Landscape</div>
                <div className="space-y-1.5">
                  {deal.competitors.map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#18181b] border border-[#2a2a2e] rounded-lg px-3 py-2.5">
                      <div>
                        <div className="text-[13px] font-medium text-[#f4f4f5]">{c.name}</div>
                        <div className="text-[11px] text-[#52525b] mt-0.5">{c.focus}</div>
                      </div>
                      <span className="text-[11px] text-[#71717a] font-medium whitespace-nowrap ml-3">{c.funding}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signals */}
            {(deal.signals || []).length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Signals</div>
                <div className="flex flex-wrap gap-1.5">
                  {deal.signals.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#18181b] border border-[#2a2a2e] text-[#a1a1aa]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Notes</div>
                {noteSaved && (
                  <span className="text-[11px] text-emerald-500">Saved</span>
                )}
              </div>
              <textarea
                value={note}
                onChange={e => handleNoteChange(e.target.value)}
                placeholder="Add notes about this deal..."
                rows={3}
                className="w-full bg-[#18181b] border border-[#2a2a2e] rounded-lg px-3 py-2.5 text-[13px] text-[#f4f4f5] placeholder-[#3a3a3f] focus:outline-none focus:border-[#52525b] transition-colors resize-none"
              />
            </div>

            {/* AI Memo */}
            <div className="border-t border-[#2a2a2e] pt-4">
              <MemoGenerator deal={deal} />
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
