import { useMemo, useState } from 'react'
import useHistory from '../hooks/useHistory'
import useDebounce from '../hooks/useDebounce'
import SearchBar from '../components/SearchBar'
import { HistoryRow } from '../components/History'
import WasteCard from '../components/WasteCard'
import { CardSkeleton } from '../components/Loading'
import ErrorBanner from '../components/ErrorPage'
import { CATEGORY_META } from '../utils/categoryMeta'

const PAGE_SIZE = 8
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name (A–Z)' },
]

export default function History() {
  const { history, loading, error, reload, remove } = useHistory()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const debouncedQuery = useDebounce(query, 250)

  const filtered = useMemo(() => {
    let items = [...history]

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim().toLowerCase()
      items = items.filter((h) => h.item?.toLowerCase().includes(q))
    }
    if (category !== 'All') {
      items = items.filter((h) => h.category === category)
    }
    if (sort === 'newest') {
      items.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
    } else if (sort === 'oldest') {
      items.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''))
    } else if (sort === 'name') {
      items.sort((a, b) => (a.item || '').localeCompare(b.item || ''))
    }
    return items
  }, [history, debouncedQuery, category, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function changePage(p) {
    setPage(Math.min(Math.max(1, p), totalPages))
  }

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink dark:text-paper">Scan history</h1>
      <p className="text-ink/60 dark:text-paper/60 mt-2">Every item you've scanned, searchable and sortable.</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={query}
          onChange={(v) => { setQuery(v); setPage(1) }}
          placeholder="Search by item name..."
          className="flex-1"
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1) }}
          className="px-4 py-3 rounded-full border border-forest-700/15 dark:border-paper/15 bg-white/70 dark:bg-forest-900/40 text-sm text-ink dark:text-paper"
        >
          <option value="All">All categories</option>
          {Object.keys(CATEGORY_META).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 rounded-full border border-forest-700/15 dark:border-paper/15 bg-white/70 dark:bg-forest-900/40 text-sm text-ink dark:text-paper"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {error && <div className="mt-6"><ErrorBanner message={error} onRetry={reload} /></div>}

      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            <CardSkeleton /><CardSkeleton /><CardSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-paper/50 rounded-lg border border-dashed border-forest-700/20 dark:border-paper/20 p-8 text-center">
            No history entries match your filters.
          </p>
        ) : (
          <div className="rounded-lg border border-forest-700/10 dark:border-paper/10 overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-forest-700/10 dark:border-paper/10 text-left">
                  <th className="py-3 px-4 text-xs font-mono uppercase text-ink/40 dark:text-paper/40">Date</th>
                  <th className="py-3 px-4 text-xs font-mono uppercase text-ink/40 dark:text-paper/40">Item</th>
                  <th className="py-3 px-4 text-xs font-mono uppercase text-ink/40 dark:text-paper/40">Category</th>
                  <th className="py-3 px-4 text-xs font-mono uppercase text-ink/40 dark:text-paper/40">Recyclable</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((entry) => (
                  <HistoryRow key={entry.id} entry={entry} onDelete={remove} onSelect={setSelected} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-full border border-forest-700/15 dark:border-paper/15 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm font-mono text-ink/60 dark:text-paper/60">{page} / {totalPages}</span>
          <button
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-full border border-forest-700/15 dark:border-paper/15 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <WasteCard result={selected} />
            <button
              onClick={() => setSelected(null)}
              className="mt-4 mx-auto block text-sm font-medium px-4 py-2 rounded-full bg-forest-700 text-paper"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
