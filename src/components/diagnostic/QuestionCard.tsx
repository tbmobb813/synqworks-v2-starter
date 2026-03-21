'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { AssessmentQuestion, AssessmentAnswer } from '@/types'

interface QuestionCardProps {
  question: AssessmentQuestion
  questionNumber: number
  totalQuestions: number
  onAnswer: (answer: AssessmentAnswer) => void
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const progress = ((questionNumber - 1) / totalQuestions) * 100

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)

    // Brief delay so user sees their selection lock in
    setTimeout(() => {
      const option = question.options[selected]
      onAnswer({
        question_id: question.id,
        skill_id: question.skill_id,
        selected_score: option.score,
      })
      setSelected(null)
      setSubmitted(false)
    }, 400)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            HR strategy diagnostic
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
        <div className="h-0.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question context */}
      {question.context && (
        <div className="mb-5 pl-4 border-l-2 border-zinc-200">
          <p className="text-sm text-zinc-500 leading-relaxed italic">
            {question.context}
          </p>
        </div>
      )}

      {/* Question text */}
      <h2 className="text-xl font-black text-zinc-900 leading-snug mb-8 tracking-tight">
        {question.question_text}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, idx) => {
          const isSelected = selected === idx
          return (
            <button
              key={idx}
              onClick={() => !submitted && setSelected(idx)}
              disabled={submitted}
              className={`
                w-full text-left px-5 py-4 rounded-lg border transition-all duration-150
                font-mono text-sm leading-relaxed
                ${isSelected
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                }
                ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="inline-block w-5 text-zinc-300 mr-2 select-none">
                {String.fromCharCode(65 + idx)}.
              </span>
              {option.label}
            </button>
          )
        })}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={selected === null || submitted}
        className={`
          w-full flex items-center justify-center gap-2 py-4 rounded-lg
          font-mono text-sm font-bold uppercase tracking-widest
          transition-all duration-150
          ${selected !== null && !submitted
            ? 'bg-zinc-900 text-white hover:bg-zinc-700 cursor-pointer'
            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }
        `}
      >
        {submitted ? (
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            Processing
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Submit answer
            <ArrowRight size={14} />
          </span>
        )}
      </button>
    </div>
  )
}
