import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getAllSignals, addCustomSignal } from '../lib/signals'
import { getAllSectors, getAllStageLabels, getAllTierLabels } from '../lib/filterConfig'

export default function AddDealModal({ onAdd, onClose }) {
  const { user, displayName, workspaceId } = useAuth()
  const [form, setForm] = useState({
    company: '', domain: '', sector: '', stage: '', amount_m: '', valuation_m: '',
    lead_investor: '', lead_tier: 'Tier 1', date: new Date().toISOString().split('T')[0],
    description: '', source: '', notes: '',
  })
  const [selectedSignals, setSelectedSignals] = useState([])
  const [customSignalInput, setCustomSignalInput] = useState('')
  const [signals, setSignals] = useState(() => getAllSignals())
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleSignal = (label) => {
    setSelectedSignals(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    )
  }

  const handleAddCustomSignal = () => {
    const label = customSignalInput.trim()
    if (!label) return
    addCustomSignal(label)
    setSignals(getAllSignals())
    setSelectedSignals(prev => prev.includes(label) ? prev : [...prev, label])
    setCustomSignalInput('')
  }

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
      valuation_m: form.valuation_m ? parseFloat(form.valuation_m) : null,
      lead_investor: form.lead_investor.trim() || 'Unknown',
      lead_tier: form.lead_tier,
      date: form.date,
      description: form.description.trim(),
      signals: selectedSignals,
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] max-h-[90vh] overflow-y-auto z-50 bg-th-surface border border-th-bd rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-th-bd-sub sticky top-0 bg-th-surface z-10">
          <h2 className="text-[15px] font-semibold text-th-tx">Add Deal</h2>
          <button onClick={onClose} className="text-th-tx3 hover:text-th-tx transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Company + Domain */}
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

          {/* Sector + Stage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Sector *</label>
              <select value={form.sector} onChange={e => set('sector', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx focus:outline-none focus:border-th-bd-str">
                <option value="">Select sector</option>
                {getAllSectors().map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Stage *</label>
              <select value={form.stage} onChange={e => set('stage', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx focus:outline-none focus:border-th-bd-str">
                <option value="">Select stage</option>
                {getAllStageLabels().map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Raise + Valuation + Lead Investor + Tier */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Raise ($M)</label>
              <input type="number" value={form.amount_m} onChange={e => set('amount_m', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                placeholder="50" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Val. ($M)</label>
              <input type="number" value={form.valuation_m} onChange={e => set('valuation_m', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                placeholder="500" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Lead Investor</label>
              <input value={form.lead_investor} onChange={e => set('lead_investor', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                placeholder="Sequoia" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Lead Tier</label>
              <select value={form.lead_tier} onChange={e => set('lead_tier', e.target.value)}
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx focus:outline-none focus:border-th-bd-str">
                {getAllTierLabels().map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Date + Source */}
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
            <label className="block text-[11px] font-medium text-th-tx3 mb-2">
              Signals
              {selectedSignals.length > 0 && (
                <span className="ml-1.5 text-th-tx4 font-normal">({selectedSignals.length} selected)</span>
              )}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {signals.map(s => (
                <button
                  key={s.label}
                  type="button"
                  title={s.description}
                  onClick={() => toggleSignal(s.label)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                    selectedSignals.includes(s.label)
                      ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                      : 'bg-th-hover text-th-tx3 border-th-bd hover:border-th-bd-str hover:text-th-tx'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={customSignalInput}
                onChange={e => setCustomSignalInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSignal())}
                placeholder="Add custom signal..."
                className="flex-1 bg-th-hover border border-th-bd rounded-lg px-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
              />
              <button
                type="button"
                onClick={handleAddCustomSignal}
                className="px-3 py-1.5 rounded-lg border border-th-bd bg-th-hover text-[12px] text-th-tx2 hover:text-th-tx hover:border-th-bd-str transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-medium text-th-tx3 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
              className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str resize-none"
              placeholder="Any context, sourcing notes, or questions..." />
          </div>

          <p className="text-[11px] text-th-tx4">
            Attributed to <span className="text-th-tx2 font-medium">{user ? displayName : 'Guest'}</span> · visible to your workspace.
          </p>

          {error && <p className="text-[12px] text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
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
