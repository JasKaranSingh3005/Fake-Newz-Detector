import { useEffect, useState } from 'react'
import { Github, Menu, X } from 'lucide-react'
import HealthBadge from './HealthBadge'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export const GITHUB_URL = 'https://github.com/JasKaranSingh3005/fake-newz-detector'

const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Detector', href: '#detector' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-canvas">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="rounded-md focus-ring" aria-label="TruthLens home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-drawer hover:text-ink focus-ring"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <HealthBadge className="hidden sm:inline-flex" />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-rule text-ink-soft transition-colors hover:bg-drawer hover:text-ink focus-ring sm:inline-flex"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-rule text-ink-soft transition-colors hover:bg-drawer hover:text-ink focus-ring md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="animate-fade-up border-t border-rule bg-canvas px-4 pb-4 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-drawer hover:text-ink focus-ring"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-drawer hover:text-ink focus-ring"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </li>
          </ul>
          <HealthBadge className="mt-3 sm:hidden" />
        </nav>
      )}
    </header>
  )
}
