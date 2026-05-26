'use client'

import { useState, useRef, useCallback } from 'react'
import {
  CloudUpload,
  FileText,
  FileImage,
  File,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react'
import { mockPolicies } from '@/lib/mock-data'
import { Document } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'

// Gather all documents from mock policies
const INITIAL_DOCS: Document[] = mockPolicies.flatMap((p) => p.documents)

type Filter = 'all' | 'health' | 'travel' | 'auto' | 'home'

function fileIcon(name: string) {
  const lower = name.toLowerCase()
  if (lower.endsWith('.pdf')) return <FileText size={18} style={{ color: 'var(--danger)' }} />
  if (lower.match(/\.(jpg|jpeg|png|webp|heic)$/)) return <FileImage size={18} style={{ color: 'var(--primary)' }} />
  return <File size={18} style={{ color: 'var(--text-muted)' }} />
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function typeBadgeColor(type: string): { bg: string; color: string } {
  switch (type) {
    case 'policy': return { bg: 'var(--primary-bg)', color: 'var(--primary)' }
    case 'eob':    return { bg: 'var(--covered-bg)', color: 'var(--covered)' }
    case 'pds':    return { bg: 'var(--warning-bg)', color: 'var(--warning)' }
    case 'claim':  return { bg: 'var(--danger-bg)',  color: 'var(--danger)' }
    default:       return { bg: 'var(--bg-elevated)', color: 'var(--text-muted)' }
  }
}

function guessFilter(doc: Document): Filter {
  const policyId = doc.policyId || ''
  if (policyId.includes('health')) return 'health'
  if (policyId.includes('travel')) return 'travel'
  if (policyId.includes('auto')) return 'auto'
  return 'all'
}

function DocRow({ doc, onRemove }: { doc: Document; onRemove: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const { bg, color } = typeBadgeColor(doc.type)
  const hasExtracted = doc.extractedData && Object.keys(doc.extractedData).length > 0

  return (
    <div
      className="card mb-2 overflow-hidden transition-all"
      style={{ borderRadius: 16 }}
    >
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => hasExtracted && setExpanded((e) => !e)}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--bg-elevated)' }}
        >
          {fileIcon(doc.name)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
            {doc.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
              style={{ background: bg, color }}
            >
              {doc.type}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
              {formatSize(doc.size)} · {formatDate(doc.uploadedAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {hasExtracted && (
            <span
              className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'var(--covered-bg)', color: 'var(--covered)' }}
            >
              <CheckCircle size={10} /> AI Read
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(doc.id) }}
            className="p-1 rounded-lg transition-all active:scale-90"
            style={{ color: 'var(--text-faint)' }}
          >
            <X size={14} />
          </button>
          {hasExtracted && (
            expanded
              ? <ChevronUp size={14} style={{ color: 'var(--text-faint)' }} />
              : <ChevronDown size={14} style={{ color: 'var(--text-faint)' }} />
          )}
        </div>
      </div>

      {expanded && hasExtracted && doc.extractedData && (
        <div
          className="px-3 pb-3 pt-0 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-wide mb-2 mt-2"
            style={{ color: 'var(--primary)' }}
          >
            Extracted Data
          </p>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(doc.extractedData).map(([key, val]) => (
              <div key={key}>
                <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{key}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>(INITIAL_DOCS)
  const [filter, setFilter] = useState<Filter>('all')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError('')

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Upload failed')

        setDocs((prev) => [data.document, ...prev])
      } catch (e: unknown) {
        setUploadError(e instanceof Error ? e.message : 'Upload failed')
      }
    }

    setUploading(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const filteredDocs = docs.filter((d) => {
    if (filter === 'all') return true
    return guessFilter(d) === filter
  })

  const filterOptions: { key: Filter; label: string }[] = [
    { key: 'all',    label: 'All' },
    { key: 'health', label: 'Health' },
    { key: 'travel', label: 'Travel' },
    { key: 'auto',   label: 'Auto' },
    { key: 'home',   label: 'Home' },
  ]

  return (
    <div className="animate-fade">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Documents</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {docs.length} document{docs.length !== 1 ? 's' : ''} stored securely
        </p>
      </div>

      {/* Upload Dropzone */}
      <div className="px-4 mb-4">
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className="rounded-2xl border-2 border-dashed p-8 flex flex-col items-center gap-3 cursor-pointer transition-all"
          style={{
            borderColor: dragOver ? 'var(--primary)' : 'var(--border)',
            background: dragOver ? 'var(--primary-bg)' : 'var(--bg-elevated)',
          }}
        >
          {uploading ? (
            <>
              <Spinner size={32} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Uploading & extracting data...
              </p>
            </>
          ) : (
            <>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--primary-bg)' }}
              >
                <CloudUpload size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  Drop insurance documents here
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
                  PDF, JPG, PNG up to 10MB · Tap to browse
                </p>
              </div>
              <span
                className="text-xs font-medium px-4 py-2 rounded-xl"
                style={{ background: 'var(--primary)', color: '#fff' }}
              >
                Choose Files
              </span>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.heic"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploadError && (
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--danger)' }}>
            {uploadError}
          </p>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto no-scrollbar">
        {filterOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-all active:scale-90"
            style={{
              background: filter === key ? 'var(--primary)' : 'var(--bg-elevated)',
              color: filter === key ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${filter === key ? 'var(--primary)' : 'var(--border)'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Documents list */}
      <div className="px-4">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={40} style={{ color: 'var(--text-faint)', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No documents in this category
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <DocRow
              key={doc.id}
              doc={doc}
              onRemove={(id) => setDocs((prev) => prev.filter((d) => d.id !== id))}
            />
          ))
        )}
      </div>
    </div>
  )
}
