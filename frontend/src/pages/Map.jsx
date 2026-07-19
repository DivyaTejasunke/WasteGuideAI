import { useEffect, useState } from 'react'
import { fetchCenters } from '../services/api'
import MapView from '../components/MapView'
import CenterCard from '../components/CenterCard'
import { CardSkeleton } from '../components/Loading'
import ErrorBanner from '../components/ErrorPage'
import SearchBar from '../components/SearchBar'

export default function MapPage() {
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [active, setActive] = useState(null)
  const [query, setQuery] = useState('')

  function load() {
    setLoading(true)
    setError('')
    fetchCenters()
      .then(setCenters)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = centers.filter((c) =>
    c.name?.toLowerCase().includes(query.toLowerCase()) ||
    c.acceptedWaste?.some((w) => w.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink dark:text-paper">Collection centers</h1>
      <p className="text-ink/60 dark:text-paper/60 mt-2">Find where to drop off recyclables, hazardous waste, and more nearby.</p>

      {error && <div className="mt-6"><ErrorBanner message={error} onRetry={load} /></div>}

      <div className="mt-6 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SearchBar value={query} onChange={setQuery} placeholder="Search centers or waste type..." />
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {loading ? (
              <>
                <CardSkeleton /><CardSkeleton /><CardSkeleton />
              </>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-ink/50 dark:text-paper/50 text-center py-8">No centers match your search.</p>
            ) : (
              filtered.map((c) => (
                <CenterCard
                  key={c.id}
                  center={c}
                  active={active?.id === c.id}
                  onClick={() => setActive(c)}
                />
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-3 rounded-lg overflow-hidden border border-forest-700/10 dark:border-paper/10 min-h-[420px]">
          {!loading && (
            <MapView
              centers={filtered}
              activeId={active?.id}
              onMarkerClick={setActive}
              center={active ? [active.latitude, active.longitude] : undefined}
            />
          )}
        </div>
      </div>
    </div>
  )
}
