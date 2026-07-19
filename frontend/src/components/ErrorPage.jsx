export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="rounded-lg border border-signal-rust/30 bg-signal-rust/5 p-4 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-signal-rust">Something went wrong</p>
        <p className="text-sm text-ink/70 dark:text-paper/70 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 text-sm font-medium px-3 py-1.5 rounded-full border border-signal-rust/40 text-signal-rust hover:bg-signal-rust/10 transition"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-24 text-center">
      <p className="font-display text-6xl text-forest-700 dark:text-sage-300">404</p>
      <p className="mt-3 text-ink/60 dark:text-paper/60">This page was sorted into the wrong bin.</p>
    </div>
  )
}
