import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock server-only dependencies before importing the route handler
vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(),
}))

vi.mock('@/lib/engine/getNextModule', () => ({
  getNextModule: vi.fn(),
}))

import { GET } from '@/app/api/recommend/route'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getNextModule } from '@/lib/engine/getNextModule'
import type { RecommendedModule } from '@/types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockUser = { id: 'user-1', email: 'user@example.com' }

const mockSkills = [
  { id: 'skill-1', name: 'Communication', sort_order: 1 },
  { id: 'skill-2', name: 'Decision Making', sort_order: 2 },
]

const mockProgress = [
  { id: 'p1', user_id: 'user-1', skill_id: 'skill-1', competency_score: 45, sessions_count: 2, last_activity_at: '' },
  { id: 'p2', user_id: 'user-1', skill_id: 'skill-2', competency_score: 70, sessions_count: 1, last_activity_at: '' },
]

const mockRecommendedModule: RecommendedModule = {
  id: 'mod-1',
  skill_id: 'skill-1',
  skill_name: 'Communication',
  title: 'Active Listening Fundamentals',
  description: null,
  difficulty: 2,
  estimated_mins: 15,
  xp_reward: 100,
  status: 'not_started',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSupabaseMock(user: typeof mockUser | null) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
    },
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'user_progress') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: mockProgress, error: null }),
          }),
        }
      }
      if (table === 'skills') {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockSkills, error: null }),
          }),
        }
      }
    }),
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GET /api/recommend', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when the user is not authenticated', async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(makeSupabaseMock(null) as any)

    const res = await GET()
    expect(res.status).toBe(401)
    expect(await res.json()).toBeNull()
  })

  it('returns dashboard data when the user is authenticated with progress', async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(makeSupabaseMock(mockUser) as any)
    vi.mocked(getNextModule).mockResolvedValue(mockRecommendedModule)

    const res = await GET()
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).not.toBeNull()
    expect(body.radar_data).toHaveLength(2)
    expect(body.recommended_module).toMatchObject({ id: 'mod-1' })
    expect(body.system_insights).toMatchObject({
      primary_gap: 'Communication', // lowest score skill
      primary_gap_score: 45,
    })
  })

  it('radar_data has correct shape for each skill', async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(makeSupabaseMock(mockUser) as any)
    vi.mocked(getNextModule).mockResolvedValue(null)

    const res = await GET()
    const { radar_data } = await res.json()

    expect(radar_data[0]).toMatchObject({
      subject: 'Communication',
      score: 45,
      full_mark: 100,
      skill_id: 'skill-1',
    })
    expect(radar_data[1]).toMatchObject({
      subject: 'Decision Making',
      score: 70,
      full_mark: 100,
      skill_id: 'skill-2',
    })
  })

  it('identifies the skill with the lowest competency score as the primary gap', async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(makeSupabaseMock(mockUser) as any)
    vi.mocked(getNextModule).mockResolvedValue(null)

    const res = await GET()
    const { system_insights } = await res.json()

    // skill-1 has score 45, skill-2 has 70 — skill-1 is the gap
    expect(system_insights.primary_gap).toBe('Communication')
    expect(system_insights.primary_gap_score).toBe(45)
  })

  it('returns null with 200 when no user progress exists (no critical skill)', async () => {
    const emptyProgressMock = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn().mockImplementation((table: string) => {
        if (table === 'user_progress') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }
        }
        if (table === 'skills') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: mockSkills, error: null }),
            }),
          }
        }
      }),
    }
    vi.mocked(createSupabaseServerClient).mockResolvedValue(emptyProgressMock as any)
    vi.mocked(getNextModule).mockResolvedValue(null)

    const res = await GET()
    expect(res.status).toBe(200)
    expect(await res.json()).toBeNull()
  })

  it('passes the supabase client directly to getNextModule', async () => {
    const mockClient = makeSupabaseMock(mockUser)
    vi.mocked(createSupabaseServerClient).mockResolvedValue(mockClient as any)
    vi.mocked(getNextModule).mockResolvedValue(null)

    await GET()

    expect(getNextModule).toHaveBeenCalledWith(
      mockUser.id,
      expect.any(Array),
      mockClient
    )
  })
})
