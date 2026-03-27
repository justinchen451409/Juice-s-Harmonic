export default function Sidebar({
  savedSearches,
  activeSearch,
  onSearchSelect,
  trackedCount,
  totalCount,
  onOpenFilters,
}) {
  const pct = totalCount > 0 ? Math.round((trackedCount / totalCount) * 100) : 0

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-screen bg-[#111113] border-r border-[#2a2a2e]">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#2a2a2e]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center flex-shrink-0">
            <span className="text-[#0a0a0b] text-[10px] font-bold leading-none">IQ</span>
          </div>
          <span className="text-[13px] font-semibold text-[#f4f4f5] tracking-tight">ICONIQ Scout</span>
        </div>
      </div>

      {/* Pipeline coverage */}
      <div className="px-4 py-4 border-b border-[#2a2a2e]">
        <div className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider mb-2">
          Pipeline Coverage
        </div>
        <div className="flex items-end justify-between mb-1.5">
          <span className="text-[22px] font-semibold text-[#f4f4f5] leading-none">{pct}%</span>
          <span className="text-[11px] text-[#71717a] mb-0.5">{trackedCount} of {totalCount}</span>
        </div>
        <div className="w-full h-1.5 bg-[#27272b] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3b82f6] rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1.5 text-[11px] text-[#52525b]">deals tracked vs. total</div>
      </div>

      {/* Saved searches */}
      <div className="flex-1 overflow-y-auto py-3">
        <div className="px-4 mb-2 text-[11px] font-medium text-[#71717a] uppercase tracking-wider">
          Saved Searches
        </div>
        {savedSearches.map(search => (
          <button
            key={search}
            onClick={() => onSearchSelect(search)}
            className={`w-full text-left px-4 py-1.5 text-[13px] transition-colors duration-100 rounded-none ${
              activeSearch === search
                ? 'bg-[#1e1e22] text-[#f4f4f5] font-medium'
                : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1a1a1e]'
            }`}
          >
            {search}
          </button>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="px-4 py-4 border-t border-[#2a2a2e] flex flex-col gap-1">
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 text-[13px] text-[#a1a1aa] hover:text-[#f4f4f5] py-1.5 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Filters
        </button>
        <div className="flex items-center gap-2 text-[13px] text-[#52525b] py-1.5">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Last updated today
        </div>
      </div>
    </aside>
  )
}
