import { buildRadarData } from '@/lib/engine/buildRadarData'
import type { Skill, UserProgress } from '@/types'

const makeSkill = (id: string, name: string, sort_order = 1): Skill => ({
  id,
  name,
  category: 'Leadership',
  description: null,
  sort_order,
  created_at: '2024-01-01',
})

const makeProgress = (skill_id: string, score: number): UserProgress => ({
  id: `prog-${skill_id}`,
  user_id: 'user-1',
  skill_id,
  competency_score: score,
  sessions_count: 1,
  last_activity_at: '2024-01-01',
})

describe('buildRadarData', () => {
  it('returns an entry for each skill', () => {
    const skills = [makeSkill('s1', 'Communication'), makeSkill('s2', 'Decision Making')]
    expect(buildRadarData(skills, [])).toHaveLength(2)
  })

  it('returns empty array when no skills are provided', () => {
    expect(buildRadarData([], [])).toEqual([])
  })

  it('maps skill name to subject', () => {
    const skills = [makeSkill('s1', 'Communication')]
    expect(buildRadarData(skills, [])[0].subject).toBe('Communication')
  })

  it('sets skill_id on each data point', () => {
    const skills = [makeSkill('s1', 'Communication'), makeSkill('s2', 'Conflict Resolution')]
    const result = buildRadarData(skills, [])
    expect(result[0].skill_id).toBe('s1')
    expect(result[1].skill_id).toBe('s2')
  })

  it('sets full_mark to 100 for every data point', () => {
    const skills = [makeSkill('s1', 'A'), makeSkill('s2', 'B'), makeSkill('s3', 'C')]
    const result = buildRadarData(skills, [])
    expect(result.every(d => d.full_mark === 100)).toBe(true)
  })

  it('defaults score to 0 when no progress entry exists for a skill', () => {
    const skills = [makeSkill('s1', 'Communication')]
    expect(buildRadarData(skills, [])[0].score).toBe(0)
  })

  it('maps competency_score to score when progress exists', () => {
    const skills = [makeSkill('s1', 'Communication')]
    const progress = [makeProgress('s1', 72)]
    expect(buildRadarData(skills, progress)[0].score).toBe(72)
  })

  it('uses 0 for skills that have no matching progress entry while others do', () => {
    const skills = [makeSkill('s1', 'A'), makeSkill('s2', 'B')]
    const progress = [makeProgress('s1', 60)]
    const result = buildRadarData(skills, progress)
    expect(result[0].score).toBe(60)
    expect(result[1].score).toBe(0)
  })

  it('preserves skill ordering from the input array', () => {
    const skills = [makeSkill('s1', 'Z', 1), makeSkill('s2', 'A', 2), makeSkill('s3', 'M', 3)]
    const result = buildRadarData(skills, [])
    expect(result.map(d => d.subject)).toEqual(['Z', 'A', 'M'])
  })
})
