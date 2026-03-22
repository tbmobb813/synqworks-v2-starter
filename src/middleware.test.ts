import { vi, describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock @supabase/ssr before importing middleware
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

import { middleware } from '@/middleware'
import { createServerClient } from '@supabase/ssr'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockUser = { id: 'user-1', email: 'user@example.com' }

function makeRequest(path: string): NextRequest {
  return new NextRequest(`http://localhost${path}`)
}

function mockAuthAs(user: typeof mockUser | null) {
  vi.mocked(createServerClient).mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
    },
  } as any)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('middleware', () => {
  beforeEach(() => vi.clearAllMocks())

  // --- unauthenticated user on protected routes ----------------------------

  it.each(['/dashboard', '/simulation/abc', '/diagnostic'])(
    'redirects unauthenticated user from %s to /login',
    async (path) => {
      mockAuthAs(null)
      const req = makeRequest(path)
      const res = await middleware(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/login')
    }
  )

  // --- authenticated user on auth routes -----------------------------------

  it.each(['/login', '/signup'])(
    'redirects authenticated user from %s to /dashboard',
    async (path) => {
      mockAuthAs(mockUser)
      const req = makeRequest(path)
      const res = await middleware(req)
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toContain('/dashboard')
    }
  )

  // --- passthrough cases ---------------------------------------------------

  it('allows an authenticated user to access /dashboard', async () => {
    mockAuthAs(mockUser)
    const req = makeRequest('/dashboard')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('allows an authenticated user to access /simulation/:id', async () => {
    mockAuthAs(mockUser)
    const req = makeRequest('/simulation/scenario-123')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('allows an unauthenticated user to access /login', async () => {
    mockAuthAs(null)
    const req = makeRequest('/login')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })

  it('allows an unauthenticated user to access / (root)', async () => {
    mockAuthAs(null)
    const req = makeRequest('/')
    const res = await middleware(req)
    expect(res.status).not.toBe(307)
  })
})
