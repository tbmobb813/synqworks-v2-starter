'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { RadarDataPoint } from '@/types'

interface SkillRadarProps {
  data: RadarDataPoint[]
  isLoading?: boolean
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as RadarDataPoint
  return (
    <div className="bg-white border border-zinc-200 rounded-lg px-3 py-2 shadow-md">
      <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-0.5">
        {d.subject}
      </p>
      <p className="text-2xl font-black text-zinc-900">{d.score}</p>
      <p className="text-xs text-zinc-400">/ 100</p>
    </div>
  )
}

export function SkillRadar({ data, isLoading }: SkillRadarProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[380px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">
            Mapping competencies
          </span>
        </div>
      </div>
    )
  }

  // Identify the weakest skill for callout
  const weakest = [...data].sort((a, b) => a.score - b.score)[0]

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-2 px-1">
        <div>
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            Competency blueprint
          </p>
        </div>
        {weakest && (
          <div className="text-right">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              Critical gap
            </p>
            <p className="text-sm font-black text-rose-500">{weakest.subject}</p>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid
            stroke="#e4e4e7"
            strokeWidth={0.5}
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: '#71717a',
              fontSize: 11,
              fontFamily: 'monospace',
              fontWeight: 500,
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            tickCount={5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="score"
            dataKey="score"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.12}
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}