import { useSimStore } from '@/lib/store/useSimStore'
import type { SimulationScenario, DrillOption } from '@/types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const scenario: SimulationScenario = {
  id: 'scenario-1',
  skill_id: 'skill-1',
  title: 'Test Scenario',
  description: null,
  environment: 'conversation',
  difficulty: 2,
  config: {
    initial_node: 'start',
    nodes: {
      start: {
        text: 'What do you do?',
        options: [
          {
            label: 'Option A — measured response',
            next_node: 'middle',
            impact: { trust: 10, compliance: -5, budget: 0 },
            explanation: 'A measured response',
          },
        ],
      },
      middle: {
        text: 'Follow-up decision',
        options: [
          {
            label: 'Option B — finish',
            next_node: 'end',
            impact: { trust: 5, compliance: 5, budget: -10 },
            explanation: 'Wrap up',
          },
        ],
      },
      end: {
        // Terminal: no options
        text: 'Scenario complete.',
        options: [],
      },
    },
  },
}

const optionA = scenario.config.nodes['start'].options[0]
const optionB = scenario.config.nodes['middle'].options[0]

const INITIAL_METRICS = { trust: 50, compliance: 50, budget: 50 }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetStore() {
  useSimStore.setState({
    scenario: null,
    current_node_id: 'initial',
    metrics: { ...INITIAL_METRICS },
    choices_log: [],
    is_complete: false,
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useSimStore', () => {
  beforeEach(resetStore)

  // --- initial state -------------------------------------------------------

  it('has the correct initial state', () => {
    const s = useSimStore.getState()
    expect(s.scenario).toBeNull()
    expect(s.current_node_id).toBe('initial')
    expect(s.metrics).toEqual(INITIAL_METRICS)
    expect(s.choices_log).toEqual([])
    expect(s.is_complete).toBe(false)
  })

  // --- startScenario -------------------------------------------------------

  it('startScenario sets the scenario and advances to initial_node', () => {
    useSimStore.getState().startScenario(scenario)
    const s = useSimStore.getState()
    expect(s.scenario).toBe(scenario)
    expect(s.current_node_id).toBe('start')
  })

  it('startScenario resets metrics to 50/50/50', () => {
    useSimStore.setState({ metrics: { trust: 90, compliance: 10, budget: 70 } })
    useSimStore.getState().startScenario(scenario)
    expect(useSimStore.getState().metrics).toEqual(INITIAL_METRICS)
  })

  it('startScenario clears choices_log and is_complete', () => {
    useSimStore.setState({
      choices_log: [{ node_id: 'x', option_label: 'y', impact: { trust: 0, compliance: 0, budget: 0 } }],
      is_complete: true,
    })
    useSimStore.getState().startScenario(scenario)
    const s = useSimStore.getState()
    expect(s.choices_log).toEqual([])
    expect(s.is_complete).toBe(false)
  })

  // --- makeChoice ----------------------------------------------------------

  it('makeChoice applies positive impact to metrics', () => {
    useSimStore.getState().startScenario(scenario)
    useSimStore.getState().makeChoice(optionA, 'start')
    const { metrics } = useSimStore.getState()
    expect(metrics.trust).toBe(60)      // 50 + 10
    expect(metrics.compliance).toBe(45) // 50 - 5
    expect(metrics.budget).toBe(50)     // 50 + 0
  })

  it('makeChoice clamps metrics to a minimum of 0', () => {
    useSimStore.setState({ scenario, current_node_id: 'start', metrics: { trust: 3, compliance: 50, budget: 50 }, choices_log: [], is_complete: false })
    const option: DrillOption = { label: 'X', next_node: 'end', impact: { trust: -10, compliance: 0, budget: 0 }, explanation: '' }
    useSimStore.getState().makeChoice(option, 'start')
    expect(useSimStore.getState().metrics.trust).toBe(0)
  })

  it('makeChoice clamps metrics to a maximum of 100', () => {
    useSimStore.setState({ scenario, current_node_id: 'start', metrics: { trust: 95, compliance: 50, budget: 50 }, choices_log: [], is_complete: false })
    const option: DrillOption = { label: 'X', next_node: 'end', impact: { trust: 20, compliance: 0, budget: 0 }, explanation: '' }
    useSimStore.getState().makeChoice(option, 'start')
    expect(useSimStore.getState().metrics.trust).toBe(100)
  })

  it('makeChoice appends a record to choices_log', () => {
    useSimStore.getState().startScenario(scenario)
    useSimStore.getState().makeChoice(optionA, 'start')
    const { choices_log } = useSimStore.getState()
    expect(choices_log).toHaveLength(1)
    expect(choices_log[0]).toMatchObject({
      node_id: 'start',
      option_label: 'Option A — measured response',
      impact: { trust: 10, compliance: -5, budget: 0 },
    })
  })

  it('makeChoice advances current_node_id to the chosen option\'s next_node', () => {
    useSimStore.getState().startScenario(scenario)
    useSimStore.getState().makeChoice(optionA, 'start')
    expect(useSimStore.getState().current_node_id).toBe('middle')
  })

  it('makeChoice sets is_complete when the next node has no options', () => {
    // Navigate to `middle`, then choose optionB which leads to `end` (empty options)
    useSimStore.getState().startScenario(scenario)
    useSimStore.getState().makeChoice(optionA, 'start')
    useSimStore.getState().makeChoice(optionB, 'middle')
    expect(useSimStore.getState().is_complete).toBe(true)
  })

  it('makeChoice sets is_complete when next_node does not exist in the nodes map', () => {
    useSimStore.setState({ scenario, current_node_id: 'start', metrics: { ...INITIAL_METRICS }, choices_log: [], is_complete: false })
    const option: DrillOption = { label: 'Y', next_node: 'nonexistent', impact: { trust: 0, compliance: 0, budget: 0 }, explanation: '' }
    useSimStore.getState().makeChoice(option, 'start')
    expect(useSimStore.getState().is_complete).toBe(true)
  })

  it('accumulates multiple choices in choices_log', () => {
    useSimStore.getState().startScenario(scenario)
    useSimStore.getState().makeChoice(optionA, 'start')
    useSimStore.getState().makeChoice(optionB, 'middle')
    expect(useSimStore.getState().choices_log).toHaveLength(2)
  })

  // --- completeSimulation --------------------------------------------------

  it('completeSimulation sets is_complete to true', () => {
    useSimStore.getState().completeSimulation()
    expect(useSimStore.getState().is_complete).toBe(true)
  })

  // --- reset ---------------------------------------------------------------

  it('reset returns all state to initial values', () => {
    useSimStore.getState().startScenario(scenario)
    useSimStore.getState().makeChoice(optionA, 'start')
    useSimStore.getState().reset()
    const s = useSimStore.getState()
    expect(s.scenario).toBeNull()
    expect(s.current_node_id).toBe('initial')
    expect(s.metrics).toEqual(INITIAL_METRICS)
    expect(s.choices_log).toEqual([])
    expect(s.is_complete).toBe(false)
  })
})
