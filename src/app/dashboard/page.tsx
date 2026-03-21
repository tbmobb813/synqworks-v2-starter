import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getNextModule } from '@/lib/engine/getNextModule'
import { buildRadarData } from '@/lib/engine/buildRadarData'
import DashboardClient from '@/components/dashboard/DashboardClient'
import type { DashboardData, Skill, UserProgress } from '@/types'

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const [progressRows, skillsRows] = await Promise.all([
      supabase.from('user_progress').select('*').eq('user_id', user.id),
      supabase.from('skills').select('*').order('sort_order'),
    ])

    const userProgress = (progressRows.data ?? []) as UserProgress[]
    const skills = skillsRows.data ?? []

    const radar_data = buildRadarData(skills as Skill[], userProgress)

    const recommended_module = await getNextModule(user.id, userProgress, supabase)

    const sortedByScore = [...userProgress].sort((a, b) => a.competency_score - b.competency_score)
    const criticalGap = sortedByScore[0]
    const criticalSkill = skills.find((s) => s.id === criticalGap?.skill_id)

    if (!criticalSkill) return null

    return {
      radar_data,
      recommended_module,
      system_insights: {
        primary_gap: criticalSkill.name,
        primary_gap_score: criticalGap.competency_score,
        trend: 'Tracking leadership growth',
        next_milestone: recommended_module?.title ?? 'Complete an assessment',
      },
    }
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <DashboardClient initialData={data} />
      </div>
    </main>
  )
}
