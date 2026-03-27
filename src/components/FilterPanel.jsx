const FOUNDER_SIGNALS = [
  'Top University',
  'Deep Technical',
  'Prior VC-backed',
  'Seasoned Founder',
  'Seasoned Operator',
  'Prior Exit',
  'YC Backed',
]

const PIPELINE_OPTIONS = [
  { value: 'tracked', label: 'Tracked' },
  { value: 'passed', label: 'Passed' },
  { value: 'untracked', label: 'Untracked' },
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

export default function FilterPanel({ open, onClose, filters, onChange, deals }) {
  const sectors = [...new Set(deals.map(d => d.sector))].sort()
  const stages = [...new Set(deals.map(d => d.stage))].sort()
  const leadTiers = ['Tier 1', 'Tier 2']

  const activeCount = [
    filters.sectors,
    filters.stages,
    filters.leadTiers,
    filters.founderSignals,
    filters.pipeline,
  ].reduce((n, arr) => n + arr.length, 0)

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] z-40 bg-[#111113] border-l border-[#2a2a2e] flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2e]">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[#f4f4f5]">Filters</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-900 text-blue-300 text-[11px] font-medium">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                onClick={() => onChange({ sectors: [], stages: [], leadTiers: [], founderSignals: [], pipeline: [] })}
                className="text-[12px] text-[#71717a] hover:text-[#a1a1aa] transition-colors"
              >
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
          {/* Sector */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Sector</div>
            <div className="flex flex-wrap gap-1.5">
              {sectors.map(s => (
                <ChipToggle
                  key={s}
                  label={s}
                  active={filters.sectors.includes(s)}
                  onClick={() => onChange({ ...filters, sectors: toggle(filters.sectors, s) })}
                />
              ))}
            </div>
          </div>

          {/* Stage */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Stage</div>
            <div className="flex flex-wrap gap-1.5">
              {stages.map(s => (
                <ChipToggle
                  key={s}
                  label={s}
                  active={filters.stages.includes(s)}
                  onClick={() => onChange({ ...filters, stages: toggle(filters.stages, s) })}
                />
              ))}
            </div>
          </div>

          {/* Lead Tier */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Lead Tier</div>
            <div className="flex flex-wrap gap-1.5">
              {leadTiers.map(t => (
                <ChipToggle
                  key={t}
                  label={t}
                  active={filters.leadTiers.includes(t)}
                  onClick={() => onChange({ ...filters, leadTiers: toggle(filters.leadTiers, t) })}
                />
              ))}
            </div>
          </div>

          {/* Founder Signals */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Founder Signals</div>
            <div className="flex flex-wrap gap-1.5">
              {FOUNDER_SIGNALS.map(s => (
                <ChipToggle
                  key={s}
                  label={s}
                  active={filters.founderSignals.includes(s)}
                  onClick={() => onChange({ ...filters, founderSignals: toggle(filters.founderSignals, s) })}
                />
              ))}
            </div>
          </div>

          {/* Pipeline Status */}
          <div>
            <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">Pipeline Status</div>
            <div className="flex flex-wrap gap-1.5">
              {PIPELINE_OPTIONS.map(opt => (
                <ChipToggle
                  key={opt.value}
                  label={opt.label}
                  active={filters.pipeline.includes(opt.value)}
                  onClick={() => onChange({ ...filters, pipeline: toggle(filters.pipeline, opt.value) })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
