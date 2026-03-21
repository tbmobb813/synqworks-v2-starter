// ============================================
// SynqWorks v2 — Core Types
// All app-wide interfaces live here.
// Supabase generated types extend these.
// ============================================

// --- Skill taxonomy ---

export interface Skill {
  id: string
  name: string
  category: string
  description: string | null
  sort_order: number
  created_at: string
}

// --- Assessment ---

export interface AssessmentOption {
  label: string
  score: number          // 1–5
  explanation: string    // shown in AAR
}

export interface AssessmentQuestion {
  id: string
  skill_id: string
  question_text: string
  context: string | null
  options: AssessmentOption[]
  sort_order: number
}

export interface AssessmentAnswer {
  question_id: string
  skill_id: string
  selected_score: number
}

// scores is a map of skill_id -> normalized 0–100 score
export type AssessmentScores = Record<string, number>

// --- Training modules ---

export interface DrillOption {
  label: string
  next_node: string
  impact: {
    trust: number
    compliance: number
    budget: number
  }
  explanation: string
}

export interface DrillNode {
  text: string
  options: DrillOption[]
}

export interface ModuleConfig {
  type: 'micro_drill' | 'scenario' | 'reference'
  nodes: Record<string, DrillNode>
  initial_node: string
}

export interface TrainingModule {
  id: string
  skill_id: string
  title: string
  description: string | null
  difficulty: number     // 1–5
  estimated_mins: number
  xp_reward: number
  config: ModuleConfig
  is_active: boolean
}

// --- Simulation ---

export interface SimulationConfig {
  initial_node: string
  nodes: Record<string, DrillNode>
}

export interface SimulationScenario {
  id: string
  skill_id: string
  title: string
  description: string | null
  environment: 'conversation' | 'inbox' | 'meeting'
  difficulty: number
  config: SimulationConfig
}

// --- Simulation runtime state (Zustand) ---

export interface SimMetrics {
  trust: number        // 0–100
  compliance: number   // 0–100
  budget: number       // 0–100
}

export interface SimChoice {
  node_id: string
  option_label: string
  impact: SimMetrics
}

export interface SimState {
  scenario: SimulationScenario | null
  current_node_id: string
  metrics: SimMetrics
  choices_log: SimChoice[]
  is_complete: boolean

  // Actions
  startScenario: (scenario: SimulationScenario) => void
  makeChoice: (option: DrillOption, node_id: string) => void
  completeSimulation: () => void
  reset: () => void
}

// --- User progress ---

export interface UserProgress {
  id: string
  user_id: string
  skill_id: string
  competency_score: number   // 0–100
  sessions_count: number
  last_activity_at: string
}

// --- Dashboard data ---

export interface RadarDataPoint {
  subject: string        // skill name
  score: number          // 0–100
  full_mark: number      // always 100
  skill_id: string
}

export interface RecommendedModule {
  id: string
  skill_id: string
  skill_name: string
  title: string
  description: string | null
  difficulty: number
  estimated_mins: number
  xp_reward: number
  status: 'not_started' | 'in_progress' | 'completed'
}

export interface SystemInsights {
  primary_gap: string       // skill name with lowest score
  primary_gap_score: number
  trend: string             // e.g. "+12% this week"
  next_milestone: string
}

export interface DashboardData {
  radar_data: RadarDataPoint[]
  recommended_module: RecommendedModule | null
  system_insights: SystemInsights
}

// --- After Action Report ---

export interface AARMetricShift {
  label: string
  value: string
  status: 'positive' | 'negative' | 'neutral'
}

export interface AARData {
  outcome_label: string
  metric_shifts: AARMetricShift[]
  strategic_insight: string
  skill_growth: {
    skill_name: string
    points_gained: number
  }
  next_module: RecommendedModule | null
  xp_earned: number
}