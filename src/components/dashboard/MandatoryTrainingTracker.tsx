'use client'

import { useRouter } from 'next/navigation'
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { MandatoryTraining } from '@/types'

export default function MandatoryTrainingTracker({ trainings }: { trainings: MandatoryTraining[] }) {
  const router = useRouter()

  if (trainings.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardCheck size={14} className="text-zinc-500" />
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Mandatory Training</p>
        </div>
        <p className="text-sm text-zinc-400 font-mono text-center py-4">No mandatory trainings assigned.</p>
      </div>
    )
  }

  const overdue = trainings.filter(t => t.is_overdue)
  const upcoming = trainings.filter(t => !t.is_completed && !t.is_overdue)
  const completed = trainings.filter(t => t.is_completed)

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={14} className="text-zinc-500" />
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Mandatory Training</p>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          {completed.length}/{trainings.length} complete
        </span>
      </div>

      <div className="space-y-2">
        {/* Overdue items first */}
        {overdue.map((t) => (
          <div key={t.module_id} className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-rose-100 transition-colors" onClick={() => router.push(`/simulation/${t.module_id}`)}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-rose-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-rose-900">{t.title}</p>
                <p className="text-[10px] font-mono text-rose-500">{t.skill_name} · {t.estimated_mins} min</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded uppercase shrink-0">
              Overdue {t.days_remaining != null ? `${Math.abs(t.days_remaining)}d` : ''}
            </span>
          </div>
        ))}

        {/* Upcoming */}
        {upcoming.map((t) => (
          <div key={t.module_id} className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => router.push(`/simulation/${t.module_id}`)}>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900">{t.title}</p>
                <p className="text-[10px] font-mono text-amber-600">{t.skill_name} · {t.estimated_mins} min</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded uppercase shrink-0">
              {t.days_remaining != null ? `${t.days_remaining}d left` : 'No date'}
            </span>
          </div>
        ))}

        {/* Completed */}
        {completed.map((t) => (
          <div key={t.module_id} className="flex items-center justify-between bg-zinc-50 rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-zinc-500 line-through">{t.title}</p>
                <p className="text-[10px] font-mono text-zinc-400">{t.skill_name}</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase shrink-0">
              Done
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
