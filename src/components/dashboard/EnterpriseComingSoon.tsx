'use client'

import { Users, BarChart3, FileDown, Lock } from 'lucide-react'

const FEATURES = [
  {
    icon: Users,
    title: 'Team Benchmarking',
    description: 'Compare competency scores across teams, departments, and cohorts with aggregate analytics.',
  },
  {
    icon: BarChart3,
    title: 'Manager View',
    description: 'Track direct reports\u2019 progress, identify skill gaps across your team, and assign targeted training.',
  },
  {
    icon: FileDown,
    title: 'Bulk Reporting Export',
    description: 'Export compliance reports, training completion logs, and certification status as CSV or PDF for audits.',
  },
]

export default function EnterpriseComingSoon() {
  return (
    <div className="relative bg-white border border-zinc-200 rounded-xl p-6 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/40 via-transparent to-blue-50/40 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-violet-500" />
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Multi-User &amp; Org Features</p>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 uppercase tracking-wider">
            Coming Soon
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group border border-dashed border-zinc-200 rounded-lg p-4 hover:border-violet-300 hover:bg-violet-50/30 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-zinc-100 group-hover:bg-violet-100 rounded-lg p-1.5 transition-colors">
                  <feature.icon size={14} className="text-zinc-400 group-hover:text-violet-600 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-zinc-700">{feature.title}</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-mono text-zinc-400 text-center mt-4">
          Interested in enterprise features? Reach out to discuss early access.
        </p>
      </div>
    </div>
  )
}
