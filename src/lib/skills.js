// Skills — saved prompts / templates for Ask CJ
const KEY = 'jh_skills'

function getAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function getSkills() { return getAll() }

export function addSkill(skill) {
  const items = getAll()
  items.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...skill })
  save(items)
  return items
}

export function removeSkill(id) {
  const items = getAll().filter(s => s.id !== id)
  save(items)
  return items
}

export function updateSkill(id, updates) {
  const items = getAll().map(s => s.id === id ? { ...s, ...updates } : s)
  save(items)
  return items
}
