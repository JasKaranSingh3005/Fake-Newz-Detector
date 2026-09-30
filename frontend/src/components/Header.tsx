import { Github, Eye } from 'lucide-react'
import HealthBadge from './HealthBadge'

const GITHUB_URL = 'https://github.com/JasKaranSingh3005/fake-newz-detector'

const NAV_LINKS = [
  { label: 'Detector', href: '#detector' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Models', href: '#models' },
  { label: 'About', href: '#about' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-navy-950/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 focus-ring rounded-sm">
          <Eye className="w-5 h-5 text-accent" aria-hidden="true" />
          <span className="font-bold text-lg text-white tracking-tight">TruthLens</span>
        </a>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 hover:text-white transition-colors focus-ring rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <HealthBadge />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="p-2 rounded-md hover:bg-white/5 transition-colors focus-ring text-slate-300 hover:text-white"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  )
}
