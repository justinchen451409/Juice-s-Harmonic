import { useState, useEffect } from 'react'
import { THESIS_SYSTEM_PROMPT } from '../lib/portfolio'

function statusColor(status) {
  if (status?.includes('Public')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
  if (status?.includes('Acquired')) return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
  if (status?.includes('Realized')) return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
  return 'bg-th-hover text-th-tx3'
}

function moicColor(moic) {
  if (moic >= 3) return 'text-emerald-600 dark:text-emerald-300'
  if (moic >= 1.5) return 'text-blue-600 dark:text-blue-300'
  if (moic < 1) return 'text-red-500 dark:text-red-400'
  return 'text-th-tx'
}

function MetricCard({ label, value, highlight }) {
  return (
    <div className="bg-th-surface border border-th-bd rounded-lg p-3">
      <div className="text-[10px] font-medium text-th-tx4 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-[14px] font-semibold ${highlight || 'text-th-tx'}`}>{value || '—'}</div>
    </div>
  )
}

async function generateProfile(co) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_API_KEY')

  const prompt = `${THESIS_SYSTEM_PROMPT}

Generate a comprehensive company profile for ${co.company}, an ICONIQ Growth portfolio company.

Known data from ICONIQ's ISP VII LP letter:
- Investment date: ${co.date}
- Status: ${co.status}
- Sector: ${co.sector}
- HQ: ${co.hq || 'Not disclosed'}
- ISP VII invested: $${co.invested_m}M (${co.fund_pct}% of fund)
- FMV: $${co.fmv_m}M
- Gross MOIC: ${co.gross_moic}x | Net MOIC: ${co.net_moic}x
${co.description ? `- ICONIQ description: "${co.description}"` : ''}
${co.developments?.length ? `- Recent developments:\n${co.developments.map(d => `  • ${d}`).join('\n')}` : ''}
${co.isp7_new ? '- New ISP VII addition in 2H\'25' : ''}

Write a profile with exactly these sections (use the section headers exactly as written):

**Overview**
2–3 sentences: what they do, what problem they solve, why it matters now. Be specific about their product, their customer, and their market position.

**Why ICONIQ Invested**
2–3 sentences: the investment thesis. Why does this company fit ICONIQ's focus on deeply embedded workflows, proprietary data moats, and AI as a compounding force? Reference the known MOIC and what it signals.

**Team**
2–3 sentences on the founding team and key leadership — backgrounds, relevant prior experience, and what makes them the right team to execute.

**Business Model & Metrics**
Key metrics you know or can reasonably infer: revenue model, ARR/GMV if known, growth trajectory, customer profile. Be specific.

**Competitive Landscape**
Who are the main competitors? How is ${co.company} differentiated? Is it a winner-take-most market?

**Risks & Open Questions**
2–3 honest risks or diligence questions an investor would want answered. Be direct.

**Recent Developments**
Bullet points of the most significant recent milestones, product launches, or strategic moves.

Tone: direct, concise, analyst-grade. No filler. Specific numbers where available.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`API error: ${await res.text()}`)
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

function ProfileSection({ text }) {
  const sections = text.split(/\n(?=\*\*[A-Z])/).filter(Boolean)
  return (
    <div className="space-y-5">
      {sections.map((section, i) => {
        const headerMatch = section.match(/^\*\*(.+?)\*\*\n?([\s\S]*)/)
        if (!headerMatch) return <p key={i} className="text-[13px] text-th-tx2 leading-relaxed">{section}</p>
        const [, header, body] = headerMatch
        const isBullets = body.includes('\n-') || body.trimStart().startsWith('-') || body.includes('\n•') || body.trimStart().startsWith('•')
        return (
          <div key={i}>
            <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">{header}</div>
            {isBullets ? (
              <ul className="space-y-1">
                {body.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•')).map((line, j) => (
                  <li key={j} className="flex gap-2 text-[13px] text-th-tx2 leading-relaxed">
                    <span className="text-th-tx4 mt-0.5 flex-shrink-0">·</span>
                    <span>{line.replace(/^[-•]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-th-tx2 leading-relaxed">{body.trim()}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function PortfolioDrawer({ company: co, onClose }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const text = await generateProfile(co)
      setProfile(text)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[500px] z-50 bg-th-panel border-l border-th-bd-sub flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-th-bd-sub flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-th-active flex items-center justify-center text-[13px] font-bold text-th-tx3 flex-shrink-0">
              {co.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-semibold text-th-tx">{co.company}</h2>
                {co.isp7_new && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-300 font-medium">
                    ISP VII New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[12px] text-th-tx3">{co.sector}</span>
                <span className="text-th-bd">·</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor(co.status)}`}>
                  {co.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-th-tx4 hover:text-th-tx transition-colors mt-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Metrics */}
          <div>
            <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">ISP VII Position</div>
            <div className="grid grid-cols-3 gap-2">
              <MetricCard label="Invested" value={`$${co.invested_m}M`} />
              <MetricCard label="FMV" value={`$${co.fmv_m}M`} />
              <MetricCard label="Gross MOIC" value={`${co.gross_moic}x`} highlight={moicColor(co.gross_moic)} />
              <MetricCard label="Net MOIC" value={`${co.net_moic}x`} highlight={moicColor(co.net_moic)} />
              <MetricCard label="% of Fund" value={`${co.fund_pct}%`} />
              <MetricCard label="Entry Date" value={co.date} />
            </div>
            {co.realized_m && (
              <div className="mt-2">
                <MetricCard label="Realized" value={`$${co.realized_m}M`} highlight="text-emerald-600 dark:text-emerald-300" />
              </div>
            )}
          </div>

          {/* Known description */}
          {co.description && !profile && (
            <div>
              <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Overview</div>
              <p className="text-[13px] text-th-tx2 leading-relaxed">{co.description}</p>
            </div>
          )}

          {/* Recent developments */}
          {co.developments?.length > 0 && !profile && (
            <div>
              <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Recent Developments</div>
              <ul className="space-y-1.5">
                {co.developments.map((d, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-th-tx2">
                    <span className="text-th-tx4 mt-0.5 flex-shrink-0">·</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI-generated profile */}
          {profile && (
            <div className="border-t border-th-bd-sub pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider">AI Profile</div>
                <button onClick={() => setProfile(null)} className="text-[11px] text-th-tx4 hover:text-th-tx2 transition-colors">
                  Regenerate
                </button>
              </div>
              <ProfileSection text={profile} />
            </div>
          )}

          {/* Generate button */}
          {!profile && (
            <div className="border-t border-th-bd-sub pt-4">
              {error && <div className="mb-3 text-[12px] text-red-600 dark:text-red-400">{error}</div>}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-lg bg-th-hover border border-th-bd text-[13px] font-medium text-th-tx2 hover:text-th-tx hover:border-th-bd-str transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
                    </svg>
                    Generating profile...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1l1.5 3.5L13 6l-3.5 1.5L8 11l-1.5-3.5L3 6l3.5-1.5L8 1z" fill="#a855f7" stroke="#a855f7" strokeWidth="0.5" strokeLinejoin="round"/>
                    </svg>
                    Generate Full Profile
                  </>
                )}
              </button>
              <p className="mt-2 text-[11px] text-th-tx4 text-center">
                Claude writes a full overview, team, competitive landscape, and risks
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
