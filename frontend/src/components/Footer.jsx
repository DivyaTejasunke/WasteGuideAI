export default function Footer() {
  return (
    <footer className="border-t border-forest-700/10 dark:border-paper/10 mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-display font-semibold text-ink dark:text-paper">WasteGuide AI</p>
          <p className="text-sm text-ink/60 dark:text-paper/60 mt-1 max-w-sm">
            A smart-city assistant for sorting, disposing, and recycling waste responsibly — built as a final-year engineering project.
          </p>
        </div>
        <p className="text-xs font-mono text-ink/50 dark:text-paper/50">
          Every scan sorted is one less item to landfill.
        </p>
      </div>
    </footer>
  )
}
