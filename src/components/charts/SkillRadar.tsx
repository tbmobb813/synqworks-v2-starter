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

const SHORT_LABELS: Record<string, string> = {
  'People Operations': 'People Ops',
  'Conflict Resolution': 'Conflict Res.',
  'Regulatory Compliance': 'Compliance',
  'Strategic Budgeting': 'Budgeting',
  'DEI Strategy': 'DEI',
  'HR Tech Fluency': 'HR Tech',
  'Diversity & Inclusion': 'Diversity & Incl.',
  'Harassment Prevention': 'Harassment Prev.',
  'Recruitment & Selection': 'Recruitment',
  'FMLA Compliance': 'FMLA',
  'Onboarding & Orientation': 'Onboarding',
  'Payroll & Compensation': 'Payroll & Comp.',
  'Performance Management': 'Performance Mgmt',
  'Employee Relations': 'Employee Rel.',
  'Policy Development': 'Policy Dev.',
  'Workplace Safety': 'Workplace Safety',
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: RadarDataPoint }[] }) => {
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
      <div className="w-full h-95 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">
            Mapping competencies
          </span>
        </div>
      </div>
    )
  }

  // Defensive: If data is missing, empty, or invalid, show a fallback UI
  if (!Array.isArray(data) || data.length === 0 || data.some(d => typeof d.score !== 'number' || isNaN(d.score))) {
    return (
      <div className="w-full h-105 flex items-center justify-center bg-zinc-50 border border-dashed border-zinc-200 rounded-xl">
        <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">No competency data available</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="radar-container">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 48, right: 64, bottom: 48, left: 64 }}>
            <PolarGrid
              stroke="#e4e4e7"
              strokeWidth={0.5}
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: '#71717a',
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
              tickFormatter={(value) => SHORT_LABELS[value as string] ?? (value as string)}
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
    </div>
  )
}
