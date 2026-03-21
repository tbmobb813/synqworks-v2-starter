'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2">SynqWorks</p>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm font-mono text-zinc-900 focus:outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm font-mono text-zinc-900 focus:outline-none focus:border-zinc-400"
            />
          </div>

          {error && (
            <p className="text-xs font-mono text-rose-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-700 disabled:opacity-50 text-white py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs font-mono text-zinc-400 mt-4">
          No account?{' '}
          <Link href="/signup" className="text-emerald-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
