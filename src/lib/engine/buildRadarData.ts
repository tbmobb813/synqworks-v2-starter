import type { Skill, UserProgress, RadarDataPoint } from '@/types'

export function buildRadarData(
  skills: Skill[],
  userProgress: UserProgress[]
): RadarDataPoint[] {
  return skills.map((skill) => {
    const progress = userProgress.find((p) => p.skill_id === skill.id)
    return {
      subject: skill.name,
      score: progress?.competency_score ?? 0,
      full_mark: 100,
      skill_id: skill.id,
    }
  })
}
