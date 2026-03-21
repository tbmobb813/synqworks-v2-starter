import type { AssessmentAnswer } from '@/types'

// Simple scoring: average selected_score per skill, returned as 0-100 integers
export function scoreAssessment(answers: AssessmentAnswer[]) {
  const map: Record<string, { total: number; count: number }> = {}

  for (const a of answers) {
    const sid = String(a.skill_id)
    if (!map[sid]) map[sid] = { total: 0, count: 0 }
    map[sid].total += a.selected_score
    map[sid].count += 1
  }

  const scores: Record<string, number> = {}
  for (const [skillId, { total, count }] of Object.entries(map)) {
    scores[skillId] = Math.round(total / Math.max(1, count))
  }

  return scores
}
