import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { UserProgress } from '@/types'

// Must mock before importing the module under test
vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(),
}))

import { getNextModule } from '@/lib/engine/getNextModule'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeProgress(skill_id: string, score: number): UserProgress {
  return {
    id: `p-${skill_id}`,
    user_id: 'user-1',
    skill_id,
    competency_score: score,
    sessions_count: 1,
    last_activity_at: '2024-01-01',
  }
}

const mockModule = {
  id: 'mod-1',
  skill_id: 'skill-a',
  title: 'Intro Module',
  description: 'Learn the basics',
  difficulty: 2,
  estimated_mins: 15,
  xp_reward: 100,
  skills: { name: 'Communication' },
}

/**
 * Builds a mock Supabase client whose query chains resolve to the provided
 * completedIds and moduleResult.
 */
function makeClient({
  completedIds = [] as string[],
  moduleResult = null as typeof mockModule | null,
} = {}) {
  // Chain object used for the training_modules query
  const chain: Record<string, ReturnType<typeof vi.fn>> = {
    eq: vi.fn(),
    lte: vi.fn(),
    gte: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    not: vi.fn(),
    single: vi.fn().mockResolvedValue(
      moduleResult
        ? { data: moduleResult, error: null }
        : { data: null, error: { message: 'PGRST116' } }
    ),
  }
  // Make every chaining method return the same chain object
  ;(['eq', 'lte', 'gte', 'order', 'limit', 'not'] as const).forEach(m => {
    chain[m].mockReturnValue(chain)
  })

  return {
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'module_completions') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: completedIds.map(id => ({ module_id: id })),
              error: null,
            }),
          }),
        }
      }
      // training_modules
      return { select: vi.fn().mockReturnValue(chain) }
    }),
  } as any
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('getNextModule', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns null immediately when userProgress is empty', async () => {
    const result = await getNextModule('user-1', [], makeClient())
    expect(result).toBeNull()
  })

  it('returns null when no matching module is found', async () => {
    const progress = [makeProgress('skill-a', 50)]
    const result = await getNextModule('user-1', progress, makeClient({ moduleResult: null }))
    expect(result).toBeNull()
  })

  it('returns a correctly shaped RecommendedModule when a match is found', async () => {
    const progress = [makeProgress('skill-a', 50)]
    const result = await getNextModule(
      'user-1',
      progress,
      makeClient({ moduleResult: mockModule })
    )

    expect(result).not.toBeNull()
    expect(result).toMatchObject({
      id: 'mod-1',
      skill_id: 'skill-a',
      skill_name: 'Communication',
      title: 'Intro Module',
      difficulty: 2,
      estimated_mins: 15,
      xp_reward: 100,
      status: 'not_started',
    })
  })

  it('targets the skill with the lowest competency score', async () => {
    const progress = [makeProgress('skill-a', 80), makeProgress('skill-b', 20)]
    const client = makeClient({ moduleResult: mockModule })

    await getNextModule('user-1', progress, client)

    // The training_modules query should have been scoped to the weakest skill
    const selectCall = client.from.mock.calls.find(
      ([t]: [string]) => t === 'training_modules'
    )
    expect(selectCall).toBeTruthy()

    // The chain's .eq() calls should include skill-b (lowest score)
    const eqCalls: string[] = (client.from('training_modules').select() as any).eq.mock.calls.flat()
    expect(eqCalls).toContain('skill-b')
  })

  it('queries module_completions to exclude already-completed modules', async () => {
    const progress = [makeProgress('skill-a', 30)]
    const client = makeClient({ completedIds: ['mod-99'], moduleResult: mockModule })

    await getNextModule('user-1', progress, client)

    const completionsCall = client.from.mock.calls.find(
      ([t]: [string]) => t === 'module_completions'
    )
    expect(completionsCall).toBeTruthy()
  })

  it('uses the provided client instead of creating a new server client', async () => {
    const { createSupabaseServerClient } = await import('@/lib/supabase/server')
    const progress = [makeProgress('skill-a', 40)]
    const client = makeClient({ moduleResult: mockModule })

    await getNextModule('user-1', progress, client)

    expect(createSupabaseServerClient).not.toHaveBeenCalled()
  })

  it('falls back to createSupabaseServerClient when no client is provided', async () => {
    const { createSupabaseServerClient } = await import('@/lib/supabase/server')
    const serverClient = makeClient()
    vi.mocked(createSupabaseServerClient).mockResolvedValue(serverClient as any)

    await getNextModule('user-1', [makeProgress('skill-a', 50)])

    expect(createSupabaseServerClient).toHaveBeenCalledOnce()
  })
})
