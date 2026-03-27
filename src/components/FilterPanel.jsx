import { useState, useEffect } from 'react'

const FOUNDER_SIGNALS = [
  'Top University', 'Deep Technical', 'Prior VC-backed',
  'Seasoned Founder', 'Seasoned Operator', 'Prior Exit', 'YC Backed',
]

const PIPELINE_OPTIONS = [
  { value: 'tracked', label: 'Tracked' },
  { value: 'passed', label: 'Passed' },
  { value: 'untracked', label: 'Untracked' },
]

// Sequoia-style and ICONIQ-style suggested presets
const DEFAULT_PRESETS = [
  {
    id: 'category-leaders',
    name: 'Category Leaders',
    desc: 'Dominant market positions with top-tier backing',
    filters: { sectors: [], stages: ['Series C', 'Series D', 'Series F', 'Pre-IPO'], leadTiers: ['Tier 1'], founderSignals: [], pipeline: [] },
  },
  {
    id: 'ai-infra',
    name: 'AI Infrastructure',
    desc: 'Foundation models, dev tools, AI platforms',
    filters: { sectors: ['Enterprise AI', 'AI Dev Tools', 'Foundation Models', 'AI Search'], stages: [], leadTiers: [], founderSignals: [], pipeline: [] },
  },
  {
    id: 'deep-technical',
    name: 'Deep Technical Teams',
    desc: 'Founders from AI labs, top research orgs',
    filters: { sectors: [], stages: [], leadTiers: [], founderSignals: ['Deep Technical'], pipeline: [] },
  },
  {
    id: 'fintech-infra',
    name: 'Fintech Infrastructure',
    desc: 'Payments, fraud, BaaS, and financial rails',
    filters: { sectors: ['Fraud Prevention', 'Fintech', 'Travel & Expense'], stages: [], leadTiers: [], founderSignals: [], pipeline: [] },
  },
  {
    id: 'pre-ipo',
    name: 'Pre-IPO Candidates',
    desc: 'Late-stage with IPO optionality',
    filters: { sectors: [], stages: ['Pre-IPO', 'Series F'], leadTiers: [], founderSignals: [], pipeline: [] },
  },
  {
    id: 'serial-founders',
    name: 'Serial Founders',
    desc: 'Prior exits and seasoned repeat founders',
    filters: { sectors: [], stages: [], leadTiers: [], founderSignals: ['Prior Exit', 'Seasoned Founder'], pipeline: [] },
  },
  {
    id: 'iconiq-thesis',
    name: 'ICONIQ Thesis Fit',
    desc: 'Tier 1 lead + Series B or later',
    filters: { sectors: [], stages: ['Series B', 'Series C', 'Series D', 'Series F', 'Pre-IPO'], leadTiers: ['Tier 1'], founderSignals: [], pipeline: [] },
  },
  {
    id: 'not-tracked',
    name: 'Untracked Pipeline',
    desc: 'Deals you haven\'t acted on yet',
    filters: { sectors: [], stages: [], leadTiers: [], founderSignals: [], pipeline: ['untracked'] },
  },
]

