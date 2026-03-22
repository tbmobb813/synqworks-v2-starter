'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { SkillBreakdownItem } from '@/types'

type SortKey = 'skill_name' | 'score' | 'risk_level'

const RISK_ORDER = { critical: 0, at_risk: 1, developing: 2, proficient: 3 }
const RISK_STYLES = {
  critical: 'bg-rose-100 text-rose-800',
  at_risk: 'bg-amber-100 text-amber-800',
  developing: 'bg-blue-100 text-blue-800',
  proficient: 'bg-emerald-100 text-emerald-800',
}
const RISK_LABELS = {
  critical: 'Critical',
  at_risk: 'At Risk',
  developing: 'Developing',
  proficient: 'Proficient',
}
const BAR_COLORS = {
  critical: 'bg-rose-500',
  at_risk: 'bg-amber-500',
  developing: 'bg-blue-500',
  proficient: 'bg-emerald-500',
}

export default function SkillBreakdownTable({ skills }: { skills: SkillBreakdownItem[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [sortAsc, setSortAsc] = useState(true)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(key === 'skill_name')
    }
  }

  const sorted = [...skills].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'skill_name') cmp = a.skill_name.localeCompare(b.skill_name)
    else if (sortKey === 'score') cmp = a.score - b.score
    else cmp = RISK_ORDER[a.risk_level] - RISK_ORDER[b.risk_level]
    return sortAsc ? cmp : -cmp
  })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Skill Breakdown</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-t border-zinc-100">
            <th className="text-left px-5 py-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest cursor-pointer select-none" onClick={() => handleSort('skill_name')}>
              <span className="flex items-center gap-1">Skill <SortIcon col="skill_name" /></span>
            </th>
            <th className="text-left px-5 py-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest cursor-pointer select-none" onClick={() => handleSort('score')}>
              <span className="flex items-center gap-1">Score <SortIcon col="score" /></span>
            </th>
            <th className="text-right px-5 py-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest cursor-pointer select-none" onClick={() => handleSort('risk_level')}>
              <span className="flex items-center gap-1 justify-end">Status <SortIcon col="risk_level" /></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((skill) => (
            <tr key={skill.skill_id} className="border-t border-zinc-50 hover:bg-zinc-50 transition-colors">
              <td className="px-5 py-3">
                <p className="font-bold text-zinc-900">{skill.skill_name}</p>
                <p className="text-[10px] font-mono text-zinc-400">{skill.category}</p>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${BAR_COLORS[skill.risk_level]}`} style={{ width: `${skill.score}%` }} />
                  </div>
                  <span className="text-xs font-mono text-zinc-600 w-6 text-right">{skill.score}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-right">
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${RISK_STYLES[skill.risk_level]}`}>
                  {RISK_LABELS[skill.risk_level]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
