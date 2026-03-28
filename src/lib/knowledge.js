// Knowledge base — files and text notes always injected into Ask CJ context
const KEY = 'jh_knowledge'

function getAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function getKnowledgeItems() { return getAll() }

export function addKnowledgeItem(item) {
  const items = getAll()
  items.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...item })
  save(items)
  return items
}

export function removeKnowledgeItem(id) {
  const items = getAll().filter(i => i.id !== id)
  save(items)
  return items
}

export function buildKnowledgePrompt() {
  const items = getAll()
  if (!items.length) return ''
  return '\n\nUSER KNOWLEDGE BASE (always treat this as ground truth context):\n' +
    items.map(i => `--- ${i.name} ---\n${i.content}`).join('\n\n')
}
