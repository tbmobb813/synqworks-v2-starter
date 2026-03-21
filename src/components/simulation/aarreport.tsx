'use client'

import { useRouter } from 'next/navigation'
import { TrendingUp, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react'
import type { AARData } from '@/types'

interface AARReportProps {
  data: AARData
  onRestart: () => void
}

function ImpactCard({
  label,
  value,
  status,
}: {
  label: string
  value: string
  status: 'positive' | 'negative' | 'neutral'
}) {
  const styles = {
    positive: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    negative: 'bg-rose-50 border-rose-200 text-rose-700',
    neutral: 'bg-zinc-50 border-zinc-200 text-zinc-600',
  }
  const valueStyles = {
    positive: 'text-emerald-900',
    negative: 'text-rose-900',
    neutral: 'text-zinc-800',
  }

  return (
    <div className={`rounded-lg border p-4 ${styles[status]}`}>
      <p className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-1.5">
        {label}
      </p>
      <p className={`text-xl font-black font-mono ${valueStyles[status]}`}>{value}</p>
    </div>
  )
}

export function AARReport({ data, onRestart }: AARReportProps) {
  const router = useRouter()

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Header verdict */}
      <div className="bg-zinc-900 rounded-xl p-8 mb-6 text-center">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
          Simulation complete
        </p>
        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          {data.outcome_label}
        </h2>
        <div className="inline-flex items-center gap-1.5 mt-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5">
          <TrendingUp size={12} className="text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400 font-bold">
            +{data.xp_earned} XP earned
          </span>
        </div>
      </div>

      {/* Impact grid */}
      <div className="mb-6">
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">
          Strategic impact
        </p>
        <div className="grid grid-cols-2 gap-3">
          {data.metric_shifts.map((shift, idx) => (
            <ImpactCard
              key={idx}
              label={shift.label}
              value={shift.value}
              status={shift.status}
            />
          ))}
        </div>
      </div>

      {/* Strategic insight */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2">
              Strategic insight
            </p>
            <p className="text-sm text-zinc-700 leading-relaxed">
              {data.strategic_insight}
            </p>
          </div>
        </div>
      </div>

      {/* Skill growth callout */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest mb-0.5">
            Skill growth
          </p>
          <p className="text-sm font-bold text-emerald-900">
            {data.skill_growth.skill_name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black font-mono text-emerald-600">
            +{data.skill_growth.points_gained}
          </p>
          <p className="text-[10px] font-mono text-emerald-500">points</p>
        </div>
      </div>

      {/* Next module CTA */}
      {data.next_module && (
        <div className="mb-4">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">
            Close the gap
          </p>
          <button
            onClick={() => router.push(`/simulation/${data.next_module!.id}`)}
            className="
              w-full flex items-center justify-between px-6 py-5
              bg-zinc-900 hover:bg-zinc-700 rounded-xl
              transition-all duration-150 cursor-pointer group
            "
          >
            <div className="text-left">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                Next module
              </p>
              <p className="text-sm font-bold text-white">{data.next_module.title}</p>
              <p className="text-xs font-mono text-zinc-500 mt-0.5">
                {data.next_module.estimated_mins} min · {data.next_module.xp_reward} XP
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150"
            />
          </button>
        </div>
      )}

      {/* Restart */}
      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center gap-2 py-3 text-xs font-mono text-zinc-400 hover:text-zinc-600 transition-colors duration-150 cursor-pointer"
      >
        <RotateCcw size={12} />
        Re-run simulation
      </button>
    </div>
  )
}