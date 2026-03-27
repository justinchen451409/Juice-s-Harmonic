import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fetchCRMNotes, insertCRMNote, updateCRMNote, deleteCRMNote, uploadCRMFile } from '../lib/supabase'

function NoteCard({ note, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = note.content.length > 300

  return (
    <div className="bg-th-surface border border-th-bd rounded-xl px-4 py-3.5 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {note.company && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-th-hover border border-th-bd text-th-tx2 whitespace-nowrap">
              {note.company}
            </span>
          )}
          {note.source && (
            <span className="text-[11px] text-th-tx3 whitespace-nowrap">{note.source}</span>
          )}
          <span className="text-[11px] text-th-tx4">
            {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 rounded text-th-tx4 hover:text-th-tx2 hover:bg-th-hover transition-colors"
            title="Edit"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded text-th-tx4 hover:text-red-500 hover:bg-th-hover transition-colors"
            title="Delete"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      <p className={`text-[13px] text-th-tx2 leading-relaxed whitespace-pre-wrap ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
        {note.content}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-[11px] text-th-tx3 hover:text-th-tx transition-colors"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
      {note.file_name && (
        <a
          href={note.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[11px] text-th-tx3 hover:text-th-tx transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 12h10M7 1v8M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {note.file_name}
        </a>
      )}
    </div>
  )
}

export default function CRMTab({ deals }) {
  const { user, workspaceId, isGuest } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [form, setForm] = useState({ company: '', content: '', source: '' })
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    if (isGuest) {
      try {
        const saved = JSON.parse(localStorage.getItem('jh_crm_notes') || '[]')
        setNotes(saved)
      } catch { setNotes([]) }
    } else if (user) {
      loadNotes()
    }
  }, [user, isGuest])

  const loadNotes = async () => {
    setLoading(true)
    try {
      const data = await fetchCRMNotes(user.id)
      setNotes(data || [])
    } catch {
      setError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ company: '', content: '', source: '' })
    setFile(null)
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  const handleSave = async () => {
    if (!form.content.trim()) {
      setError('Note content is required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      let fileUrl = null
      let fileName = null
      if (file && user && !isGuest) {
        const result = await uploadCRMFile(user.id, file)
        fileUrl = result.url
        fileName = result.name
      }

      if (editingId) {
        const patch = {
          content: form.content.trim(),
          company: form.company || null,
          source: form.source.trim() || null,
        }
        if (fileUrl) { patch.file_url = fileUrl; patch.file_name = fileName }
        if (isGuest) {
          const updated = notes.map(n =>
            n.id === editingId ? { ...n, ...patch, updated_at: new Date().toISOString() } : n
          )
          setNotes(updated)
          localStorage.setItem('jh_crm_notes', JSON.stringify(updated))
        } else {
          const updated = await updateCRMNote(editingId, patch)
          setNotes(prev => prev.map(n => n.id === editingId ? (updated || { ...n, ...patch }) : n))
        }
      } else {
        const note = {
          id: crypto.randomUUID(),
          user_id: user?.id || 'guest',
          workspace_id: workspaceId || null,
          company: form.company || null,
          content: form.content.trim(),
          source: form.source.trim() || null,
          file_url: fileUrl,
          file_name: fileName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        if (isGuest) {
          const updated = [note, ...notes]
          setNotes(updated)
          localStorage.setItem('jh_crm_notes', JSON.stringify(updated))
        } else {
          const inserted = await insertCRMNote(note)
          setNotes(prev => [inserted || note, ...prev])
        }
      }
      resetForm()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (isGuest) {
      const updated = notes.filter(n => n.id !== id)
      setNotes(updated)
      localStorage.setItem('jh_crm_notes', JSON.stringify(updated))
    } else {
      try {
        await deleteCRMNote(id)
        setNotes(prev => prev.filter(n => n.id !== id))
      } catch {
        setError('Failed to delete note')
      }
    }
  }

  const startEdit = (note) => {
    setEditingId(note.id)
    setForm({ company: note.company || '', content: note.content, source: note.source || '' })
    setShowForm(true)
    setError(null)
  }

  const filtered = notes.filter(n => {
    if (!searchText.trim()) return true
    const q = searchText.toLowerCase()
    return n.content.toLowerCase().includes(q) || (n.company || '').toLowerCase().includes(q) || (n.source || '').toLowerCase().includes(q)
  })

  return (
    <div className="flex flex-col h-full bg-th-bg overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-th-bd-sub bg-th-panel">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-th-tx4" width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-th-surface border border-th-bd rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
          />
        </div>
        <span className="text-[11px] text-th-tx4 ml-auto">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ company: '', content: '', source: '' }); setError(null) }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-th-tx text-th-surface text-[12px] font-medium hover:opacity-90 transition-opacity"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          New Note
        </button>
      </div>

      {/* New / Edit form */}
      {showForm && (
        <div className="flex-shrink-0 border-b border-th-bd-sub bg-th-surface px-4 py-4 shadow-sm">
          <div className="max-w-2xl space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-th-tx3 mb-1">Company (optional)</label>
                <select
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx focus:outline-none focus:border-th-bd-str"
                >
                  <option value="">No company linked</option>
                  {deals.map(d => <option key={d.id} value={d.company}>{d.company}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-th-tx3 mb-1">Source (optional)</label>
                <input
                  value={form.source}
                  onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                  placeholder="e.g. Call with CEO, Email, Conference"
                  className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-th-tx3 mb-1">Note *</label>
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={4}
                autoFocus
                placeholder="Add your notes, research, or key takeaways..."
                className="w-full bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str resize-none"
              />
            </div>
            {!isGuest && (
              <div>
                <label className="block text-[11px] font-medium text-th-tx3 mb-1">Attach file (optional)</label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileRef}
                    type="file"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-th-bd bg-th-hover text-[12px] text-th-tx2 hover:text-th-tx hover:border-th-bd-str transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v8M4 4l3-3 3 3M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {file ? file.name : 'Upload file'}
                  </button>
                  {file && (
                    <button type="button" onClick={() => setFile(null)} className="text-th-tx4 hover:text-th-tx2 text-[11px] transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
            {isGuest && (
              <p className="text-[11px] text-th-tx4">Sign in to attach files and sync notes across devices.</p>
            )}
            {error && <p className="text-[12px] text-red-500">{error}</p>}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-th-tx text-th-surface text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Note' : 'Save Note'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-th-bd text-[13px] text-th-tx2 hover:bg-th-hover transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="text-center py-16 text-[13px] text-th-tx3">Loading notes...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-10 h-10 rounded-xl bg-th-hover flex items-center justify-center mb-4">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 3h12v12H3zM3 7h12M7 7v8" stroke="currentColor" className="text-th-tx3" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="text-[13px] font-medium text-th-tx2 mb-1">
              {notes.length === 0 ? 'No notes yet' : 'No notes match your search'}
            </div>
            {notes.length === 0 && (
              <p className="text-[12px] text-th-tx4 max-w-xs leading-relaxed">
                Add notes about companies, calls, or research to keep your CRM organized. Ask CJ can search your notes.
              </p>
            )}
          </div>
        ) : (
          <div className="max-w-2xl space-y-3">
            {filtered.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => startEdit(note)}
                onDelete={() => handleDelete(note.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
