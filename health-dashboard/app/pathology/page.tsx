'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Plus, FlaskConical, Scan, ClipboardList, Pill, File, X, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PathologyDocument } from '@/lib/types';

const docTypeConfig = {
  blood_test: { label: 'Blood Test', icon: FlaskConical, color: 'text-red-400', bg: 'bg-red-900/20 border-red-800/30' },
  imaging: { label: 'Imaging', icon: Scan, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-800/30' },
  report: { label: 'Report', icon: ClipboardList, color: 'text-green-400', bg: 'bg-green-900/20 border-green-800/30' },
  prescription: { label: 'Prescription', icon: Pill, color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-800/30' },
  other: { label: 'Other', icon: File, color: 'text-gray-400', bg: 'bg-gray-800/50 border-gray-700' },
};

export default function PathologyPage() {
  const [docs, setDocs] = useState<PathologyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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
        setShowUpload(false);
        setForm({ type: 'blood_test', summary: '' });
        if (fileRef.current) fileRef.current.value = '';
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } finally {
      setUploading(false);
    }
  };

  const filtered = filter === 'all' ? docs : docs.filter((d) => d.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-primary-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Pathology Docs</h1>
          <p className="text-sm text-gray-400">{docs.length} document{docs.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-700 hover:bg-primary-600 text-xs font-semibold text-white transition-colors"
        >
          <Plus size={14} />
          Upload
        </button>
      </div>

      {uploadSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-green-800/40 bg-green-900/20 px-3 py-2.5 animate-slide-up">
          <CheckCircle2 size={16} className="text-green-400" />
          <span className="text-sm text-green-300">Document uploaded successfully</span>
        </div>
      )}

      {/* Upload form */}
      {showUpload && (
        <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Upload Document</span>
            <button onClick={() => setShowUpload(false)}>
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Document Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none focus:border-primary-500"
              >
                <option value="blood_test">Blood Test</option>
                <option value="imaging">Imaging (MRI/X-ray)</option>
                <option value="report">Medical Report</option>
                <option value="prescription">Prescription</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Summary (optional)</label>
              <input
                type="text"
                value={form.summary}
                onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                placeholder="e.g. Annual blood panel — May 2025"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">File</label>
              <div
                className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-primary-600 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={20} className="text-gray-500 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Tap to select PDF or image</p>
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.heic" required />
              </div>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Upload Document'}
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
            className={cn(
              'flex-shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors',
              filter === f ? 'bg-primary-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            )}
          >
            {f === 'all' ? 'All' : docTypeConfig[f as keyof typeof docTypeConfig].label}
          </button>
        ))}
      </div>

      {/* Document list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText size={32} className="text-gray-700 mb-3" />
          <p className="text-sm text-gray-500">No documents yet</p>
          <p className="text-xs text-gray-600 mt-1">Upload your blood tests, scans, and reports</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => {
            const cfg = docTypeConfig[doc.type] || docTypeConfig.other;
            const Icon = cfg.icon;
            const isExpanded = expandedDoc === doc.id;

            return (
              <div key={doc.id} className={cn('rounded-2xl border bg-gray-900/60', cfg.bg)}>
                <button
                  className="w-full flex items-start gap-3 p-4 text-left"
                  onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                >
                  <div className={cn('p-2 rounded-xl bg-gray-900/80 flex-shrink-0', cfg.color)}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{doc.filename}</p>
                    {doc.summary && <p className="text-xs text-gray-400 mt-0.5 truncate">{doc.summary}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full border', cfg.bg, cfg.color)}>{cfg.label}</span>
                      <span className="text-[10px] text-gray-500">{doc.uploadDate}</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-gray-500 flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-gray-500 flex-shrink-0 mt-1" />}
                </button>

                {isExpanded && doc.keyValues && Object.keys(doc.keyValues).length > 0 && (
                  <div className="px-4 pb-4 animate-slide-up">
                    <div className="border-t border-gray-800/50 pt-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Values</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(doc.keyValues).map(([k, v]) => (
                          <div key={k} className="bg-gray-800/60 rounded-xl p-2">
                            <p className="text-[10px] text-gray-500 mb-0.5">{k}</p>
                            <p className="text-sm font-semibold text-white">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <a
                      href={doc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-300 transition-colors"
                    >
                      <FileText size={13} />
                      View Document
                    </a>
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
