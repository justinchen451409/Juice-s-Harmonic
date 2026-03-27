// Default signal library — each signal has a label and a definition
// Users can add custom signals via the FilterPanel; they persist in localStorage

export const DEFAULT_SIGNALS = [
  { label: 'Top-tier lead',        description: 'Lead investor is Tier 1 (Sequoia, a16z, Benchmark, etc.). Strongest market quality signal.' },
  { label: 'Revenue acceleration', description: 'ARR growth rate is meaningfully accelerating quarter over quarter, not just growing.' },
  { label: 'High ARR growth',      description: '>100% YoY ARR growth with retention metrics supporting durability.' },
  { label: 'IPO candidate',        description: 'Company is actively preparing for a public offering within 12–24 months.' },
  { label: 'Category leader',      description: 'Clear market leadership — not just fast growth, but dominant positioning vs. peers.' },
  { label: 'Viral adoption',       description: 'Bottom-up product-led growth driving organic expansion without heavy enterprise sales.' },
  { label: 'Deep Technical',       description: 'Founding team has elite research/engineering pedigree — AI lab, top-tier PhD, ex-FAANG research.' },
  { label: 'Anthropic built',      description: 'Product built natively on Claude / Anthropic stack — strategic ICONIQ synergy.' },
  { label: 'ICONIQ style',         description: 'Matches ICONIQ thesis: deeply embedded workflows, proprietary data moat, AI-native.' },
  { label: 'Financial crime AI',   description: 'Fraud prevention, AML, or financial risk management using AI/ML.' },
  { label: 'Full-stack AI',        description: 'End-to-end AI platform from model layer to workflow automation — not just a wrapper.' },
  { label: 'Profitable',           description: 'EBITDA positive or free cash flow positive. Path to profitability is de-risked.' },
  { label: 'EU sovereignty',       description: 'European data residency positioning for GDPR-heavy regulated markets.' },
  { label: '$1B ARR',              description: 'At or approaching $1B in annual recurring revenue.' },
  { label: 'On-prem deployment',   description: 'Supports on-premise or VPC deployment for regulated industries (finance, defense, health).' },
  { label: 'Consumer breakout',    description: 'Consumer viral moment driving mass adoption well beyond typical B2B beachhead.' },
  { label: 'API monetization',     description: 'Developer/enterprise API as a growing, sticky revenue stream.' },
  { label: 'Rapid growth',         description: 'Headcount, ARR, or usage growing exceptionally fast — top decile for stage.' },
  { label: 'Fortune 500',          description: 'Multiple Fortune 500 companies as anchor customers, not just pilots.' },
  { label: 'Regulated verticals',  description: 'Serving finance, healthcare, defense, or other compliance-heavy verticals with tailored product.' },
  { label: 'Open-source moat',     description: 'Open-source community creates distribution advantages and meaningful switching costs.' },
  { label: 'Creator economy',      description: 'Platform serving individual creators or prosumers at scale with strong retention.' },
  { label: 'Enterprise API',       description: 'Enterprise-grade API with strong developer adoption, SLAs, and land-and-expand motion.' },
  { label: 'Media adoption',       description: 'Meaningful traction in media, entertainment, or content production workflows.' },
  { label: 'ICONIQ portfolio',     description: 'Existing ICONIQ portfolio company or strong co-investment / distribution dynamic.' },
  { label: 'Fintech native',       description: 'Built specifically for fintech use cases — embedded finance, card issuing, BaaS, payments.' },
]

const STORAGE_KEY = 'jh_custom_signals'

export function getCustomSignals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

// Returns merged list: defaults + user-defined custom signals
export function getAllSignals() {
  const custom = getCustomSignals().map(label => ({
    label,
    description: 'Custom signal',
    custom: true,
  }))
  return [...DEFAULT_SIGNALS, ...custom]
}

export function getAllSignalLabels() {
  return getAllSignals().map(s => s.label)
}

export function addCustomSignal(label) {
  const existing = getCustomSignals()
  const trimmed = label.trim()
  if (!trimmed || existing.includes(trimmed)) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, trimmed]))
}

export function removeCustomSignal(label) {
  const existing = getCustomSignals()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter(s => s !== label)))
}
