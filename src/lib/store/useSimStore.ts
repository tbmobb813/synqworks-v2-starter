// Minimal simulation store stub.
// Replace with real Zustand store implementation as needed.

import type { SimState, SimulationScenario } from '@/types'

export function useSimStore(): SimState {
  return {
    scenario: null,
    current_node_id: 'initial',
    metrics: { trust: 50, compliance: 50, budget: 50 },
    choices_log: [],
    is_complete: false,

    startScenario: (_scenario: SimulationScenario) => {},
    makeChoice: (_option: any, _node_id: string) => {},
    completeSimulation: () => {},
    reset: () => {},
  }
}
