import { useEffect, useState } from 'react'
import { fetchAnalytics } from '../services/api'
import StatisticsCards from '../components/StatisticsCards'
import { RecyclableDoughnut, CategoryBarChart, WeeklyActivityLine, WasteTypesPie } from '../components/Charts'
import { CardSkeleton } from '../components/Loading'
import ErrorBanner from '../components/ErrorPage'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    setError('')
    fetchAnalytics()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink dark:text-paper">Dashboard</h1>
      <p className="text-ink/60 dark:text-paper/60 mt-2">Your personal waste management statistics.</p>

      {error && <div className="mt-6"><ErrorBanner message={error} onRetry={load} /></div>}

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
          </div>
        ) : (
          <StatisticsCards stats={stats} />
        )}
      </div>

      {!loading && stats?.totalScans > 0 && (
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <RecyclableDoughnut stats={stats} />
          <CategoryBarChart stats={stats} />
          <WeeklyActivityLine stats={stats} />
          <WasteTypesPie stats={stats} />
        </div>
      )}

      {!loading && stats?.totalScans === 0 && (
        <p className="mt-10 text-sm text-ink/50 dark:text-paper/50 rounded-lg border border-dashed border-forest-700/20 dark:border-paper/20 p-8 text-center">
          Scan a few items to see your statistics come to life here.
        </p>
      )}
    </div>
  )
}
