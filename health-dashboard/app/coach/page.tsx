'use client';

import { useState, useRef, useEffect, ReactElement } from 'react';
import { Brain, Send, Loader2, RefreshCw, ChevronDown, ChevronUp, Zap, Utensils, Dumbbell, Moon, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { icon: Utensils, text: 'What should I eat today?', label: 'Nutrition' },
  { icon: Dumbbell, text: 'Design my workout for this week', label: 'Training' },
  { icon: Moon, text: 'How can I improve my sleep?', label: 'Sleep' },
  { icon: Heart, text: 'Analyse my stress and recovery', label: 'Recovery' },
  { icon: Zap, text: 'What supplements do I need?', label: 'Supplements' },
];

function formatMarkdown(text: string): ReactElement {
  const lines = text.split('\n');
  const elements: ReactElement[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="space-y-1.5 my-2 ml-1">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-300">
              <span className="text-primary-400 flex-shrink-0 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={key++} className="text-sm font-bold text-white mt-4 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={key++} className="text-base font-bold text-primary-300 mt-4 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      flushList();
      elements.push(<p key={key++} className="text-sm font-semibold text-white mt-3 mb-1">{line.slice(2, -2)}</p>);
    } else if (line.match(/^[-*] /)) {
      listItems.push(line.slice(2));
    } else if (line.match(/^\d+\. /)) {
      flushList();
      const num = line.match(/^(\d+)\. (.+)/);
      if (num) {
        elements.push(
          <div key={key++} className="flex gap-2 my-1.5">
            <span className="text-primary-400 font-bold text-sm flex-shrink-0">{num[1]}.</span>
            <span className="text-sm text-gray-300">{num[2]}</span>
          </div>
        );
      }
    } else if (line.trim() === '') {
      flushList();
    } else if (line.trim()) {
      flushList();
      const boldReplaced = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');
      elements.push(
        <p key={key++} className="text-sm text-gray-300 my-1" dangerouslySetInnerHTML={{ __html: boldReplaced }} />
      );
    }
  }
  flushList();

  return <div className="space-y-0.5">{elements}</div>;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const loadInitialAnalysis = async () => {
    setLoading(true);
    setShowQuick(false);
    try {
      const res = await fetch('/api/coach', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const data = await res.json();
      if (data.response) {
        setMessages([{ role: 'assistant', content: data.response, timestamp: new Date() }]);
      } else {
        setMessages([{ role: 'assistant', content: `Error: ${data.error || 'Failed to load analysis. Please add your ANTHROPIC_API_KEY to .env.local'}`, timestamp: new Date() }]);
      }
    } catch {
      setMessages([{ role: 'assistant', content: 'Failed to connect to the coach. Please check your API key in .env.local', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text?: string) => {
    const question = text || input.trim();
    if (!question) return;
    setInput('');
    setShowQuick(false);

    const userMsg: Message = { role: 'user', content: question, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response || `Error: ${data.error}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Failed to get response. Check your API key.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-800/60">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-xl bg-primary-900/50">
            <Brain size={18} className="text-primary-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Health Coach</h1>
            <p className="text-xs text-gray-500">Powered by Claude · Personalised for you</p>
          </div>
          <button
            onClick={loadInitialAnalysis}
            className="ml-auto p-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Full analysis"
          >
            <RefreshCw size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Profile chip */}
        <div className="flex gap-1.5 flex-wrap mt-2">
          {['30M', 'Asian', '168cm', '78kg', 'Shanghai'].map((tag) => (
            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">{tag}</span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
            <div className="p-4 rounded-2xl bg-primary-900/30 border border-primary-800/40">
              <Brain size={32} className="text-primary-400 mx-auto" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-1">Your AI health coach</p>
              <p className="text-sm text-gray-400 max-w-xs">
                Analyses your data from Apple Health, Strava & RENPHO to give personalised recommendations.
              </p>
            </div>
            <button
              onClick={loadInitialAnalysis}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-2xl text-sm font-semibold text-white transition-colors"
            >
              <Zap size={16} />
              Get my daily analysis
            </button>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={cn('animate-slide-up', msg.role === 'user' ? 'flex justify-end' : '')}>
            {msg.role === 'user' ? (
              <div className="max-w-[85%] bg-primary-700 rounded-2xl rounded-tr-sm px-4 py-2.5">
                <p className="text-sm text-white">{msg.content}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/80 px-4 py-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Brain size={12} className="text-primary-400" />
                  <span className="text-[10px] font-semibold text-primary-400 uppercase tracking-wider">Coach</span>
                </div>
                {formatMarkdown(msg.content)}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 px-4 py-3 animate-slide-up">
            <div className="flex items-center gap-2">
              <Loader2 size={14} className="text-primary-400 animate-spin" />
              <span className="text-sm text-gray-400">Analysing your health data…</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {showQuick && messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Quick questions</span>
            <button onClick={() => setShowQuick(!showQuick)}>
              {showQuick ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronUp size={14} className="text-gray-500" />}
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((p) => (
              <button
                key={p.text}
                onClick={() => sendMessage(p.text)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-700 bg-gray-800/60 hover:bg-gray-700 transition-colors"
              >
                <p.icon size={13} className="text-primary-400" />
                <span className="text-xs text-gray-300 whitespace-nowrap">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-3 pt-2 border-t border-gray-800/60">
        <div className="flex items-end gap-2 bg-gray-800/80 rounded-2xl border border-gray-700 px-3 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything…"
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 resize-none outline-none max-h-24 min-h-[20px]"
            rows={1}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 96) + 'px';
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className={cn(
              'p-2 rounded-xl transition-colors flex-shrink-0',
              input.trim() && !loading ? 'bg-primary-600 hover:bg-primary-500' : 'bg-gray-700 opacity-50 cursor-not-allowed'
            )}
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-gray-600 text-center mt-1.5">AI analysis · Not medical advice</p>
      </div>
    </div>
  );
}
