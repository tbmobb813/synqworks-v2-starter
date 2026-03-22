'use client'

import { Zap, CheckCircle } from 'lucide-react'
import type { RecentActivityItem } from '@/types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function RecentActivityFeed({ activities }: { activities: RecentActivityItem[] }) {
  if (activities.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-5">
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">Recent Activity</p>
        <p className="text-sm text-zinc-400 font-mono text-center py-4">No simulations completed yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">Recent Activity</p>
      <div className="space-y-3">
        {activities.map((a) => (
          <div key={a.id} className="flex items-start gap-3 border-l-2 border-zinc-200 pl-3">
            <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-zinc-900 truncate">{a.scenario_title}</p>
              <p className="text-xs text-zinc-500">{a.outcome_label}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="flex items-center gap-1 text-xs font-mono text-emerald-600"><Zap size={10} />+{a.xp_earned} XP</p>
              <p className="text-[10px] font-mono text-zinc-400">{timeAgo(a.completed_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
