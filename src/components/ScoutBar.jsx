import { useState } from 'react'

const SUGGESTED_QUERIES = [
  'Series B+ AI with Databricks synergy',
  'Top-tier led fintech raises',
  'Founders with deep technical background',
  'Pre-IPO candidates',
]

async function callClaude(query, deals) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_API_KEY')

  const dealsJson = JSON.stringify(
    deals.map(d => ({
      id: d.id,
      company: d.company,
      sector: d.sector,
      stage: d.stage,
      amount_m: d.amount_m,
      lead_investor: d.lead_investor,
      lead_tier: d.lead_tier,
      signals: d.signals,
      iconiq_synergy: d.iconiq_synergy,
      founders: d.founders,
      arr: d.arr,
    }))
  )

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
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `You are a deal filtering assistant for a growth equity investor at ICONIQ Growth.

Here are the current deals as JSON:
${dealsJson}

The investor is asking: "${query}"

Return ONLY a valid JSON array of deal IDs that match the query. No explanation, no markdown, no code fences — just the raw JSON array. Example: ["id1","id2"]

If no deals match, return [].`,
        },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error: ${err}`)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text?.trim() || '[]'
  return JSON.parse(text)
}

export default function ScoutBar({ deals, onAiFilter, aiFilteredIds }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (q) => {
    const text = q || query
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    try {
      const ids = await callClaude(text.trim(), deals)
      onAiFilter(ids)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setError(null)
    onAiFilter(null)
  }

  return (
    <div className="border-b border-[#2a2a2e] bg-[#111113] px-6 py-4">
      {/* Query input */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {loading ? (
              <svg className="animate-spin w-4 h-4 text-[#3b82f6]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1l1.5 3.5L13 6l-3.5 1.5L8 11l-1.5-3.5L3 6l3.5-1.5L8 1z" fill="#a855f7" stroke="#a855f7" strokeWidth="0.5" strokeLinejoin="round"/>
                <path d="M13 10l.75 1.75L15.5 12.5l-1.75.75L13 15l-.75-1.75L10.5 12.5l1.75-.75L13 10z" fill="#a855f7" opacity="0.7"/>
              </svg>
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask anything — e.g. 'Series B AI companies with Databricks synergy'"
            className="w-full bg-[#18181b] border border-[#3a3a3f] rounded-lg pl-9 pr-4 py-2.5 text-[13px] text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[#52525b] transition-colors"
          />
        </div>
        {aiFilteredIds !== null ? (
          <button
            onClick={handleClear}
            className="px-4 py-2.5 rounded-lg bg-[#27272b] text-[#a1a1aa] text-[13px] font-medium hover:bg-[#303034] transition-colors whitespace-nowrap border border-[#3a3a3f]"
          >
            Clear filter
          </button>
        ) : (
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !query.trim()}
            className="px-4 py-2.5 rounded-lg bg-[#1e40af] text-white text-[13px] font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Search
          </button>
        )}
      </div>

      {/* Status / chips row */}
      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        {aiFilteredIds !== null ? (
          <span className="text-[12px] text-[#a855f7] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] inline-block"/>
            AI filter active — {aiFilteredIds.length} match{aiFilteredIds.length !== 1 ? 'es' : ''}
          </span>
        ) : (
          <>
            <span className="text-[11px] text-[#52525b]">Try:</span>
            {SUGGESTED_QUERIES.map(q => (
              <button
                key={q}
                onClick={() => { setQuery(q); handleSubmit(q) }}
                className="text-[11px] px-2.5 py-1 rounded-md bg-[#1e1e22] text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#27272b] transition-colors border border-[#2a2a2e]"
              >
                {q}
              </button>
            ))}
          </>
        )}
        {error && (
          <span className="text-[11px] text-red-400 ml-auto">{error}</span>
        )}
      </div>
    </div>
  )
}
