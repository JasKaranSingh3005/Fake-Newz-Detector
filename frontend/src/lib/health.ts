import { useSyncExternalStore } from 'react'
import { checkHealth } from './api'

export type HealthStatus = 'checking' | 'waking' | 'online' | 'offline'

// Shared so the navbar badge and the detector agree on backend state,
// and a cold-starting Render instance is only pinged once at a time.
let status: HealthStatus = 'checking'
let inflight: Promise<boolean> | null = null
const listeners = new Set<() => void>()

const WAKING_THRESHOLD_MS = 2500

function setStatus(next: HealthStatus) {
  if (status === next) return
  status = next
  listeners.forEach((l) => l())
}

export function runHealthCheck(): Promise<boolean> {
  if (inflight) return inflight
  if (status !== 'online') setStatus('checking')
  const slow = setTimeout(() => {
    if (status !== 'online') setStatus('waking')
  }, WAKING_THRESHOLD_MS)

  inflight = checkHealth().then((ok) => {
    clearTimeout(slow)
    setStatus(ok ? 'online' : 'offline')
    inflight = null
    return ok
  })
  return inflight
}

/** Resolves once the backend responds (or the health check gives up). */
export function waitForBackend(): Promise<boolean> {
  return status === 'online' ? Promise.resolve(true) : runHealthCheck()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useHealth(): HealthStatus {
  return useSyncExternalStore(subscribe, () => status)
}
