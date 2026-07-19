import { getCategoryColor, HAZARD_META } from '../utils/categoryMeta'

function formatTimestamp(ts) {
  if (!ts) return ''
  try {
    return new Date(ts).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return ts
  }
}

export default function WasteCard({ result, compact = false }) {
  if (!result) return null

  const {
    item, category, recyclable, hazardLevel, hazardWarning,
    disposalSteps = [], recyclingSteps = [], ecoSuggestion, timestamp,
  } = result

  const catColor = getCategoryColor(category)
  const hazColor = HAZARD_META[hazardLevel]?.color || '#7A9278'

  function handleDownload() {
    const text = `WasteGuide AI — Scan Result
Item: ${item}
Category: ${category}
Recyclable: ${recyclable ? 'Yes' : 'No'}
Hazard level: ${hazardLevel}
Hazard warning: ${hazardWarning}

Disposal steps:
${disposalSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Recycling steps:
${recyclingSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Eco suggestion: ${ecoSuggestion}
`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${item.replace(/\s+/g, '_').toLowerCase()}_wasteguide.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-lg border border-forest-700/10 dark:border-paper/10 bg-white/50 dark:bg-forest-900/30 shadow-card overflow-hidden">
      <div className="p-6 border-b border-forest-700/10 dark:border-paper/10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-semibold text-ink dark:text-paper">{item}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: catColor }}
            >
              {category}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                recyclable
                  ? 'bg-badge-recycle/10 text-badge-recycle'
                  : 'bg-ink/10 text-ink/60 dark:bg-paper/10 dark:text-paper/60'
              }`}
            >
              {recyclable ? '♻ Recyclable' : 'Not recyclable'}
            </span>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: hazColor }}
            >
              {hazardLevel} hazard
            </span>
          </div>
        </div>
        {!compact && (
          <button
            onClick={handleDownload}
            className="text-sm font-medium px-3 py-1.5 rounded-full border border-forest-700/20 dark:border-paper/20 hover:bg-forest-700/5 dark:hover:bg-paper/5 transition"
          >
            Download
          </button>
        )}
      </div>

      {hazardWarning && hazardWarning !== 'None' && (
        <div className="px-6 py-3 bg-signal-rust/5 border-b border-forest-700/10 dark:border-paper/10 text-sm text-signal-rust">
          ⚠ {hazardWarning}
        </div>
      )}

      <div className="p-6 grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide font-mono text-ink/50 dark:text-paper/50 mb-3">Disposal steps</p>
          <ol className="space-y-2">
            {disposalSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink/80 dark:text-paper/80">
                <span className="font-mono text-forest-500 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide font-mono text-ink/50 dark:text-paper/50 mb-3">Recycling procedure</p>
          <ol className="space-y-2">
            {recyclingSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink/80 dark:text-paper/80">
                <span className="font-mono text-forest-500 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {ecoSuggestion && (
        <div className="mx-6 mb-6 rounded-lg bg-forest-700/5 dark:bg-sage-300/10 p-4 flex items-start gap-3">
          <span className="text-lg">🌱</span>
          <p className="text-sm text-ink/80 dark:text-paper/80">{ecoSuggestion}</p>
        </div>
      )}

      {timestamp && (
        <p className="px-6 pb-5 text-xs font-mono text-ink/40 dark:text-paper/40">
          Saved {formatTimestamp(timestamp)}
        </p>
      )}
    </div>
  )
}
