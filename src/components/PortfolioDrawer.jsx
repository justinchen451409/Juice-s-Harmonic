import { useState, useEffect } from 'react'
import { THESIS_SYSTEM_PROMPT } from '../lib/portfolio'

const STATUS_COLORS = {
  'Private': 'bg-zinc-800 text-zinc-300',
  'Public': 'bg-emerald-950 text-emerald-300',
  'Acquired': 'bg-blue-950 text-blue-300',
  'Fully Realized': 'bg-purple-950 text-purple-300',
}

function statusColor(status) {
  if (status?.includes('Public')) return 'bg-emerald-950 text-emerald-300'
  if (status?.includes('Acquired')) return 'bg-blue-950 text-blue-300'
  if (status?.includes('Realized')) return 'bg-purple-950 text-purple-300'
  return 'bg-zinc-800 text-zinc-300'
}

function moicColor(moic) {
  if (moic >= 3) return 'text-emerald-300'
  if (moic >= 1.5) return 'text-blue-300'
  if (moic < 1) return 'text-red-400'
  return 'text-[#f4f4f5]'
}

function MetricCard({ label, value, highlight }) {
  return (
    <div className="bg-[#18181b] border border-[#2a2a2e] rounded-lg p-3">
      <div className="text-[10px] font-medium text-[#52525b] uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-[14px] font-semibold ${highlight || 'text-[#f4f4f5]'}`}>{value || '—'}</div>
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
        if (!headerMatch) return <p key={i} className="text-[13px] text-[#a1a1aa] leading-relaxed">{section}</p>
        const [, header, body] = headerMatch
        const isBullets = body.includes('\n-') || body.trimStart().startsWith('-') || body.includes('\n•') || body.trimStart().startsWith('•')
        return (
          <div key={i}>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">{header}</div>
            {isBullets ? (
              <ul className="space-y-1">
                {body.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•')).map((line, j) => (
                  <li key={j} className="flex gap-2 text-[13px] text-[#a1a1aa] leading-relaxed">
                    <span className="text-[#52525b] mt-0.5 flex-shrink-0">·</span>
                    <span>{line.replace(/^[-•]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-[#a1a1aa] leading-relaxed">{body.trim()}</p>
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
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-[500px] z-50 bg-[#111113] border-l border-[#2a2a2e] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[#2a2a2e] flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#27272b] flex items-center justify-center text-[13px] font-bold text-[#71717a] flex-shrink-0">
              {co.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-semibold text-[#f4f4f5]">{co.company}</h2>
                {co.isp7_new && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 border border-amber-900 text-amber-300 font-medium">
                    ISP VII New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[12px] text-[#71717a]">{co.sector}</span>
                <span className="text-[#3a3a3f]">·</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor(co.status)}`}>
                  {co.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#52525b] hover:text-[#f4f4f5] transition-colors mt-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Metrics */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">ISP VII Position</div>
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
                <MetricCard label="Realized" value={`$${co.realized_m}M`} highlight="text-emerald-300" />
              </div>
            )}
          </div>

          {/* Known description */}
          {co.description && !profile && (
            <div>
              <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Overview</div>
              <p className="text-[13px] text-[#a1a1aa] leading-relaxed">{co.description}</p>
            </div>
          )}

          {/* Recent developments */}
          {co.developments?.length > 0 && !profile && (
            <div>
              <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Recent Developments</div>
              <ul className="space-y-1.5">
                {co.developments.map((d, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-[#a1a1aa]">
                    <span className="text-[#52525b] mt-0.5 flex-shrink-0">·</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI-generated profile */}
          {profile && (
            <div className="border-t border-[#2a2a2e] pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">AI Profile</div>
                <button onClick={() => setProfile(null)} className="text-[11px] text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                  Regenerate
                </button>
              </div>
              <ProfileSection text={profile} />
            </div>
          )}

          {/* Generate button */}
          {!profile && (
            <div className="border-t border-[#2a2a2e] pt-4">
              {error && <div className="mb-3 text-[12px] text-red-400">{error}</div>}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-lg bg-[#1e1e22] border border-[#2a2a2e] text-[13px] font-medium text-[#a1a1aa] hover:text-[#f4f4f5] hover:border-[#3a3a3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-[#a855f7]" viewBox="0 0 24 24" fill="none">
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
              <p className="mt-2 text-[11px] text-[#52525b] text-center">
                Claude writes a full overview, team, competitive landscape, and risks
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
