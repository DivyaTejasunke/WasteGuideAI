import { getMarkerColor } from '../utils/categoryMeta'

export default function CenterCard({ center, active, onClick }) {
  const color = getMarkerColor(center.category)
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-4 transition ${
        active
          ? 'border-forest-700 dark:border-sage-300 bg-forest-700/5 dark:bg-sage-300/10'
          : 'border-forest-700/10 dark:border-paper/10 hover:border-forest-700/30 dark:hover:border-paper/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />
        <div className="min-w-0">
          <p className="font-medium text-ink dark:text-paper truncate">{center.name}</p>
          <p className="text-xs text-ink/60 dark:text-paper/60 mt-0.5">{center.address}</p>
          <p className="text-xs text-ink/50 dark:text-paper/50 mt-1 font-mono">{center.openingHours}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {(center.acceptedWaste || []).slice(0, 4).map((w) => (
              <span key={w} className="text-[10px] px-2 py-0.5 rounded-full bg-forest-700/8 dark:bg-paper/10 text-ink/60 dark:text-paper/60">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}
