'use client'

import { Award, Check, X } from 'lucide-react'
import type { CertificationProgress } from '@/types'

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; bar: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', bar: 'bg-violet-500', badge: 'bg-violet-100 text-violet-800' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800' },
}

function getColors(color: string) {
  return COLOR_MAP[color] ?? COLOR_MAP.emerald
}

export default function CertificationProgressCard({ certifications }: { certifications: CertificationProgress[] }) {
  if (certifications.length === 0) return null

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award size={14} className="text-zinc-500" />
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Certification Progress</p>
      </div>
      <div className="space-y-4">
        {certifications.map((cert) => {
          const colors = getColors(cert.badge_color)
          const isComplete = cert.percent_complete === 100

          return (
            <div key={cert.id} className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className={`text-sm font-bold ${colors.text}`}>{cert.name}</p>
                  {cert.description && (
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed max-w-md">{cert.description}</p>
                  )}
                </div>
                {isComplete ? (
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${colors.badge}`}>Certified</span>
                ) : (
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase bg-zinc-100 text-zinc-600">In Progress</span>
                )}
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all bar-fill ${colors.bar}`} style={{ '--bar-w': `${cert.percent_complete}%` } as React.CSSProperties} />
                </div>
                <span className={`text-xs font-mono font-bold ${colors.text}`}>{cert.percent_complete}%</span>
              </div>

              {/* Skill checklist */}
              <div className="space-y-1">
                {cert.skill_scores.map((ss) => (
                  <div key={ss.skill_name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {ss.met ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <X size={12} className="text-zinc-400" />
                      )}
                      <span className={ss.met ? 'text-zinc-700' : 'text-zinc-400'}>{ss.skill_name}</span>
                    </div>
                    <span className={`font-mono text-[10px] ${ss.met ? colors.text : 'text-zinc-400'}`}>
                      {ss.score}/{cert.threshold}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
