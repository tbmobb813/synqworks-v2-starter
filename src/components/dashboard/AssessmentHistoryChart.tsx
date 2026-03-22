'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { AssessmentHistoryPoint } from '@/types'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AssessmentHistoryChart({ history }: { history: AssessmentHistoryPoint[] }) {
  if (history.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-5">
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">Assessment History</p>
        <p className="text-sm text-zinc-400 font-mono text-center py-4">No assessments completed yet.</p>
      </div>
    )
  }

  const maxScore = 100
  const latest = history[history.length - 1]
  const previous = history.length > 1 ? history[history.length - 2] : null
  const delta = previous ? latest.avg_score - previous.avg_score : 0

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Assessment History</p>
        {history.length > 1 && (
          <div className={`flex items-center gap-1 text-xs font-mono ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-600' : 'text-zinc-400'}`}>
            {delta > 0 ? <TrendingUp size={12} /> : delta < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            {delta > 0 ? '+' : ''}{delta} pts
          </div>
        )}
      </div>

      {/* Mini bar chart — one bar per assessment attempt */}
      <div className="flex items-end gap-2 h-24 mb-3">
        {history.map((point, i) => {
          const heightPct = (point.avg_score / maxScore) * 100
          const isLatest = i === history.length - 1

          return (
            <div key={point.completed_at} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] font-mono text-zinc-500">{point.avg_score}</span>
              <div className="w-full flex items-end chart-bar-container">
                <div
                  className={`w-full rounded-t transition-all chart-bar ${isLatest ? 'bg-emerald-500' : 'bg-zinc-200'}`}
                  style={{ '--bar-h': `${heightPct}%` } as React.CSSProperties}
                />
              </div>
              <span className="text-[8px] font-mono text-zinc-400">{formatDate(point.completed_at)}</span>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
        <span className="font-mono">{history.length} attempt{history.length !== 1 ? 's' : ''}</span>
        <span className="font-mono">Latest: <span className="font-bold text-zinc-900">{latest.avg_score}/100</span></span>
      </div>
    </div>
  )
}
