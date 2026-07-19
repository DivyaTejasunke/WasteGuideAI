const STACK = [
  { group: 'Frontend', items: ['React + Vite', 'Tailwind CSS', 'Chart.js', 'React Leaflet'] },
  { group: 'Backend', items: ['Python + Flask', 'Flask-CORS', 'Requests'] },
  { group: 'Database', items: ['Firebase Firestore', '(local JSON fallback for offline dev)'] },
  { group: 'AI', items: ['Groq API — llama-3.3-70b-versatile'] },
  { group: 'Maps', items: ['OpenStreetMap + Leaflet.js'] },
]

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16">
      <p className="text-xs font-mono uppercase tracking-widest text-forest-500">About the project</p>
      <h1 className="font-display text-3xl font-semibold text-ink dark:text-paper mt-3">
        WasteGuide AI
      </h1>
      <p className="text-ink/70 dark:text-paper/70 mt-4 leading-relaxed">
        WasteGuide AI is a full-stack smart-city assistant that helps citizens identify waste
        items, understand proper disposal and recycling procedures, locate nearby collection
        centers, and track their personal waste-management statistics over time. An AI model
        classifies each item and returns structured, actionable guidance in seconds.
      </p>

      <h2 className="font-display text-xl font-semibold text-ink dark:text-paper mt-10 mb-4">Built with</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {STACK.map((s) => (
          <div key={s.group} className="rounded-lg border border-forest-700/10 dark:border-paper/10 p-4">
            <p className="text-xs font-mono uppercase text-ink/40 dark:text-paper/40">{s.group}</p>
            <ul className="mt-2 space-y-1">
              {s.items.map((i) => (
                <li key={i} className="text-sm text-ink/80 dark:text-paper/80">{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl font-semibold text-ink dark:text-paper mt-10 mb-3">Why it matters</h2>
      <p className="text-ink/70 dark:text-paper/70 leading-relaxed">
        Improper waste disposal contaminates recycling streams and puts hazardous materials into
        landfills where they can leach into soil and water. A simple, fast way to check
        "what do I do with this?" lowers the barrier to disposing of things correctly — one item
        at a time.
      </p>
    </div>
  )
}
