'use client'

import { useSimStore } from '@/lib/store/useSimStore'
import { Shield, Users, Wallet, ArrowRight } from 'lucide-react'
import type { SimulationScenario } from '@/types'

interface MetricBarProps {
  icon: React.ReactNode
  label: string
  value: number
  color: string
  textColor: string
}

function MetricBar({ icon, label, value, color, textColor }: MetricBarProps) {
  const status = value >= 70 ? 'good' : value >= 40 ? 'warn' : 'danger'
  const barColor =
    status === 'good' ? 'bg-emerald-500' :
    status === 'warn' ? 'bg-amber-400' : 'bg-rose-500'

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400">{icon}</span>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            {label}
          </span>
        </div>
        <span className={`text-xs font-black font-mono ${
          status === 'good' ? 'text-emerald-600' :
          status === 'warn' ? 'text-amber-600' : 'text-rose-600'
        }`}>
          {value}
        </span>
      </div>
      <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out bar-fill`}
          style={{ '--bar-w': `${value}%` } as React.CSSProperties}
        />
      </div>
    </div>
  )
}

interface SimulationPlayerProps {
  scenario: SimulationScenario
}

export function SimulationPlayer({ scenario }: SimulationPlayerProps) {
  const { current_node_id, metrics, makeChoice, is_complete } = useSimStore()

  const currentNode = scenario.config.nodes[current_node_id]

  if (!currentNode || is_complete) return null

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Metric dashboard */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-6">
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-4">
          Live impact tracker
        </p>
        <div className="flex gap-6">
          <MetricBar
            icon={<Users size={12} />}
            label="Trust"
            value={metrics.trust}
            color="emerald"
            textColor="emerald"
          />
          <MetricBar
            icon={<Shield size={12} />}
            label="Compliance"
            value={metrics.compliance}
            color="blue"
            textColor="blue"
          />
          <MetricBar
            icon={<Wallet size={12} />}
            label="Budget"
            value={metrics.budget}
            color="amber"
            textColor="amber"
          />
        </div>
      </div>

      {/* Scenario text */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-6">
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">
          Situation
        </p>
        <p className="text-base text-zinc-800 leading-relaxed font-medium">
          {currentNode.text}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-4">
          Your response
        </p>
        {currentNode.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => makeChoice(option, current_node_id)}
            className="
              group w-full text-left px-5 py-4 rounded-lg border border-zinc-200
              bg-white hover:border-zinc-900 hover:bg-zinc-900
              transition-all duration-150 cursor-pointer
              flex items-center justify-between gap-4
            "
          >
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-xs font-mono text-zinc-300 group-hover:text-zinc-500 mt-0.5 shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm text-zinc-700 group-hover:text-white leading-relaxed font-medium transition-colors duration-150">
                {option.label}
              </span>
            </div>
            <ArrowRight
              size={14}
              className="text-zinc-300 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
