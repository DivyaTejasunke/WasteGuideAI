import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const LINKS = [
  { to: '/', label: 'Scan' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'History' },
  { to: '/map', label: 'Centers' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-forest-700/10 dark:border-paper/10 bg-paper/90 dark:bg-forest-900/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-full bg-forest-700 dark:bg-sage-300 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 6 8 6 13a6 6 0 0012 0c0-5-6-11-6-11z" fill="#EEF0E4" className="dark:fill-forest-900" />
            </svg>
          </span>
          <span className="font-display font-semibold text-lg tracking-tight text-ink dark:text-paper">
            WasteGuide <span className="text-forest-500">AI</span>
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-forest-700 text-paper dark:bg-sage-300 dark:text-forest-900'
                    : 'text-ink/70 hover:text-ink dark:text-paper/70 dark:hover:text-paper'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-forest-700/15 dark:border-paper/15 hover:bg-forest-700/5 dark:hover:bg-paper/5 transition"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center border border-forest-700/15 dark:border-paper/15"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-forest-700/10 dark:border-paper/10 px-5 py-3 flex flex-col gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-forest-700 text-paper dark:bg-sage-300 dark:text-forest-900'
                    : 'text-ink/70 dark:text-paper/70'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
