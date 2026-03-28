// Default founder signal definitions — parallel to signals.js
// Supports custom signals and editable descriptions via localStorage

export const DEFAULT_FOUNDER_SIGNALS = [
  { label: 'Top University',    description: 'Founder attended MIT, Stanford, CMU, Harvard, Oxford, Cambridge, Caltech, or equivalent top-tier institution with strong CS/engineering program.' },
  { label: 'Deep Technical',    description: 'AI lab background (DeepMind, OpenAI, Google Brain, Meta FAIR), top-tier PhD with published work, or elite research org. Has built proprietary models or systems — not just applied existing ones.' },
  { label: 'Prior VC-backed',   description: 'Previously founded or was an early employee (0–20) at a VC-backed startup that raised a Series A or later.' },
  { label: 'Seasoned Founder',  description: 'Founded 2+ companies with meaningful outcomes. Has navigated PMF, fundraising, team-building, and at least one inflection point before.' },
  { label: 'Seasoned Operator', description: 'Held VP+ or C-suite role at a high-growth company (>$100M ARR or >500 employees). Has managed large teams and complex GTM motions.' },
  { label: 'Prior Exit',        description: 'Successfully sold a previous company via M&A or IPO. Demonstrates ability to build and close — meaningful signal on execution and shareholder alignment.' },
  { label: 'YC Backed',         description: 'Y Combinator alumni. Strong signal on product discipline and network access — though signal dilutes at later stages given YC batch size.' },
]

const CUSTOM_KEY = 'jh_custom_founder_signals'
const DESC_OVERRIDES_KEY = 'jh_founder_signal_descriptions'

function getCustom() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]') } catch { return [] }
}
function getOverrides() {
  try { return JSON.parse(localStorage.getItem(DESC_OVERRIDES_KEY) || '{}') } catch { return {} }
}

export function getAllFounderSignals() {
  const overrides = getOverrides()
  const defaults = DEFAULT_FOUNDER_SIGNALS.map(s => ({
    ...s,
    description: overrides[s.label] ?? s.description,
  }))
  const custom = getCustom().map(label => ({
    label,
    description: overrides[label] ?? 'Custom founder signal — click to add a definition.',
    custom: true,
  }))
  return [...defaults, ...custom]
}

export function getAllFounderSignalLabels() {
  return getAllFounderSignals().map(s => s.label)
}

export function addCustomFounderSignal(label) {
  const trimmed = label.trim()
  if (!trimmed) return
  const existing = getCustom()
  if (!existing.includes(trimmed)) {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify([...existing, trimmed]))
  }
}

export function removeCustomFounderSignal(label) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(getCustom().filter(s => s !== label)))
  const overrides = getOverrides()
  delete overrides[label]
  localStorage.setItem(DESC_OVERRIDES_KEY, JSON.stringify(overrides))
}

export function editFounderSignalDescription(label, newDescription) {
  const overrides = getOverrides()
  overrides[label] = newDescription
  localStorage.setItem(DESC_OVERRIDES_KEY, JSON.stringify(overrides))
}

export function resetFounderSignalDescription(label) {
  const overrides = getOverrides()
  delete overrides[label]
  localStorage.setItem(DESC_OVERRIDES_KEY, JSON.stringify(overrides))
}

export function getCustomFounderSignals() {
  return getCustom()
}
