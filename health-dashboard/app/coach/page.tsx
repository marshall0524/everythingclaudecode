'use client';

import { useState, useRef, useEffect, ReactElement } from 'react';
import { Brain, Send, Loader2, Calendar, MessageSquare, Zap, Utensils, Moon, Dumbbell, Pill, ChevronRight } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface Message { role: 'user' | 'assistant'; content: string; }

const quickPrompts = [
  { icon: Utensils,     label: 'Protein left', text: 'How much protein and calories do I have left today, and what should I eat to hit it?' },
  { icon: Dumbbell,     label: 'Workout',      text: 'Based on my recovery data, what workout should I do today?' },
  { icon: Moon,         label: 'Sleep',        text: 'My sleep has been averaging under 7 hours. What specific changes should I make?' },
  { icon: Pill,         label: 'Supplements',  text: 'What evidence-based supplements do I need given my blood work?' },
  { icon: Zap,          label: 'Stress',       text: 'How do I improve my HRV and reduce stress given my current data?' },
];

function parseMarkdown(text: string): ReactElement {
  const lines = text.split('\n');
  const out: ReactElement[] = [];
  let listBuf: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!listBuf.length) return;
    out.push(
      <ul key={key++} className="space-y-1.5 my-2 ml-1">
        {listBuf.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--recovery)' }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>') }} />
          </li>
        ))}
      </ul>
    );
    listBuf = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }

    if (line.startsWith('## ')) {
      flushList();
      out.push(<h2 key={key++} className="text-base font-extrabold mt-5 mb-2 flex items-center gap-1.5" style={{ color: 'var(--text)' }}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      out.push(<h3 key={key++} className="text-sm font-bold mt-3 mb-1.5" style={{ color: 'var(--text)' }}>{line.slice(4)}</h3>);
    } else if (/^\*\*(.+)\*\*$/.test(line)) {
      flushList();
      out.push(<p key={key++} className="text-sm font-bold mt-2.5 mb-1" style={{ color: 'var(--text)' }}>{line.slice(2, -2)}</p>);
    } else if (/^[-*] /.test(line)) {
      listBuf.push(line.slice(2));
    } else if (/^\d+\. /.test(line)) {
      flushList();
      const [, num, rest] = line.match(/^(\d+)\. (.+)/)!;
      out.push(
        <div key={key++} className="flex gap-2 my-1.5">
          <span className="font-extrabold text-sm flex-shrink-0" style={{ color: 'var(--recovery)' }}>{num}.</span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: rest.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>') }} />
        </div>
      );
    } else {
      flushList();
      out.push(
        <p key={key++} className="text-sm my-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>') }}
        />
      );
    }
  }
  flushList();
  return <div>{out}</div>;
}

