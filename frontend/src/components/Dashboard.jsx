import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAnalytics } from '../services/api'
import { CardSkeleton } from './Loading'

// Compact "quick statistics" widget embedded on the Home page.
// The full breakdown with charts lives on the Dashboard page.
export default function QuickStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        <CardSkeleton /><CardSkeleton /><CardSkeleton />
      </div>
    )
  }

  const items = [
    { label: 'Scans', value: stats?.totalScans ?? 0 },
    { label: 'Recyclable', value: stats?.recyclableCount ?? 0 },
    { label: 'Recycle rate', value: `${stats?.recyclePercentage ?? 0}%` },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-lg border border-forest-700/10 dark:border-paper/10 p-4 text-center">
            <p className="font-display text-2xl font-semibold text-ink dark:text-paper">{it.value}</p>
            <p className="text-xs text-ink/50 dark:text-paper/50 mt-1">{it.label}</p>
          </div>
        ))}
      </div>
      <Link to="/dashboard" className="text-sm font-medium text-forest-700 dark:text-sage-300 hover:underline self-start">
        View full dashboard →
      </Link>
    </div>
  )
}
