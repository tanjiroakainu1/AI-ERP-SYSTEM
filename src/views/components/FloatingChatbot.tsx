import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { ChatMessage } from '../../services/openrouter'
import { requestOpenRouterReply } from '../../services/openrouter'

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl border border-cyan-500/20 bg-slate-800/90 px-4 py-3">
      <span
        className="h-2 w-2 rounded-full bg-cyan-400/90"
        style={{ animation: 'chat-dot 1.2s ease-in-out infinite' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-violet-400/90"
        style={{ animation: 'chat-dot 1.2s ease-in-out 0.2s infinite' }}
      />
      <span
        className="h-2 w-2 rounded-full bg-fuchsia-400/90"
        style={{ animation: 'chat-dot 1.2s ease-in-out 0.4s infinite' }}
      />
    </div>
  )
}

export function FloatingChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi — you can ask me anything: general topics, coding, writing, how-tos, or help understanding this ERP (products, orders, exams, library, tours, courses, activity logs, etc.). I do not see your live data—just describe what you need. What is on your mind?",
    },
  ])

  const title = useMemo(() => 'Ask AI', [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) {
      return
    }
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || loading) {
      return
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const reply = await requestOpenRouterReply(nextMessages)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error from AI service.'
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Something went wrong: ${message}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`font-sans ${
        open
          ? 'fixed inset-x-3 top-14 z-[60] flex max-h-[calc(100dvh-3.75rem)] flex-col sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:max-h-[min(85dvh,600px)] sm:w-[min(calc(100vw-3rem),440px)]'
          : `fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] z-[60] flex justify-center sm:inset-x-auto sm:bottom-6 sm:left-auto sm:right-[max(1.5rem,env(safe-area-inset-right,0px))] sm:justify-end`
      }`}
    >
      {open ? (
        <div className="flex max-h-full min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-cyan-500/25 bg-slate-950/95 shadow-[0_25px_80px_-12px_rgba(0,0,0,0.65),0_0_60px_-15px_rgba(34,211,238,0.25)] backdrop-blur-2xl ring-1 ring-cyan-500/10">
          <div className="relative flex shrink-0 items-center justify-between gap-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-3 py-3 sm:px-4 sm:py-3.5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
            <div className="relative flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-base shadow-inner backdrop-blur-sm sm:h-10 sm:w-10 sm:text-lg">
                ✦
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold tracking-tight text-white">
                  {title}
                </h3>
                <p className="text-[11px] font-medium text-white/80 sm:text-xs">
                  <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Ask anything · General + ERP help
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="relative shrink-0 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
            >
              Close
            </button>
          </div>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-gradient-to-b from-slate-900 to-slate-950 px-3 py-3 sm:px-4 sm:py-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex gap-1.5 sm:gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white shadow-lg sm:h-8 sm:w-8 sm:text-xs">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[min(100%,20rem)] rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-lg sm:max-w-[85%] sm:px-3.5 sm:py-2.5 ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                      : 'rounded-bl-md border border-slate-700/80 bg-slate-800/90 text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start pl-0 sm:pl-10">
                <TypingIndicator />
              </div>
            )}
          </div>

          <form
            className="shrink-0 border-t border-white/5 bg-slate-900/90 p-2.5 backdrop-blur-sm sm:p-3"
            onSubmit={submit}
          >
            <div className="flex items-end gap-2 rounded-2xl border border-slate-700/80 bg-slate-800/60 p-1.5 pl-2.5 shadow-inner focus-within:border-cyan-500/40 focus-within:ring-2 focus-within:ring-cyan-500/20 sm:pl-3">
              <input
                type="text"
                placeholder="Ask anything…"
                className="min-h-[44px] min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none sm:py-2.5"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={loading}
                autoComplete="off"
                enterKeyHint="send"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
                aria-label="Send message"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] leading-snug text-slate-500 sm:mt-2">
              Ask anything—general or app-related · No access to your private records · Verify important info
            </p>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative flex w-full max-w-[calc(100vw-1.5rem)] touch-manipulation items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-8px_rgba(99,102,241,0.65)] transition hover:scale-[1.02] hover:shadow-[0_16px_48px_-8px_rgba(139,92,246,0.55)] sm:w-auto sm:max-w-none sm:px-5"
        >
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 opacity-30 blur-md transition group-hover:opacity-50" />
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="relative">Ask anything</span>
        </button>
      )}
    </div>
  )
}
