'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Phase = 'idle' | 'loading' | 'sent' | 'error'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Enter a valid email address.')
      return
    }

    setPhase('loading')
    setErrorMsg('')

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setPhase('error')
      setErrorMsg(error.message)
      return
    }

    setPhase('sent')
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">

      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03] login-grid-bg" />

      <div className="relative w-full max-w-sm">

        {/* Logo mark */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L3 6.5V13.5L10 18L17 13.5V6.5L10 2Z"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M10 6L6.5 8.25V12.75L10 15L13.5 12.75V8.25L10 6Z"
                fill="#10b981"
                fillOpacity="0.3"
                stroke="#10b981"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
            SynqWorks
          </p>
        </div>

        {phase === 'sent' ? (
          /* ---- Sent state ---- */
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <path
                  d="M2 6L12 13L22 6"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mb-2">
              Check your inbox
            </h2>
            <p className="text-sm font-mono text-zinc-500 leading-relaxed">
              We sent a magic link to
            </p>
            <p className="text-sm font-mono text-emerald-400 mt-1 mb-8">
              {email}
            </p>
            <p className="text-xs font-mono text-zinc-600">
              No email? Check spam or{' '}
              <button
                onClick={() => setPhase('idle')}
                className="text-zinc-400 underline underline-offset-2 hover:text-white transition-colors cursor-pointer"
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          /* ---- Input state ---- */
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                Welcome back
              </h1>
              <p className="text-sm font-mono text-zinc-500">
                Enter your email to receive a sign-in link.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrorMsg('')
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="you@company.com"
                  autoFocus
                  className="
                    w-full bg-zinc-900 border border-zinc-800
                    text-white placeholder:text-zinc-700
                    font-mono text-sm
                    px-4 py-3.5 rounded-lg
                    focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                    transition-all duration-150
                  "
                />
                {errorMsg && (
                  <p className="text-xs font-mono text-rose-500 mt-2">
                    {errorMsg}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={phase === 'loading'}
                className="
                  w-full flex items-center justify-center gap-2
                  bg-emerald-500 hover:bg-emerald-400
                  disabled:bg-zinc-800 disabled:text-zinc-600
                  text-zinc-950 font-mono font-black text-xs
                  uppercase tracking-widest
                  py-4 rounded-lg
                  transition-all duration-150
                  cursor-pointer disabled:cursor-not-allowed
                "
              >
                {phase === 'loading' ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
                    Sending link
                  </>
                ) : (
                  'Send magic link'
                )}
              </button>
            </div>

            <p className="text-center text-[10px] font-mono text-zinc-700 mt-8">
              Magic links expire after 1 hour
            </p>
          </>
        )}
      </div>
    </div>
  )
}
