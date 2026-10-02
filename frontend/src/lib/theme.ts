import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'truthlens-theme'
const META_COLORS: Record<Theme, string> = { light: '#FFFFFF', dark: '#0A0A0A' }

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLORS[theme])
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => readStored() ?? systemTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Follow OS changes until the user picks a theme explicitly.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      if (!readStored()) setTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* storage unavailable (private mode) — theme still applies for this session */
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
