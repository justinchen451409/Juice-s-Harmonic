import { useState, useEffect, useRef } from 'react'
import { getRichContext, saveRichContext, hasRichContext } from '../lib/richContext'

export default function RichContextModal({ signalLabel, onClose }) {
  const [text, setText] = useState('')
  const [links, setLinks] = useState([])
  const [files, setFiles] = useState([])
  const [linkInput, setLinkInput] = useState('')
  const [dragging, setDragging] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const ctx = getRichContext(signalLabel)
    setText(ctx.text || '')
    setLinks(ctx.links || [])
    setFiles(ctx.files || [])
  }, [signalLabel])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSave = () => {
    saveRichContext(signalLabel, { text, links, files })
    setSaved(true)
    setTimeout(onClose, 600)
  }

  const addLink = () => {
    const url = linkInput.trim()
    if (!url || links.includes(url)) return
    setLinks(prev => [...prev, url])
    setLinkInput('')
  }

  const removeLink = (url) => setLinks(prev => prev.filter(l => l !== url))
  const removeFile = (name) => setFiles(prev => prev.filter(f => f.name !== name))

  const handleFiles = (fileList) => {
    Array.from(fileList).forEach(file => {
      const isText = file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.csv')
      if (!isText) {
        alert(`"${file.name}" can't be read as text. For PDFs or Word docs, paste the content into the text area above.`)
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setFiles(prev => {
          if (prev.find(f => f.name === file.name)) return prev
          return [...prev, { name: file.name, content: e.target.result }]
        })
      }
      reader.readAsText(file)
    })
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const charCount = text.length + files.reduce((n, f) => n + f.content.length, 0)

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] max-h-[88vh] z-[70] bg-th-surface border border-th-bd rounded-2xl shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-th-bd-sub flex-shrink-0">
          <div>
            <h2 className="text-[15px] font-semibold text-th-tx">Deep Context — "{signalLabel}"</h2>
            <p className="text-[12px] text-th-tx3 mt-0.5">Everything here gets injected into Ask CJ as background knowledge. Paste LP letters, investment memos, thesis notes, or any reference material.</p>
          </div>
          <button onClick={onClose} className="text-th-tx3 hover:text-th-tx transition-colors ml-4 flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Main text area */}
          <div>
            <label className="block text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Context & Thesis Notes</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`Paste anything here — LP letters, investment committee notes, portfolio patterns, thesis frameworks, market maps, relevant excerpts from research reports...\n\nThe more specific and detailed, the better CJ can apply this to deal analysis.`}
              className="w-full bg-th-hover border border-th-bd rounded-xl px-4 py-3 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str transition-colors resize-none leading-relaxed"
              rows={14}
            />
          </div>

          {/* Links */}
          <div>
            <label className="block text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Reference Links</label>
            <div className="flex gap-2 mb-2">
              <input
                value={linkInput}
                onChange={e => setLinkInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLink())}
                placeholder="https://..."
                className="flex-1 bg-th-hover border border-th-bd rounded-lg px-3 py-2 text-[13px] text-th-tx placeholder-th-tx4 focus:outline-none focus:border-th-bd-str transition-colors"
              />
              <button onClick={addLink} className="px-4 py-2 rounded-lg border border-th-bd bg-th-hover text-[13px] text-th-tx2 hover:text-th-tx hover:border-th-bd-str transition-colors">
                Add
              </button>
            </div>
            {links.length > 0 && (
              <div className="space-y-1">
                {links.map(url => (
                  <div key={url} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-th-hover border border-th-bd">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-th-tx4 flex-shrink-0">
                      <path d="M5.5 8.5a3 3 0 004.243 0l1.5-1.5a3 3 0 00-4.243-4.243L6 3.757" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M8.5 5.5a3 3 0 00-4.243 0l-1.5 1.5a3 3 0 004.243 4.243L8 10.243" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    <span className="flex-1 text-[12px] text-th-tx2 truncate">{url}</span>
                    <button onClick={() => removeLink(url)} className="text-th-tx4 hover:text-red-500 transition-colors flex-shrink-0">
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File upload */}
          <div>
            <label className="block text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">
              Attach Text Files
              <span className="ml-1.5 font-normal text-th-tx4 normal-case">.txt, .md, .csv — for PDFs/Word docs, paste the content above</span>
            </label>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors ${
                dragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30' : 'border-th-bd hover:border-th-bd-str'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.md,.csv,text/*"
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mx-auto mb-2 text-th-tx4">
                <path d="M10 13V4M10 4L7 7M10 4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-[12px] text-th-tx3">Drop files here or click to upload</p>
            </div>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map(f => (
                  <div key={f.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-th-hover border border-th-bd">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-th-tx4 flex-shrink-0">
                      <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                    <span className="flex-1 text-[12px] text-th-tx2">{f.name}</span>
                    <span className="text-[11px] text-th-tx4">{Math.round(f.content.length / 1000)}k chars</span>
                    <button onClick={() => removeFile(f.name)} className="text-th-tx4 hover:text-red-500 transition-colors flex-shrink-0">
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-th-bd-sub flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-th-tx4">{(charCount / 1000).toFixed(1)}k characters · injected into Ask CJ context</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-th-bd text-[13px] text-th-tx2 hover:bg-th-hover transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-th-tx text-th-surface hover:opacity-90'}`}>
              {saved ? '✓ Saved' : 'Save Context'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
