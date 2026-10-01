import { Github } from 'lucide-react'
import HealthBadge from './HealthBadge'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const GITHUB_URL = 'https://github.com/JasKaranSingh3005/fake-newz-detector'

const NAV_LINKS = [
  { label: 'Detector', href: '#detector' },
  { label: 'Model Benchmarks', href: '#benchmarks' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-canvas/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="focus-ring rounded-sm">
          <Logo />
        </a>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft hover:text-ink transition-colors focus-ring rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <HealthBadge />
          <ThemeToggle />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="p-2 rounded hover:bg-drawer transition-colors focus-ring text-ink-soft hover:text-ink"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  )
}
