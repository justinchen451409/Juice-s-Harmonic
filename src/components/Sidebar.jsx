import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SettingsModal from './SettingsModal'

export default function Sidebar({
  savedSearches,
  activeSearch,
  onSearchSelect,
  trackedCount,
  totalCount,
  onOpenFilters,
  activeTab,
}) {
  const { displayName, avatarUrl, isGuest } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const pct = totalCount > 0 ? Math.round((trackedCount / totalCount) * 100) : 0

  return (
    <>
      <aside className="w-[220px] flex-shrink-0 flex flex-col h-screen bg-th-panel border-r border-th-bd-sub">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-th-bd-sub">
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <rect width="24" height="24" rx="5" fill="currentColor" className="text-th-tx"/>
              {/* Sound wave / harmonic bars */}
              <rect x="4" y="10" width="2.5" height="4" rx="1.25" fill="currentColor" className="text-th-surface" opacity="0.6"/>
              <rect x="8" y="7" width="2.5" height="10" rx="1.25" fill="currentColor" className="text-th-surface"/>
              <rect x="12" y="5" width="2.5" height="14" rx="1.25" fill="currentColor" className="text-th-surface"/>
              <rect x="16" y="8" width="2.5" height="8" rx="1.25" fill="currentColor" className="text-th-surface" opacity="0.75"/>
            </svg>
            <span className="text-[13px] font-semibold text-th-tx tracking-tight">Juice's Harmonic</span>
          </div>
        </div>

        {/* Pipeline coverage */}
        <div className="px-4 py-4 border-b border-th-bd-sub">
          <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">
            Pipeline Coverage
          </div>
          <div className="flex items-end justify-between mb-1.5">
            <span className="text-[22px] font-semibold text-th-tx leading-none">{pct}%</span>
            <span className="text-[11px] text-th-tx3 mb-0.5">{trackedCount} of {totalCount}</span>
          </div>
          <div className="w-full h-1.5 bg-th-active rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1.5 text-[11px] text-th-tx4">deals tracked vs. total</div>
        </div>

        {/* Saved searches */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-4 mb-2 text-[11px] font-medium text-th-tx3 uppercase tracking-wider">
            {activeTab === 'portfolio' ? 'Portfolio Views' : activeTab === 'crm' ? 'CRM' : 'Saved Searches'}
          </div>
          {activeTab === 'portfolio' ? (
            <div className="px-4 py-2 text-[12px] text-th-tx4 leading-relaxed">
              ISP VII companies sorted by MOIC, FMV, or date. Click any row for a Claude-generated profile.
            </div>
          ) : activeTab === 'crm' ? (
            <div className="px-4 py-2 text-[12px] text-th-tx4 leading-relaxed">
              Private notes, call summaries, and research. Only visible to you. Ask CJ can search your notes for context.
            </div>
          ) : activeTab === 'ask' ? (
            <div className="px-4 py-2 text-[12px] text-th-tx4 leading-relaxed">
              Ask CJ knows your full pipeline, ICONIQ's investment thesis, and ISP VII portfolio data.
            </div>
          ) : (
            savedSearches.map(search => (
              <button
                key={search}
                onClick={() => onSearchSelect(search)}
                className={`w-full text-left px-4 py-1.5 text-[13px] transition-colors duration-100 ${
                  activeSearch === search && activeTab === 'scout'
                    ? 'bg-th-hover text-th-tx font-medium'
                    : 'text-th-tx2 hover:text-th-tx hover:bg-th-hover'
                }`}
              >
                {search}
              </button>
            ))
          )}
        </div>

        {/* Bottom nav */}
        <div className="px-4 py-4 border-t border-th-bd-sub flex flex-col gap-1">
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-2 text-[13px] text-th-tx2 hover:text-th-tx py-1.5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Filters
          </button>

          {/* User / Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 py-1.5 w-full text-left hover:bg-th-hover rounded-lg px-0 transition-colors group"
          >
            {isGuest ? (
              <div className="w-6 h-6 rounded-full bg-th-active flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="5" r="3" stroke="currentColor" className="text-th-tx3" strokeWidth="1.3"/>
                  <path d="M1.5 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" className="text-th-tx3" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
            ) : avatarUrl ? (
              <img src={avatarUrl} className="w-6 h-6 rounded-full flex-shrink-0" alt="" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-th-active flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-th-tx">
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-[12px] text-th-tx2 group-hover:text-th-tx transition-colors truncate">
              {isGuest ? 'Guest' : displayName}
            </span>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="ml-auto flex-shrink-0 text-th-tx4 group-hover:text-th-tx2 transition-colors">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M5 5.5A2 2 0 019 7c0 1-1 1.5-2 2v.5M7 11v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  )
}
