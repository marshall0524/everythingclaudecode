'use client';

import { useState, useEffect } from 'react';
import { Apple, Activity, Scale, RefreshCw, CheckCircle2, XCircle, Clock, ChevronRight, Smartphone, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncStatus {
  lastSync: Record<string, string>;
  profile: {
    stravaConnected: boolean;
    appleHealthConnected: boolean;
    renphoConnected: boolean;
  };
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

const shortcutCode = `// iOS Shortcut — runs daily at 6 AM
// Sends your Apple Health data to your HealthOS dashboard

GET Health Data (Weight, Steps, Sleep, HRV, Active Energy)
→ POST https://your-app.vercel.app/api/health
   Body: {
     "weight": [Weight],
     "date": [Current Date ISO],
     "bmi": [BMI],
     "sleep": {
       "date": [Date],
       "totalHours": [Sleep Duration Hours],
       "quality": "good",
       "source": "apple_health"
     },
     "source": "apple_health"
   }`;

export default function SyncPage() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showShortcutGuide, setShowShortcutGuide] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => setStatus({ lastSync: data.lastSync, profile: data.profile }))
      .catch(console.error);
  }, []);

  const handleSync = async (source: string) => {
    setSyncing(source);
    try {
      await fetch('/api/sync', { method: 'POST' });
      const res = await fetch('/api/health');
      const data = await res.json();
      setStatus({ lastSync: data.lastSync, profile: data.profile });
    } finally {
      setSyncing(null);
    }
  };

  const handleStravaConnect = () => {
    window.location.href = '/api/strava';
  };

  const copyShortcut = () => {
    navigator.clipboard.writeText(shortcutCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sources = [
    {
      id: 'apple_health',
      name: 'Apple Health',
      description: 'Weight, sleep, HRV, steps, active energy, VO2 max',
      icon: Apple,
      color: 'text-red-400',
      bg: 'from-red-950/40 to-red-900/20',
      border: 'border-red-800/30',
      connected: status?.profile.appleHealthConnected,
      lastSync: status?.lastSync.apple_health,
      canAutoSync: true,
    },
    {
      id: 'strava',
      name: 'Strava',
      description: 'Runs, rides, workouts, heart rate, pace, elevation',
      icon: Activity,
      color: 'text-orange-400',
      bg: 'from-orange-950/40 to-orange-900/20',
      border: 'border-orange-800/30',
      connected: status?.profile.stravaConnected,
      lastSync: status?.lastSync.strava,
      canAutoSync: true,
    },
    {
      id: 'renpho',
      name: 'RENPHO Scale',
      description: 'Weight, BMI, body fat %, muscle mass, visceral fat',
      icon: Scale,
      color: 'text-blue-400',
      bg: 'from-blue-950/40 to-blue-900/20',
      border: 'border-blue-800/30',
      connected: status?.profile.renphoConnected,
      lastSync: status?.lastSync.renpho,
      canAutoSync: false,
      note: 'Syncs automatically via Apple Health',
    },
  ];

  return (
    <div className="px-4 py-4 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white">Data Sync</h1>
        <p className="text-sm text-gray-400">Automated daily sync · all your health sources</p>
      </div>

      {/* Auto-sync status */}
      <div className="rounded-2xl border border-green-800/30 bg-gradient-to-br from-green-950/40 to-green-900/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw size={16} className="text-green-400" />
          <span className="text-sm font-semibold text-white">Automated Daily Sync</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-300 font-medium">Active</span>
        </div>
        <p className="text-xs text-gray-400">Your data syncs automatically every morning at 6:00 AM. You can also trigger a manual sync below.</p>
      </div>

      {/* Data sources */}
      <section>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Connected Sources</h2>
        <div className="space-y-3">
          {sources.map((src) => {
            const Icon = src.icon;
            return (
              <div key={src.id} className={cn('rounded-2xl border p-4 bg-gradient-to-br', src.bg, src.border)}>
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-xl bg-gray-900/60 flex-shrink-0', src.color)}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white">{src.name}</span>
                      {src.connected ? (
                        <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle size={14} className="text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{src.description}</p>
                    {src.note && <p className="text-xs text-gray-500 italic mb-2">{src.note}</p>}
                    {src.lastSync && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={11} />
                        <span>Last synced: {formatTime(src.lastSync)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  {src.id === 'strava' && !src.connected && (
                    <button
                      onClick={handleStravaConnect}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white transition-colors"
                    >
                      Connect Strava
                      <ChevronRight size={12} />
                    </button>
                  )}
                  {src.id === 'apple_health' && (
                    <button
                      onClick={() => setShowShortcutGuide(!showShortcutGuide)}
                      className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-300 transition-colors"
                    >
                      <Smartphone size={12} />
                      Setup Guide
                    </button>
                  )}
                  {src.canAutoSync && (
                    <button
                      onClick={() => handleSync(src.id)}
                      disabled={syncing === src.id}
                      className={cn(
                        'flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-colors',
                        syncing === src.id ? 'bg-gray-700 text-gray-500' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      )}
                    >
                      <RefreshCw size={12} className={syncing === src.id ? 'animate-spin' : ''} />
                      {syncing === src.id ? 'Syncing…' : 'Sync Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Apple Health iOS Shortcuts guide */}
      {showShortcutGuide && (
        <section className="rounded-2xl border border-gray-700 bg-gray-900/60 p-4 animate-slide-up">
          <h3 className="text-sm font-bold text-white mb-3">Apple Health Setup (iOS Shortcuts)</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-900/50 flex items-center justify-center text-xs font-bold text-primary-400">1</span>
              <div>
                <p className="text-xs font-medium text-gray-300">Install &quot;Health Auto Export&quot; app</p>
                <p className="text-xs text-gray-500">Free app on App Store — automatically exports Apple Health data to a webhook</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-900/50 flex items-center justify-center text-xs font-bold text-primary-400">2</span>
              <div>
                <p className="text-xs font-medium text-gray-300">Configure webhook URL</p>
                <p className="text-xs font-mono bg-gray-800 rounded px-2 py-1 mt-1 text-primary-300 break-all">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://your-app.vercel.app'}/api/health
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-900/50 flex items-center justify-center text-xs font-bold text-primary-400">3</span>
              <div>
                <p className="text-xs font-medium text-gray-300">Or use iOS Shortcuts</p>
                <p className="text-xs text-gray-500 mb-2">Create an automation that runs daily and posts your health metrics to the API endpoint above.</p>
                <div className="relative">
                  <pre className="text-[10px] text-gray-400 bg-gray-800 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap">{shortcutCode}</pre>
                  <button
                    onClick={copyShortcut}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-900/50 flex items-center justify-center text-xs font-bold text-primary-400">4</span>
              <div>
                <p className="text-xs font-medium text-gray-300">Set automation schedule</p>
                <p className="text-xs text-gray-500">Set the shortcut to run daily at 6:00 AM for automatic morning sync</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RENPHO sync info */}
      <section className="rounded-2xl border border-gray-700 bg-gray-900/40 p-4">
        <h3 className="text-sm font-bold text-white mb-2">RENPHO Integration</h3>
        <p className="text-xs text-gray-400 mb-3">RENPHO scales sync body composition data directly to Apple Health. Once Apple Health is connected, all RENPHO data (weight, body fat, muscle mass, BMI, visceral fat) flows in automatically.</p>
        <div className="flex flex-wrap gap-2">
          {['Weight', 'BMI', 'Body Fat %', 'Muscle Mass', 'Visceral Fat', 'Metabolic Age'].map((m) => (
            <span key={m} className="text-[10px] px-2 py-1 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/30">{m}</span>
          ))}
        </div>
      </section>

      {/* API reference */}
      <section className="rounded-2xl border border-gray-700 bg-gray-900/40 p-4">
        <h3 className="text-sm font-bold text-white mb-2">Webhook API</h3>
        <p className="text-xs text-gray-400 mb-2">POST health data from any source:</p>
        <div className="space-y-2 text-xs font-mono">
          <div className="bg-gray-800 rounded-lg p-2">
            <span className="text-green-400">POST </span>
            <span className="text-gray-300">/api/health</span>
          </div>
          <pre className="text-[10px] text-gray-400 bg-gray-800 rounded-xl p-3 overflow-x-auto">{`{
  "date": "2025-05-24",
  "weight": 78.0,
  "bmi": 27.6,
  "bodyFat": 20.5,
  "sleep": {
    "date": "2025-05-24",
    "totalHours": 7.2,
    "deepSleep": 1.5,
    "remSleep": 1.8,
    "lightSleep": 3.7,
    "quality": "good"
  },
  "source": "apple_health"
}`}</pre>
        </div>
      </section>

      <div className="h-2" />
    </div>
  );
}
