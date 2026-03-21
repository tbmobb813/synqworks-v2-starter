'use client'

import { create } from 'zustand'
import type { SimState, SimulationScenario, DrillOption } from '@/types'

export const useSimStore = create<SimState>((set, get) => ({
  scenario: null,
  current_node_id: 'initial',
  metrics: { trust: 50, compliance: 50, budget: 50 },
  choices_log: [],
  is_complete: false,

  startScenario: (scenario: SimulationScenario) => {
    set({
      scenario,
      current_node_id: scenario.config.initial_node,
      metrics: { trust: 50, compliance: 50, budget: 50 },
      choices_log: [],
      is_complete: false,
    })
  },

  makeChoice: (option: DrillOption, node_id: string) => {
    const { metrics, scenario } = get()

    const clamp = (v: number) => Math.min(100, Math.max(0, v))
    const newMetrics = {
      trust: clamp(metrics.trust + option.impact.trust),
      compliance: clamp(metrics.compliance + option.impact.compliance),
      budget: clamp(metrics.budget + option.impact.budget),
    }

    const newEntry = {
      node_id,
      option_label: option.label,
      impact: option.impact,
    }

    const nextNodeId = option.next_node
    const nextNode = scenario?.config.nodes[nextNodeId]
    const isTerminal = !nextNode || nextNode.options.length === 0

    set((state) => ({
      metrics: newMetrics,
      choices_log: [...state.choices_log, newEntry],
      current_node_id: nextNodeId,
      is_complete: isTerminal,
    }))
  },

  completeSimulation: () => set({ is_complete: true }),

  reset: () =>
    set({
      scenario: null,
      current_node_id: 'initial',
      metrics: { trust: 50, compliance: 50, budget: 50 },
      choices_log: [],
      is_complete: false,
    }),
}))
