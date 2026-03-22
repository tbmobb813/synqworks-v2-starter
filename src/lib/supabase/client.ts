import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

// Singleton browser client — shares session with @supabase/ssr middleware
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Named factory for callers that prefer createClient() call style
export function createClient() {
  return supabase
}
