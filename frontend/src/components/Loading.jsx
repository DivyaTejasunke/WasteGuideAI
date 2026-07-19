export function Spinner({ label = 'Loading' }) {
  return (
    <div role="status" className="flex items-center gap-3 text-ink/60 dark:text-paper/60">
      <span className="w-5 h-5 rounded-full border-2 border-forest-700/20 dark:border-paper/20 border-t-forest-700 dark:border-t-sage-300 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-forest-700/10 dark:border-paper/10 p-5 space-y-3">
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="skeleton h-3 w-2/3 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-5/6 rounded" />
    </div>
  )
}

export function ScanProgress({ step }) {
  const steps = ['Reading item', 'Consulting AI classifier', 'Preparing your result']
  return (
    <div className="rounded-lg border border-forest-700/10 dark:border-paper/10 p-6">
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3 text-sm">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border ${
                i < step
                  ? 'bg-forest-700 border-forest-700 text-paper'
                  : i === step
                  ? 'border-forest-700 text-forest-700 dark:text-sage-300 dark:border-sage-300 animate-pulse'
                  : 'border-forest-700/20 text-ink/30 dark:border-paper/20 dark:text-paper/30'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </span>
            <span className={i <= step ? 'text-ink dark:text-paper' : 'text-ink/40 dark:text-paper/40'}>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
