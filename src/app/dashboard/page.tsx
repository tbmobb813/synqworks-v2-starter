import type { DashboardData } from '@/types'
import DashboardClient from '@/components/dashboard/DashboardClient'

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const res = await fetch('/api/recommend', { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (err) {
    return null
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <DashboardClient initialData={data} />
      </div>
    </main>
  )
}