function ChipToggle({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-[12px] font-medium border transition-colors ${
        active
          ? 'bg-blue-950 text-blue-300 border-blue-800'
          : 'bg-[#1e1e22] text-[#a1a1aa] border-[#2a2a2e] hover:border-[#3a3a3f] hover:text-[#f4f4f5]'
      }`}
    >
      {label}
    </button>
  )
}

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
}

const EMPTY_FILTERS = { sectors: [], stages: [], leadTiers: [], founderSignals: [], pipeline: [] }

function filtersEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export default function FilterPanel({ open, onClose, filters, onChange, deals }) {
  const sectors = [...new Set(deals.map(d => d.sector))].sort()
  const stages = [...new Set(deals.map(d => d.stage))].sort()

  const [customPresets, setCustomPresets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('scout_presets') || '[]') } catch { return [] }
  })
  const [savingName, setSavingName] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)

  const allPresets = [...DEFAULT_PRESETS, ...customPresets]

  const activePreset = allPresets.find(p => filtersEqual(p.filters, filters))

  const activeCount = Object.values(filters).reduce((n, arr) => n + arr.length, 0)

  const applyPreset = (preset) => {
    onChange({ ...EMPTY_FILTERS, ...preset.filters })
  }

  const savePreset = () => {
    if (!savingName.trim()) return
    const preset = {
      id: `custom_${Date.now()}`,
      name: savingName.trim(),
      desc: 'Custom saved filter',
      filters: { ...filters },
      custom: true,
    }
    const updated = [...customPresets, preset]
    setCustomPresets(updated)
    localStorage.setItem('scout_presets', JSON.stringify(updated))
    setSavingName('')
    setShowSaveInput(false)
  }

  const deletePreset = (id) => {
    const updated = customPresets.filter(p => p.id !== id)
    setCustomPresets(updated)
    localStorage.setItem('scout_presets', JSON.stringify(updated))
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} />}

      <div className={`fixed top-0 right-0 h-full w-[340px] z-40 bg-[#111113] border-l border-[#2a2a2e] flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2e] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[#f4f4f5]">Filters</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-900 text-blue-300 text-[11px] font-medium">{activeCount}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button onClick={() => onChange(EMPTY_FILTERS)} className="text-[12px] text-[#71717a] hover:text-[#a1a1aa] transition-colors">
                Clear all
              </button>
            )}
            <button onClick={onClose} className="text-[#71717a] hover:text-[#f4f4f5] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Preset filters */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Presets</div>
            <div className="space-y-1.5">
              {allPresets.map(preset => (
                <div key={preset.id} className="flex items-center gap-2">
                  <button
                    onClick={() => activePreset?.id === preset.id ? onChange(EMPTY_FILTERS) : applyPreset(preset)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg border text-[12px] transition-colors ${
                      activePreset?.id === preset.id
                        ? 'bg-blue-950 border-blue-800 text-blue-200'
                        : 'bg-[#18181b] border-[#2a2a2e] text-[#a1a1aa] hover:border-[#3a3a3f] hover:text-[#f4f4f5]'
                    }`}
                  >
                    <div className="font-medium leading-tight">{preset.name}</div>
                    <div className="text-[11px] opacity-60 mt-0.5">{preset.desc}</div>
                  </button>
                  {preset.custom && (
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="text-[#3a3a3f] hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#2a2a2e]" />

          {/* Sector */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Sector</div>
            <div className="flex flex-wrap gap-1.5">
              {sectors.map(s => (
                <ChipToggle key={s} label={s} active={filters.sectors.includes(s)}
                  onClick={() => onChange({ ...filters, sectors: toggle(filters.sectors, s) })} />
              ))}
            </div>
          </div>

          {/* Stage */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Stage</div>
            <div className="flex flex-wrap gap-1.5">
              {stages.map(s => (
                <ChipToggle key={s} label={s} active={filters.stages.includes(s)}
                  onClick={() => onChange({ ...filters, stages: toggle(filters.stages, s) })} />
              ))}
            </div>
          </div>

          {/* Lead Tier */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Lead Tier</div>
            <div className="flex gap-1.5">
              {['Tier 1', 'Tier 2'].map(t => (
                <ChipToggle key={t} label={t} active={filters.leadTiers.includes(t)}
                  onClick={() => onChange({ ...filters, leadTiers: toggle(filters.leadTiers, t) })} />
              ))}
            </div>
          </div>

          {/* Founder Signals */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Founder Signals</div>
            <div className="flex flex-wrap gap-1.5">
              {FOUNDER_SIGNALS.map(s => (
                <ChipToggle key={s} label={s} active={filters.founderSignals.includes(s)}
                  onClick={() => onChange({ ...filters, founderSignals: toggle(filters.founderSignals, s) })} />
              ))}
            </div>
          </div>

          {/* Pipeline Status */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Pipeline Status</div>
            <div className="flex gap-1.5">
              {PIPELINE_OPTIONS.map(opt => (
                <ChipToggle key={opt.value} label={opt.label} active={filters.pipeline.includes(opt.value)}
                  onClick={() => onChange({ ...filters, pipeline: toggle(filters.pipeline, opt.value) })} />
              ))}
            </div>
          </div>

          {/* Save current filter as preset */}
          {activeCount > 0 && !activePreset && (
            <div className="border-t border-[#2a2a2e] pt-4">
              {showSaveInput ? (
                <div className="flex gap-2">
                  <input
                    value={savingName}
                    onChange={e => setSavingName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && savePreset()}
                    placeholder="Preset name..."
                    autoFocus
                    className="flex-1 bg-[#18181b] border border-[#3a3a3f] rounded-lg px-3 py-1.5 text-[12px] text-[#f4f4f5] placeholder-[#3a3a3f] focus:outline-none"
                  />
                  <button onClick={savePreset} className="px-3 py-1.5 rounded-lg bg-blue-900 text-blue-200 text-[12px] font-medium hover:bg-blue-800 transition-colors">
                    Save
                  </button>
                  <button onClick={() => setShowSaveInput(false)} className="text-[#52525b] hover:text-[#a1a1aa] transition-colors px-1">
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSaveInput(true)}
                  className="w-full py-2 rounded-lg border border-dashed border-[#2a2a2e] text-[12px] text-[#52525b] hover:text-[#a1a1aa] hover:border-[#3a3a3f] transition-colors"
                >
                  + Save current filters as preset
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
