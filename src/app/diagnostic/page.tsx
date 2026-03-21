'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionCard } from '@/components/diagnostic/QuestionCard'
import { scoreAssessment } from '@/lib/engine/scoreAssessment'
import {
  fetchAssessmentQuestions,
  saveAssessmentResult,
  upsertUserProgress,
} from '@/lib/supabase/queries'
import { useUserStore } from '@/lib/store/useUserStore'
import type { AssessmentQuestion, AssessmentAnswer } from '@/types'

type Phase = 'loading' | 'intro' | 'questions' | 'processing' | 'done'

export default function DiagnosticPage() {
  const router = useRouter()
  const { user } = useUserStore()

  const [phase, setPhase] = useState<Phase>('loading')
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    fetchAssessmentQuestions()
      .then((qs) => {
        setQuestions(qs)
        setPhase('intro')
      })
      .catch(console.error)
  }, [])

  const handleAnswer = async (answer: AssessmentAnswer) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1)
    } else {
      // All questions answered — score and save
      setPhase('processing')

      try {
        const scores = scoreAssessment(newAnswers)

        if (user) {
          // Save full result and update per-skill progress in parallel
          await Promise.all([
            saveAssessmentResult(user.id, scores),
            ...Object.entries(scores).map(([skillId, score]) =>
              upsertUserProgress(user.id, skillId, score)
            ),
          ])
        }

        setPhase('done')
      } catch (err) {
        console.error('Failed to save assessment:', err)
        setPhase('done') // Still redirect even on save failure
      }
    }
  }

  // Auto-redirect once done
  useEffect(() => {
    if (phase === 'done') {
      setTimeout(() => router.push('/dashboard'), 1800)
    }
  }, [phase, router])

  // --- Loading ---
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  // --- Intro ---
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-4">
            SynqWorks diagnostic
          </p>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-4 leading-tight">
            HR leadership<br />stress test
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed mb-8 max-w-sm mx-auto">
            {questions.length} situational questions. No right or wrong answers —
            only strategic trade-offs. Your responses generate a real-time
            competency blueprint.
          </p>
          <button
            onClick={() => setPhase('questions')}
            className="
              inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-700
              text-white px-8 py-4 rounded-lg text-xs font-mono font-bold
              uppercase tracking-widest transition-all duration-150 cursor-pointer
            "
          >
            Begin assessment
          </button>
          <p className="text-[10px] font-mono text-zinc-400 mt-4">
            ~{Math.ceil(questions.length * 0.75)} minutes
          </p>
        </div>
      </div>
    )
  }

  // --- Processing / Done ---
  if (phase === 'processing' || phase === 'done') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-mono text-zinc-500">
            {phase === 'processing'
              ? 'Calculating your strategic blind spots...'
              : 'Blueprint ready. Redirecting...'}
          </p>
        </div>
      </div>
    )
  }

  // --- Questions ---
  const currentQuestion = questions[currentIdx]

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6 py-12">
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIdx + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
      />
    </div>
  )
}