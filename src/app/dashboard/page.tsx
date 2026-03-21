import { supabase } from '@/lib/supabase/client'
import { getNextModule } from '@/lib/engine/getNextModule'
import DashboardClient from '@/components/dashboard/DashboardClient'
import type { DashboardData, RadarDataPoint, UserProgress } from '@/types'

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const [progressRows, skillsRows] = await Promise.all([
      supabase.from('user_progress').select('*').eq('user_id', user.id),
      supabase.from('skills').select('*').order('sort_order'),
    ])

    const userProgress = (progressRows.data ?? []) as UserProgress[]
    const skills = skillsRows.data ?? []

    const radar_data: RadarDataPoint[] = skills.map((skill) => {
      const progress = userProgress.find((p) => p.skill_id === skill.id)
      return {
        subject: skill.name,
        score: progress?.competency_score ?? 0,
        full_mark: 100,
        skill_id: skill.id,
      }
    })

    const recommended_module = await getNextModule(user.id, userProgress)

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
