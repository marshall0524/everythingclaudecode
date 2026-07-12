'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, CheckCircle2, AlertCircle, ExternalLink, Save, Loader2, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [secretSet, setSecretSet] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [connected, setConnected] = useState(false);
  const [usingEnvFallback, setUsingEnvFallback] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [origin, setOrigin] = useState('');

  const load = async () => {
    const res = await fetch('/api/settings');
    const d = await res.json();
    setClientId(d.stravaClientId || '');
    setSecretSet(d.stravaClientSecretSet);
    setConfigured(d.stravaConfigured);
    setConnected(d.stravaConnected);
    setUsingEnvFallback(d.usingEnvFallback);
  };

  useEffect(() => {
    load();
    setOrigin(window.location.origin);
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stravaClientId: clientId, stravaClientSecret: clientSecret }),
    });
    setClientSecret('');
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    load();
  };

  const disconnect = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clearStrava: true }),
    });
    setClientId('');
    setClientSecret('');
    setSaving(false);
    load();
  };

  return (
    <div className="px-4 py-4 space-y-5 animate-fade">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Connect data source APIs</p>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'color-mix(in srgb, #FC4C02 15%, var(--bg-card))' }}>
            <Activity size={20} style={{ color: '#FC4C02' }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>Strava API</p>
              {connected
                ? <CheckCircle2 size={14} style={{ color: 'var(--recovery)' }} />
                : configured
                  ? <AlertCircle size={14} style={{ color: 'var(--warning)' }} />
                  : null}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {connected ? 'Connected' : configured ? 'Configured — not connected yet' : 'Not configured'}
            </p>
          </div>
        </div>

        {usingEnvFallback && (
          <div className="mb-3 p-2.5 rounded-xl text-xs" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
            Using credentials from Vercel environment variables. Save here to override them.
          </div>
        )}

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>Client ID</label>
            <input
              type="text"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              placeholder="e.g. 123456"
              className="w-full text-sm rounded-xl px-3 py-2 outline-none"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text)', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-muted)' }}>Client Secret</label>
            <input
              type="password"
              value={clientSecret}
              onChange={e => setClientSecret(e.target.value)}
              placeholder={secretSet ? '••••••••••••••••  (saved — enter to replace)' : 'Paste your client secret'}
              className="w-full text-sm rounded-xl px-3 py-2 outline-none"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text)', border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving || !clientId}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-bold text-black transition-all active:scale-95 disabled:opacity-40"
            style={{ background: '#FC4C02' }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? 'Saved' : 'Save'}
          </button>
          {configured && (
            <button
              onClick={disconnect}
              disabled={saving}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95"
              style={{ background: 'var(--bg-elevated)', color: 'var(--danger)' }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {configured && (
          <a
            href="/api/strava"
            className="mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: '#FC4C02' }}
          >
            {connected ? 'Reconnect Strava' : 'Connect Strava'}
          </a>
        )}

        <div className="mt-4 pt-4 space-y-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>How to get these</p>
          {[
            { n: '1', title: 'Open Strava API settings', body: 'strava.com/settings/api — create an app if you haven’t.' },
            { n: '2', title: 'Authorization Callback Domain', body: origin ? origin.replace(/^https?:\/\//, '') : 'your-app.vercel.app' },
            { n: '3', title: 'Copy Client ID and Client Secret', body: 'Paste them into the fields above and hit Save.' },
            { n: '4', title: 'Click Connect Strava', body: 'Approve on Strava’s page — you’ll land back on Sync, connected.' },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0" style={{ background: 'color-mix(in srgb, #FC4C02 20%, var(--bg-card))', color: '#FC4C02' }}>{n}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
                <p className="text-xs mt-0.5 break-all" style={{ color: 'var(--text-faint)' }}>{body}</p>
              </div>
            </div>
          ))}
          <a
            href="https://www.strava.com/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold mt-2"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
          >
            Open Strava API Settings
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <Link href="/sync" className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold" style={{ color: 'var(--text-faint)' }}>
        ← Back to Data Sources
      </Link>

      <div className="h-2" />
    </div>
  );
}
