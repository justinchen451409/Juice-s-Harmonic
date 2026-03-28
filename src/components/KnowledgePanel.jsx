import { useState, useRef } from 'react'
import { getKnowledgeItems, addKnowledgeItem, removeKnowledgeItem } from '../lib/knowledge'
import { getSkills, addSkill, removeSkill, updateSkill } from '../lib/skills'

function FileIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}

function NoteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M2 2h10v8l-3 3H2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M9 10v3M9 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M4.5 5h5M4.5 7.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}

function SkillIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M7 1l1.4 3.3L12 5l-3 2.8.7 3.7L7 10l-2.7 1.5.7-3.7L2 5l3.6-.7L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  )
}

// ---- Context (knowledge) tab ----
function ContextTab({ onItemsChange }) {
  const [items, setItems] = useState(() => getKnowledgeItems())
  const [showAddNote, setShowAddNote] = useState(false)
  const [noteName, setNoteName] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)

  const update = (fn) => {
    const next = fn()
    setItems(next)
    onItemsChange?.()
  }

  const saveNote = () => {
    if (!noteName.trim() || !noteContent.trim()) return
    update(() => addKnowledgeItem({ type: 'note', name: noteName.trim(), content: noteContent.trim() }))
    setNoteName('')
    setNoteContent('')
    setShowAddNote(false)
  }

  const remove = (id) => update(() => removeKnowledgeItem(id))

  const handleFiles = (fileList) => {
    Array.from(fileList).forEach(file => {
      const isText = file.type.startsWith('text/') || /\.(txt|md|csv|json)$/i.test(file.name)
      if (!isText) {
        alert(`"${file.name}" can't be read as text. For PDFs or Word docs, copy and paste the content as a note instead.`)
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        update(() => addKnowledgeItem({ type: 'file', name: file.name, content: e.target.result }))
      }
      reader.readAsText(file)
    })
  }

  return (
    <div className="flex flex-col h-full">
      <p className="text-[11px] text-th-tx4 leading-relaxed mb-3">
        Everything here is injected into every CJ conversation. Add LP letters, investment memos, market notes — anything you want CJ to always know.
      </p>

      {/* Upload drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl px-3 py-4 text-center cursor-pointer transition-colors mb-3 ${
          dragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30' : 'border-th-bd hover:border-th-bd-str'
        }`}
      >
        <input ref={fileInputRef} type="file" multiple accept=".txt,.md,.csv,.json,text/*" className="hidden"
          onChange={e => handleFiles(e.target.files)} />
        <p className="text-[12px] text-th-tx3">Drop files or click to upload</p>
        <p className="text-[11px] text-th-tx4 mt-0.5">.txt, .md, .csv — paste PDFs as notes</p>
      </div>

      {/* Add note */}
      {showAddNote ? (
        <div className="space-y-2 mb-3 p-3 bg-th-hover border border-th-bd rounded-xl">
          <input value={noteName} onChange={e => setNoteName(e.target.value)}
            placeholder="Note title..."
            className="w-full bg-th-surface border border-th-bd rounded-lg px-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str" />
          <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)}
            placeholder="Paste content, thesis notes, excerpts..."
            rows={6}
            className="w-full bg-th-surface border border-th-bd rounded-lg px-3 py-2 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str resize-none" />
          <div className="flex gap-2">
            <button onClick={saveNote} className="flex-1 py-1.5 rounded-lg bg-th-tx text-th-surface text-[12px] font-medium hover:opacity-90 transition-opacity">Save</button>
            <button onClick={() => { setShowAddNote(false); setNoteName(''); setNoteContent('') }}
              className="px-3 py-1.5 rounded-lg border border-th-bd text-[12px] text-th-tx2 hover:bg-th-hover transition-colors">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAddNote(true)}
          className="w-full py-2 mb-3 rounded-xl border border-dashed border-th-bd text-[12px] text-th-tx4 hover:text-th-tx2 hover:border-th-bd-str transition-colors flex items-center justify-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Add note or paste content
        </button>
      )}

      {/* Items list */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {items.length === 0 && (
          <p className="text-[12px] text-th-tx4 text-center py-6">No context added yet</p>
        )}
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-2 p-2.5 rounded-lg bg-th-surface border border-th-bd group">
            <span className="text-th-tx4 mt-0.5 flex-shrink-0">
              {item.type === 'file' ? <FileIcon /> : <NoteIcon />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-th-tx truncate">{item.name}</div>
              <div className="text-[10px] text-th-tx4 mt-0.5">{Math.round(item.content.length / 1000)}k chars</div>
            </div>
            <button onClick={() => remove(item.id)}
              className="text-transparent group-hover:text-th-tx4 hover:!text-red-500 transition-colors flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Skills tab ----
function SkillsTab({ onInvoke }) {
  const [skills, setSkills] = useState(() => getSkills())
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', prompt: '' })

  const saveSkill = () => {
    if (!form.name.trim() || !form.prompt.trim()) return
    if (editingId) {
      setSkills(updateSkill(editingId, form))
      setEditingId(null)
    } else {
      setSkills(addSkill(form))
    }
    setForm({ name: '', description: '', prompt: '' })
    setShowAdd(false)
  }

  const startEdit = (skill) => {
    setForm({ name: skill.name, description: skill.description || '', prompt: skill.prompt })
    setEditingId(skill.id)
    setShowAdd(true)
  }

  const remove = (id) => setSkills(removeSkill(id))

  const cancelForm = () => { setShowAdd(false); setEditingId(null); setForm({ name: '', description: '', prompt: '' }) }

  return (
    <div className="flex flex-col h-full">
      <p className="text-[11px] text-th-tx4 leading-relaxed mb-3">
        Save prompts you use often. Click any skill to instantly send it to CJ.
      </p>

      {showAdd ? (
        <div className="space-y-2 mb-3 p-3 bg-th-hover border border-th-bd rounded-xl">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Skill name (e.g. 'Thesis fit check')"
            className="w-full bg-th-surface border border-th-bd rounded-lg px-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str" />
          <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Short description (optional)"
            className="w-full bg-th-surface border border-th-bd rounded-lg px-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str" />
          <textarea value={form.prompt} onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
            placeholder="The prompt text CJ will receive..."
            rows={5}
            className="w-full bg-th-surface border border-th-bd rounded-lg px-3 py-2 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str resize-none" />
          <div className="flex gap-2">
            <button onClick={saveSkill} className="flex-1 py-1.5 rounded-lg bg-th-tx text-th-surface text-[12px] font-medium hover:opacity-90 transition-opacity">
              {editingId ? 'Save changes' : 'Save skill'}
            </button>
            <button onClick={cancelForm} className="px-3 py-1.5 rounded-lg border border-th-bd text-[12px] text-th-tx2 hover:bg-th-hover transition-colors">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="w-full py-2 mb-3 rounded-xl border border-dashed border-th-bd text-[12px] text-th-tx4 hover:text-th-tx2 hover:border-th-bd-str transition-colors flex items-center justify-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          New skill
        </button>
      )}

      <div className="flex-1 overflow-y-auto space-y-1.5">
        {skills.length === 0 && (
          <p className="text-[12px] text-th-tx4 text-center py-6">No skills saved yet</p>
        )}
        {skills.map(skill => (
          <div key={skill.id} className="group rounded-xl border border-th-bd bg-th-surface overflow-hidden">
            <button
              onClick={() => onInvoke(skill.prompt)}
              className="w-full text-left px-3 py-2.5 hover:bg-th-hover transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-th-tx leading-tight">{skill.name}</div>
                  {skill.description && (
                    <div className="text-[11px] text-th-tx4 mt-0.5 leading-snug">{skill.description}</div>
                  )}
                  <div className="text-[11px] text-th-tx3 mt-1.5 line-clamp-2 leading-snug">{skill.prompt}</div>
                </div>
              </div>
            </button>
            <div className="flex border-t border-th-bd-sub opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(skill)}
                className="flex-1 py-1.5 text-[11px] text-th-tx4 hover:text-th-tx hover:bg-th-hover transition-colors text-center">Edit</button>
              <div className="w-px bg-th-bd-sub" />
              <button onClick={() => remove(skill.id)}
                className="flex-1 py-1.5 text-[11px] text-th-tx4 hover:text-red-500 hover:bg-th-hover transition-colors text-center">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Main panel ----
export default function KnowledgePanel({ open, onToggle, onInvokeSkill, onKnowledgeChange }) {
  const [tab, setTab] = useState('context')

  if (!open) {
    return (
      <button
        onClick={onToggle}
        title="Knowledge & Skills"
        className="fixed right-5 bottom-24 z-20 w-9 h-9 rounded-full bg-th-surface border border-th-bd shadow-md flex items-center justify-center text-th-tx3 hover:text-th-tx hover:border-th-bd-str transition-colors"
      >
        <SkillIcon />
      </button>
    )
  }

  return (
    <div className="w-[300px] flex-shrink-0 border-l border-th-bd-sub bg-th-panel flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-th-bd-sub flex-shrink-0">
        <div className="flex gap-0 bg-th-hover rounded-lg p-0.5">
          {[['context', 'Context'], ['skills', 'Skills']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors ${
                tab === id ? 'bg-th-surface text-th-tx shadow-sm' : 'text-th-tx3 hover:text-th-tx'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button onClick={onToggle} className="text-th-tx4 hover:text-th-tx transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2H12v3M9 5.5L12 2M5 12H2V9M5 8.5L2 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden px-4 py-3 flex flex-col">
        {tab === 'context'
          ? <ContextTab onItemsChange={onKnowledgeChange} />
          : <SkillsTab onInvoke={(prompt) => { onInvokeSkill(prompt); onToggle() }} />
        }
      </div>
    </div>
  )
}
