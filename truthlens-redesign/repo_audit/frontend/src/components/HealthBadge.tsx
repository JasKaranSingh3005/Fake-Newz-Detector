import { useEffect, useState } from 'react'
import { checkHealth } from '../lib/api'

export default function HealthBadge() {
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    const check = async () => {
      const result = await checkHealth()
      if (mounted) setOnline(result)
    }
    check()
    const interval = setInterval(check, 60000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const label = online === null ? 'CHECKING' : online ? 'LIVE' : 'OFFLINE'
  const dot = online === null ? 'bg-ink-faint' : online ? 'bg-real' : 'bg-fake'

  return (
    <div
      className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-ink-soft border border-rule-strong rounded px-2 py-1"
      role="status"
      aria-live="polite"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </div>
  )
}
