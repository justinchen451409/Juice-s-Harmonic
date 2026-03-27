import { useState } from 'react'

async function generateMemo(deal) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_API_KEY')

  const prompt = `You are a senior associate at ICONIQ Growth, a growth equity firm. Write a concise 3-paragraph investment memo for the following company:

Company: ${deal.company}
Sector: ${deal.sector}
Stage: ${deal.stage}
Raise Amount: $${deal.amount_m}M
Lead Investor: ${deal.lead_investor} (${deal.lead_tier})
ARR: ${deal.arr}
Headcount: ${deal.headcount} (${deal.headcount_growth} growth)
Description: ${deal.description}

Founders:
${(deal.founders || []).map(f => `- ${f.name}: ${f.bg}, notable: ${f.highlight}`).join('\n')}

ICONIQ Portfolio Synergies:
${(deal.iconiq_synergy || []).join(', ')}

Competitors:
${(deal.competitors || []).map(c => `- ${c.name} (${c.funding}): ${c.focus}`).join('\n')}

Write exactly 3 paragraphs:
1. What the company does and why it matters right now — be specific about market timing, momentum, and what has changed to make this a compelling investment today.
2. Why ICONIQ specifically should care — focus on concrete portfolio synergies, distribution advantages, and co-investment dynamics with portfolio companies listed above.
3. Key risks and open questions an investor would want diligence answers on before committing.

Tone: direct, no filler, specific numbers where available. Write as if you're presenting this to the investment committee.`

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
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error: ${err}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text || ''
}

export default function MemoGenerator({ deal }) {
  const [memo, setMemo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const text = await generateMemo(deal)
      setMemo(text)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (memo) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">AI Deal Memo</div>
          <button
            onClick={() => setMemo('')}
            className="text-[11px] text-[#52525b] hover:text-[#a1a1aa] transition-colors"
          >
            Regenerate
          </button>
        </div>
        <div className="space-y-3 text-[13px] text-[#a1a1aa] leading-relaxed">
          {memo.split('\n\n').filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-3">AI Deal Memo</div>
      {error && (
        <div className="mb-3 text-[12px] text-red-400">{error}</div>
      )}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1e1e22] border border-[#2a2a2e] text-[13px] font-medium text-[#a1a1aa] hover:text-[#f4f4f5] hover:border-[#3a3a3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4 text-[#a855f7]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
            </svg>
            Generating memo...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1l1.5 3.5L13 6l-3.5 1.5L8 11l-1.5-3.5L3 6l3.5-1.5L8 1z" fill="#a855f7" stroke="#a855f7" strokeWidth="0.5" strokeLinejoin="round"/>
            </svg>
            Generate Investment Memo
          </>
        )}
      </button>
      <p className="mt-2 text-[11px] text-[#52525b] text-center">
        Uses Claude to write a 3-paragraph IC-ready memo
      </p>
    </div>
  )
}
