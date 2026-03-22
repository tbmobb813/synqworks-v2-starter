'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ArrowRight, Clock, Zap } from 'lucide-react'
import { LogOut } from 'lucide-react'
import { useUserStore } from '@/lib/store/useUserStore'
import { SkillRadar } from '@/components/charts/SkillRadar'
import type { DashboardData } from '@/types'

export default function DashboardClient({ initialData }: { initialData: DashboardData | null }) {
  const router = useRouter()
  const [data] = useState<DashboardData | null>(initialData)
  const signOut = useUserStore(s => s.signOut)

  const { data: queryData, isLoading, error } = useQuery<DashboardData | null>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/recommend')
      if (res.status === 401) return null
      if (!res.ok) throw new Error('Failed to load')
      return res.json() as Promise<DashboardData>
    },
    initialData: data ?? undefined,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const useData = queryData ?? data

  if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-sm font-mono text-rose-500">Failed to load dashboard.</p></div>

  const mod = useData?.recommended_module
  const insights = useData?.system_insights

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">SynqWorks</p>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Leadership blueprint</h1>
          {insights && !isLoading && <p className="text-sm text-zinc-500 mt-1 font-mono">{insights.trend} · Next: {insights.next_milestone}</p>}
        </div>
        <button onClick={async () => { await signOut(); router.push('/login') }} title="Sign out" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-800 mt-1">
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-xl p-6">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-4">Competency blueprint</p>
          <SkillRadar data={useData?.radar_data ?? []} isLoading={isLoading} />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          {insights && !isLoading && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
              <p className="text-[10px] font-mono text-rose-500 uppercase tracking-widest mb-1">Critical gap</p>
              <p className="text-xl font-black text-rose-900">{insights.primary_gap}</p>
              <p className="text-xs font-mono text-rose-500 mt-1">Score: {insights.primary_gap_score} / 100</p>
            </div>
          )}

          <div className="bg-white border border-zinc-200 rounded-xl p-5 flex-1">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-4">Recommended next</p>

            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-zinc-100 rounded w-3/4" />
                <div className="h-3 bg-zinc-100 rounded w-full" />
                <div className="h-3 bg-zinc-100 rounded w-2/3" />
              </div>
            ) : mod ? (
              <>
                <p className="text-xs font-mono text-emerald-600 uppercase tracking-widest mb-1">{mod.skill_name}</p>
                <h3 className="text-base font-black text-zinc-900 leading-snug mb-2">{mod.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">{mod.description}</p>
                <div className="flex items-center gap-4 mb-5">
                  <span className="flex items-center gap-1 text-xs font-mono text-zinc-400"><Clock size={11} />{mod.estimated_mins} min</span>
                  <span className="flex items-center gap-1 text-xs font-mono text-emerald-600"><Zap size={11} />{mod.xp_reward} XP</span>
                  <span className="text-xs font-mono text-zinc-400">Level {mod.difficulty}/5</span>
                </div>
                <button onClick={() => router.push(`/simulation/${mod.id}`)} className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-700 text-white py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer">
                  Start module
                  <ArrowRight size={12} />
                </button>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-zinc-400 font-mono mb-3">No module available yet.</p>
                <button onClick={() => router.push('/diagnostic')} className="text-xs font-mono text-emerald-600 underline underline-offset-2">Take the assessment first</button>
              </div>
            )}
          </div>

          <button onClick={() => router.push('/diagnostic')} className="w-full border border-zinc-200 bg-white hover:border-zinc-400 rounded-xl py-4 text-xs font-mono text-zinc-500 hover:text-zinc-800 uppercase tracking-widest transition-all duration-150 cursor-pointer">Retake diagnostic</button>
        </div>
      </div>
    </>
  )
}
