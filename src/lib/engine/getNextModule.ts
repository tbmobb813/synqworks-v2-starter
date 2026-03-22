import type { SupabaseClient } from '@supabase/supabase-js'
import type { RecommendedModule, UserProgress } from '@/types'

// ============================================
// getNextModule
// Finds the best simulation scenario for a user
// based on their weakest skill gap.
//
// Logic:
// 1. Find the skill with the lowest competency score
// 2. Find a scenario for that skill at difficulty
//    just above their current level (Goldilocks zone)
// 3. Exclude any scenarios they've already completed
// ============================================

export async function getNextModule(
  userId: string,
  userProgress: UserProgress[],
  client: SupabaseClient
): Promise<RecommendedModule | null> {
  if (userProgress.length === 0) return null

  const db = client

  // Step 1: Find the critical gap (lowest scoring skill)
  const criticalGap = [...userProgress].sort(
    (a, b) => a.competency_score - b.competency_score
  )[0]

  // Normalize 0-100 score to 1-5 difficulty scale
  const currentDifficultyLevel = Math.max(1, Math.ceil(criticalGap.competency_score / 20))

  // Step 2: Get completed scenario IDs to exclude
  const { data: completedRows } = await db
    .from('simulation_results')
    .select('scenario_id')
    .eq('user_id', userId)

  const completedIds = completedRows?.map((r: { scenario_id: string }) => r.scenario_id) ?? []

  // Step 3: Query for the best matching scenario
  // Target difficulty = current level + 1 (capped at 5)
  const targetDifficulty = Math.min(currentDifficultyLevel + 1, 5)

  let query = db
    .from('simulation_scenarios')
    .select(`
      id,
      skill_id,
      title,
      description,
      difficulty,
      skills ( name )
    `)
    .eq('skill_id', criticalGap.skill_id)
    .lte('difficulty', targetDifficulty)
    .gte('difficulty', Math.max(1, currentDifficultyLevel))
    .order('difficulty', { ascending: true })
    .limit(1)

  // Exclude completed scenarios if any exist
  if (completedIds.length > 0) {
    query = query.not('id', 'in', `(${completedIds.join(',')})`)
  }

  const { data, error } = await query.single()

  if (error || !data) return null

  return {
    id: data.id,
    skill_id: data.skill_id,
    skill_name: (data.skills as unknown as { name: string }).name,
    title: data.title,
    description: data.description,
    difficulty: data.difficulty,
    estimated_mins: data.difficulty * 5,   // 5–25 min based on difficulty
    xp_reward: data.difficulty * 50,       // 50–250 XP based on difficulty
    status: 'not_started',
  }
}
