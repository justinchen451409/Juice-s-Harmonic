import { useState, useRef, useEffect } from 'react'
import { THESIS_SYSTEM_PROMPT } from '../lib/portfolio'
import { useAuth } from '../contexts/AuthContext'
import { buildRichContextPrompt } from '../lib/richContext'

const SUGGESTED = [
  'Series B+ AI companies with Databricks or Anthropic synergy',
  'Top-tier led fintech raises above $100M',
  'Founders with deep technical backgrounds from OpenAI or DeepMind',
  'Pre-IPO candidates with $500M+ ARR potential',
  'What deals most fit ICONIQ\'s investment thesis?',
  'Companies competing with ICONIQ portfolio companies',
]

function SparkleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1l1.5 3.5L13 6l-3.5 1.5L8 11l-1.5-3.5L3 6l3.5-1.5L8 1z" fill="#a855f7" stroke="#a855f7" strokeWidth="0.3" strokeLinejoin="round"/>
      <path d="M13 10l.75 1.75L15.5 12.5l-1.75.75L13 15l-.75-1.75L10.5 12.5l1.75-.75L13 10z" fill="#a855f7" opacity="0.6"/>
    </svg>
  )
}

async function askClaude(messages, deals, crmNotes = []) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('Add VITE_ANTHROPIC_API_KEY to your .env file to use Ask CJ.')

  const dealsContext = JSON.stringify(
    deals.map(d => ({
      id: d.id, company: d.company, sector: d.sector, stage: d.stage,
      amount_m: d.amount_m, lead_investor: d.lead_investor, lead_tier: d.lead_tier,
      date: d.date, signals: d.signals, iconiq_synergy: d.iconiq_synergy,
      founders: d.founders, arr: d.arr, headcount: d.headcount,
      headcount_growth: d.headcount_growth, description: d.description,
    }))
  )

  const crmContext = crmNotes.length > 0
    ? `\n\nCRM NOTES (private notes from the user):\n${crmNotes.map(n =>
        `[${n.company || 'General'}] ${n.source ? `(${n.source}) ` : ''}${n.content}`
      ).join('\n\n')}`
    : ''

  const richContext = buildRichContextPrompt()
  const richContextSection = richContext
    ? `\n\nSIGNAL DEEP CONTEXT (user-defined thesis documentation — treat this as ground truth for how to evaluate these signals):\n${richContext}`
    : ''

  const systemPrompt = `${THESIS_SYSTEM_PROMPT}

You are CJ, an AI assistant helping an ICONIQ Growth associate analyze deal flow. You have access to their current deal pipeline${crmNotes.length > 0 ? ' and their private CRM notes' : ''}:

CURRENT DEALS:
${dealsContext}${crmContext}${richContextSection}

When answering:
- Be direct and specific. No filler. Write like a growth equity analyst.
- Reference specific companies and data points from the deal list.
- If the user references their CRM notes, use that context to give a more informed response.
- If the question is about filtering/finding deals, end your response with a JSON block on its own line in this exact format: FILTER_IDS:["id1","id2"] — list only matching deal IDs, or FILTER_IDS:[] if none match.
- If the question is conversational (not about filtering), do NOT include a FILTER_IDS block.
- Use numbers and percentages where available.`

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
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  })

  if (!res.ok) throw new Error(`API error: ${await res.text()}`)
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

function parseResponse(text) {
  const match = text.match(/FILTER_IDS:(\[.*?\])/s)
  if (!match) return { display: text, filteredIds: null }
  const display = text.replace(/\nFILTER_IDS:\[.*?\]/s, '').trim()
  try {
    return { display, filteredIds: JSON.parse(match[1]) }
  } catch {
    return { display, filteredIds: null }
  }
}

function UserBubble({ content }) {
  return (
    <div className="flex justify-end mb-6">
      <div className="max-w-[75%] bg-th-hover border border-th-bd rounded-2xl rounded-tr-sm px-4 py-3 text-[14px] text-th-tx leading-relaxed">
        {content}
      </div>
    </div>
  )
}

