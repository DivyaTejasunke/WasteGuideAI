const CARD_CONFIG = [
  { key: 'totalScans', label: 'Total scans', icon: '📊', suffix: '' },
  { key: 'recyclableCount', label: 'Recyclable items', icon: '♻', suffix: '' },
  { key: 'hazardousCount', label: 'Hazardous items', icon: '⚠', suffix: '' },
  { key: 'recyclePercentage', label: 'Recycle rate', icon: '🌱', suffix: '%' },
]

export default function StatisticsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_CONFIG.map((c) => (
        <div
          key={c.key}
          className="rounded-lg border border-forest-700/10 dark:border-paper/10 bg-white/50 dark:bg-forest-900/30 p-5"
        >
          <p className="text-xl">{c.icon}</p>
          <p className="mt-3 font-display text-3xl font-semibold text-ink dark:text-paper">
            {stats?.[c.key] ?? 0}{c.suffix}
          </p>
          <p className="text-xs uppercase tracking-wide font-mono text-ink/50 dark:text-paper/50 mt-1">
            {c.label}
          </p>
        </div>
      ))}
    </div>
  )
}
