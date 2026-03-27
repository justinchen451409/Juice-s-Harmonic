import { ALL_STAGES, ALL_TIERS } from './tiers'

const CUSTOM_SECTORS_KEY = 'jh_custom_sectors'
const CUSTOM_STAGES_KEY = 'jh_custom_stages'
const CUSTOM_TIERS_KEY = 'jh_custom_tiers'

export const DEFAULT_SECTORS = [
  'Enterprise AI', 'AI Dev Tools', 'AI Search', 'AI Video', 'AI Audio / Voice',
  'Foundation Models', 'Data Infrastructure', 'Fintech', 'Fraud Prevention',
  'Legal AI', 'HealthTech AI', 'WealthTech', 'HR Tech', 'Travel & Expense',
  'E-commerce', 'Security / Cybersecurity', 'Developer Tools', 'Other',
]

function getItems(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function setItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items))
}

// --- Sectors ---
export function getAllSectors() {
  const custom = getItems(CUSTOM_SECTORS_KEY)
  return [...DEFAULT_SECTORS, ...custom.filter(s => !DEFAULT_SECTORS.includes(s))]
}
export function getCustomSectors() { return getItems(CUSTOM_SECTORS_KEY) }
export function addCustomSector(label) {
  if (!label || DEFAULT_SECTORS.includes(label)) return
  const custom = getItems(CUSTOM_SECTORS_KEY)
  if (!custom.includes(label)) setItems(CUSTOM_SECTORS_KEY, [...custom, label])
}
export function removeCustomSector(label) {
  setItems(CUSTOM_SECTORS_KEY, getItems(CUSTOM_SECTORS_KEY).filter(s => s !== label))
}

// --- Stages ---
export function getAllStageLabels() {
  const custom = getItems(CUSTOM_STAGES_KEY)
  return [...ALL_STAGES, ...custom.filter(s => !ALL_STAGES.includes(s))]
}
export function getCustomStages() { return getItems(CUSTOM_STAGES_KEY) }
export function addCustomStage(label) {
  if (!label || ALL_STAGES.includes(label)) return
  const custom = getItems(CUSTOM_STAGES_KEY)
  if (!custom.includes(label)) setItems(CUSTOM_STAGES_KEY, [...custom, label])
}
export function removeCustomStage(label) {
  setItems(CUSTOM_STAGES_KEY, getItems(CUSTOM_STAGES_KEY).filter(s => s !== label))
}

// --- Tiers ---
export function getAllTierLabels() {
  const custom = getItems(CUSTOM_TIERS_KEY)
  return [...ALL_TIERS, ...custom.filter(s => !ALL_TIERS.includes(s))]
}
export function getCustomTiers() { return getItems(CUSTOM_TIERS_KEY) }
export function addCustomTier(label) {
  if (!label || ALL_TIERS.includes(label)) return
  const custom = getItems(CUSTOM_TIERS_KEY)
  if (!custom.includes(label)) setItems(CUSTOM_TIERS_KEY, [...custom, label])
}
export function removeCustomTier(label) {
  setItems(CUSTOM_TIERS_KEY, getItems(CUSTOM_TIERS_KEY).filter(s => s !== label))
}
