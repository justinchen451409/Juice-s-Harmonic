import { useState, useCallback, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import DealTable from './components/DealTable'
import FilterPanel from './components/FilterPanel'
import CompanyDrawer from './components/CompanyDrawer'
import AIQueryTab from './components/AIQueryTab'
import PortfolioTab from './components/PortfolioTab'
import CRMTab from './components/CRMTab'
import AuthModal from './components/AuthModal'
import AddDealModal from './components/AddDealModal'
import { SEED_DEALS } from './data/seed'
import { updateDealStatus, logPipelineAction, insertDeal, fetchCRMNotes } from './lib/supabase'
import { useAuth } from './contexts/AuthContext'

const SAVED_SEARCHES = [
  'All Notable Raises',
  'Series B+ AI',
  'Fintech Infra',
  'Top-Tier Lead Only',
  'ICONIQ Synergy 2+',
  'Pre-IPO Candidates',
  'European Founders',
  'Deep Technical Background',
]

function TableIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 5h12M5 5v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M8 1l1.5 3.5L13 6l-3.5 1.5L8 11l-1.5-3.5L3 6l3.5-1.5L8 1z" fill="currentColor" strokeWidth="0" strokeLinejoin="round"/>
    </svg>
  )
}

function PortfolioIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M4.5 4V3a1.5 1.5 0 013 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M1 8h12" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
}

function NoteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M4 5h6M4 8h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

const TABS = [
  { id: 'scout',     label: 'Scout',           icon: TableIcon },
  { id: 'ask',       label: 'Ask CJ',          icon: SparkleIcon },
  { id: 'portfolio', label: 'ICONIQ Portfolio', icon: PortfolioIcon },
  { id: 'crm',       label: 'CRM',             icon: NoteIcon },
]

function applySearch(deals, search) {
  if (!search || search === 'All Notable Raises') return deals
  switch (search) {
    case 'Series B+ AI':
      return deals.filter(d =>
        ['Series B','Series C','Series D','Series E','Series F','Pre-IPO'].includes(d.stage) &&
        (d.sector.toLowerCase().includes('ai') || d.signals.some(s => s.toLowerCase().includes('ai')))
      )
    case 'Fintech Infra':
      return deals.filter(d =>
        ['Fraud Prevention','Fintech','Travel & Expense'].includes(d.sector) ||
        d.signals.some(s => s.toLowerCase().includes('fintech'))
      )
    case 'Top-Tier Lead Only':
      return deals.filter(d => d.lead_tier === 'Tier 1')
    case 'ICONIQ Synergy 2+':
      return deals.filter(d => (d.iconiq_synergy || []).length >= 2)
    case 'Pre-IPO Candidates':
      return deals.filter(d => d.stage === 'Pre-IPO' || d.signals.includes('IPO candidate'))
    case 'European Founders':
      return deals.filter(d =>
        d.signals.some(s => s.toLowerCase().includes('eu')) ||
        (d.founders || []).some(f => f.bg?.toLowerCase().includes('european'))
      )
    case 'Deep Technical Background':
      return deals.filter(d => (d.founders || []).some(f => f.highlight === 'Deep Technical'))
    default:
      return deals
  }
}

function applyFilters(deals, filters) {
  return deals.filter(deal => {
    if (filters.sectors.length && !filters.sectors.includes(deal.sector)) return false
    if (filters.stages.length && !filters.stages.includes(deal.stage)) return false
    if (filters.leadTiers.length && !filters.leadTiers.includes(deal.lead_tier)) return false
    if (filters.founderSignals.length) {
      const has = (deal.founders || []).some(f => filters.founderSignals.includes(f.highlight))
      if (!has) return false
    }
    if (filters.pipeline.length) {
      const tracked  = filters.pipeline.includes('tracked')   && deal.tracked
      const passed   = filters.pipeline.includes('passed')    && deal.passed
      const untracked = filters.pipeline.includes('untracked') && !deal.tracked && !deal.passed
      if (!tracked && !passed && !untracked) return false
    }
    return true
  })
}

