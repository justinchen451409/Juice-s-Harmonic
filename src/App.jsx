import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import ScoutBar from './components/ScoutBar'
import DealTable from './components/DealTable'
import FilterPanel from './components/FilterPanel'
import CompanyDrawer from './components/CompanyDrawer'
import { SEED_DEALS } from './data/seed'
import { updateDealStatus, logPipelineAction } from './lib/supabase'

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

function applySearch(deals, search) {
  if (!search || search === 'All Notable Raises') return deals
  switch (search) {
    case 'Series B+ AI':
      return deals.filter(d =>
        ['Series B', 'Series C', 'Series D', 'Series E', 'Series F', 'Pre-IPO'].includes(d.stage) &&
        (d.sector.toLowerCase().includes('ai') || d.signals.some(s => s.toLowerCase().includes('ai')))
      )
    case 'Fintech Infra':
      return deals.filter(d =>
        ['Fraud Prevention', 'Fintech', 'Travel & Expense'].includes(d.sector) ||
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
      return deals.filter(d =>
        (d.founders || []).some(f => f.highlight === 'Deep Technical')
      )
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
      const hasSignal = (deal.founders || []).some(f =>
        filters.founderSignals.includes(f.highlight)
      )
      if (!hasSignal) return false
    }
    if (filters.pipeline.length) {
      const tracked = filters.pipeline.includes('tracked') && deal.tracked
      const passed = filters.pipeline.includes('passed') && deal.passed
      const untracked = filters.pipeline.includes('untracked') && !deal.tracked && !deal.passed
      if (!tracked && !passed && !untracked) return false
    }
    return true
  })
}

export default function App() {
  const [deals, setDeals] = useState(SEED_DEALS)
  const [activeSearch, setActiveSearch] = useState('All Notable Raises')
  const [aiFilteredIds, setAiFilteredIds] = useState(null)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [filters, setFilters] = useState({
    sectors: [],
    stages: [],
    leadTiers: [],
    founderSignals: [],
    pipeline: [],
  })

  const visibleDeals = (() => {
    let result = applySearch(deals, activeSearch)
    result = applyFilters(result, filters)
    if (aiFilteredIds !== null) {
      result = result.filter(d => aiFilteredIds.includes(d.id))
    }
    return result
  })()

  const trackedCount = deals.filter(d => d.tracked).length
  const totalCount = deals.length

  const handleTrack = useCallback((id, value) => {
    setDeals(prev =>
      prev.map(d => d.id === id ? { ...d, tracked: value, passed: value ? false : d.passed } : d)
    )
    setSelectedDeal(prev => prev?.id === id ? { ...prev, tracked: value, passed: value ? false : prev.passed } : prev)
    updateDealStatus(id, { tracked: value, passed: value ? false : undefined }).catch(() => {})
    logPipelineAction(id, value ? 'tracked' : 'untracked').catch(() => {})
  }, [])

  const handlePass = useCallback((id, value) => {
    setDeals(prev =>
      prev.map(d => d.id === id ? { ...d, passed: value, tracked: value ? false : d.tracked } : d)
    )
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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0b]">
      <Sidebar
        savedSearches={SAVED_SEARCHES}
        activeSearch={activeSearch}
        onSearchSelect={setActiveSearch}
        trackedCount={trackedCount}
        totalCount={totalCount}
        onOpenFilters={() => { setFilterPanelOpen(true); setSelectedDeal(null) }}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <ScoutBar
          deals={deals}
          onAiFilter={setAiFilteredIds}
          aiFilteredIds={aiFilteredIds}
        />
        <DealTable
          deals={visibleDeals}
          onRowClick={handleRowClick}
          onTrack={handleTrack}
          selectedDealId={selectedDeal?.id}
        />
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
    </div>
  )
}
