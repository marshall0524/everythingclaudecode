'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Plus, FlaskConical, Scan, ClipboardList, Pill, File, X, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import { PathologyDocument } from '@/lib/types';

const docTypeConfig = {
  blood_test: { label: 'Blood Test', icon: FlaskConical, color: '#FF3B30' },
  imaging: { label: 'Imaging', icon: Scan, color: '#0A84FF' },
  report: { label: 'Report', icon: ClipboardList, color: '#30D158' },
  prescription: { label: 'Prescription', icon: Pill, color: '#BF5AF2' },
  other: { label: 'Other', icon: File, color: '#8E8E93' },
};

export default function PathologyPage() {
  const [docs, setDocs] = useState<PathologyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [autoExtracted, setAutoExtracted] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ type: 'blood_test', summary: '' });

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        setDocs(data.pathology || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', form.type);
    fd.append('summary', form.summary);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setDocs((prev) => [data.doc, ...prev]);
        setUploadSuccess(true);
        setAutoExtracted(data.autoExtracted);
        setShowUpload(false);
        setForm({ type: 'blood_test', summary: '' });
        if (fileRef.current) fileRef.current.value = '';
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    } finally {
      setUploading(false);
    }
  };

  const filtered = filter === 'all' ? docs : docs.filter((d) => d.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--recovery)' }} />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-5 animate-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Health Documents</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{docs.length} document{docs.length !== 1 ? 's' : ''} · grounds your coach's advice</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-black transition-all active:scale-95"
          style={{ background: 'var(--recovery)' }}
        >
          <Plus size={14} />
          Upload
        </button>
      </div>

      {uploadSuccess && (
        <div className="flex items-start gap-2.5 rounded-2xl p-3 animate-up" style={{ background: 'color-mix(in srgb, var(--recovery) 12%, var(--bg-card))', border: '1px solid color-mix(in srgb, var(--recovery) 30%, transparent)' }}>
          {autoExtracted ? <Sparkles size={15} style={{ color: 'var(--recovery)', flexShrink: 0, marginTop: 1 }} /> : <CheckCircle2 size={15} style={{ color: 'var(--recovery)', flexShrink: 0, marginTop: 1 }} />}
          <p className="text-xs font-semibold" style={{ color: 'var(--recovery)' }}>
            {autoExtracted ? 'Uploaded — Claude auto-extracted the key values below.' : 'Document uploaded.'}
          </p>
        </div>
      )}

      {/* Upload form */}
      {showUpload && (
        <div className="card p-4 animate-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Upload Document</span>
            <button onClick={() => setShowUpload(false)}>
              <X size={16} style={{ color: 'var(--text-faint)' }} />
            </button>
          </div>
          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>Document Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full text-sm rounded-xl px-3 py-2 outline-none"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text)', border: '1px solid var(--border)' }}
              >
                <option value="blood_test">Blood Test</option>
                <option value="imaging">Imaging (MRI/X-ray)</option>
                <option value="report">Medical Report</option>
                <option value="prescription">Prescription</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>Summary (optional — auto-filled if left blank)</label>
              <input
                type="text"
                value={form.summary}
                onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                placeholder="e.g. Annual blood panel — May 2025"
                className="w-full text-sm rounded-xl px-3 py-2 outline-none"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text)', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>File</label>
              <div
                className="rounded-xl p-4 text-center cursor-pointer transition-colors"
                style={{ border: '2px dashed var(--border)' }}
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={20} style={{ color: 'var(--text-faint)', margin: '0 auto 4px' }} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tap to select a PDF or photo — from files or camera</p>
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.heic" required />
              </div>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-black transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'var(--recovery)' }}
            >
              {uploading && <Loader2 size={14} className="animate-spin" />}
              {uploading ? 'Analysing document…' : 'Upload Document'}
            </button>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['all', 'blood_test', 'imaging', 'report', 'prescription', 'other'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors"
            style={filter === f
              ? { background: 'var(--recovery)', color: '#000' }
              : { background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
          >
            {f === 'all' ? 'All' : docTypeConfig[f as keyof typeof docTypeConfig].label}
          </button>
        ))}
      </div>

      {/* Document list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText size={28} style={{ color: 'var(--text-faint)' }} />
          <p className="text-sm font-semibold mt-3" style={{ color: 'var(--text-muted)' }}>No documents yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Upload blood tests, scans, and reports — your coach reads these directly</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => {
            const cfg = docTypeConfig[doc.type] || docTypeConfig.other;
            const Icon = cfg.icon;
            const isExpanded = expandedDoc === doc.id;

            return (
              <div key={doc.id} className="card overflow-hidden">
                <button
                  className="w-full flex items-start gap-3 p-4 text-left"
                  onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                >
                  <div className="p-2 rounded-xl flex-shrink-0" style={{ background: 'color-mix(in srgb, ' + cfg.color + ' 15%, var(--bg-elevated))', color: cfg.color }}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{doc.filename}</p>
                    {doc.summary && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{doc.summary}</p>}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, ' + cfg.color + ' 15%, transparent)', color: cfg.color }}>{cfg.label}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{doc.uploadDate}</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--text-faint)', flexShrink: 0, marginTop: 4 }} /> : <ChevronDown size={16} style={{ color: 'var(--text-faint)', flexShrink: 0, marginTop: 4 }} />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 animate-up">
                    <div style={{ borderTop: '1px solid var(--border-subtle)' }} className="pt-3">
                      {doc.keyValues && Object.keys(doc.keyValues).length > 0 ? (
                        <>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-faint)' }}>Key Values</p>
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {Object.entries(doc.keyValues).map(([k, v]) => (
                              <div key={k} className="rounded-xl p-2" style={{ background: 'var(--bg-elevated)' }}>
                                <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-faint)' }}>{k}</p>
                                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{v}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-xs mb-3" style={{ color: 'var(--text-faint)' }}>No structured values extracted for this document.</p>
                      )}
                      {doc.filePath && (
                        <a
                          href={doc.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors"
                          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                        >
                          <FileText size={13} />
                          View Document
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="h-2" />
    </div>
  );
}
