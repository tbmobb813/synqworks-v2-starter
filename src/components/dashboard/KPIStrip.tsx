'use client'

import { Zap, Target, BarChart3, AlertTriangle } from 'lucide-react'
import type { KPIStats } from '@/types'

const kpiCards = [
  { key: 'total_xp' as const, label: 'Total XP Earned', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', format: (v: number) => v.toLocaleString() },
  { key: 'simulations_completed' as const, label: 'Simulations Completed', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', format: (v: number) => String(v) },
  { key: 'avg_competency' as const, label: 'Avg Competency Score', icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50', format: (v: number) => `${v}/100` },
  { key: 'skills_at_risk' as const, label: 'Skills At Risk', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', format: (v: number) => String(v) },
]

export default function KPIStrip({ stats }: { stats: KPIStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {kpiCards.map(({ key, label, icon: Icon, color, bg, format }) => (
        <div key={key} className="bg-white border border-zinc-200 rounded-xl p-4 flex items-start gap-3">
          <div className={`${bg} rounded-lg p-2`}>
            <Icon size={16} className={color} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{label}</p>
            <p className={`text-xl font-black ${key === 'skills_at_risk' && stats[key] > 0 ? 'text-rose-600' : 'text-zinc-900'}`}>
              {format(stats[key])}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
