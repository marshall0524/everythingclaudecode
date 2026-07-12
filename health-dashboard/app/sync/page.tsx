'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Apple, Activity, RefreshCw, CheckCircle2, Clock, Smartphone, Copy, Check, ChevronRight, AlertCircle, MessageCircle, Settings } from 'lucide-react';

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const WEBHOOK_EXAMPLE = `{
  "date": "2025-05-25",
  "weight": 78.0,
  "bmi": 27.6,
  "bodyFat": 20.5,
  "sleep": {
    "date": "2025-05-25",
    "totalHours": 7.2,
    "deepSleep": 1.5,
    "remSleep": 1.8,
    "lightSleep": 3.7,
    "quality": "good"
  },
  "source": "apple_health"
}`;

export default function SyncPage() {
  const [lastSync, setLastSync]     = useState<Record<string, string>>({});
  const [connected, setConnected]   = useState({ apple: true, strava: true });
  const [syncing, setSyncing]       = useState<string | null>(null);
  const [copied, setCopied]         = useState(false);
  const [showGuide, setShowGuide]   = useState(false);
  const [showAPI, setShowAPI]       = useState(false);
  const [showWA, setShowWA]         = useState(false);
  const [waConfigured, setWaConfigured] = useState<boolean | null>(null);
  const [stravaConfigured, setStravaConfigured] = useState(false);
  const [syncError, setSyncError]   = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('strava') === 'connected') setBanner({ type: 'success', text: 'Strava connected — hit Sync Now to pull your activities.' });
    if (params.get('error') === 'strava_denied') setBanner({ type: 'error', text: 'Strava connection was cancelled.' });
    if (params.get('error') === 'strava_token') setBanner({ type: 'error', text: 'Strava rejected the connection — check your Client ID/Secret on the Settings page.' });
    if (params.toString()) window.history.replaceState({}, '', window.location.pathname);

    fetch('/api/health').then(r => r.json()).then(d => {
      setLastSync(d.lastSync || {});
      setConnected({ apple: d.profile?.appleHealthConnected, strava: d.profile?.stravaConnected });
    }).catch(() => {});
    fetch('/api/coach/test').then(r => r.json()).then(d => setWaConfigured(!!d.whatsappConfigured)).catch(() => {});
    fetch('/api/settings').then(r => r.json()).then(d => setStravaConfigured(!!d.stravaConfigured)).catch(() => {});
  }, []);

  const sync = async (src: string) => {
    setSyncing(src);
    setSyncError(null);
    try {
      if (src === 'strava') {
        const res = await fetch('/api/strava', { method: 'POST' });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error?.message || d.error || 'Strava sync failed');
      } else {
        // Apple Health is push-based (webhook) — nothing to actively pull here.
        await fetch('/api/sync', { method: 'POST' });
      }
      const d = await fetch('/api/health').then(r => r.json());
      setLastSync(d.lastSync || {});
      setConnected({ apple: d.profile?.appleHealthConnected, strava: d.profile?.stravaConnected });
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setSyncing(null);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const webhookUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/health` : 'https://your-app.vercel.app/api/health';

  return (
    <div className="px-4 py-5 space-y-5 animate-fade">
      <div>
        <h1 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Data Sources</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Apple Health · Strava · Automated daily sync</p>
      </div>

      {banner && (
        <div
          className="flex items-start gap-2.5 rounded-2xl p-3"
          style={{
            background: banner.type === 'success' ? 'color-mix(in srgb, var(--recovery) 12%, var(--bg-card))' : 'color-mix(in srgb, var(--danger) 12%, var(--bg-card))',
            border: `1px solid ${banner.type === 'success' ? 'color-mix(in srgb, var(--recovery) 30%, transparent)' : 'color-mix(in srgb, var(--danger) 30%, transparent)'}`,
          }}
        >
          {banner.type === 'success' ? <CheckCircle2 size={15} style={{ color: 'var(--recovery)', flexShrink: 0, marginTop: 1 }} /> : <AlertCircle size={15} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />}
          <p className="text-xs font-semibold" style={{ color: banner.type === 'success' ? 'var(--recovery)' : 'var(--danger)' }}>{banner.text}</p>
        </div>
      )}

      {/* Auto-sync badge */}
      <div className="card p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'color-mix(in srgb, var(--recovery) 18%, var(--bg-card))' }}>
          <RefreshCw size={18} style={{ color: 'var(--recovery)' }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Automated Daily Sync</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {Object.keys(lastSync).length
              ? 'Set up Health Auto Export / Strava to push data here every morning'
              : 'Not receiving data yet — follow the setup guides below'}
          </p>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-full"
          style={
            Object.keys(lastSync).length
              ? { background: 'color-mix(in srgb, var(--recovery) 15%, transparent)', color: 'var(--recovery)' }
              : { background: 'color-mix(in srgb, var(--warning) 15%, transparent)', color: 'var(--warning)' }
          }
        >
          {Object.keys(lastSync).length ? 'RECEIVING DATA' : 'NOT SET UP'}
        </span>
      </div>

      {/* Apple Health */}
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'color-mix(in srgb, #FF3B30 15%, var(--bg-card))' }}>
            <Apple size={20} style={{ color: '#FF3B30' }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>Apple Health</p>
              {connected.apple
                ? <CheckCircle2 size={14} style={{ color: 'var(--recovery)' }} />
                : <AlertCircle size={14} style={{ color: 'var(--warning)' }} />
              }
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Weight, sleep, HRV, steps, VO2 max, active energy</p>
          </div>
        </div>

        {lastSync.apple_health && (
          <div className="flex items-center gap-1.5 mb-3 text-xs" style={{ color: 'var(--text-faint)' }}>
            <Clock size={11} />
            Last synced: {timeAgo(lastSync.apple_health)}
          </div>
        )}

        <div className="p-3 rounded-xl mb-3" style={{ background: 'var(--bg-elevated)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Note: RENPHO data</p>
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Your RENPHO scale syncs body composition (weight, BMI, body fat, muscle mass, visceral fat) directly to Apple Health automatically — no extra setup needed.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
          >
            <Smartphone size={12} />
            Setup Guide
          </button>
          <button
            onClick={() => sync('apple_health')}
            disabled={syncing === 'apple_health'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
          >
            <RefreshCw size={12} className={syncing === 'apple_health' ? 'animate-spin' : ''} />
            {syncing === 'apple_health' ? 'Syncing…' : 'Sync Now'}
          </button>
        </div>

        {showGuide && (
          <div className="mt-4 space-y-3 animate-up">
            <div className="h-px" style={{ background: 'var(--border-subtle)' }} />
            <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>How to set up Apple Health sync</p>
            {[
              { n: '1', title: 'Install "Health Auto Export" from App Store', body: 'Free app that automatically pushes Apple Health data to any webhook URL.' },
              { n: '2', title: 'Set your webhook URL', body: webhookUrl },
              { n: '3', title: 'Schedule daily at 6 AM', body: 'Select all metrics: Weight, Sleep, HRV, Steps, VO2 Max, Active Energy, Resting HR.' },
              { n: '4', title: 'Enable RENPHO → Apple Health sync', body: 'In the RENPHO app: Profile → Settings → Health Data → enable Apple Health sync.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0" style={{ background: 'color-mix(in srgb, var(--recovery) 20%, var(--bg-card))', color: 'var(--recovery)' }}>{n}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
                  {n === '2' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-[10px] font-mono px-2 py-1 rounded-lg flex-1 truncate" style={{ background: 'var(--bg-elevated)', color: 'var(--strain)' }}>{webhookUrl}</code>
                      <button onClick={() => copy(webhookUrl)} className="p-1.5 rounded-lg active:scale-90" style={{ background: 'var(--bg-elevated)' }}>
                        {copied ? <Check size={11} style={{ color: 'var(--recovery)' }} /> : <Copy size={11} style={{ color: 'var(--text-faint)' }} />}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{body}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strava */}
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'color-mix(in srgb, #FC4C02 15%, var(--bg-card))' }}>
            <Activity size={20} style={{ color: '#FC4C02' }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>Strava</p>
              {connected.strava
                ? <CheckCircle2 size={14} style={{ color: 'var(--recovery)' }} />
                : <AlertCircle size={14} style={{ color: 'var(--warning)' }} />
              }
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Runs, rides, workouts, heart rate, pace, elevation</p>
          </div>
        </div>

        {lastSync.strava && (
          <div className="flex items-center gap-1.5 mb-3 text-xs" style={{ color: 'var(--text-faint)' }}>
            <Clock size={11} />
            Last synced: {timeAgo(lastSync.strava)}
          </div>
        )}

        {syncError && (
          <div className="flex items-start gap-2 mb-3 p-2.5 rounded-xl" style={{ background: 'color-mix(in srgb, var(--danger) 12%, var(--bg-card))' }}>
            <AlertCircle size={13} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
            <p className="text-xs" style={{ color: 'var(--danger)' }}>{syncError}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {!stravaConfigured ? (
            <Link href="/settings" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95" style={{ background: '#FC4C02' }}>
              <Settings size={12} />
              Set Up Strava API
            </Link>
          ) : !connected.strava ? (
            <a href="/api/strava" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95" style={{ background: '#FC4C02' }}>
              Connect Strava
              <ChevronRight size={12} />
            </a>
          ) : (
            <button
              onClick={() => sync('strava')}
              disabled={syncing === 'strava'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
            >
              <RefreshCw size={12} className={syncing === 'strava' ? 'animate-spin' : ''} />
              {syncing === 'strava' ? 'Syncing…' : 'Sync Now'}
            </button>
          )}
          <Link href="/settings" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
            <Settings size={12} />
            API Settings
          </Link>
        </div>
      </div>

      {/* WhatsApp daily summary */}
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'color-mix(in srgb, #25D366 15%, var(--bg-card))' }}>
            <MessageCircle size={20} style={{ color: '#25D366' }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>Daily WhatsApp Summary</p>
              {waConfigured === null ? null : waConfigured
                ? <CheckCircle2 size={14} style={{ color: 'var(--recovery)' }} />
                : <AlertCircle size={14} style={{ color: 'var(--warning)' }} />
              }
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sent every morning via CallMeBot</p>
          </div>
        </div>

        {waConfigured === false && (
          <div className="p-3 rounded-xl mb-3" style={{ background: 'color-mix(in srgb, var(--warning) 10%, var(--bg-card))', border: '1px solid color-mix(in srgb, var(--warning) 25%, transparent)' }}>
            <p className="text-xs font-semibold" style={{ color: 'var(--warning)' }}>Not configured yet</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>Set CALLMEBOT_PHONE and CALLMEBOT_APIKEY to enable it.</p>
          </div>
        )}

        <button
          onClick={() => setShowWA(!showWA)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
        >
          <Smartphone size={12} />
          Setup Guide
        </button>

        {showWA && (
          <div className="mt-4 space-y-3 animate-up">
            <div className="h-px" style={{ background: 'var(--border-subtle)' }} />
            {[
              { n: '1', title: 'Add the CallMeBot contact', body: 'Save +34 644 51 95 23 in your phone contacts.' },
              { n: '2', title: 'Send the opt-in message', body: 'WhatsApp that contact: "I allow callmebot to send me messages"' },
              { n: '3', title: 'Get your API key', body: 'CallMeBot replies with a key within a minute or two.' },
              { n: '4', title: 'Add it to your environment', body: 'Set CALLMEBOT_PHONE=61469616917 and CALLMEBOT_APIKEY=<your key> in .env.local (local) or Vercel env vars (deployed), then redeploy/restart.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0" style={{ background: 'color-mix(in srgb, var(--recovery) 20%, var(--bg-card))', color: 'var(--recovery)' }}>{n}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API reference */}
      <div className="card p-4">
        <button className="flex items-center justify-between w-full" onClick={() => setShowAPI(!showAPI)}>
          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Webhook API Reference</p>
          <ChevronRight size={14} style={{ color: 'var(--text-faint)', transform: showAPI ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
        {showAPI && (
          <div className="mt-3 animate-up">
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>POST health data from any source to:</p>
            <div className="flex items-center gap-2 mb-3">
              <code className="text-[11px] font-mono px-2 py-1.5 rounded-xl flex-1 truncate" style={{ background: 'var(--bg-elevated)', color: 'var(--strain)' }}>POST {webhookUrl}</code>
              <button onClick={() => copy(`POST ${webhookUrl}`)} className="p-2 rounded-xl active:scale-90" style={{ background: 'var(--bg-elevated)' }}>
                {copied ? <Check size={12} style={{ color: 'var(--recovery)' }} /> : <Copy size={12} style={{ color: 'var(--text-faint)' }} />}
              </button>
            </div>
            <div className="relative">
              <pre className="text-[10px] p-3 rounded-xl overflow-x-auto" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{WEBHOOK_EXAMPLE}</pre>
              <button onClick={() => copy(WEBHOOK_EXAMPLE)} className="absolute top-2 right-2 p-1.5 rounded-lg active:scale-90" style={{ background: 'var(--bg-card)' }}>
                {copied ? <Check size={11} style={{ color: 'var(--recovery)' }} /> : <Copy size={11} style={{ color: 'var(--text-faint)' }} />}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-2" />
    </div>
  );
}
