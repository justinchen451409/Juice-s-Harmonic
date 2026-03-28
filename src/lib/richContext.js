// Rich context storage for signals — used to give Ask CJ deep thesis context
// Stored per signal label in localStorage

const STORAGE_KEY = 'jh_rich_contexts'

function getAll() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

export function getRichContext(label) {
  return getAll()[label] || { text: '', links: [], files: [] }
}

export function saveRichContext(label, context) {
  const all = getAll()
  all[label] = context
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function removeRichContext(label) {
  const all = getAll()
  delete all[label]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function hasRichContext(label) {
  const ctx = getRichContext(label)
  return ctx.text.trim().length > 0 || ctx.links.length > 0 || ctx.files.length > 0
}

// Returns a flat string suitable for injecting into Claude's system prompt
export function buildRichContextPrompt() {
  const all = getAll()
  const parts = []
  for (const [label, ctx] of Object.entries(all)) {
    const hasContent = ctx.text?.trim() || ctx.links?.length || ctx.files?.length
    if (!hasContent) continue
    parts.push(`### Signal context: "${label}"`)
    if (ctx.text?.trim()) parts.push(ctx.text.trim())
    if (ctx.links?.length) parts.push('Referenced links:\n' + ctx.links.map(l => `- ${l}`).join('\n'))
    if (ctx.files?.length) parts.push('Attached documents:\n' + ctx.files.map(f => `--- ${f.name} ---\n${f.content}`).join('\n\n'))
  }
  return parts.join('\n\n')
}
