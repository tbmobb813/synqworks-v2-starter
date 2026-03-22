'use client'

import { ShieldAlert } from 'lucide-react'
import type { RiskSkill } from '@/types'

export default function ComplianceRiskRegister({ risks }: { risks: RiskSkill[] }) {
  if (risks.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert size={14} className="text-emerald-600" />
          <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest">Compliance Risk Register</p>
        </div>
        <p className="text-sm text-emerald-700 font-mono">All skills above risk threshold. No action required.</p>
      </div>
    )
  }

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert size={14} className="text-rose-600" />
        <p className="text-[10px] font-mono text-rose-600 uppercase tracking-widest">Compliance Risk Register</p>
      </div>
      <div className="space-y-2">
        {risks.map((risk) => (
          <div key={risk.skill_name} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
            <div>
              <p className="text-sm font-bold text-rose-900">{risk.skill_name}</p>
              <p className="text-[10px] font-mono text-rose-500">{risk.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-rose-200 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full bar-fill" style={{ '--bar-w': `${risk.score}%` } as React.CSSProperties} />
              </div>
              <span className="text-xs font-mono font-bold text-rose-700 w-8 text-right">{risk.score}</span>
              <span className="text-[9px] font-mono bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded uppercase font-bold">
                {risk.score < 25 ? 'Critical' : 'At Risk'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
