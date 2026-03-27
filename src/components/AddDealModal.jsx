import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ALL_TIERS } from '../lib/tiers'
import { ALL_STAGES } from '../lib/tiers'

const SECTORS = [
  'Enterprise AI', 'AI Dev Tools', 'AI Search', 'AI Video', 'AI Audio / Voice',
  'Foundation Models', 'Data Infrastructure', 'Fintech', 'Fraud Prevention',
  'Legal AI', 'HealthTech AI', 'WealthTech', 'HR Tech', 'Travel & Expense',
  'E-commerce', 'Security / Cybersecurity', 'Developer Tools', 'Other',
]

export default function AddDealModal({ onAdd, onClose }) {
  const { user, displayName, workspaceId } = useAuth()
  const [form, setForm] = useState({
    company: '', domain: '', sector: '', stage: '', amount_m: '',
    lead_investor: '', lead_tier: 'Tier 1', date: new Date().toISOString().split('T')[0],
    description: '', signals: '', source: '', notes: '',
  })
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company || !form.sector || !form.stage) {
      setError('Company, sector, and stage are required.')
      return
    }
    const deal = {
      id: crypto.randomUUID(),
      company: form.company.trim(),
      domain: form.domain.trim() || null,
      sector: form.sector,
      stage: form.stage,
      amount_m: form.amount_m ? parseFloat(form.amount_m) : null,
      lead_investor: form.lead_investor.trim() || 'Unknown',
      lead_tier: form.lead_tier,
      date: form.date,
      description: form.description.trim(),
      signals: form.signals ? form.signals.split(',').map(s => s.trim()).filter(Boolean) : [],
      iconiq_synergy: [],
      founders: [],
      competitors: [],
      headcount: null,
      headcount_growth: '',
      arr: '',
      tracked: false,
      passed: false,
      notes: form.notes.trim(),
      source: form.source.trim() || 'manual',
      contributor_name: user ? displayName : 'Guest',
      workspace_id: workspaceId || null,
    }
    onAdd(deal)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] max-h-[90vh] overflow-y-auto z-50 bg-th-surface border border-th-bd rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-th-bd-sub sticky top-0 bg-th-surface z-10">
          <h2 className="text-[15px] font-semibold text-th-tx">Add Deal</h2>
          <button onClick={onClose} className="text-th-tx3 hover:text-th-tx transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Company *</label>
              <input value={form.company} onChange={e => set('company', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                placeholder="e.g. Acme AI" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Domain</label>
              <input value={form.domain} onChange={e => set('domain', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                placeholder="e.g. acme.ai" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Sector *</label>
              <select value={form.sector} onChange={e => set('sector', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx focus:outline-none focus:border-th-bd-str">
                <option value="">Select sector</option>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Stage *</label>
              <select value={form.stage} onChange={e => set('stage', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx focus:outline-none focus:border-th-bd-str">
                <option value="">Select stage</option>
                {ALL_STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Raise ($M)</label>
              <input type="number" value={form.amount_m} onChange={e => set('amount_m', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                placeholder="e.g. 50" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Lead Investor</label>
              <input value={form.lead_investor} onChange={e => set('lead_investor', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                placeholder="e.g. Sequoia" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Lead Tier</label>
              <select value={form.lead_tier} onChange={e => set('lead_tier', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx focus:outline-none focus:border-th-bd-str">
                {ALL_TIERS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx focus:outline-none focus:border-th-bd-str" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Source</label>
              <input value={form.source} onChange={e => set('source', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                placeholder="e.g. TechCrunch, a16z blog, Direct" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-medium text-th-tx3 mb-1">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str resize-none"
              placeholder="What does the company do? Why is it interesting?" />
          </div>

          {/* Signals */}
          <div>
            <label className="block text-[11px] font-medium text-th-tx3 mb-1">Signals <span className="text-th-tx4">(comma-separated)</span></label>
            <input value={form.signals} onChange={e => set('signals', e.target.value)}
              className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
              placeholder="e.g. Top-tier lead, Revenue acceleration, Deep Technical" />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-medium text-th-tx3 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
              className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str resize-none"
              placeholder="Any context, sourcing notes, or questions..." />
          </div>

          {/* Attribution note */}
          <p className="text-[11px] text-th-tx4">
            This deal will be attributed to <span className="text-th-tx2 font-medium">{user ? displayName : 'Guest'}</span> and visible to your workspace.
          </p>

          {error && <p className="text-[12px] text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg border border-th-bd text-[13px] text-th-tx2 hover:bg-th-hover transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-th-tx text-th-surface text-[13px] font-medium hover:opacity-90 transition-opacity">
              Add Deal
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
