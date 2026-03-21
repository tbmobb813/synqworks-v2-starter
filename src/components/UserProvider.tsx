'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/lib/store/useUserStore'

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const init = useUserStore(s => s.init)
  useEffect(() => { init() }, [init])
  return <>{children}</>
}