export default function CoachPage() {
  const [tab, setTab]         = useState<'chat' | 'weekly'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<string>('');
  const [weeklyLoaded, setWeeklyLoaded] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'ok' | 'missing'>('unknown');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  useEffect(() => {
    fetch('/api/coach/test').then(r => r.json()).then(d => {
      setApiStatus(d.configured ? 'ok' : 'missing');
    }).catch(() => setApiStatus('missing'));
    fetch('/api/health').then(r => r.json()).then(d => setProfile(d.profile)).catch(() => {});
  }, []);

  const callCoach = async (question?: string, mode?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, mode }),
      });
      const data = await res.json();
      return data.response || data.error || 'No response received.';
    } catch {
      return 'Connection error. Please check your network.';
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text?: string) => {
    const q = text || input.trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    const reply = await callCoach(q);
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
  };

  const loadWeekly = async () => {
    if (weeklyLoaded) return;
    setLoading(true);
    const text = await callCoach(undefined, 'weekly');
    setWeeklyPlan(text);
    setWeeklyLoaded(true);
  };

  const loadDailyBrief = async () => {
    const text = await callCoach();
    setMessages([{ role: 'assistant', content: text }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)]">

      {/* ── API key missing banner ───────────── */}
      {apiStatus === 'missing' && (
        <div className="mx-4 mt-3 p-3 rounded-2xl flex items-start gap-2" style={{ background: 'color-mix(in srgb, #FF3B30 12%, var(--bg-card))', border: '1px solid color-mix(in srgb, #FF3B30 25%, transparent)' }}>
          <span className="text-sm">⚠️</span>
          <div>
            <p className="text-xs font-bold" style={{ color: '#FF3B30' }}>API key not configured</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Go to <strong>Vercel → Project → Settings → Environment Variables</strong>, add <code style={{ color: '#FF9F0A' }}>ANTHROPIC_API_KEY</code>, then <strong>redeploy</strong> (Deployments → Redeploy).</p>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────── */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--recovery) 20%, var(--bg-card))' }}>
            <Brain size={18} style={{ color: 'var(--recovery)' }} />
          </div>
          <div>
            <h1 className="text-base font-extrabold leading-tight" style={{ color: 'var(--text)' }}>Your Health Coach</h1>
            <p className="text-[11px] font-medium" style={{ color: 'var(--text-faint)' }}>Evidence-based · Sports medicine · Nutrition · Longevity</p>
          </div>
        </div>

        {/* Profile chips */}
        {profile && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {[
              `${profile.age}${profile.gender === 'male' ? 'M' : 'F'}`,
              profile.ethnicity,
              `${profile.height}cm`,
              `→${profile.targetWeight}kg`,
              profile.location,
            ].map(t => (
              <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>{t}</span>
            ))}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'var(--bg-elevated)' }}>
          {[{ id: 'chat' as const, icon: MessageSquare, label: 'Chat' }, { id: 'weekly' as const, icon: Calendar, label: 'Weekly Program' }].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setTab(id); if (id === 'weekly') loadWeekly(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: tab === id ? 'var(--bg-card)' : 'transparent',
                color: tab === id ? 'var(--recovery)' : 'var(--text-faint)',
                boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ─────────────────────────── */}
      {tab === 'weekly' ? (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading && !weeklyPlan && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 size={28} className="animate-spin" style={{ color: 'var(--recovery)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Building your weekly program…</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Analysing your Apple Health & Strava data</p>
            </div>
          )}
          {weeklyPlan && (
            <div className="card p-4 animate-up">
              {parseMarkdown(weeklyPlan)}
            </div>
          )}
          {!weeklyPlan && !loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--recovery) 15%, var(--bg-card))' }}>
                <Calendar size={28} style={{ color: 'var(--recovery)' }} />
              </div>
              <div>
                <p className="text-base font-extrabold mb-1" style={{ color: 'var(--text)' }}>Your Weekly Program</p>
                <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>Your coach will build a personalised Mon–Sun training and nutrition plan based on your health data.</p>
              </div>
              <button
                onClick={loadWeekly}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-black transition-all active:scale-95"
                style={{ background: 'var(--recovery)' }}
              >
                <Zap size={16} />
                Generate My Program
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--recovery) 15%, var(--bg-card))' }}>
                  <Brain size={28} style={{ color: 'var(--recovery)' }} />
                </div>
                <div>
                  <p className="text-base font-extrabold mb-1" style={{ color: 'var(--text)' }}>Ready to coach you</p>
                  <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>Every recommendation is evidence-based and personalised to your Apple Health & Strava data.</p>
                </div>
                <button
                  onClick={loadDailyBrief}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-black active:scale-95"
                  style={{ background: 'var(--recovery)' }}
                >
                  <Zap size={15} />
                  Get today&apos;s brief
                </button>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`animate-up ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm" style={{ background: 'var(--strain)' }}>
                    <p className="text-sm text-white">{msg.content}</p>
                  </div>
                ) : (
                  <div className="card px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Brain size={11} style={{ color: 'var(--recovery)' }} />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--recovery)' }}>Health Coach</span>
                    </div>
                    {parseMarkdown(msg.content)}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="card px-4 py-3 animate-up">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" style={{ color: 'var(--recovery)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Analysing your health data…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length === 0 && (
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {quickPrompts.map(p => (
                  <button
                    key={p.label}
                    onClick={() => sendMessage(p.text)}
                    className="surface flex-shrink-0 flex items-center gap-1.5 px-3 py-2 hover:opacity-80 transition-opacity active:scale-95"
                  >
                    <p.icon size={13} style={{ color: 'var(--recovery)' }} />
                    <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-3 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex items-end gap-2 rounded-2xl px-3 py-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask your coach anything…"
                className="flex-1 bg-transparent text-sm resize-none outline-none max-h-24 min-h-[20px]"
                style={{ color: 'var(--text)' }}
                rows={1}
                onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 96) + 'px'; }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl transition-all flex-shrink-0 active:scale-90 disabled:opacity-30"
                style={{ background: input.trim() && !loading ? 'var(--recovery)' : 'var(--bg-card)' }}
              >
                <Send size={14} color={input.trim() && !loading ? '#000' : 'var(--text-faint)'} />
              </button>
            </div>
            <p className="text-[10px] text-center mt-1.5" style={{ color: 'var(--text-faint)' }}>Evidence-based coaching · Not a substitute for medical advice</p>
          </div>
        </>
      )}
    </div>
  );
}
