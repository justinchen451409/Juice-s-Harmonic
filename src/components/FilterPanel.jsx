import { useState } from 'react'
import { TIER_DEFINITIONS, STAGE_DEFINITIONS } from '../lib/tiers'
import { getAllSignals, addCustomSignal, removeCustomSignal, editSignalDescription, resetSignalDescription } from '../lib/signals'
import {
  getAllSectors, getCustomSectors, addCustomSector, removeCustomSector,
  getAllStageLabels, getCustomStages, addCustomStage, removeCustomStage,
  getAllTierLabels, getCustomTiers, addCustomTier, removeCustomTier,
} from '../lib/filterConfig'

const FOUNDER_SIGNALS = [
  'Top University', 'Deep Technical', 'Prior VC-backed',
  'Seasoned Founder', 'Seasoned Operator', 'Prior Exit', 'YC Backed',
]

const PIPELINE_OPTIONS = [
  { value: 'tracked', label: 'Tracked' },
  { value: 'passed', label: 'Passed' },
  { value: 'untracked', label: 'Untracked' },
]

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
          ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
          : 'bg-th-hover text-th-tx2 border-th-bd hover:border-th-bd-str hover:text-th-tx'
      }`}
    >
      {label}
    </button>
  )
}

function InfoTooltip({ text }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-th-tx4 hover:text-th-tx2 transition-colors ml-1"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M7 6.5v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </button>
      {show && (
        <div className="absolute left-5 top-0 z-50 w-64 bg-th-surface border border-th-bd rounded-lg shadow-lg px-3 py-2.5 text-[11px] text-th-tx2 leading-relaxed pointer-events-none">
          {text}
        </div>
      )}
    </div>
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
  const [signalList, setSignalList] = useState(() => getAllSignals())
  const [newSignalInput, setNewSignalInput] = useState('')
  const [showSignalManager, setShowSignalManager] = useState(false)
  const [editingSignal, setEditingSignal] = useState(null)
  const [editingDesc, setEditingDesc] = useState('')

  const handleStartEdit = (signal) => {
    setEditingSignal(signal.label)
    setEditingDesc(signal.description)
  }
  const handleSaveEdit = () => {
    if (!editingSignal) return
    editSignalDescription(editingSignal, editingDesc.trim())
    setSignalList(getAllSignals())
    setEditingSignal(null)
    setEditingDesc('')
  }
  const handleResetDesc = (label) => {
    resetSignalDescription(label)
    setSignalList(getAllSignals())
    if (editingSignal === label) { setEditingSignal(null); setEditingDesc('') }
  }

  const [sectorList, setSectorList] = useState(() => getAllSectors())
  const [newSectorInput, setNewSectorInput] = useState('')
  const [showSectorManager, setShowSectorManager] = useState(false)

  const [stageList, setStageList] = useState(() => getAllStageLabels())
  const [newStageInput, setNewStageInput] = useState('')
  const [showStageManager, setShowStageManager] = useState(false)

  const [tierList, setTierList] = useState(() => getAllTierLabels())
  const [newTierInput, setNewTierInput] = useState('')
  const [showTierManager, setShowTierManager] = useState(false)

  const customSectors = getCustomSectors()
  const customStages = getCustomStages()
  const customTiers = getCustomTiers()

  // Sectors visible in filter chips: master list items that appear in deals, plus any active filters
  const dealsectorSet = new Set(deals.map(d => d.sector))
  const filterSectors = sectorList.filter(s => dealsectorSet.has(s) || filters.sectors.includes(s))

  const handleAddSignal = () => {
    const label = newSignalInput.trim()
    if (!label) return
    addCustomSignal(label)
    setSignalList(getAllSignals())
    setNewSignalInput('')
  }

  const handleRemoveSignal = (label) => {
    removeCustomSignal(label)
    setSignalList(getAllSignals())
    onChange({ ...filters, founderSignals: filters.founderSignals.filter(s => s !== label) })
  }

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
      {open && <div className="fixed inset-0 z-30 bg-black/20 dark:bg-black/40" onClick={onClose} />}

      <div className={`fixed top-0 right-0 h-full w-[340px] z-40 bg-th-panel border-l border-th-bd-sub flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-th-bd-sub flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-th-tx">Filters</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-[11px] font-medium">{activeCount}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button onClick={() => onChange(EMPTY_FILTERS)} className="text-[12px] text-th-tx3 hover:text-th-tx transition-colors">
                Clear all
              </button>
            )}
            <button onClick={onClose} className="text-th-tx3 hover:text-th-tx transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Presets */}
          <div>
            <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Presets</div>
            <div className="space-y-1.5">
              {allPresets.map(preset => (
                <div key={preset.id} className="flex items-center gap-2">
                  <button
                    onClick={() => activePreset?.id === preset.id ? onChange(EMPTY_FILTERS) : applyPreset(preset)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg border text-[12px] transition-colors ${
                      activePreset?.id === preset.id
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200'
                        : 'bg-th-surface border-th-bd text-th-tx2 hover:border-th-bd-str hover:text-th-tx'
                    }`}
                  >
                    <div className="font-medium leading-tight">{preset.name}</div>
                    <div className="text-[11px] opacity-60 mt-0.5">{preset.desc}</div>
                  </button>
                  {preset.custom && (
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="text-th-bd-str hover:text-red-500 transition-colors flex-shrink-0"
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

          <div className="border-t border-th-bd-sub" />

          {/* Sector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider">Sector</div>
                <InfoTooltip text="Filter by the company's primary market or industry vertical. Add custom sectors to track your own thesis areas." />
              </div>
              <button onClick={() => setShowSectorManager(s => !s)} className="text-[11px] text-th-tx4 hover:text-th-tx2 transition-colors">
                {showSectorManager ? 'Done' : 'Manage'}
              </button>
            </div>
            {showSectorManager ? (
              <div className="space-y-2">
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {sectorList.map(s => (
                    <div key={s} className="flex items-center gap-2 py-1.5 border-b border-th-bd-sub last:border-0">
                      <span className="flex-1 text-[12px] text-th-tx">{s}</span>
                      {customSectors.includes(s) ? (
                        <button onClick={() => { removeCustomSector(s); setSectorList(getAllSectors()) }} className="text-th-tx4 hover:text-red-500 transition-colors flex-shrink-0">
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                        </button>
                      ) : (
                        <span className="text-[10px] text-th-tx4">Default</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input value={newSectorInput} onChange={e => setNewSectorInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { addCustomSector(newSectorInput.trim()); setSectorList(getAllSectors()); setNewSectorInput('') } }}
                    placeholder="New sector..." className="flex-1 bg-th-surface border border-th-bd rounded-lg px-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str" />
                  <button onClick={() => { addCustomSector(newSectorInput.trim()); setSectorList(getAllSectors()); setNewSectorInput('') }} className="px-3 py-1.5 rounded-lg bg-th-tx text-th-surface text-[12px] font-medium hover:opacity-90 transition-opacity">Add</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {filterSectors.map(s => (
                  <ChipToggle key={s} label={s} active={filters.sectors.includes(s)}
                    onClick={() => onChange({ ...filters, sectors: toggle(filters.sectors, s) })} />
                ))}
              </div>
            )}
          </div>

          {/* Stage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider">Stage</div>
                <InfoTooltip text="Funding stage. ICONIQ Growth focuses on Series B through Pre-IPO. Hover any stage chip for ARR benchmarks." />
              </div>
              <button onClick={() => setShowStageManager(s => !s)} className="text-[11px] text-th-tx4 hover:text-th-tx2 transition-colors">
                {showStageManager ? 'Done' : 'Manage'}
              </button>
            </div>
            {showStageManager ? (
              <div className="space-y-2">
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {stageList.map(s => (
                    <div key={s} className="flex items-start gap-2 py-1.5 border-b border-th-bd-sub last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-th-tx">{s}</div>
                        {STAGE_DEFINITIONS[s] && <div className="text-[11px] text-th-tx4 mt-0.5 leading-snug">{STAGE_DEFINITIONS[s].arr_range} · {STAGE_DEFINITIONS[s].description}</div>}
                        {!STAGE_DEFINITIONS[s] && <div className="text-[11px] text-th-tx4 mt-0.5">Custom stage</div>}
                      </div>
                      {customStages.includes(s) ? (
                        <button onClick={() => { removeCustomStage(s); setStageList(getAllStageLabels()) }} className="text-th-tx4 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5">
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                        </button>
                      ) : (
                        <span className="text-[10px] text-th-tx4 flex-shrink-0 mt-0.5">Default</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input value={newStageInput} onChange={e => setNewStageInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { addCustomStage(newStageInput.trim()); setStageList(getAllStageLabels()); setNewStageInput('') } }}
                    placeholder="New stage..." className="flex-1 bg-th-surface border border-th-bd rounded-lg px-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str" />
                  <button onClick={() => { addCustomStage(newStageInput.trim()); setStageList(getAllStageLabels()); setNewStageInput('') }} className="px-3 py-1.5 rounded-lg bg-th-tx text-th-surface text-[12px] font-medium hover:opacity-90 transition-opacity">Add</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {stageList.map(s => (
                  <div key={s} className="relative group">
                    <ChipToggle label={s} active={filters.stages.includes(s)}
                      onClick={() => onChange({ ...filters, stages: toggle(filters.stages, s) })} />
                    {STAGE_DEFINITIONS[s] && (
                      <div className="absolute bottom-full left-0 mb-1.5 z-50 w-56 bg-th-surface border border-th-bd rounded-lg shadow-lg px-3 py-2 text-[11px] text-th-tx2 leading-relaxed hidden group-hover:block pointer-events-none">
                        <div className="font-medium text-th-tx mb-0.5">{s}</div>
                        <div className="text-th-tx3">{STAGE_DEFINITIONS[s].arr_range}</div>
                        <div className="mt-1">{STAGE_DEFINITIONS[s].description}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lead Tier */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider">Lead Tier</div>
                <InfoTooltip text="Quality tier of the lead investor. Hover any tier chip to see definition and example firms." />
              </div>
              <button onClick={() => setShowTierManager(s => !s)} className="text-[11px] text-th-tx4 hover:text-th-tx2 transition-colors">
                {showTierManager ? 'Done' : 'Manage'}
              </button>
            </div>
            {showTierManager ? (
              <div className="space-y-2">
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {tierList.map(t => (
                    <div key={t} className="flex items-start gap-2 py-1.5 border-b border-th-bd-sub last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-th-tx">{TIER_DEFINITIONS[t]?.label || t}</div>
                        {TIER_DEFINITIONS[t] && <div className="text-[11px] text-th-tx4 mt-0.5 leading-snug">{TIER_DEFINITIONS[t].description}</div>}
                        {!TIER_DEFINITIONS[t] && <div className="text-[11px] text-th-tx4 mt-0.5">Custom tier</div>}
                      </div>
                      {customTiers.includes(t) ? (
                        <button onClick={() => { removeCustomTier(t); setTierList(getAllTierLabels()) }} className="text-th-tx4 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5">
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                        </button>
                      ) : (
                        <span className="text-[10px] text-th-tx4 flex-shrink-0 mt-0.5">Default</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input value={newTierInput} onChange={e => setNewTierInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { addCustomTier(newTierInput.trim()); setTierList(getAllTierLabels()); setNewTierInput('') } }}
                    placeholder="New tier..." className="flex-1 bg-th-surface border border-th-bd rounded-lg px-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str" />
                  <button onClick={() => { addCustomTier(newTierInput.trim()); setTierList(getAllTierLabels()); setNewTierInput('') }} className="px-3 py-1.5 rounded-lg bg-th-tx text-th-surface text-[12px] font-medium hover:opacity-90 transition-opacity">Add</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {tierList.map(t => (
                  <div key={t} className="relative group">
                    <ChipToggle label={t} active={filters.leadTiers.includes(t)}
                      onClick={() => onChange({ ...filters, leadTiers: toggle(filters.leadTiers, t) })} />
                    {TIER_DEFINITIONS[t] && (
                      <div className="absolute bottom-full left-0 mb-1.5 z-50 w-64 bg-th-surface border border-th-bd rounded-lg shadow-lg px-3 py-2 text-[11px] text-th-tx2 leading-relaxed hidden group-hover:block pointer-events-none">
                        <div className="font-medium text-th-tx mb-0.5">{TIER_DEFINITIONS[t].label}</div>
                        <div className="mb-1">{TIER_DEFINITIONS[t].description}</div>
                        <div className="text-th-tx4 text-[10px]">{TIER_DEFINITIONS[t].examples?.slice(0, 4).join(', ')}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Founder Signals */}
          <div>
            <div className="flex items-center mb-2">
              <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider">Founder Signals</div>
              <InfoTooltip text="Filter by founder background. 'Deep Technical' = AI lab / PhD / top research org. 'Prior Exit' = sold a company. 'Top University' = MIT, Stanford, CMU, Oxford, etc. Signal quality varies — context matters." />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FOUNDER_SIGNALS.map(s => (
                <ChipToggle key={s} label={s} active={filters.founderSignals.includes(s)}
                  onClick={() => onChange({ ...filters, founderSignals: toggle(filters.founderSignals, s) })} />
              ))}
            </div>
          </div>

          {/* Deal Signals */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider">Deal Signals</div>
                <InfoTooltip text="Filter deals by investment signal tags. Hover any signal to see its definition. Add custom signals to track your own thesis criteria." />
              </div>
              <button
                onClick={() => setShowSignalManager(s => !s)}
                className="text-[11px] text-th-tx4 hover:text-th-tx2 transition-colors"
              >
                {showSignalManager ? 'Done' : 'Manage'}
              </button>
            </div>

            {showSignalManager ? (
              <div className="space-y-2">
                <div className="space-y-0 max-h-64 overflow-y-auto pr-1">
                  {signalList.map(s => (
                    <div key={s.label} className="py-2 border-b border-th-bd-sub last:border-0">
                      {editingSignal === s.label ? (
                        <div className="space-y-1.5">
                          <div className="text-[12px] font-medium text-th-tx">{s.label}</div>
                          <textarea
                            value={editingDesc}
                            onChange={e => setEditingDesc(e.target.value)}
                            rows={3}
                            autoFocus
                            className="w-full bg-th-surface border border-th-bd-str rounded-lg px-2.5 py-2 text-[11px] text-th-tx placeholder-th-tx4 focus:outline-none resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <button onClick={handleSaveEdit} className="px-2.5 py-1 rounded-md bg-th-tx text-th-surface text-[11px] font-medium hover:opacity-90 transition-opacity">Save</button>
                            <button onClick={() => { setEditingSignal(null); setEditingDesc('') }} className="text-[11px] text-th-tx4 hover:text-th-tx2 transition-colors">Cancel</button>
                            {!s.custom && (
                              <button onClick={() => handleResetDesc(s.label)} className="text-[11px] text-th-tx4 hover:text-th-tx2 transition-colors ml-auto">Reset to default</button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-medium text-th-tx">{s.label}</div>
                            <div className="text-[11px] text-th-tx4 leading-snug mt-0.5">{s.description}</div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                            <button onClick={() => handleStartEdit(s)} className="text-th-tx4 hover:text-th-tx2 transition-colors" title="Edit definition">
                              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                                <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            {s.custom && (
                              <button onClick={() => handleRemoveSignal(s.label)} className="text-th-tx4 hover:text-red-500 transition-colors" title="Remove signal">
                                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                  <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    value={newSignalInput}
                    onChange={e => setNewSignalInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSignal()}
                    placeholder="New signal name..."
                    className="flex-1 bg-th-surface border border-th-bd rounded-lg px-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                  />
                  <button onClick={handleAddSignal} className="px-3 py-1.5 rounded-lg bg-th-tx text-th-surface text-[12px] font-medium hover:opacity-90 transition-opacity">
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {signalList.map(s => (
                  <div key={s.label} className="relative group/sig">
                    <ChipToggle
                      label={s.label}
                      active={filters.founderSignals.includes(s.label)}
                      onClick={() => onChange({ ...filters, founderSignals: toggle(filters.founderSignals, s.label) })}
                    />
                    <div className="absolute bottom-full left-0 mb-1.5 z-50 w-56 bg-th-surface border border-th-bd rounded-lg shadow-lg px-3 py-2 text-[11px] text-th-tx2 leading-relaxed hidden group-hover/sig:block pointer-events-none">
                      <div className="font-medium text-th-tx mb-0.5">{s.label}</div>
                      <div>{s.description}</div>
                      {s.custom && <div className="text-th-tx4 mt-1">Custom signal</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pipeline Status */}
          <div>
            <div className="flex items-center mb-2">
              <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider">Pipeline Status</div>
              <InfoTooltip text="Filter by your action state. 'Tracked' = you've flagged this deal for follow-up. 'Passed' = decided not to pursue. 'Untracked' = needs a decision." />
            </div>
            <div className="flex gap-1.5">
              {PIPELINE_OPTIONS.map(opt => (
                <ChipToggle key={opt.value} label={opt.label} active={filters.pipeline.includes(opt.value)}
                  onClick={() => onChange({ ...filters, pipeline: toggle(filters.pipeline, opt.value) })} />
              ))}
            </div>
          </div>

          {/* Save current filter */}
          {activeCount > 0 && !activePreset && (
            <div className="border-t border-th-bd-sub pt-4">
              {showSaveInput ? (
                <div className="flex gap-2">
                  <input
                    value={savingName}
                    onChange={e => setSavingName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && savePreset()}
                    placeholder="Preset name..."
                    autoFocus
                    className="flex-1 bg-th-surface border border-th-bd-str rounded-lg px-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none"
                  />
                  <button onClick={savePreset} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[12px] font-medium hover:bg-blue-700 transition-colors">
                    Save
                  </button>
                  <button onClick={() => setShowSaveInput(false)} className="text-th-tx4 hover:text-th-tx2 transition-colors px-1">
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSaveInput(true)}
                  className="w-full py-2 rounded-lg border border-dashed border-th-bd text-[12px] text-th-tx4 hover:text-th-tx2 hover:border-th-bd-str transition-colors"
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
