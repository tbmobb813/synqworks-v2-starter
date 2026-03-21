import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getNextModule } from '@/lib/engine/getNextModule'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const [progressRows, skillsRows] = await Promise.all([
      supabase.from('user_progress').select('*').eq('user_id', user.id),
      supabase.from('skills').select('*').order('sort_order'),
    ])

    const userProgress = (progressRows.data ?? [])
    const skills = skillsRows.data ?? []

    const radar_data = skills.map((skill: any) => {
      const progress = userProgress.find((p: any) => p.skill_id === skill.id)
      return {
        subject: skill.name,
        score: progress?.competency_score ?? 0,
        full_mark: 100,
        skill_id: skill.id,
      }
    })

    const recommended_module = await getNextModule(user.id, userProgress)

    const sortedByScore = [...userProgress].sort((a: any, b: any) => a.competency_score - b.competency_score)
    const criticalGap = sortedByScore[0]
    const criticalSkill = skills.find((s: any) => s.id === criticalGap?.skill_id)

    const payload = {
      radar_data,
      recommended_module,
      system_insights: criticalSkill ? {
        primary_gap: criticalSkill.name,
        primary_gap_score: criticalGap.competency_score,
        trend: 'Tracking leadership growth',
        next_milestone: recommended_module?.title ?? 'Complete an assessment',
      } : null,
    }

    return NextResponse.json(payload)
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
