import { BookOpen, Github } from 'lucide-react'
import { GITHUB_URL } from './Header'
import Logo from './Logo'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-paper/40 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-ink-soft">Built with FastAPI, scikit-learn, React and TypeScript.</p>
          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            This tool provides probabilistic ML classifications and does not independently verify factual claims.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-rule px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-drawer hover:text-ink focus-ring"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            href={`${API_URL}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-rule px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-drawer hover:text-ink focus-ring"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            API Docs
          </a>
        </nav>
      </div>
    </footer>
  )
}