export default function App() {
  const { user, isGuest, loading: authLoading } = useAuth()
  const [authDismissed, setAuthDismissed] = useState(() => {
    try { return localStorage.getItem('jh_auth_dismissed') === '1' } catch { return false }
  })

  const [activeTab, setActiveTab] = useState('scout')
  const [deals, setDeals] = useState(SEED_DEALS)
  const [activeSearch, setActiveSearch] = useState('All Notable Raises')
  const [aiFilteredIds, setAiFilteredIds] = useState(null)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState({
    sectors: [], stages: [], leadTiers: [], founderSignals: [], pipeline: [],
  })
  const [addDealOpen, setAddDealOpen] = useState(false)
  const [crmNotes, setCrmNotes] = useState([])

  // Load CRM notes for Ask CJ context
  useEffect(() => {
    if (user) {
      fetchCRMNotes(user.id).then(data => setCrmNotes(data || [])).catch(() => {})
    } else if (isGuest) {
      try {
        const saved = JSON.parse(localStorage.getItem('jh_crm_notes') || '[]')
        setCrmNotes(saved)
      } catch {}
    }
  }, [user, isGuest])

  const showAuthModal = !authLoading && !user && !authDismissed

  const dismissAuth = () => {
    setAuthDismissed(true)
    try { localStorage.setItem('jh_auth_dismissed', '1') } catch {}
  }

  const visibleDeals = (() => {
    let result = applySearch(deals, activeSearch)
    result = applyFilters(result, filters)
    if (aiFilteredIds !== null) {
      result = result.filter(d => aiFilteredIds.includes(d.id))
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter(d =>
        d.company.toLowerCase().includes(q) ||
        d.sector.toLowerCase().includes(q) ||
        d.lead_investor.toLowerCase().includes(q)
      )
    }
    return result
  })()

  const trackedCount = deals.filter(d => d.tracked).length
  const totalCount = deals.length

  const handleTrack = useCallback((id, value) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, tracked: value, passed: value ? false : d.passed } : d))
    setSelectedDeal(prev => prev?.id === id ? { ...prev, tracked: value, passed: value ? false : prev.passed } : prev)
    updateDealStatus(id, { tracked: value, passed: value ? false : undefined }).catch(() => {})
    logPipelineAction(id, value ? 'tracked' : 'untracked').catch(() => {})
  }, [])

  const handlePass = useCallback((id, value) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, passed: value, tracked: value ? false : d.tracked } : d))
    setSelectedDeal(prev => prev?.id === id ? { ...prev, passed: value, tracked: value ? false : prev.tracked } : prev)
    updateDealStatus(id, { passed: value, tracked: value ? false : undefined }).catch(() => {})
    logPipelineAction(id, value ? 'passed' : 'unpassed').catch(() => {})
  }, [])

  const handleNoteUpdate = useCallback((id, note) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, notes: note } : d))
    setSelectedDeal(prev => prev?.id === id ? { ...prev, notes: note } : prev)
    updateDealStatus(id, { notes: note }).catch(() => {})
    logPipelineAction(id, 'noted', note).catch(() => {})
  }, [])

  const handleRowClick = useCallback((deal) => {
    setSelectedDeal(deal)
    setFilterPanelOpen(false)
  }, [])

  const handleApplyAiFilter = useCallback((ids) => {
    setAiFilteredIds(ids)
    setActiveTab('scout')
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSelectedDeal(null)
    setFilterPanelOpen(false)
  }

  const handleAddDeal = useCallback((deal) => {
    setDeals(prev => [deal, ...prev])
    insertDeal(deal).catch(() => {})
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-th-bg">
      <Sidebar
        savedSearches={SAVED_SEARCHES}
        activeSearch={activeSearch}
        onSearchSelect={(s) => { setActiveSearch(s); handleTabChange('scout') }}
        trackedCount={trackedCount}
        totalCount={totalCount}
        onOpenFilters={() => { setFilterPanelOpen(true); setSelectedDeal(null) }}
        activeTab={activeTab}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Tab bar */}
        <div className="flex-shrink-0 flex items-center gap-1 px-4 pt-3 pb-0 border-b border-th-bd-sub bg-th-panel">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-t-lg border-b-2 transition-all -mb-px ${
                  isActive
                    ? 'text-th-tx border-purple-500 bg-th-bg'
                    : 'text-th-tx3 border-transparent hover:text-th-tx2'
                }`}
              >
                <Icon />
                {tab.label}
                {tab.id === 'scout' && aiFilteredIds !== null && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 ml-0.5" />
                )}
              </button>
            )
          })}

          {/* Add Deal button */}
          <button
            onClick={() => setAddDealOpen(true)}
            className="ml-auto mr-1 mb-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-th-tx text-th-surface text-[12px] font-medium hover:opacity-90 transition-opacity"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add Deal
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {/* ── Scout Tab ── */}
          {activeTab === 'scout' && (
            <div className="flex flex-col h-full">
              {/* Search + filter bar */}
              <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-th-bd-sub bg-th-panel">
                <div className="relative flex-1 max-w-sm">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-th-tx4" width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    placeholder="Search companies, sectors, investors..."
                    className="w-full bg-th-surface border border-th-bd rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                  />
                </div>

                {aiFilteredIds !== null && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100 border border-purple-200 dark:bg-purple-950 dark:border-purple-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span className="text-[12px] text-purple-700 dark:text-purple-300 font-medium">AI filter: {aiFilteredIds.length} match{aiFilteredIds.length !== 1 ? 'es' : ''}</span>
                    <button onClick={() => setAiFilteredIds(null)} className="text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors ml-1">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => { setFilterPanelOpen(true); setSelectedDeal(null) }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${
                    Object.values(filters).some(a => a.length)
                      ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300'
                      : 'bg-th-surface border-th-bd text-th-tx3 hover:text-th-tx2 hover:border-th-bd-str'
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  Filters
                  {Object.values(filters).reduce((n, a) => n + a.length, 0) > 0 && (
                    <span className="ml-0.5">({Object.values(filters).reduce((n, a) => n + a.length, 0)})</span>
                  )}
                </button>

                <span className="text-[11px] text-th-tx4 ml-auto">{visibleDeals.length} of {totalCount} deals</span>
              </div>

              <DealTable
                deals={visibleDeals}
                onRowClick={handleRowClick}
                onTrack={handleTrack}
                selectedDealId={selectedDeal?.id}
              />
            </div>
          )}

          {/* ── Ask CJ Tab ── */}
          {activeTab === 'ask' && (
            <AIQueryTab deals={deals} onApplyFilter={handleApplyAiFilter} crmNotes={crmNotes} />
          )}

          {/* ── ICONIQ Portfolio Tab ── */}
          {activeTab === 'portfolio' && (
            <PortfolioTab />
          )}

          {/* ── CRM Tab ── */}
          {activeTab === 'crm' && (
            <CRMTab deals={deals} />
          )}
        </div>
      </div>

      <FilterPanel
        open={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        filters={filters}
        onChange={setFilters}
        deals={deals}
      />

      {selectedDeal && (
        <CompanyDrawer
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onTrack={handleTrack}
          onPass={handlePass}
          onNoteUpdate={handleNoteUpdate}
        />
      )}

      {addDealOpen && (
        <AddDealModal
          onAdd={handleAddDeal}
          onClose={() => setAddDealOpen(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal onGuest={dismissAuth} />
      )}
    </div>
  )
}
