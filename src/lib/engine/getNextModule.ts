import { supabase } from '@/lib/supabase/client'
import type { RecommendedModule, UserProgress } from '@/types'

// ============================================
// getNextModule
// Finds the best training module for a user
// based on their weakest skill gap.
//
// Logic:
// 1. Find the skill with the lowest competency score
// 2. Find a module for that skill at difficulty
//    just above their current level (Goldilocks zone)
// 3. Exclude any modules they've already completed
// ============================================

export async function getNextModule(
  userId: string,
  userProgress: UserProgress[]
): Promise<RecommendedModule | null> {
  if (userProgress.length === 0) return null

  // Step 1: Find the critical gap (lowest scoring skill)
  const criticalGap = [...userProgress].sort(
    (a, b) => a.competency_score - b.competency_score
  )[0]

  // Normalize 0-100 score to 1-5 difficulty scale
  const currentDifficultyLevel = Math.max(1, Math.ceil(criticalGap.competency_score / 20))

  // Step 2: Get completed module IDs to exclude
  const { data: completedRows } = await supabase
    .from('module_completions')
    .select('module_id')
    .eq('user_id', userId)

  const completedIds = completedRows?.map((r) => r.module_id) ?? []

  // Step 3: Query for the best matching module
  // Target difficulty = current level + 1 (capped at 5)
  const targetDifficulty = Math.min(currentDifficultyLevel + 1, 5)

  let query = supabase
    .from('training_modules')
    .select(`
      id,
      skill_id,
      title,
      description,
      difficulty,
      estimated_mins,
      xp_reward,
      skills ( name )
    `)
    .eq('skill_id', criticalGap.skill_id)
    .eq('is_active', true)
    .lte('difficulty', targetDifficulty)
    .gte('difficulty', Math.max(1, currentDifficultyLevel))
    .order('difficulty', { ascending: true })
    .limit(1)

  // Exclude completed modules if any exist
  if (completedIds.length > 0) {
    query = query.not('id', 'in', `(${completedIds.join(',')})`)
  }

  const { data, error } = await query.single()

  if (error || !data) return null

  return {
    id: data.id,
    skill_id: data.skill_id,
    skill_name: (data.skills as { name: string }).name,
    title: data.title,
    description: data.description,
    difficulty: data.difficulty,
    estimated_mins: data.estimated_mins,
    xp_reward: data.xp_reward,
    status: 'not_started',
  }
}
