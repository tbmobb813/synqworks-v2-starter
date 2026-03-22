import { scoreAssessment } from '@/lib/engine/scoreAssessment'
import type { AssessmentAnswer } from '@/types'

describe('scoreAssessment', () => {
  it('returns empty object for empty input', () => {
    expect(scoreAssessment([])).toEqual({})
  })

  it('returns the score directly for a single answer per skill', () => {
    const answers: AssessmentAnswer[] = [
      { question_id: 'q1', skill_id: 'skill-a', selected_score: 4 },
    ]
    expect(scoreAssessment(answers)).toEqual({ 'skill-a': 4 })
  })

  it('averages multiple answers for the same skill', () => {
    const answers: AssessmentAnswer[] = [
      { question_id: 'q1', skill_id: 'skill-a', selected_score: 2 },
      { question_id: 'q2', skill_id: 'skill-a', selected_score: 4 },
    ]
    expect(scoreAssessment(answers)).toEqual({ 'skill-a': 3 })
  })

  it('rounds the average to the nearest integer', () => {
    const answers: AssessmentAnswer[] = [
      { question_id: 'q1', skill_id: 'skill-a', selected_score: 1 },
      { question_id: 'q2', skill_id: 'skill-a', selected_score: 2 },
    ]
    // avg = 1.5 → rounds to 2
    expect(scoreAssessment(answers)).toEqual({ 'skill-a': 2 })
  })

  it('handles multiple skills independently', () => {
    const answers: AssessmentAnswer[] = [
      { question_id: 'q1', skill_id: 'skill-a', selected_score: 5 },
      { question_id: 'q2', skill_id: 'skill-b', selected_score: 3 },
      { question_id: 'q3', skill_id: 'skill-a', selected_score: 3 },
    ]
    expect(scoreAssessment(answers)).toEqual({ 'skill-a': 4, 'skill-b': 3 })
  })

  it('coerces skill_id to string', () => {
    const answers = [{ question_id: 'q1', skill_id: 42 as unknown as string, selected_score: 5 }]
    const result = scoreAssessment(answers)
    expect(result['42']).toBe(5)
  })

  it('produces correct scores across three skills with varying answer counts', () => {
    const answers: AssessmentAnswer[] = [
      { question_id: 'q1', skill_id: 'x', selected_score: 1 },
      { question_id: 'q2', skill_id: 'x', selected_score: 3 },
      { question_id: 'q3', skill_id: 'x', selected_score: 5 },
      { question_id: 'q4', skill_id: 'y', selected_score: 5 },
      { question_id: 'q5', skill_id: 'z', selected_score: 2 },
      { question_id: 'q6', skill_id: 'z', selected_score: 2 },
    ]
    // x: avg(1,3,5)=3, y: 5, z: avg(2,2)=2
    expect(scoreAssessment(answers)).toEqual({ x: 3, y: 5, z: 2 })
  })
})
