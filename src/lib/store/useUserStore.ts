'use client'

import { create } from 'zustand'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import type { User } from '@supabase/supabase-js'

interface UserStore {
  user: User | null
  loading: boolean
  init: () => Promise<void>
  signOut: () => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,

  init: async () => {
    const supabase = createSupabaseBrowserClient()

    const { data: { user } } = await supabase.auth.getUser()
    set({ user, loading: false })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  signOut: async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
