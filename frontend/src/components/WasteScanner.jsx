import { useState } from 'react'
import { classifyItem } from '../services/api'
import { ScanProgress } from './Loading'
import ErrorBanner from './ErrorPage'
import WasteCard from './WasteCard'

const EXAMPLES = ['Battery', 'Pizza box', 'Plastic bottle', 'Old smartphone', 'Banana peel']

export default function WasteScanner({ onScanned }) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  async function handleScan(e) {
    e?.preventDefault()
    const item = value.trim()
    if (!item) {
      setError('Please enter a waste item to scan.')
      return
    }
    setError('')
    setResult(null)
    setLoading(true)
    setStep(0)

    const t1 = setTimeout(() => setStep(1), 250)
    try {
      const data = await classifyItem(item)
      setStep(2)
      setResult(data)
      onScanned?.(data)
    } catch (err) {
      setError(err.message)
    } finally {
      clearTimeout(t1)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Battery, pizza box, glass jar..."
          maxLength={120}
          className="flex-1 px-5 py-4 rounded-full border border-forest-700/15 dark:border-paper/15 bg-white/70 dark:bg-forest-900/40 text-ink dark:text-paper placeholder:text-ink/40 dark:placeholder:text-paper/40 focus:outline-none focus:ring-2 focus:ring-forest-700/30 dark:focus:ring-sage-300/40 transition text-base"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-7 py-4 rounded-full bg-forest-700 dark:bg-sage-300 text-paper dark:text-forest-900 font-semibold hover:bg-forest-900 dark:hover:bg-sage-300/80 disabled:opacity-60 transition shrink-0"
        >
          {loading ? 'Scanning…' : 'Scan'}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setValue(ex)}
            className="text-xs px-3 py-1.5 rounded-full border border-forest-700/15 dark:border-paper/15 text-ink/60 dark:text-paper/60 hover:border-forest-700/40 dark:hover:border-paper/40 transition"
          >
            {ex}
          </button>
        ))}
      </div>

      {loading && <ScanProgress step={step} />}
      {!loading && error && <ErrorBanner message={error} onRetry={handleScan} />}
      {!loading && result && <WasteCard result={result} />}
    </div>
  )
}
