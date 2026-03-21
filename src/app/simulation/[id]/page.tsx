'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSimStore } from '@/lib/store/useSimStore'
import { useUserStore } from '@/lib/store/useUserStore'
import { SimulationPlayer } from '@/components/simulation/Player'
import { AARReport } from '@/components/simulation/AARReport'
import {
  fetchScenarioById,
  saveSimulationResult,
  fetchUserProgress,
} from '@/lib/supabase/queries'
import { getNextModule } from '@/lib/engine/getNextModule'
import { upsertUserProgress } from '@/lib/supabase/queries'
import type { SimulationScenario, AARData } from '@/types'

export default function SimulationPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUserStore()

  const {
    scenario,
    metrics,
    choices_log,
    is_complete,
    startScenario,
    reset,
  } = useSimStore()

  const [loading, setLoading] = useState(true)
  const [aarData, setAarData] = useState<AARData | null>(null)

  // Load and start scenario
  useEffect(() => {
    if (!id) return
    fetchScenarioById(id)
      .then((s: SimulationScenario) => {
        startScenario(s)
        setLoading(false)
      })
      .catch(console.error)

    return () => reset()
  }, [id])

  // When simulation completes, build AAR and save results
  useEffect(() => {
    if (!is_complete || !scenario || !user) return

    const buildAAR = async () => {
      const xpEarned = Math.round(
        ((metrics.trust + metrics.compliance) / 200) * 150
      )

      // Determine outcome label from metrics
      const outcomeLabel =
        metrics.compliance >= 70 && metrics.trust >= 60
          ? 'Systemic risk averted, trust maintained'
          : metrics.trust >= 70
          ? 'Trust preserved, compliance risk elevated'
          : metrics.compliance >= 70
          ? 'Compliance secured, team trust impacted'
          : 'High-risk outcome — review strategy'

      // Build metric shifts for display
      const metricShifts = [
        {
          label: 'Org trust',
          value: `${metrics.trust >= 50 ? '+' : ''}${metrics.trust - 50}%`,
          status: (metrics.trust >= 60 ? 'positive' : metrics.trust >= 40 ? 'neutral' : 'negative') as 'positive' | 'neutral' | 'negative',
        },
        {
          label: 'Legal compliance',
          value: `${metrics.compliance}%`,
          status: (metrics.compliance >= 70 ? 'positive' : metrics.compliance >= 40 ? 'neutral' : 'negative') as 'positive' | 'neutral' | 'negative',
        },
        {
          label: 'Budget impact',
          value: metrics.budget >= 90 ? 'Stable' : metrics.budget >= 60 ? 'Moderate' : 'Strained',
          status: (metrics.budget >= 80 ? 'positive' : metrics.budget >= 50 ? 'neutral' : 'negative') as 'positive' | 'neutral' | 'negative',
        },
        {
          label: 'Retention risk',
          value: metrics.trust >= 65 ? 'Low' : metrics.trust >= 45 ? 'Medium' : 'High',
          status: (metrics.trust >= 65 ? 'positive' : metrics.trust >= 45 ? 'neutral' : 'negative') as 'positive' | 'neutral' | 'negative',
        },
      ]

      // Update user progress for this skill
      const pointsGained = Math.round(xpEarned / 10)
      const userProgress = (await fetchUserProgress(user.id)) as any[]
      const currentProgress = userProgress.find(p => p.skill_id === scenario.skill_id)
      const newScore = Math.min(100, (currentProgress?.competency_score ?? 0) + pointsGained)
      await upsertUserProgress(user.id, scenario.skill_id, newScore)

      // Get next recommended module
      const updatedProgress = userProgress.map(p =>
        p.skill_id === scenario.skill_id ? { ...p, competency_score: newScore } : p
      )
      const nextModule = await getNextModule(user.id, updatedProgress)

      // Save simulation result
      await saveSimulationResult(
        user.id,
        scenario.id,
        metrics,
        choices_log,
        outcomeLabel,
        xpEarned
      )

      setAarData({
        outcome_label: outcomeLabel,
        metric_shifts: metricShifts,
        strategic_insight: `Your choices in this scenario resulted in a ${outcomeLabel.toLowerCase()}. 
          ${metrics.compliance < 60
            ? 'The compliance gap you created may expose the organization to legal risk within the next 6 months if left unaddressed.'
            : 'Your compliance posture was strong. Focus next on building resilience in your team trust metrics.'}`,
        skill_growth: {
          skill_name: scenario.title,
          points_gained: pointsGained,
        },
        next_module: nextModule,
        xp_earned: xpEarned,
      })
    }

    buildAAR().catch(console.error)
  }, [is_complete])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-zinc-400">Loading scenario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6 py-12">
      <div className="w-full">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">
            {scenario?.environment ?? 'simulation'}
          </p>
          <h1 className="text-xl font-black text-zinc-900 tracking-tight">
            {scenario?.title}
          </h1>
        </div>

        {/* Player or AAR */}
        {is_complete && aarData ? (
          <AARReport
            data={aarData}
            onRestart={() => {
              setAarData(null)
              if (scenario) startScenario(scenario)
            }}
          />
        ) : scenario ? (
          <SimulationPlayer scenario={scenario} />
        ) : null}
      </div>
    </div>
  )
}