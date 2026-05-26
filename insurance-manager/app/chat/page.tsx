'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MapPin, Bot, User } from 'lucide-react'
import { mockPolicies, USER_LOCATION } from '@/lib/mock-data'
import { ChatMessage } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'

const SUGGESTED = [
  "What's my travel insurance deductible?",
  "Am I covered for dental?",
  "What do I do if my flight is delayed?",
  "How do I file a claim?",
  "What are my coverage gaps?",
  "What's my health insurance copay?",
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--primary-bg)' }}
      >
        <Bot size={14} style={{ color: 'var(--primary)' }} />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
      >
        <span className="typing-dot inline-block w-2 h-2 rounded-full" style={{ background: 'var(--text-faint)' }} />
        <span className="typing-dot inline-block w-2 h-2 rounded-full" style={{ background: 'var(--text-faint)' }} />
        <span className="typing-dot inline-block w-2 h-2 rounded-full" style={{ background: 'var(--text-faint)' }} />
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 animate-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: isUser ? 'var(--primary)' : 'var(--primary-bg)' }}
      >
        {isUser
          ? <User size={14} color="#fff" />
          : <Bot size={14} style={{ color: 'var(--primary)' }} />
        }
      </div>
      <div
        className="max-w-[76%] px-4 py-3 text-sm leading-relaxed"
        style={{
          background: isUser ? 'var(--primary)' : 'var(--bg-card)',
          color: isUser ? '#fff' : 'var(--text)',
          borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          border: isUser ? 'none' : '1px solid var(--border-subtle)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {msg.content}
        {msg.sourceDocuments && msg.sourceDocuments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {msg.sourceDocuments.map((src) => (
              <span
                key={src}
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'color-mix(in srgb, var(--primary) 20%, transparent)', color: '#fff' }}
              >
                {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm your insurance advisor. I have access to your ${mockPolicies.length} policies — travel, health, and auto.\n\nAsk me anything: coverage details, how to file a claim, what's excluded, or compare your options. What would you like to know?`,
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(USER_LOCATION)
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          policies: mockPolicies,
          location,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      if (!res.body) throw new Error('No response stream')

      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '', timestamp: new Date().toISOString() },
      ])

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m,
          ),
        )
      }
    } catch (e: unknown) {
      const errorText = e instanceof Error ? e.message : 'Something went wrong'
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorText}\n\nMake sure your ANTHROPIC_API_KEY is configured.`,
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 136px)' }}>
      {/* Location bar */}
      <div className="px-4 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setShowLocationPrompt((v) => !v)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all active:scale-90"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
        >
          <MapPin size={12} />
          {location || 'Set location for local advice'}
        </button>
        <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
          {mockPolicies.length} policies loaded
        </p>
      </div>

      {showLocationPrompt && (
        <div className="px-4 py-2 flex gap-2 animate-up" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Chicago, IL"
            className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
          <button
            onClick={() => setShowLocationPrompt(false)}
            className="text-xs px-3 py-2 rounded-xl font-medium"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            Save
          </button>
        </div>
      )}

      {/* Suggested chips (only when conversation is fresh) */}
      {messages.length <= 1 && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          {SUGGESTED.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="flex-shrink-0 text-xs px-3 py-2 rounded-xl transition-all active:scale-90"
              style={{
                background: 'var(--primary-bg)',
                color: 'var(--primary)',
                border: '1px solid color-mix(in srgb, var(--primary) 25%, transparent)',
                maxWidth: 180,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 flex items-end gap-3"
        style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
      >
        <div className="flex-1 flex items-end" style={{ position: 'relative' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your policies..."
            rows={1}
            className="w-full text-sm px-4 py-3 rounded-2xl resize-none outline-none no-scrollbar"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              minHeight: 44,
              maxHeight: 120,
              lineHeight: 1.4,
            }}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement
              t.style.height = 'auto'
              t.style.height = Math.min(t.scrollHeight, 120) + 'px'
            }}
            disabled={loading}
          />
        </div>
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
          style={{
            background: input.trim() && !loading ? 'var(--primary)' : 'var(--bg-elevated)',
            color: input.trim() && !loading ? '#fff' : 'var(--text-faint)',
          }}
        >
          {loading ? <Spinner size={16} /> : <Send size={18} strokeWidth={2} />}
        </button>
      </div>
    </div>
  )
}
