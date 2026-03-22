import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface UserStore {
  user: User | null
  isLoading: boolean
  init: () => Promise<void>
  fetchUser: () => Promise<void>
  signOut: () => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,

  init: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    set({ user, isLoading: false })

    // Subscribe to auth changes so the store stays in sync
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, isLoading: false })
    })
  },

  fetchUser: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    set({ user, isLoading: false })
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