function AssistantBubble({ content, filteredIds, onApplyFilter }) {
  const paragraphs = content.split('\n\n').filter(Boolean)
  return (
    <div className="flex gap-3 mb-6">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
        <SparkleIcon size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[14px] text-th-tx2 leading-relaxed">
              {p.split('\n').map((line, j) => (
                <span key={j}>{line}{j < p.split('\n').length - 1 && <br/>}</span>
              ))}
            </p>
          ))}
        </div>
        {filteredIds !== null && (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onApplyFilter(filteredIds)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300 text-[12px] font-medium hover:opacity-90 transition-opacity"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View {filteredIds.length} deal{filteredIds.length !== 1 ? 's' : ''} in Scout
            </button>
            {filteredIds.length === 0 && (
              <span className="text-[12px] text-th-tx4">No matching deals in current pipeline</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AIQueryTab({ deals, onApplyFilter, crmNotes = [] }) {
  const { isGuest } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = async (text) => {
    const query = text || input
    if (!query.trim() || loading) return
    setInput('')
    setError(null)

    const userMsg = { role: 'user', content: query.trim() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const raw = await askClaude(updatedMessages, deals, crmNotes)
      const { display, filteredIds } = parseResponse(raw)
      setMessages(prev => [...prev, { role: 'assistant', content: display, filteredIds }])
    } catch (e) {
      setError(e.message)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full bg-th-bg">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-6 pb-24">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center mb-6">
              <SparkleIcon size={22} />
            </div>
            <h2 className="text-[22px] font-semibold text-th-tx mb-2 text-center">
              Ask CJ about your pipeline
            </h2>
            <p className="text-[14px] text-th-tx3 text-center max-w-[440px] mb-10 leading-relaxed">
              CJ knows your full pipeline, ICONIQ's investment thesis, ISP VII portfolio data
              {crmNotes.length > 0 ? ', and your CRM notes' : ''}. Ask anything.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-[560px]">
              {SUGGESTED.map(q => (
                <button
                  key={q}
                  onClick={() => handleSubmit(q)}
                  className="text-left px-4 py-3 rounded-xl bg-th-surface border border-th-bd text-[13px] text-th-tx2 hover:text-th-tx hover:border-th-bd-str hover:bg-th-hover transition-all leading-snug"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-[720px] mx-auto px-6 pt-8 pb-4">
            {messages.map((msg, i) =>
              msg.role === 'user' ? (
                <UserBubble key={i} content={msg.content} />
              ) : (
                <AssistantBubble
                  key={i}
                  content={msg.content}
                  filteredIds={msg.filteredIds ?? null}
                  onApplyFilter={onApplyFilter}
                />
              )
            )}
            {loading && (
              <div className="flex gap-3 mb-6">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center flex-shrink-0">
                  <SparkleIcon size={13} />
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-6 pb-6">
        <div className="max-w-[720px] mx-auto">
          {!isEmpty && (
            <button
              onClick={() => setMessages([])}
              className="mb-3 text-[12px] text-th-tx4 hover:text-th-tx2 transition-colors"
            >
              New conversation
            </button>
          )}
          <div className="relative bg-th-surface border border-th-bd rounded-2xl focus-within:border-th-bd-str transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your deal pipeline..."
              rows={1}
              className="w-full bg-transparent px-4 pt-3.5 pb-12 text-[14px] text-th-tx placeholder-th-tx4 focus:outline-none resize-none leading-relaxed"
              style={{ minHeight: '52px', maxHeight: '200px' }}
            />
            <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between pointer-events-none">
              <span className="text-[11px] text-th-tx4">Press Enter to send · Shift+Enter for new line</span>
              <button
                onClick={() => handleSubmit()}
                disabled={loading || !input.trim()}
                className="pointer-events-auto w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center disabled:opacity-30 hover:bg-purple-700 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 12V2M2 7l5-5 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          {crmNotes.length > 0 && (
            <p className="mt-2 text-[11px] text-th-tx4 text-center">
              CJ has access to {crmNotes.length} CRM note{crmNotes.length !== 1 ? 's' : ''} for context
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
