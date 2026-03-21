import { supabase } from './client'
import type {
  Skill,
  UserProgress,
  TrainingModule,
  AssessmentQuestion,
  SimulationScenario,
  AssessmentScores,
} from '@/types'

// ============================================
// SKILLS
// ============================================

export async function fetchSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data
}

// ============================================
// USER PROGRESS
// ============================================

export async function fetchUserProgress(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data as any[]
}

export async function upsertUserProgress(
  userId: string,
  skillId: string,
  newScore: number
): Promise<void> {
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      skill_id: skillId,
      competency_score: newScore,
      last_activity_at: new Date().toISOString(),
    }, { onConflict: 'user_id,skill_id' })

  if (error) throw error
}

// ============================================
// ASSESSMENT QUESTIONS
// ============================================

export async function fetchAssessmentQuestions(): Promise<AssessmentQuestion[]> {
  const { data, error } = await supabase
    .from('assessment_questions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw error
  return data as unknown as AssessmentQuestion[]
}

export async function saveAssessmentResult(
  userId: string,
  scores: AssessmentScores
): Promise<void> {
  const { error } = await supabase
    .from('assessment_results')
    .insert({ user_id: userId, scores })

  if (error) throw error
}

// ============================================
// TRAINING MODULES
// ============================================

export async function fetchModuleById(moduleId: string): Promise<TrainingModule> {
  const { data, error } = await supabase
    .from('training_modules')
    .select('*')
    .eq('id', moduleId)
    .single()

  if (error) throw error
  return data as unknown as TrainingModule
}

export async function fetchCompletedModuleIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('module_completions')
    .select('module_id')
    .eq('user_id', userId)

  if (error) throw error
  return data.map((row) => row.module_id)
}

export async function saveModuleCompletion(
  userId: string,
  moduleId: string,
  score: number,
  timeSpentSeconds: number
): Promise<void> {
  const { error } = await supabase
    .from('module_completions')
    .upsert({
      user_id: userId,
      module_id: moduleId,
      score,
      time_spent_s: timeSpentSeconds,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,module_id' })

  if (error) throw error
}

// ============================================
// SIMULATION SCENARIOS
// ============================================

export async function fetchScenarioById(scenarioId: string): Promise<SimulationScenario> {
  const { data, error } = await supabase
    .from('simulation_scenarios')
    .select('*')
    .eq('id', scenarioId)
    .single()

  if (error) throw error
  return data as unknown as SimulationScenario
}

export async function saveSimulationResult(
  userId: string,
  scenarioId: string,
  metrics: { trust: number; compliance: number; budget: number },
  choicesLog: object[],
  outcomeLabel: string,
  xpEarned: number
): Promise<void> {
  const { error } = await supabase
    .from('simulation_results')
    .insert({
      user_id: userId,
      scenario_id: scenarioId,
      metrics,
      choices_log: choicesLog as unknown as import('../../types/supabase').Json,
      outcome_label: outcomeLabel,
      xp_earned: xpEarned,
      completed_at: new Date().toISOString(),
    })

  if (error) throw error
}