import { useEffect } from 'react'
import { runHealthCheck, useHealth, type HealthStatus } from '../lib/health'

const CONFIG: Record<HealthStatus, { label: string; dot: string; title: string }> = {
  checking: { label: 'Checking', dot: 'bg-ink-faint', title: 'Checking API status…' },
  waking: {
    label: 'Waking up',
    dot: 'bg-warn animate-pulse',
    title: 'The API is starting from a cold start. This can take up to a minute.',
  },
  online: { label: 'API online', dot: 'bg-real', title: 'The ML API is online.' },
  offline: { label: 'API offline', dot: 'bg-fake', title: 'The ML API could not be reached.' },
}

export default function HealthBadge({ className = '' }: { className?: string }) {
  const status = useHealth()

  useEffect(() => {
    runHealthCheck()
    const interval = setInterval(runHealthCheck, 60000)
    return () => clearInterval(interval)
  }, [])

  const { label, dot, title } = CONFIG[status]

  return (
    <div
      role="status"
      aria-live="polite"
      title={title}
      className={`inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1 text-xs font-medium text-ink-soft ${className}`}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {status === 'online' && <span className="absolute inset-0 animate-ping rounded-full bg-real opacity-40" />}
        <span className={`relative h-2 w-2 rounded-full ${dot}`} />
      </span>
      {label}
    </div>
  )
}
