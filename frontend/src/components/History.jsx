import { getCategoryColor } from '../utils/categoryMeta'

export function HistoryRow({ entry, onDelete, onSelect }) {
  const date = entry.timestamp
    ? new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  return (
    <tr className="border-b border-forest-700/10 dark:border-paper/10 hover:bg-forest-700/5 dark:hover:bg-paper/5 transition">
      <td className="py-3 px-4 text-sm font-mono text-ink/60 dark:text-paper/60 whitespace-nowrap">{date}</td>
      <td className="py-3 px-4">
        <button
          onClick={() => onSelect?.(entry)}
          className="text-sm font-medium text-ink dark:text-paper hover:text-forest-700 dark:hover:text-sage-300 text-left"
        >
          {entry.item}
        </button>
      </td>
      <td className="py-3 px-4">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: getCategoryColor(entry.category) }}
        >
          {entry.category}
        </span>
      </td>
      <td className="py-3 px-4 text-sm">
        {entry.recyclable ? (
          <span className="text-badge-recycle">♻ Yes</span>
        ) : (
          <span className="text-ink/40 dark:text-paper/40">No</span>
        )}
      </td>
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onDelete?.(entry.id)}
          aria-label={`Delete ${entry.item} from history`}
          className="text-xs px-2.5 py-1 rounded-full border border-signal-rust/30 text-signal-rust hover:bg-signal-rust/10 transition"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}
