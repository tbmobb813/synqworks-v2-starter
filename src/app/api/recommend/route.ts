import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getNextModule } from '@/lib/engine/getNextModule'
import { buildRadarData } from '@/lib/engine/buildRadarData'
import type {
  DashboardData, Skill, UserProgress, KPIStats, RiskSkill,
  SkillBreakdownItem, RecentActivityItem, CertificationProgress,
  AssessmentHistoryPoint, MandatoryTraining
} from '@/types'

function getRiskLevel(score: number): SkillBreakdownItem['risk_level'] {
  if (score < 25) return 'critical'
  if (score < 40) return 'at_risk'
  if (score < 70) return 'developing'
  return 'proficient'
}

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(null, { status: 401 })
  }

  const [progressRows, skillsRows, simResultsRows, assessmentRows, certRows, mandatoryModuleRows, completedModuleRows] = await Promise.all([
    supabase.from('user_progress').select('*').eq('user_id', user.id),
    supabase.from('skills').select('*').order('sort_order'),
    supabase
      .from('simulation_results')
      .select('id, scenario_id, outcome_label, xp_earned, completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(5),
    supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: true }),
    supabase.from('certifications').select('*'),
    supabase
      .from('training_modules')
      .select('id, skill_id, title, difficulty, estimated_mins, is_mandatory, due_date')
      .eq('is_mandatory', true)
      .eq('is_active', true),
    supabase
      .from('module_completions')
      .select('module_id')
      .eq('user_id', user.id),
  ])

  const userProgress = (progressRows.data ?? []) as UserProgress[]
  const skills = (skillsRows.data ?? []) as Skill[]
  const simResults = simResultsRows.data ?? []
  const assessments = assessmentRows.data ?? []
  const certs = certRows.data ?? []
  const mandatoryModules = mandatoryModuleRows.data ?? []
  const completedModuleIds = new Set((completedModuleRows.data ?? []).map((r: { module_id: string }) => r.module_id))

  const radar_data = buildRadarData(skills, userProgress)
  const recommended_module = await getNextModule(user.id, userProgress, supabase)

  const skillMap = new Map(skills.map(s => [s.id, s]))
  const progressMap = new Map(userProgress.map(p => [p.skill_id, p.competency_score]))

  // KPI stats
  const totalXP = simResults.reduce((sum, r) => sum + (r.xp_earned ?? 0), 0)
  const scores = userProgress.map(p => p.competency_score)
  const avgCompetency = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const atRiskCount = scores.filter(s => s < 40).length

  const kpi_stats: KPIStats = {
    total_xp: totalXP,
    simulations_completed: simResults.length,
    avg_competency: avgCompetency,
    skills_at_risk: atRiskCount,
  }

  // Risk register
  const risk_register: RiskSkill[] = userProgress
    .filter(p => p.competency_score < 40)
    .sort((a, b) => a.competency_score - b.competency_score)
    .map(p => {
      const skill = skillMap.get(p.skill_id)
      return { skill_name: skill?.name ?? 'Unknown', category: skill?.category ?? '', score: p.competency_score }
    })

  // Skill breakdown
  const skill_breakdown: SkillBreakdownItem[] = skills.map(skill => {
    const progress = userProgress.find(p => p.skill_id === skill.id)
    const score = progress?.competency_score ?? 0
    return { skill_id: skill.id, skill_name: skill.name, category: skill.category, score, risk_level: getRiskLevel(score) }
  })

  // Recent activity
  const scenarioIds = [...new Set(simResults.map(r => r.scenario_id))]
  let scenarioMap = new Map<string, string>()
  if (scenarioIds.length > 0) {
    const { data: scenarios } = await supabase.from('simulation_scenarios').select('id, title').in('id', scenarioIds)
    if (scenarios) scenarioMap = new Map(scenarios.map(s => [s.id, s.title]))
  }

  const recent_activity: RecentActivityItem[] = simResults.map(r => ({
    id: r.id,
    scenario_title: scenarioMap.get(r.scenario_id) ?? 'Simulation',
    outcome_label: r.outcome_label ?? 'Completed',
    xp_earned: r.xp_earned ?? 0,
    completed_at: r.completed_at,
  }))

  // --- #5 Certification progress ---
  const certifications: CertificationProgress[] = certs.map((cert: { id: string; name: string; description: string | null; badge_color: string; threshold: number; skill_ids: string[] }) => {
    const skillIds: string[] = cert.skill_ids ?? []
    const skillScores = skillIds.map(sid => {
      const skill = skillMap.get(sid)
      const score = progressMap.get(sid) ?? 0
      return { skill_name: skill?.name ?? 'Unknown', score, met: score >= cert.threshold }
    })
    const skillsMet = skillScores.filter(s => s.met).length
    const percentComplete = skillIds.length > 0 ? Math.round((skillsMet / skillIds.length) * 100) : 0

    return {
      id: cert.id,
      name: cert.name,
      description: cert.description,
      badge_color: cert.badge_color,
      threshold: cert.threshold,
      total_skills: skillIds.length,
      skills_met: skillsMet,
      percent_complete: percentComplete,
      skill_scores: skillScores,
    }
  })

  // --- #6 Assessment history ---
  const assessment_history: AssessmentHistoryPoint[] = assessments.map((a: { completed_at: string; scores: Record<string, number> }) => {
    const skillScores = a.scores as Record<string, number>
    const vals = Object.values(skillScores)
    const avgScore = vals.length > 0 ? Math.round(vals.reduce((sum, v) => sum + v, 0) / vals.length) : 0
    return { completed_at: a.completed_at, avg_score: avgScore, skill_scores: skillScores }
  })

  // --- #7 Mandatory training tracker ---
  const now = new Date()
  const mandatory_trainings: MandatoryTraining[] = mandatoryModules.map((m: { id: string; skill_id: string; title: string; difficulty: number; estimated_mins: number; is_mandatory: boolean; due_date: string | null }) => {
    const skill = skillMap.get(m.skill_id)
    const isCompleted = completedModuleIds.has(m.id)
    let daysRemaining: number | null = null
    let isOverdue = false
    if (m.due_date) {
      const due = new Date(m.due_date)
      daysRemaining = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      isOverdue = daysRemaining < 0 && !isCompleted
    }
    return {
      module_id: m.id,
      title: m.title,
      skill_name: skill?.name ?? 'Unknown',
      difficulty: m.difficulty,
      estimated_mins: m.estimated_mins,
      due_date: m.due_date,
      is_completed: isCompleted,
      days_remaining: daysRemaining,
      is_overdue: isOverdue,
    }
  })

  // System insights
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

  const body: DashboardData = {
    radar_data,
    recommended_module,
    system_insights,
    kpi_stats,
    risk_register,
    skill_breakdown,
    recent_activity,
    certifications,
    assessment_history,
    mandatory_trainings,
  }
  return NextResponse.json(body)
}
