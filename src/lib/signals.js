// Default signal library — labels + quantitative definitions
// Users can edit any description and add custom signals; all changes persist in localStorage

export const DEFAULT_SIGNALS = [
  { label: 'Top-tier lead',        description: 'Lead investor is Tier 1 (Sequoia, a16z, Benchmark, Accel, etc.). Strongest quality signal — these firms see thousands of deals and are highly selective.' },
  { label: 'Revenue acceleration', description: 'ARR growth rate is accelerating QoQ — e.g. growing 15% in Q1 then 25% in Q2. Not just high absolute growth, but the rate itself is increasing.' },
  { label: 'High ARR growth',      description: '>100% YoY ARR growth. Strong NDR (>120%) supporting that growth is durable, not just new logo dependent.' },
  { label: 'IPO candidate',        description: 'Active IPO preparation within 12–24 months. Signals: audited financials, S-1 filing activity, CFO hire, public market comps being circulated.' },
  { label: 'Category leader',      description: 'Clear #1 or #2 market position with meaningful lead over nearest competitor. Evidenced by win rates, analyst placement, or share of voice.' },
  { label: 'Viral adoption',       description: 'Bottom-up PLG driving >50% of new ARR without enterprise sales. Organic word-of-mouth and community flywheel driving expansion.' },
  { label: 'Deep Technical',       description: 'Founding team from AI labs (DeepMind, OpenAI, Google Brain), top-tier PhD programs, or elite research orgs. Proprietary model/architecture differentiation.' },
  { label: 'Anthropic built',      description: 'Product built natively on Claude / Anthropic stack — direct ICONIQ portfolio synergy and preferential API access potential.' },
  { label: 'ICONIQ style',         description: 'Matches ICONIQ Growth thesis: deeply embedded enterprise workflows, proprietary data moat, AI-native platform, Series B–D stage, $50M–$500M ARR range.' },
  { label: 'Financial crime AI',   description: 'Fraud detection, AML, identity verification, or financial risk management using real-time ML/AI. Fintech, banking, or crypto as primary buyers.' },
  { label: 'Full-stack AI',        description: 'End-to-end AI platform owning model layer through workflow automation — not a wrapper on GPT. Proprietary model fine-tuning or training.' },
  { label: 'Profitable',           description: 'EBITDA positive or FCF positive. Not just "path to profitability" — currently generating positive operating cash flow.' },
  { label: 'EU sovereignty',       description: 'European data residency with in-region compute, GDPR compliance baked in. Positioning for EU public sector and regulated enterprise contracts.' },
  { label: '$1B ARR',              description: 'At or above $1B ARR. Relevant for late-stage / Pre-IPO tracking where absolute revenue scale is the key metric.' },
  { label: 'On-prem deployment',   description: 'Supports on-premise or private VPC deployment. Required for defense, intelligence, and regulated financial services buyers.' },
  { label: 'Consumer breakout',    description: '>10M MAU or viral consumer moment. Product has crossed from B2B beachhead to mainstream consumer adoption.' },
  { label: 'API monetization',     description: 'Developer API generating >20% of total ARR with strong usage-based growth curve. Land-and-expand via API consumption.' },
  { label: 'Rapid growth',         description: 'Headcount, ARR, or usage in top decile for stage. Rough proxy: >150% YoY ARR at Series A, >100% at Series B, >75% at Series C.' },
  { label: 'Fortune 500',          description: '>5 Fortune 500 logos as paying customers (not pilots). ACV typically >$250K per account.' },
  { label: 'Regulated verticals',  description: 'Primary customers in finance, healthcare (HIPAA), defense (FedRAMP), or other compliance-heavy verticals requiring certified product.' },
  { label: 'Open-source moat',     description: '>5K GitHub stars or dominant OSS community adoption. Open core business model with paid enterprise tier driving >60% of commercial revenue.' },
  { label: 'Creator economy',      description: 'Platform serving individual creators or prosumers with >1M registered users and strong engagement / monetization metrics.' },
  { label: 'Enterprise API',       description: 'Enterprise-grade API with 99.9%+ uptime SLA, SOC 2 Type II, dedicated customer success, and strong net revenue retention (>120%).' },
  { label: 'Media adoption',       description: 'Named deployments in major media, entertainment, or content production workflows. Hollywood studios, streaming platforms, or major publishers as customers.' },
  { label: 'ICONIQ portfolio',     description: 'Existing ICONIQ portfolio company or strong co-investment dynamic where ICONIQ has preferential access or board relationship.' },
  { label: 'Fintech native',       description: 'Built for fintech use cases from day one — embedded finance, card issuing, BaaS, real-time payments. Not a horizontal tool retrofitted for fintech.' },
]

const CUSTOM_SIGNALS_KEY = 'jh_custom_signals'
const DESC_OVERRIDES_KEY = 'jh_signal_descriptions'

export function getCustomSignals() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_SIGNALS_KEY) || '[]') } catch { return [] }
}

function getDescOverrides() {
  try { return JSON.parse(localStorage.getItem(DESC_OVERRIDES_KEY) || '{}') } catch { return {} }
}

// Returns merged list: defaults + custom, with any user-edited descriptions applied
export function getAllSignals() {
  const overrides = getDescOverrides()
  const defaults = DEFAULT_SIGNALS.map(s => ({
    ...s,
    description: overrides[s.label] ?? s.description,
  }))
  const custom = getCustomSignals().map(label => ({
    label,
    description: overrides[label] ?? 'Custom signal — click to add a definition.',
    custom: true,
  }))
  return [...defaults, ...custom]
}

export function getAllSignalLabels() {
  return getAllSignals().map(s => s.label)
}

export function addCustomSignal(label) {
  const trimmed = label.trim()
  if (!trimmed) return
  const existing = getCustomSignals()
  if (!existing.includes(trimmed)) {
    localStorage.setItem(CUSTOM_SIGNALS_KEY, JSON.stringify([...existing, trimmed]))
  }
}

export function removeCustomSignal(label) {
  localStorage.setItem(CUSTOM_SIGNALS_KEY, JSON.stringify(getCustomSignals().filter(s => s !== label)))
  // Also remove any description override for this signal
  const overrides = getDescOverrides()
  delete overrides[label]
  localStorage.setItem(DESC_OVERRIDES_KEY, JSON.stringify(overrides))
}

export function editSignalDescription(label, newDescription) {
  const overrides = getDescOverrides()
  overrides[label] = newDescription
  localStorage.setItem(DESC_OVERRIDES_KEY, JSON.stringify(overrides))
}

export function resetSignalDescription(label) {
  const overrides = getDescOverrides()
  delete overrides[label]
  localStorage.setItem(DESC_OVERRIDES_KEY, JSON.stringify(overrides))
}
