import { useState } from 'react'
import { Link } from 'react-router-dom'
import WasteScanner from '../components/WasteScanner'
import QuickStats from '../components/Dashboard'
import { HistoryRow } from '../components/History'
import useHistory from '../hooks/useHistory'

const TIPS = [
  { title: 'Rinse before you bin', body: 'A quick rinse keeps recyclables from contaminating an entire batch.' },
  { title: 'Flatten cardboard', body: 'Flattened boxes take up less space and process faster at the facility.' },
  { title: 'Batteries never go loose', body: 'Tape the terminals or bag them separately — they can spark fires in transit.' },
]

export default function Home() {
  const { history, remove } = useHistory()
  const [lastScanned, setLastScanned] = useState(null)

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-forest-500">Smart-city waste assistant</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink dark:text-paper mt-3 max-w-2xl leading-tight">
          Tell it what you're throwing away. It tells you exactly where it goes.
        </h1>
        <p className="text-ink/60 dark:text-paper/60 mt-4 max-w-xl">
          Type any item and WasteGuide AI classifies it, warns you about hazards, and walks you through disposal and recycling — sorted by an AI model in seconds.
        </p>

        <div className="mt-8 max-w-2xl">
          <WasteScanner onScanned={setLastScanned} />
        </div>
      </section>

      {/* Environmental quote */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-8">
        <blockquote className="border-l-2 border-forest-700 dark:border-sage-300 pl-5 font-display text-xl text-ink/80 dark:text-paper/80 italic">
          "There is no such thing as 'away.' When we throw anything away, it must go somewhere."
          <footer className="mt-2 text-sm font-body not-italic text-ink/50 dark:text-paper/50">— Annie Leonard</footer>
        </blockquote>
      </section>

      {/* Quick stats + recent scans */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-8 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-paper mb-4">Quick statistics</h2>
          <QuickStats />
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-ink dark:text-paper">Recent scans</h2>
            <Link to="/history" className="text-sm font-medium text-forest-700 dark:text-sage-300 hover:underline">
              View all →
            </Link>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-ink/50 dark:text-paper/50 rounded-lg border border-dashed border-forest-700/20 dark:border-paper/20 p-6 text-center">
              No scans yet. Try scanning an item above to get started.
            </p>
          ) : (
            <div className="rounded-lg border border-forest-700/10 dark:border-paper/10 overflow-hidden">
              <table className="w-full">
                <tbody>
                  {history.slice(0, 5).map((entry) => (
                    <HistoryRow key={entry.id} entry={entry} onDelete={remove} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Tips */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        <h2 className="font-display text-lg font-semibold text-ink dark:text-paper mb-4">Tips for cleaner sorting</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {TIPS.map((tip) => (
            <div key={tip.title} className="rounded-lg border border-forest-700/10 dark:border-paper/10 p-5">
              <p className="font-medium text-ink dark:text-paper">{tip.title}</p>
              <p className="text-sm text-ink/60 dark:text-paper/60 mt-2">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
