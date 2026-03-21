import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getNextModule } from '@/lib/engine/getNextModule'
import { buildRadarData } from '@/lib/engine/buildRadarData'
import type { DashboardData, UserProgress } from '@/types'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(null, { status: 401 })
  }

  const [progressRows, skillsRows] = await Promise.all([
    supabase.from('user_progress').select('*').eq('user_id', user.id),
    supabase.from('skills').select('*').order('sort_order'),
  ])

  const userProgress = (progressRows.data ?? []) as UserProgress[]
  const skills = skillsRows.data ?? []

  const radar_data = buildRadarData(skills as import('@/types').Skill[], userProgress)

  const recommended_module = await getNextModule(user.id, userProgress)

  const sortedByScore = [...userProgress].sort((a, b) => a.competency_score - b.competency_score)
  const criticalGap = sortedByScore[0]
  const criticalSkill = skills.find((s) => s.id === criticalGap?.skill_id)

  const system_insights = criticalSkill
    ? {
        primary_gap: criticalSkill.name,
        primary_gap_score: criticalGap.competency_score,
        trend: 'Tracking leadership growth',
        next_milestone: recommended_module?.title ?? 'Complete an assessment',
      }
    : null

  if (!system_insights) {
    return NextResponse.json(null, { status: 200 })
  }

  const body: DashboardData = { radar_data, recommended_module, system_insights }
  return NextResponse.json(body)
}
